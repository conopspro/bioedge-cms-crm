import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/homepage/events
 * Get featured events for homepage
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("homepage_events")
      .select(`
        *,
        event:events(
          id, name, slug, tagline, start_date, end_date,
          city, state, venue_name, featured_image_url, status
        )
      `)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching homepage events:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in GET /api/homepage/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/homepage/events
 * Add an event to homepage featured events
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.event_id) {
      return NextResponse.json(
        { error: "event_id is required" },
        { status: 400 }
      )
    }

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from("homepage_events")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single()

    const newOrder = (maxOrder?.display_order || 0) + 1

    const { data, error } = await supabase
      .from("homepage_events")
      .insert({
        event_id: body.event_id,
        display_order: body.display_order ?? newOrder,
        is_visible: body.is_visible ?? true,
        custom_title: body.custom_title || null,
        custom_tagline: body.custom_tagline || null,
        custom_image_url: body.custom_image_url || null,
      })
      .select(`
        *,
        event:events(
          id, name, slug, tagline, start_date, end_date,
          city, state, venue_name, featured_image_url, status
        )
      `)
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This event is already featured on the homepage" },
          { status: 400 }
        )
      }
      console.error("Error adding homepage event:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/homepage/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/homepage/events
 * Bulk update homepage events (for reordering)
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected array of events" },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      body.map(async (event: { id: string; [key: string]: any }) => {
        const { id, ...updates } = event
        const { data, error } = await supabase
          .from("homepage_events")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) {
          console.error(`Error updating homepage event ${id}:`, error)
          return { id, error: error.message }
        }
        return data
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in PATCH /api/homepage/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
