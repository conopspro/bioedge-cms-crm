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
    .from("contacts")
    .select(`
      id,
      slug,
      first_name,
      last_name,
      title,
      avatar_url,
      linkedin_url,
      bio,
      company:companies(name, logo_url, category, is_draft)
    `)
    .eq("show_on_articles", true)
    .order("last_name", { ascending: true })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  // Apply search filter on name
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  const { data: rawData, error } = await query

  // Hide draft companies from public display
  const data = (rawData || []).map((leader: any) => ({
    ...leader,
    company: leader.company?.is_draft === true ? null : leader.company,
  }))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter by company category client-side
  let leaders = data || []
  if (category) {
    leaders = leaders.filter(
      (leader: any) =>
        leader.company?.category === category
    )
  }

  return NextResponse.json({
    items: leaders,
    hasMore: data?.length === PAGE_SIZE
  })
}
