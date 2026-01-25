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
    .from("articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image_url,
      youtube_url,
      company:companies (
        id,
        name,
        category
      )
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

  // Filter by company category client-side (Supabase doesn't support filtering on joined table easily)
  let articles = data || []
  if (category) {
    articles = articles.filter(
      (article: any) =>
        article.company?.category === category
    )
  }

  return NextResponse.json({
    items: articles,
    hasMore: data?.length === PAGE_SIZE
  })
}
