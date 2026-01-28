import { NextRequest, NextResponse } from "next/server"
import { perplexityService } from "@/lib/services/perplexity"

/**
 * Research Paper Search API
 *
 * GET /api/search-papers?q=xxx - Search for papers via Perplexity AI
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

    if (!perplexityService.isConfigured()) {
      return NextResponse.json(
        { error: "Perplexity API not configured" },
        { status: 503 }
      )
    }

    const papers = await perplexityService.searchPapers(query, { limit })

    return NextResponse.json({
      results: papers.map((paper) => ({
        title: paper.title,
        url: paper.url,
        snippet: paper.abstract,
        publication: paper.journal,
        citedBy: paper.citationCount,
        year: paper.year,
        authors: paper.authors,
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
