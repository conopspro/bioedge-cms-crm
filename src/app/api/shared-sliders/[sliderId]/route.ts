import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ sliderId: string }>
}

/**
 * GET /api/shared-sliders/[sliderId]
 * Get a single shared slider with images
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()

    const { data: slider, error } = await supabase
      .from("shared_photo_sliders")
      .select(`
        *,
        images:shared_slider_images(*)
      `)
      .eq("id", sliderId)
      .single()

    if (error) {
      console.error("Error fetching shared slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(slider)
  } catch (error) {
    console.error("Error in GET /api/shared-sliders/[sliderId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/shared-sliders/[sliderId]
 * Update a shared slider
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "name",
      "slug",
      "description",
      "auto_play",
      "auto_play_interval",
      "show_navigation",
      "show_dots",
      "show_captions",
      "section_title",
      "section_subtitle",
      "section_background",
      "is_active",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: slider, error } = await supabase
      .from("shared_photo_sliders")
      .update(updateData)
      .eq("id", sliderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating shared slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(slider)
  } catch (error) {
    console.error("Error in PATCH /api/shared-sliders/[sliderId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/shared-sliders/[sliderId]
 * Delete a shared slider
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("shared_photo_sliders")
      .delete()
      .eq("id", sliderId)

    if (error) {
      console.error("Error deleting shared slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/shared-sliders/[sliderId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
