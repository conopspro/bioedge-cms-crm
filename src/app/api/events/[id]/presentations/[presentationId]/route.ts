import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; presentationId: string }>
}

/**
 * GET /api/events/[id]/presentations/[presentationId]
 * Get a specific event-presentation link
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id, presentationId } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_presentations")
      .select(`
        *,
        presentation:presentations(
          id,
          title,
          slug,
          short_description,
          long_description,
          session_type,
          status,
          recording_url,
          recording_embed,
          contact:contacts(id, first_name, last_name, title, avatar_url),
          company:companies(id, name, logo_url),
          panelists:presentation_panelists(
            id,
            role,
            display_order,
            contact:contacts(id, first_name, last_name, title, avatar_url),
            company:companies(id, name)
          )
        )
      `)
      .eq("id", presentationId)
      .eq("event_id", id)
      .single()

    if (error) {
      console.error("Error fetching event presentation:", error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/presentations/[presentationId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/presentations/[presentationId]
 * Update scheduling info for a linked presentation
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, presentationId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.scheduled_date !== undefined) updateData.scheduled_date = body.scheduled_date
    if (body.start_time !== undefined) updateData.start_time = body.start_time
    if (body.end_time !== undefined) updateData.end_time = body.end_time
    if (body.room !== undefined) updateData.room = body.room
    if (body.event_room_id !== undefined) updateData.event_room_id = body.event_room_id
    if (body.track !== undefined) updateData.track = body.track
    if (body.event_track_id !== undefined) updateData.event_track_id = body.event_track_id
    if (body.status !== undefined) updateData.status = body.status
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured
    if (body.display_order !== undefined) updateData.display_order = body.display_order
    if (body.notes !== undefined) updateData.notes = body.notes

    const { data, error } = await supabase
      .from("event_presentations")
      .update(updateData)
      .eq("id", presentationId)
      .eq("event_id", id)
      .select(`
        *,
        presentation:presentations(
          id,
          title,
          slug,
          short_description,
          session_type,
          status
        )
      `)
      .single()

    if (error) {
      console.error("Error updating event presentation:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/presentations/[presentationId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/events/[id]/presentations/[presentationId]
 * Unlink a presentation from this event
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, presentationId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_presentations")
      .delete()
      .eq("id", presentationId)
      .eq("event_id", id)

    if (error) {
      console.error("Error unlinking presentation:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/presentations/[presentationId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
