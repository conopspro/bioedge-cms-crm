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
    .from("spotlights")
    .select(`
      id,
      title,
      slug,
      short_description,
      recording_embed,
      youtube_url,
      contact:contacts(id, first_name, last_name, avatar_url),
      company:companies(id, name, logo_url, category)
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

  // Filter by company category client-side
  let spotlights = data || []
  if (category) {
    spotlights = spotlights.filter(
      (s: any) =>
        s.company?.category === category
    )
  }

  return NextResponse.json({
    items: spotlights,
    hasMore: data?.length === PAGE_SIZE
  })
}
