import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/enhance/batch
 *
 * Get IDs of entities that need enhancement
 * Query params:
 *   - type: "company" | "contact" | "article"
 *   - limit: max IDs to return (default 100)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type") || "company"
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500)

    let ids: string[] = []
    let total = 0

    if (type === "company") {
      // Get companies without descriptions
      const { data, error, count } = await supabase
        .from("companies")
        .select("id", { count: "exact" })
        .is("description", null)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      ids = (data || []).map(c => c.id)
      total = count || 0
    } else if (type === "contact") {
      // Get contacts without bios
      const { data, error, count } = await supabase
        .from("contacts")
        .select("id", { count: "exact" })
        .is("bio", null)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      ids = (data || []).map(c => c.id)
      total = count || 0
    } else if (type === "article") {
      // Get articles not yet enhanced
      const { data, error, count } = await supabase
        .from("articles")
        .select("id", { count: "exact" })
        .eq("ai_enhanced", false)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      ids = (data || []).map(a => a.id)
      total = count || 0
    }

    return NextResponse.json({ ids, total })
  } catch (error) {
    console.error("Batch fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch batch IDs" },
      { status: 500 }
    )
  }
}
