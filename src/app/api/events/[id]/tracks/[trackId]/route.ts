import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; trackId: string }>
}

/**
 * GET /api/events/[id]/tracks/[trackId]
 * Get a specific track
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id, trackId } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_tracks")
      .select("*")
      .eq("id", trackId)
      .eq("event_id", id)
      .single()

    if (error) {
      console.error("Error fetching event track:", error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/tracks/[trackId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/tracks/[trackId]
 * Update a track
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, trackId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.color !== undefined) updateData.color = body.color
    if (body.position !== undefined) updateData.position = body.position

    const { data, error } = await supabase
      .from("event_tracks")
      .update(updateData)
      .eq("id", trackId)
      .eq("event_id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating event track:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/tracks/[trackId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/events/[id]/tracks/[trackId]
 * Delete a track
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, trackId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_tracks")
      .delete()
      .eq("id", trackId)
      .eq("event_id", id)

    if (error) {
      console.error("Error deleting event track:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/tracks/[trackId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
