import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; photoId: string }>
}

/**
 * DELETE /api/events/[id]/section-photos/[photoId]
 * Delete a section photo
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, photoId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_section_photos")
      .delete()
      .eq("id", photoId)
      .eq("event_id", id)

    if (error) {
      console.error("Error deleting section photo:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/section-photos/[photoId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/section-photos/[photoId]
 * Update a section photo
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, photoId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("event_section_photos")
      .update({
        ...(body.alt_text !== undefined && { alt_text: body.alt_text }),
        ...(body.caption !== undefined && { caption: body.caption }),
        ...(body.is_primary !== undefined && { is_primary: body.is_primary }),
        ...(body.is_visible !== undefined && { is_visible: body.is_visible }),
        ...(body.display_order !== undefined && { display_order: body.display_order }),
      })
      .eq("id", photoId)
      .eq("event_id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating section photo:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/section-photos/[photoId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
