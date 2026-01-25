import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; sliderId: string; imageId: string }>
}

/**
 * PATCH /api/events/[id]/sliders/[sliderId]/images/[imageId]
 * Update a slider image
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { imageId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "image_url",
      "thumbnail_url",
      "alt_text",
      "caption",
      "link_url",
      "display_order",
      "is_visible",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: image, error } = await supabase
      .from("event_slider_images")
      .update(updateData)
      .eq("id", imageId)
      .select()
      .single()

    if (error) {
      console.error("Error updating slider image:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/sliders/[sliderId]/images/[imageId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[id]/sliders/[sliderId]/images/[imageId]
 * Delete a slider image
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { imageId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_slider_images")
      .delete()
      .eq("id", imageId)

    if (error) {
      console.error("Error deleting slider image:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/sliders/[sliderId]/images/[imageId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
