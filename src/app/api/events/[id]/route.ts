import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]
 * Get a single event by ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      console.error("Error fetching event:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]
 * Update an event
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate name if provided
    if (body.name !== undefined && !body.name?.trim()) {
      return NextResponse.json(
        { error: "Event name cannot be empty" },
        { status: 400 }
      )
    }

    // Validate slug if provided
    if (body.slug !== undefined && !body.slug?.trim()) {
      return NextResponse.json(
        { error: "Slug cannot be empty" },
        { status: 400 }
      )
    }

    // Check if slug is unique (excluding current event)
    if (body.slug) {
      const { data: existing } = await supabase
        .from("events")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: "An event with this slug already exists" },
          { status: 400 }
        )
      }
    }

    // Update the event
    const { data, error } = await supabase
      .from("events")
      .update({
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim() }),
        ...(body.tagline !== undefined && { tagline: body.tagline || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.extended_info !== undefined && { extended_info: body.extended_info || null }),
        ...(body.venue_name !== undefined && { venue_name: body.venue_name || null }),
        ...(body.venue_address !== undefined && { venue_address: body.venue_address || null }),
        ...(body.city !== undefined && { city: body.city || null }),
        ...(body.state !== undefined && { state: body.state || null }),
        ...(body.country !== undefined && { country: body.country || null }),
        ...(body.start_date !== undefined && { start_date: body.start_date || null }),
        ...(body.end_date !== undefined && { end_date: body.end_date || null }),
        ...(body.timezone !== undefined && { timezone: body.timezone || null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.registration_url !== undefined && { registration_url: body.registration_url || null }),
        ...(body.featured_image_url !== undefined && { featured_image_url: body.featured_image_url || null }),
        ...(body.og_image_url !== undefined && { og_image_url: body.og_image_url || null }),
        ...(body.landing_page_settings !== undefined && { landing_page_settings: body.landing_page_settings }),
        ...(body.section_colors !== undefined && { section_colors: body.section_colors }),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      console.error("Error updating event:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate the public event page so changes appear immediately
    if (data.slug) {
      revalidatePath(`/${data.slug}`)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event and all related data
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Delete the event (cascade will handle related records)
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting event:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
