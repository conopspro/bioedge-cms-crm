import { NextRequest, NextResponse } from "next/server"
import { googleBooksService } from "@/lib/services/google-books"

/**
 * Book Search API
 *
 * GET /api/search-books?q=xxx - Search for books via Google Books API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const limit = parseInt(searchParams.get("limit") || "5", 10)

    if (!query) {
      return NextResponse.json(
        { error: "Please provide a search query (q parameter)" },
        { status: 400 }
      )
    }

    const books = await googleBooksService.searchBooks(query, { limit })

    return NextResponse.json({
      results: books.map((book) => ({
        title: book.title,
        author: book.authors.join(", "),
        year: book.year,
        url: book.url,
        thumbnail: book.thumbnail,
        publisher: book.publisher,
        description: book.description,
      })),
    })
  } catch (error) {
    console.error("Book search error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search books" },
      { status: 500 }
    )
  }
}
