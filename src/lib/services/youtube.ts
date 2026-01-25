/**
 * YouTube Data API Integration
 *
 * Provides direct access to YouTube for video search and metadata.
 * More detailed data than Serper, and enables lightweight video display.
 *
 * API Docs: https://developers.google.com/youtube/v3/docs
 *
 * Quota: 10,000 units/day
 * - Search: 100 units per request
 * - Video details: 1 unit per request
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

interface YouTubeSearchItem {
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
    }
    channelTitle: string
    liveBroadcastContent: string
  }
}

interface YouTubeVideoItem {
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
      standard?: { url: string; width: number; height: number }
      maxres?: { url: string; width: number; height: number }
    }
    channelTitle: string
    tags?: string[]
    categoryId: string
  }
  contentDetails: {
    duration: string // ISO 8601 duration (e.g., "PT4M13S")
    dimension: string
    definition: string // "hd" or "sd"
    caption: string
  }
  statistics: {
    viewCount: string
    likeCount?: string
    commentCount?: string
  }
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[]
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

interface YouTubeVideosResponse {
  items: YouTubeVideoItem[]
}

export interface YouTubeVideo {
  videoId: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  publishedAt: string
  // Thumbnails for lightweight display
  thumbnails: {
    default: string
    medium: string
    high: string
    maxres?: string
  }
  // Detailed stats (from videos.list)
  duration: string // Formatted (e.g., "4:13")
  durationSeconds: number
  viewCount: number
  likeCount?: number
  definition: "hd" | "sd"
  // URLs
  url: string
  embedUrl: string
}

class YouTubeService {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Search for videos by query
   * Cost: 100 units per search + 1 unit per video for details
   */
  async searchVideos(
    query: string,
    options: {
      maxResults?: number
      relevanceLanguage?: string
      videoDuration?: "any" | "short" | "medium" | "long"
      videoDefinition?: "any" | "high" | "standard"
      order?: "relevance" | "date" | "viewCount" | "rating"
    } = {}
  ): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      throw new Error("YouTube API key not configured. Set YOUTUBE_API_KEY environment variable.")
    }

    const {
      maxResults = 5,
      relevanceLanguage = "en",
      videoDuration = "any",
      videoDefinition = "any",
      order = "relevance",
    } = options

    // Step 1: Search for videos
    const searchParams = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: maxResults.toString(),
      relevanceLanguage,
      videoDuration,
      videoDefinition,
      order,
      key: this.apiKey,
    })

    const searchResponse = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`)

    if (!searchResponse.ok) {
      const error = await searchResponse.json().catch(() => ({ error: { message: "Unknown error" } }))
      throw new Error(error.error?.message || `YouTube API error: ${searchResponse.status}`)
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return []
    }

    // Step 2: Get detailed info for each video (duration, stats, etc.)
    const videoIds = searchData.items.map((item) => item.id.videoId).join(",")

    const videosParams = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: videoIds,
      key: this.apiKey,
    })

    const videosResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videosParams}`)

    if (!videosResponse.ok) {
      // If details fail, return basic info from search
      return searchData.items.map((item) => this.mapSearchItemToVideo(item))
    }

    const videosData: YouTubeVideosResponse = await videosResponse.json()

    // Map detailed video data
    return videosData.items.map((item) => this.mapVideoItemToVideo(item))
  }

  /**
   * Get details for specific video IDs
   * Cost: 1 unit per video
   */
  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      throw new Error("YouTube API key not configured. Set YOUTUBE_API_KEY environment variable.")
    }

    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: videoIds.join(","),
      key: this.apiKey,
    })

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
      throw new Error(error.error?.message || `YouTube API error: ${response.status}`)
    }

    const data: YouTubeVideosResponse = await response.json()

    return data.items.map((item) => this.mapVideoItemToVideo(item))
  }

  /**
   * Parse ISO 8601 duration to seconds and formatted string
   */
  private parseDuration(isoDuration: string): { seconds: number; formatted: string } {
    // Match PT1H2M3S format
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)

    if (!match) {
      return { seconds: 0, formatted: "0:00" }
    }

    const hours = parseInt(match[1] || "0", 10)
    const minutes = parseInt(match[2] || "0", 10)
    const seconds = parseInt(match[3] || "0", 10)

    const totalSeconds = hours * 3600 + minutes * 60 + seconds

    // Format as H:MM:SS or M:SS
    let formatted: string
    if (hours > 0) {
      formatted = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    } else {
      formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return { seconds: totalSeconds, formatted }
  }

  /**
   * Map search result to YouTubeVideo (basic info only)
   */
  private mapSearchItemToVideo(item: YouTubeSearchItem): YouTubeVideo {
    const videoId = item.id.videoId

    return {
      videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      thumbnails: {
        default: item.snippet.thumbnails.default.url,
        medium: item.snippet.thumbnails.medium.url,
        high: item.snippet.thumbnails.high.url,
      },
      duration: "",
      durationSeconds: 0,
      viewCount: 0,
      definition: "hd",
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    }
  }

  /**
   * Map detailed video data to YouTubeVideo
   */
  private mapVideoItemToVideo(item: YouTubeVideoItem): YouTubeVideo {
    const { seconds, formatted } = this.parseDuration(item.contentDetails.duration)

    return {
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      thumbnails: {
        default: item.snippet.thumbnails.default.url,
        medium: item.snippet.thumbnails.medium.url,
        high: item.snippet.thumbnails.high.url,
        maxres: item.snippet.thumbnails.maxres?.url,
      },
      duration: formatted,
      durationSeconds: seconds,
      viewCount: parseInt(item.statistics.viewCount || "0", 10),
      likeCount: item.statistics.likeCount ? parseInt(item.statistics.likeCount, 10) : undefined,
      definition: item.contentDetails.definition === "hd" ? "hd" : "sd",
      url: `https://www.youtube.com/watch?v=${item.id}`,
      embedUrl: `https://www.youtube.com/embed/${item.id}`,
    }
  }
}

// Export singleton instance
export const youtubeService = new YouTubeService()
