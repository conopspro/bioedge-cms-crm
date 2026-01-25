import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/events
 * List all events
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching events:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Default landing page settings for new events
const defaultLandingPageSettings = {
  hero: {
    visible: true,
    title: "",
    subtitle: "",
    order: 0,
    layout: "full_background",
    split_image_url: null,
    split_image_position: "right",
    cta_text: "Register Now",
    show_countdown: true,
    show_early_bird: true,
    overlay_opacity: 70,
  },
  value_props: {
    visible: true,
    title: "What You'll Get",
    subtitle: "Why Attend",
    order: 1,
    layout: "grid",
    columns: 3,
    show_icons: true,
    icon_style: "check",
    use_custom_props: false,
    custom_value_props: null,
  },
  testimonials: {
    visible: true,
    title: "Don't Take Our Word For It",
    subtitle: "What Attendees Say",
    order: 2,
    layout: "grid",
    columns: 3,
    max_testimonials: 6,
    show_photos: true,
    show_company: true,
    show_title: true,
    show_video_link: true,
    show_quote_icon: true,
    card_style: "default",
  },
  leaders: { visible: true, title: "Featured Leaders", subtitle: "Who You'll Learn From", order: 3 },
  photo_slider_1: { visible: false, title: "Photo Gallery", subtitle: "Event Highlights", order: 4, slider_id: null, background: "#ffffff" },
  tickets: { visible: true, title: "Choose Your Experience", subtitle: "Reserve Your Spot", order: 5 },
  venue: { visible: true, title: "", subtitle: "The Venue", order: 6 },
  companies: { visible: true, title: "Companies & Sponsors", subtitle: "Our Partners", order: 7 },
  video_playlist: { visible: false, title: "Videos", subtitle: "Watch & Learn", order: 8, videos: [], background: "#f8f9fa" },
  photo_slider_2: { visible: false, title: "More Photos", subtitle: "Gallery", order: 9, slider_id: null, background: "#ffffff" },
  faq: {
    visible: true,
    title: "Frequently Asked Questions",
    subtitle: "Questions?",
    order: 10,
    layout: "accordion",
    show_contact_section: true,
    contact_text: "Still have questions?",
    contact_email: null,
    contact_button_text: "Contact Us",
    show_categories: false,
    expand_first: false,
  },
  custom_html: { visible: false, title: "Custom Section", subtitle: "", order: 11, html_content: "", background: "#ffffff" },
  final_cta: { visible: true, title: "Ready to Join Us?", subtitle: "", description: "", button_text: "Get Your Tickets Now", order: 12 },
  section_order: ["hero", "value_props", "testimonials", "leaders", "photo_slider_1", "tickets", "venue", "companies", "video_playlist", "photo_slider_2", "faq", "custom_html", "final_cta"],
}

/**
 * POST /api/events
 * Create a new event
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      )
    }

    if (!body.slug?.trim()) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }

    // Check if slug is unique - use maybeSingle() since no match is expected/valid
    const { data: existing, error: slugCheckError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", body.slug)
      .maybeSingle()

    if (slugCheckError) {
      console.error("Error checking slug:", slugCheckError)
      return NextResponse.json(
        { error: "Failed to validate event slug" },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { error: "An event with this slug already exists" },
        { status: 400 }
      )
    }

    // Create the event with default landing page settings
    const { data, error } = await supabase
      .from("events")
      .insert({
        name: body.name.trim(),
        slug: body.slug.trim(),
        tagline: body.tagline || null,
        description: body.description || null,
        extended_info: body.extended_info || null,
        venue_name: body.venue_name || null,
        venue_address: body.venue_address || null,
        city: body.city || null,
        state: body.state || null,
        country: body.country || null,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        timezone: body.timezone || null,
        status: body.status || "draft",
        registration_url: body.registration_url || null,
        featured_image_url: body.featured_image_url || null,
        og_image_url: body.og_image_url || null,
        landing_page_settings: defaultLandingPageSettings,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating event:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
