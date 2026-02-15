import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "0")
  const category = searchParams.get("category")
  const search = searchParams.get("q")
  const edge = searchParams.get("edge")

  const supabase = await createClient()

  // Build query (exclude drafts)
  let query = supabase
    .from("companies")
    .select("id, name, slug, domain, logo_url, category, edge_categories, access_levels, has_affiliate")
    .or("is_draft.is.null,is_draft.eq.false")

  // Apply search filter
  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  // Apply category filter
  if (category) {
    query = query.eq("category", category)
  }

  // Apply EDGE category filter
  if (edge) {
    query = query.contains("edge_categories", [edge])
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Sort: companies with logos first, then alphabetical within each group
  const sorted = (data || []).sort((a, b) => {
    const aHasLogo = a.logo_url ? 0 : 1
    const bHasLogo = b.logo_url ? 0 : 1
    if (aHasLogo !== bHasLogo) return aHasLogo - bHasLogo
    return a.name.localeCompare(b.name)
  })

  // Paginate after sorting
  const start = page * PAGE_SIZE
  const end = start + PAGE_SIZE
  const items = sorted.slice(start, end)

  return NextResponse.json({
    items,
    hasMore: end < sorted.length,
  })
}
