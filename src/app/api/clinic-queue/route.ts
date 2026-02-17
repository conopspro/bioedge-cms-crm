import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/clinic-queue
 *
 * List queue items with pagination and filtering.
 *
 * Query params:
 *   status           - pending | approved | rejected | imported
 *   perplexity_status - pending | searching | found | not_found | error
 *   search_tag       - filter by search tag
 *   page             - page number (default 1)
 *   limit            - items per page (default 50)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl

    const status = searchParams.get("status")
    const perplexityStatus = searchParams.get("perplexity_status")
    const searchTag = searchParams.get("search_tag")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "50", 10)))

    const offset = (page - 1) * limit

    // Build the query
    let query = supabase
      .from("clinic_queue")
      .select("*", { count: "exact" })

    if (status) {
      query = query.eq("status", status)
    }
    if (perplexityStatus) {
      query = query.eq("perplexity_status", perplexityStatus)
    }
    if (searchTag) {
      query = query.eq("search_tag", searchTag)
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching clinic queue:", error)
      return NextResponse.json(
        { error: `Failed to fetch clinic queue: ${error.message}` },
        { status: 500 }
      )
    }

    const total = count ?? 0

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
