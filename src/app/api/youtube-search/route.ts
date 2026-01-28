import { NextRequest, NextResponse } from "next/server"
import { youtubeService } from "@/lib/services/youtube"

/**
 * YouTube Video Details API
 *
 * GET /api/youtube-search?videoId=xxx - Get details for a specific video
 * GET /api/youtube-search?q=xxx - Search for videos
 *
 * Cost: 1 unit per video detail, 100 units per search
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const videoId = searchParams.get("videoId")
    const query = searchParams.get("q")

    if (!youtubeService.isConfigured()) {
      return NextResponse.json(
        { error: "YouTube API not configured" },
        { status: 503 }
      )
    }

    // Get details for a specific video
    if (videoId) {
      const videos = await youtubeService.getVideoDetails([videoId])

      if (videos.length === 0) {
        return NextResponse.json(
          { error: "Video not found" },
          { status: 404 }
        )
      }

      const video = videos[0]

      // Return in the format expected by the presentation form
      return NextResponse.json({
        metadata: {
          videoId: video.videoId,
          title: video.title,
          channel: video.channelTitle,
          duration: video.duration,
          thumbnail: video.thumbnails.high || video.thumbnails.medium || video.thumbnails.default,
          viewCount: video.viewCount,
          definition: video.definition,
          publishedAt: video.publishedAt,
        },
        video,
      })
    }

    // Search for videos
    if (query) {
      const maxResults = parseInt(searchParams.get("maxResults") || "5", 10)
      const videos = await youtubeService.searchVideos(query, { maxResults })

      return NextResponse.json({
        results: videos.map((video) => ({
          metadata: {
            videoId: video.videoId,
            title: video.title,
            channel: video.channelTitle,
            duration: video.duration,
            thumbnail: video.thumbnails.high || video.thumbnails.medium || video.thumbnails.default,
            viewCount: video.viewCount,
            publishedAt: video.publishedAt,
          },
          video,
        })),
      })
    }

    return NextResponse.json(
      { error: "Please provide either videoId or q (query) parameter" },
      { status: 400 }
    )
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch video details" },
      { status: 500 }
    )
  }
}
