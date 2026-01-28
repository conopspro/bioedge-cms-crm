import { NextRequest, NextResponse } from "next/server"
import { serperService } from "@/lib/services/serper"

/**
 * Research Paper Search API
 *
 * GET /api/search-papers?q=xxx - Search for papers via Serper (Google Scholar)
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

    if (!serperService.isConfigured()) {
      return NextResponse.json(
        { error: "Serper API not configured" },
        { status: 503 }
      )
    }

    const papers = await serperService.searchScholar(query, limit)

    return NextResponse.json({
      results: papers.map((paper) => ({
        title: paper.title,
        url: paper.url,
        snippet: paper.snippet,
        publication: paper.publication,
        citedBy: paper.citedBy,
        year: paper.year,
      })),
    })
  } catch (error) {
    console.error("Paper search error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search papers" },
      { status: 500 }
    )
  }
}
