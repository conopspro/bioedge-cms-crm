import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/sliders
 * Fetch all photo sliders for an event
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()

    const { data: sliders, error } = await supabase
      .from("event_photo_sliders")
      .select(`
        *,
        images:event_slider_images(*)
      `)
      .eq("event_id", eventId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching sliders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(sliders)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/sliders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/events/[id]/sliders
 * Create a new photo slider
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { name, slug, position = "custom", section_title, section_subtitle, section_background = "white" } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    // Get max display order
    const { data: existing } = await supabase
      .from("event_photo_sliders")
      .select("display_order")
      .eq("event_id", eventId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

    const { data: slider, error } = await supabase
      .from("event_photo_sliders")
      .insert({
        event_id: eventId,
        name,
        slug,
        position,
        display_order: displayOrder,
        section_title,
        section_subtitle,
        section_background,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(slider, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/sliders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
