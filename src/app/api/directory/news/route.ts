/**
 * Public News Directory API
 *
 * GET /api/directory/news?page=0&source=X&edge=X&system=X&q=X
 *
 * Returns paginated news articles for the public /news page.
 * Follows the same pattern as /api/directory/articles.
 */

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "0")
  const source = searchParams.get("source")
  const edge = searchParams.get("edge")
  const system = searchParams.get("system")
  const search = searchParams.get("q")

  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("news_articles")
    .select(
      "id, title, url, source_name, published_at, author, summary, key_points, edge_significance, edge_categories, biological_systems"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  // Filter by source name
  if (source) {
    query = query.eq("source_name", source)
  }

  // Filter by EDGE category (array contains)
  if (edge) {
    query = query.contains("edge_categories", [edge])
  }

  // Filter by biological system (array contains)
  if (system) {
    query = query.contains("biological_systems", [system])
  }

  // Text search across title, summary, significance, and content
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,summary.ilike.%${search}%,edge_significance.ilike.%${search}%,raw_content.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    items: data || [],
    hasMore: (data?.length || 0) === PAGE_SIZE,
  })
}
