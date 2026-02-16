import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/navigation?location=main_header&event_id=xxx
 * List navigation items for a location
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const eventId = searchParams.get("event_id")

    const supabase = await createClient()

    let query = supabase
      .from("navigation_items")
      .select("*")
      .order("display_order", { ascending: true })

    if (location) {
      query = query.eq("location", location)
    }

    if (eventId) {
      query = query.eq("event_id", eventId)
    } else {
      query = query.is("event_id", null)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching navigation items:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/navigation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/navigation
 * Create a new navigation item
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { label, href, location, is_external = false, display_order = 0, is_visible = true, event_id = null, parent_id = null } = body

    if (!label || !href || !location) {
      return NextResponse.json({ error: "label, href, and location are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("navigation_items")
      .insert({ label, href, location, is_external, display_order, is_visible, event_id, parent_id })
      .select()
      .single()

    if (error) {
      console.error("Error creating navigation item:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/navigation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
