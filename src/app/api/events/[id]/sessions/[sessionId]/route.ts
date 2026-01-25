import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; sessionId: string }>
}

/**
 * DELETE /api/events/[id]/sessions/[sessionId]
 * Delete a session
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, sessionId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("event_id", id)

    if (error) {
      console.error("Error deleting session:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/sessions/[sessionId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/sessions/[sessionId]
 * Update a session
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, sessionId } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Handle time fields
    let startTime = undefined
    let endTime = undefined

    if (body.start_time !== undefined) {
      if (body.start_time && body.start_time.length === 5) {
        startTime = `2024-01-01T${body.start_time}:00`
      } else {
        startTime = body.start_time || null
      }
    }

    if (body.end_time !== undefined) {
      if (body.end_time && body.end_time.length === 5) {
        endTime = `2024-01-01T${body.end_time}:00`
      } else {
        endTime = body.end_time || null
      }
    }

    const { data, error } = await supabase
      .from("event_sessions")
      .update({
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.session_type !== undefined && { session_type: body.session_type }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.day_number !== undefined && { day_number: body.day_number }),
        ...(startTime !== undefined && { start_time: startTime }),
        ...(endTime !== undefined && { end_time: endTime }),
        ...(body.location !== undefined && { location: body.location || null }),
        ...(body.track !== undefined && { track: body.track || null }),
        ...(body.venue_room_id !== undefined && { venue_room_id: body.venue_room_id || null }),
        ...(body.session_id !== undefined && { session_id: body.session_id || null }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.is_featured !== undefined && { is_featured: body.is_featured }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      })
      .eq("id", sessionId)
      .eq("event_id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating session:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/sessions/[sessionId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
