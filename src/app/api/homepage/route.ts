import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/homepage
 * Get homepage settings, sections, and featured events
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch homepage settings (singleton)
    const { data: settings, error: settingsError } = await supabase
      .from("homepage_settings")
      .select("*")
      .single()

    if (settingsError && settingsError.code !== "PGRST116") {
      console.error("Error fetching homepage settings:", settingsError)
      return NextResponse.json({ error: settingsError.message }, { status: 500 })
    }

    // Fetch sections ordered by display_order
    const { data: sections, error: sectionsError } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("display_order", { ascending: true })

    if (sectionsError) {
      console.error("Error fetching homepage sections:", sectionsError)
      return NextResponse.json({ error: sectionsError.message }, { status: 500 })
    }

    // Fetch featured events with event details
    const { data: featuredEvents, error: eventsError } = await supabase
      .from("homepage_events")
      .select(`
        *,
        event:events(
          id, name, slug, tagline, start_date, end_date,
          city, state, venue_name, featured_image_url, status
        )
      `)
      .order("display_order", { ascending: true })

    if (eventsError) {
      console.error("Error fetching homepage events:", eventsError)
      return NextResponse.json({ error: eventsError.message }, { status: 500 })
    }

    return NextResponse.json({
      settings,
      sections: sections || [],
      featuredEvents: featuredEvents || [],
    })
  } catch (error) {
    console.error("Error in GET /api/homepage:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/homepage
 * Update homepage settings
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Get existing settings ID
    const { data: existing } = await supabase
      .from("homepage_settings")
      .select("id")
      .single()

    if (!existing) {
      // Create settings if they don't exist
      const { data, error } = await supabase
        .from("homepage_settings")
        .insert(body)
        .select()
        .single()

      if (error) {
        console.error("Error creating homepage settings:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    // Update existing settings
    const { data, error } = await supabase
      .from("homepage_settings")
      .update(body)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating homepage settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/homepage:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
