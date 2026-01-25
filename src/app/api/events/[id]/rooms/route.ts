import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/rooms
 * Get all rooms for an event
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_rooms")
      .select("*")
      .eq("event_id", id)
      .order("position", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching event rooms:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/rooms:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events/[id]/rooms
 * Create a new room for an event
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("event_rooms")
      .insert({
        event_id: id,
        name: body.name,
        description: body.description || null,
        capacity: body.capacity || null,
        position: body.position || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating event room:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/rooms:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
