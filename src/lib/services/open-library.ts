/**
 * Open Library API Integration
 *
 * Free, open-source book database from Internet Archive
 * No API key required
 *
 * API Docs: https://openlibrary.org/developers/api
 */

const OPEN_LIBRARY_API = "https://openlibrary.org"

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  author_key?: string[]
  first_publish_year?: number
  publisher?: string[]
  isbn?: string[]
  cover_i?: number
  subject?: string[]
  number_of_pages_median?: number
  ratings_average?: number
  ratings_count?: number
}

interface OpenLibrarySearchResponse {
  numFound: number
  docs: OpenLibraryDoc[]
}

export interface OpenLibraryBook {
  title: string
  authors: string[]
  url: string
  coverUrl: string | null
  firstPublishYear: number | null
  publisher: string | null
  subjects: string[]
  pageCount: number | null
  rating: number | null
  ratingsCount: number | null
}

class OpenLibraryService {
  /**
   * Always available - no API key required
   */
  isConfigured(): boolean {
    return true
  }

  /**
   * Search for books by query
   */
  async searchBooks(query: string, limit: number = 10): Promise<OpenLibraryBook[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      fields: "key,title,author_name,author_key,first_publish_year,publisher,cover_i,subject,number_of_pages_median,ratings_average,ratings_count",
    })

    const response = await fetch(`${OPEN_LIBRARY_API}/search.json?${params}`)

    if (!response.ok) {
      console.error("Open Library API error:", response.status)
      return []
    }

    const data: OpenLibrarySearchResponse = await response.json()

    return data.docs.map((doc) => this.mapToBook(doc))
  }

  /**
   * Search for books by a specific author
   */
  async searchByAuthor(authorName: string, limit: number = 10): Promise<OpenLibraryBook[]> {
    const params = new URLSearchParams({
      author: authorName,
      limit: limit.toString(),
      fields: "key,title,author_name,author_key,first_publish_year,publisher,cover_i,subject,number_of_pages_median,ratings_average,ratings_count",
    })

    const response = await fetch(`${OPEN_LIBRARY_API}/search.json?${params}`)

    if (!response.ok) {
      console.error("Open Library API error:", response.status)
      return []
    }

    const data: OpenLibrarySearchResponse = await response.json()

    return data.docs.map((doc) => this.mapToBook(doc))
  }

  private mapToBook(doc: OpenLibraryDoc): OpenLibraryBook {
    // Cover URL format: https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
    const coverUrl = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null

    return {
      title: doc.title,
      authors: doc.author_name || [],
      url: `https://openlibrary.org${doc.key}`,
      coverUrl,
      firstPublishYear: doc.first_publish_year || null,
      publisher: doc.publisher?.[0] || null,
      subjects: doc.subject?.slice(0, 5) || [],
      pageCount: doc.number_of_pages_median || null,
      rating: doc.ratings_average || null,
      ratingsCount: doc.ratings_count || null,
    }
  }
}

// Export singleton instance
export const openLibraryService = new OpenLibraryService()
