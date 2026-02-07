import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "0")
  const category = searchParams.get("category")
  const search = searchParams.get("q")

  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("presentations")
    .select(`
      id,
      title,
      slug,
      short_description,
      recording_embed,
      youtube_url,
      contact:contacts(id, first_name, last_name, avatar_url),
      company:companies(id, name, logo_url, category, is_draft)
    `)
    .eq("status", "published")
    .order("title", { ascending: true })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  // Apply search filter
  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Hide draft companies from public display, then filter by category
  let presentations = (data || []).map((p: any) => ({
    ...p,
    company: p.company?.is_draft === true ? null : p.company,
  }))
  if (category) {
    presentations = presentations.filter(
      (p: any) =>
        p.company?.category === category
    )
  }

  return NextResponse.json({
    items: presentations,
    hasMore: data?.length === PAGE_SIZE
  })
}
