/**
 * Serper.dev API Integration
 *
 * Provides Google Search capabilities including:
 * - YouTube video search
 * - Google Scholar search
 * - Regular web search (for books, etc.)
 *
 * API Docs: https://serper.dev/api
 */

const SERPER_API_BASE = "https://google.serper.dev"

interface SerperSearchResult {
  title: string
  link: string
  snippet: string
  position: number
}

interface SerperVideoResult {
  title: string
  link: string
  snippet: string
  channel: string
  duration: string
  date: string
  imageUrl: string
}

interface SerperScholarResult {
  title: string
  link: string
  snippet: string
  publication_info?: string
  cited_by?: number
  year?: string
}

interface SerperSearchResponse {
  searchParameters: {
    q: string
    type: string
  }
  organic?: SerperSearchResult[]
  videos?: SerperVideoResult[]
  scholar?: SerperScholarResult[]
}

export interface YouTubeSearchResult {
  title: string
  url: string
  videoId: string
  description: string
  channel: string
  duration: string
  date: string
  thumbnail: string
}

export interface ScholarSearchResult {
  title: string
  url: string
  snippet: string
  publication: string | null
  citedBy: number | null
  year: string | null
}

export interface BookSearchResult {
  title: string
  url: string
  snippet: string
  author: string | null
}

class SerperService {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.SERPER_API_KEY || null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  private async fetch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    if (!this.apiKey) {
      throw new Error("Serper API key not configured. Set SERPER_API_KEY environment variable.")
    }

    const response = await fetch(`${SERPER_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "X-API-KEY": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new Error(error.message || `Serper API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Search for YouTube videos related to a topic
   */
  async searchYouTube(query: string, limit: number = 5): Promise<YouTubeSearchResult[]> {
    const response = await this.fetch<SerperSearchResponse>("/videos", {
      q: query,
      num: limit,
    })

    return (response.videos || []).map((video) => {
      // Extract video ID from YouTube URL
      const videoIdMatch = video.link.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)
      const videoId = videoIdMatch ? videoIdMatch[1] : ""

      return {
        title: video.title,
        url: video.link,
        videoId,
        description: video.snippet,
        channel: video.channel,
        duration: video.duration,
        date: video.date,
        thumbnail: video.imageUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      }
    })
  }

  /**
   * Search Google Scholar for academic papers
   */
  async searchScholar(query: string, limit: number = 5): Promise<ScholarSearchResult[]> {
    const response = await this.fetch<SerperSearchResponse>("/scholar", {
      q: query,
      num: limit,
    })

    return (response.scholar || []).map((paper) => ({
      title: paper.title,
      url: paper.link,
      snippet: paper.snippet,
      publication: paper.publication_info || null,
      citedBy: paper.cited_by || null,
      year: paper.year || null,
    }))
  }

  /**
   * Search for books related to a topic
   */
  async searchBooks(query: string, limit: number = 5): Promise<BookSearchResult[]> {
    // Search for books by adding "book" to the query and looking for Amazon/Goodreads results
    const response = await this.fetch<SerperSearchResponse>("/search", {
      q: `${query} book`,
      num: limit * 2, // Get more results to filter
    })

    // Filter for book-related results
    const bookResults = (response.organic || [])
      .filter((result) => {
        const url = result.link.toLowerCase()
        const title = result.title.toLowerCase()
        return (
          url.includes("amazon.com") ||
          url.includes("goodreads.com") ||
          url.includes("barnesandnoble.com") ||
          title.includes("book") ||
          result.snippet.toLowerCase().includes("author")
        )
      })
      .slice(0, limit)

    return bookResults.map((result) => {
      // Try to extract author from snippet
      const authorMatch = result.snippet.match(/by\s+([^.]+?)(?:\s+\||,|\.|$)/i)

      return {
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        author: authorMatch ? authorMatch[1].trim() : null,
      }
    })
  }

  /**
   * General web search
   */
  async search(query: string, limit: number = 10): Promise<SerperSearchResult[]> {
    const response = await this.fetch<SerperSearchResponse>("/search", {
      q: query,
      num: limit,
    })

    return response.organic || []
  }
}

// Export singleton instance
export const serperService = new SerperService()
