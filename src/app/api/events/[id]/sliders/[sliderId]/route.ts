import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; sliderId: string }>
}

/**
 * GET /api/events/[id]/sliders/[sliderId]
 * Fetch a specific photo slider with images
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()

    const { data: slider, error } = await supabase
      .from("event_photo_sliders")
      .select(`
        *,
        images:event_slider_images(*)
      `)
      .eq("id", sliderId)
      .single()

    if (error) {
      console.error("Error fetching slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 })
    }

    return NextResponse.json(slider)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/sliders/[sliderId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/events/[id]/sliders/[sliderId]
 * Update a photo slider
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "name",
      "slug",
      "position",
      "display_order",
      "auto_play",
      "auto_play_interval",
      "show_navigation",
      "show_dots",
      "show_captions",
      "is_visible",
      "section_title",
      "section_subtitle",
      "section_background",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: slider, error } = await supabase
      .from("event_photo_sliders")
      .update(updateData)
      .eq("id", sliderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(slider)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/sliders/[sliderId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[id]/sliders/[sliderId]
 * Delete a photo slider and all its images
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()

    // Cascade delete will handle images
    const { error } = await supabase
      .from("event_photo_sliders")
      .delete()
      .eq("id", sliderId)

    if (error) {
      console.error("Error deleting slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/sliders/[sliderId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
