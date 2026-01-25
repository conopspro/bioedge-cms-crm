import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/homepage/sections
 * Get all homepage sections
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching homepage sections:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in GET /api/homepage/sections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/homepage/sections
 * Create a new homepage section
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from("homepage_sections")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single()

    const newOrder = (maxOrder?.display_order || 0) + 1

    const { data, error } = await supabase
      .from("homepage_sections")
      .insert({
        ...body,
        display_order: body.display_order ?? newOrder,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating homepage section:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/homepage/sections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/homepage/sections
 * Bulk update sections (for reordering)
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Expect array of { id, display_order } or full section updates
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected array of sections" },
        { status: 400 }
      )
    }

    // Update each section
    const results = await Promise.all(
      body.map(async (section: { id: string; [key: string]: any }) => {
        const { id, ...updates } = section
        const { data, error } = await supabase
          .from("homepage_sections")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) {
          console.error(`Error updating section ${id}:`, error)
          return { id, error: error.message }
        }
        return data
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in PATCH /api/homepage/sections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
