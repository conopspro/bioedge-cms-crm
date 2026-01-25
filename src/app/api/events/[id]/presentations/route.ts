import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/presentations
 * Get all presentations linked to this event with scheduling info
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
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
          session_type,
          status,
          recording_url,
          contact:contacts(id, first_name, last_name, title, avatar_url),
          company:companies(id, name, logo_url),
          panelists:presentation_panelists(
            id,
            role,
            display_order,
            contact:contacts(id, first_name, last_name, title, avatar_url)
          )
        )
      `)
      .eq("event_id", id)
      .order("scheduled_date", { ascending: true })
      .order("start_time", { ascending: true })
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching event presentations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/presentations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events/[id]/presentations
 * Link an existing presentation to this event with scheduling info
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.presentation_id) {
      return NextResponse.json(
        { error: "presentation_id is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("event_presentations")
      .insert({
        event_id: id,
        presentation_id: body.presentation_id,
        scheduled_date: body.scheduled_date || null,
        start_time: body.start_time || null,
        end_time: body.end_time || null,
        room: body.room || null,
        track: body.track || null,
        status: body.status || "scheduled",
        is_featured: body.is_featured || false,
        display_order: body.display_order || 0,
        notes: body.notes || null,
      })
      .select(`
        *,
        presentation:presentations(
          id,
          title,
          slug,
          short_description,
          session_type,
          status,
          contact:contacts(id, first_name, last_name, title, avatar_url),
          company:companies(id, name, logo_url)
        )
      `)
      .single()

    if (error) {
      console.error("Error linking presentation:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/presentations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
