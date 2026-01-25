import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/sessions
 * Get all event sessions (scheduled instances) for an event
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_sessions")
      .select("*")
      .eq("event_id", id)
      .order("day_number", { ascending: true })
      .order("start_time", { ascending: true })
      .order("position", { ascending: true })

    if (error) {
      console.error("Error fetching sessions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/sessions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events/[id]/sessions
 * Add an event session (scheduled instance)
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    // Handle time fields - convert time strings to full timestamps
    let startTime = null
    let endTime = null

    if (body.start_time) {
      // If it's a time string like "09:00", convert to ISO timestamp
      if (body.start_time.length === 5) {
        startTime = `2024-01-01T${body.start_time}:00`
      } else {
        startTime = body.start_time
      }
    }

    if (body.end_time) {
      if (body.end_time.length === 5) {
        endTime = `2024-01-01T${body.end_time}:00`
      } else {
        endTime = body.end_time
      }
    }

    const { data, error } = await supabase
      .from("event_sessions")
      .insert({
        event_id: id,
        session_id: body.session_id || null, // Link to template if provided
        title: body.title.trim(),
        description: body.description || null,
        session_type: body.session_type || "presentation",
        status: body.status || "draft",
        day_number: body.day_number || 1,
        start_time: startTime,
        end_time: endTime,
        location: body.location || null,
        track: body.track || null,
        venue_room_id: body.venue_room_id || null,
        position: body.position || 0,
        is_featured: body.is_featured || false,
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating session:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/sessions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
