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

  // Build query (exclude drafts - include NULL and false)
  let query = supabase
    .from("companies")
    .select("id, name, slug, domain, logo_url, category, edge_categories, access_levels, has_affiliate")
    .or("is_draft.is.null,is_draft.eq.false")
    .order("name", { ascending: true })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

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

  return NextResponse.json({
    items: data || [],
    hasMore: data?.length === PAGE_SIZE
  })
}
