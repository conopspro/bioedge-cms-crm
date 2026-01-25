import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/enhance/search
 *
 * Search for entities to enhance
 * Query params:
 *   - type: "companies" | "contacts" | "articles"
 *   - q: search query
 *   - limit: max results (default 50)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type") || "companies"
    const query = searchParams.get("q") || ""
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = `%${query}%`

    let results: Array<{
      id: string
      name: string
      subtitle: string
      enhanced: boolean
      enhancedAt: string | null
    }> = []

    if (type === "companies") {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, domain, website, description, ai_enhanced_at")
        .or(`name.ilike.${searchTerm},domain.ilike.${searchTerm},website.ilike.${searchTerm}`)
        .order("name")
        .limit(limit)

      if (error) throw error

      results = (data || []).map(c => ({
        id: c.id,
        name: c.name,
        subtitle: c.domain || c.website || "No domain",
        enhanced: !!c.description,
        enhancedAt: c.ai_enhanced_at,
      }))
    } else if (type === "contacts") {
      const { data, error } = await supabase
        .from("contacts")
        .select("id, first_name, last_name, email, bio, ai_researched_at")
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .order("last_name")
        .limit(limit)

      if (error) throw error

      results = (data || []).map(c => ({
        id: c.id,
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Unknown",
        subtitle: c.email || "No email",
        enhanced: !!c.bio,
        enhancedAt: c.ai_researched_at,
      }))
    } else if (type === "articles") {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, status, ai_enhanced, updated_at")
        .ilike("title", searchTerm)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      results = (data || []).map(a => ({
        id: a.id,
        name: a.title,
        subtitle: `Status: ${a.status}`,
        enhanced: a.ai_enhanced,
        enhancedAt: a.ai_enhanced ? a.updated_at : null,
      }))
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}
