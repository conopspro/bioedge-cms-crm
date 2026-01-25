import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; roomId: string }>
}

/**
 * GET /api/events/[id]/rooms/[roomId]
 * Get a specific room
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id, roomId } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_rooms")
      .select("*")
      .eq("id", roomId)
      .eq("event_id", id)
      .single()

    if (error) {
      console.error("Error fetching event room:", error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/rooms/[roomId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/rooms/[roomId]
 * Update a room
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, roomId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.capacity !== undefined) updateData.capacity = body.capacity
    if (body.position !== undefined) updateData.position = body.position

    const { data, error } = await supabase
      .from("event_rooms")
      .update(updateData)
      .eq("id", roomId)
      .eq("event_id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating event room:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/rooms/[roomId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/events/[id]/rooms/[roomId]
 * Delete a room
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, roomId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_rooms")
      .delete()
      .eq("id", roomId)
      .eq("event_id", id)

    if (error) {
      console.error("Error deleting event room:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/rooms/[roomId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
