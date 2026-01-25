import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/section-photos
 * Get all section photos for an event
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_section_photos")
      .select("*")
      .eq("event_id", id)
      .order("section")
      .order("display_order")

    if (error) {
      console.error("Error fetching section photos:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in GET /api/events/[id]/section-photos:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events/[id]/section-photos
 * Add a new section photo
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { section, image_url, alt_text, caption, display_order } = body

    if (!section || !image_url) {
      return NextResponse.json(
        { error: "Section and image_url are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("event_section_photos")
      .insert({
        event_id: id,
        section,
        image_url,
        alt_text: alt_text || null,
        caption: caption || null,
        display_order: display_order || 0,
        is_primary: false,
        is_visible: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating section photo:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/events/[id]/section-photos:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
