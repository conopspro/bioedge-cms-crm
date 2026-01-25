/**
 * Google Books API Integration
 *
 * Uses the official Google Books API to find real books with verified data.
 * This provides accurate book information including:
 * - Verified titles and authors
 * - Real publication dates
 * - Actual thumbnail images
 * - Links to Google Books (which include purchase options)
 *
 * API Docs: https://developers.google.com/books/docs/v1/using
 *
 * Note: Google Books API has a free tier with 1,000 requests/day.
 * An API key is recommended for higher quotas.
 */

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

export interface GoogleBook {
  title: string
  authors: string[]
  year: number | null
  description: string | null
  url: string // Google Books link
  thumbnail: string | null
  rating: number | null
  publisher: string | null
  pageCount: number | null
  categories: string[]
  isbn: string | null
}

interface GoogleBooksVolumeInfo {
  title?: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  pageCount?: number
  categories?: string[]
  averageRating?: number
  imageLinks?: {
    thumbnail?: string
    smallThumbnail?: string
  }
  industryIdentifiers?: Array<{
    type: string
    identifier: string
  }>
  infoLink?: string
  canonicalVolumeLink?: string
}

interface GoogleBooksItem {
  id: string
  volumeInfo: GoogleBooksVolumeInfo
  saleInfo?: {
    buyLink?: string
  }
}

interface GoogleBooksResponse {
  totalItems: number
  items?: GoogleBooksItem[]
}

class GoogleBooksService {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.GOOGLE_BOOKS_API_KEY || null
  }

  isConfigured(): boolean {
    // Google Books API works without a key, but with lower quotas
    return true
  }

  /**
   * Search for books by query
   */
  async searchBooks(
    query: string,
    options: {
      limit?: number
      orderBy?: "relevance" | "newest"
    } = {}
  ): Promise<GoogleBook[]> {
    const { limit = 5, orderBy = "relevance" } = options

    try {
      const params = new URLSearchParams({
        q: query,
        maxResults: Math.min(limit, 40).toString(), // Google Books max is 40
        orderBy,
        printType: "books",
        langRestrict: "en",
      })

      if (this.apiKey) {
        params.set("key", this.apiKey)
      }

      const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`)

      if (!response.ok) {
        console.error("Google Books API error:", response.status)
        return []
      }

      const data: GoogleBooksResponse = await response.json()

      if (!data.items || data.items.length === 0) {
        return []
      }

      return data.items
        .map((item) => this.parseBookItem(item))
        .filter((book): book is GoogleBook => book !== null)
        .slice(0, limit)
    } catch (error) {
      console.error("Google Books search failed:", error)
      return []
    }
  }

  /**
   * Search for books by a specific author
   */
  async searchBooksByAuthor(
    authorName: string,
    topic?: string,
    limit: number = 5
  ): Promise<GoogleBook[]> {
    // Use the inauthor: operator for more precise author matching
    let query = `inauthor:"${authorName}"`

    // Add topic for additional relevance if provided
    if (topic) {
      // Extract key terms from topic, avoiding overly long queries
      const topicTerms = topic
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 3)
        .join(" ")
      if (topicTerms) {
        query += ` ${topicTerms}`
      }
    }

    const books = await this.searchBooks(query, { limit: limit * 2 }) // Get more to filter

    // Filter to ensure the author is actually in the authors list
    const authorLower = authorName.toLowerCase()
    const filtered = books.filter((book) =>
      book.authors.some((a) => {
        const aLower = a.toLowerCase()
        // Check if author name matches (handles "John Smith" vs "Smith, John")
        return (
          aLower.includes(authorLower) ||
          authorLower.includes(aLower) ||
          this.authorNamesMatch(authorName, a)
        )
      })
    )

    return filtered.slice(0, limit)
  }

  /**
   * Check if two author names likely refer to the same person
   */
  private authorNamesMatch(name1: string, name2: string): boolean {
    const normalize = (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter((p) => p.length > 1)
        .sort()

    const parts1 = normalize(name1)
    const parts2 = normalize(name2)

    // Check if last names match and at least one other part matches
    if (parts1.length === 0 || parts2.length === 0) return false

    const lastName1 = parts1[parts1.length - 1]
    const lastName2 = parts2[parts2.length - 1]

    if (lastName1 !== lastName2) return false

    // If we just have last names, that's a match
    if (parts1.length === 1 || parts2.length === 1) return true

    // Check if first name or initial matches
    const first1 = parts1[0]
    const first2 = parts2[0]

    return (
      first1 === first2 ||
      first1.startsWith(first2[0]) ||
      first2.startsWith(first1[0])
    )
  }

  /**
   * Search for books by a leader with full context
   * (Compatibility method for replacing perplexityService.searchBooksByLeader)
   */
  async searchBooksByLeader(
    authorName: string,
    options: {
      company?: string
      title?: string
      industry?: string
      limit?: number
    } = {}
  ): Promise<GoogleBook[]> {
    const { company, industry, limit = 5 } = options

    // Build topic context from available info
    let topic = ""
    if (industry) topic = industry
    if (company) topic = topic ? `${topic} ${company}` : company

    return this.searchBooksByAuthor(authorName, topic || undefined, limit)
  }

  /**
   * Search for books on a specific topic
   */
  async searchBooksByTopic(
    topic: string,
    options: {
      limit?: number
      category?: string
    } = {}
  ): Promise<GoogleBook[]> {
    const { limit = 5, category } = options

    let query = topic

    // Add subject filter if category provided
    if (category) {
      query += ` subject:"${category}"`
    }

    return this.searchBooks(query, { limit })
  }

  /**
   * Parse a Google Books API item into our GoogleBook format
   */
  private parseBookItem(item: GoogleBooksItem): GoogleBook | null {
    const info = item.volumeInfo

    if (!info.title) {
      return null
    }

    // Build the full title with subtitle
    let title = info.title
    if (info.subtitle) {
      title += `: ${info.subtitle}`
    }

    // Extract year from publishedDate (can be "2023", "2023-01", or "2023-01-15")
    let year: number | null = null
    if (info.publishedDate) {
      const yearMatch = info.publishedDate.match(/^(\d{4})/)
      if (yearMatch) {
        year = parseInt(yearMatch[1], 10)
      }
    }

    // Get ISBN (prefer ISBN-13)
    let isbn: string | null = null
    if (info.industryIdentifiers) {
      const isbn13 = info.industryIdentifiers.find((id) => id.type === "ISBN_13")
      const isbn10 = info.industryIdentifiers.find((id) => id.type === "ISBN_10")
      isbn = isbn13?.identifier || isbn10?.identifier || null
    }

    // Get thumbnail - prefer larger image, use https
    let thumbnail: string | null = null
    if (info.imageLinks) {
      thumbnail = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || null
      if (thumbnail) {
        // Ensure https and get larger image
        thumbnail = thumbnail.replace("http://", "https://")
        // Request a larger zoom level
        thumbnail = thumbnail.replace("zoom=1", "zoom=2")
      }
    }

    // Get the best URL - prefer canonical link, fall back to info link
    const url = info.canonicalVolumeLink || info.infoLink || `https://books.google.com/books?id=${item.id}`

    return {
      title,
      authors: info.authors || [],
      year,
      description: info.description || null,
      url,
      thumbnail,
      rating: info.averageRating || null,
      publisher: info.publisher || null,
      pageCount: info.pageCount || null,
      categories: info.categories || [],
      isbn,
    }
  }
}

// Export singleton instance
export const googleBooksService = new GoogleBooksService()
