import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/events/[id]/duplicate
 *
 * Duplicate an event with all its settings but NOT content items.
 *
 * What gets copied:
 * - Event details (name, tagline, description, venue info)
 * - Landing page settings (section visibility, titles, hero layout)
 * - Section colors
 * - Ticket tiers and their features
 * - FAQ links (references to FAQ templates)
 * - Value propositions
 * - Sliders and their images
 * - Section photos
 *
 * What does NOT get copied (starts fresh):
 * - Leaders (event_contacts)
 * - Companies (event_companies)
 * - Presentations (event_presentations)
 * - Sessions
 * - Rooms
 * - Tracks
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate new slug is provided
    if (!body.newSlug?.trim()) {
      return NextResponse.json(
        { error: "New slug is required" },
        { status: 400 }
      )
    }

    // Validate new name is provided
    if (!body.newName?.trim()) {
      return NextResponse.json(
        { error: "New name is required" },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const { data: existing } = await supabase
      .from("events")
      .select("id")
      .eq("slug", body.newSlug.trim())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "An event with this slug already exists" },
        { status: 400 }
      )
    }

    // Fetch the source event
    const { data: sourceEvent, error: fetchError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !sourceEvent) {
      return NextResponse.json(
        { error: "Source event not found" },
        { status: 404 }
      )
    }

    // Create the new event with copied settings
    const { data: newEvent, error: createError } = await supabase
      .from("events")
      .insert({
        name: body.newName.trim(),
        slug: body.newSlug.trim(),
        tagline: sourceEvent.tagline,
        description: sourceEvent.description,
        extended_info: sourceEvent.extended_info,
        venue_name: null, // Clear venue - likely different
        venue_address: null,
        city: null,
        state: null,
        country: null,
        start_date: null, // Clear dates - need new ones
        end_date: null,
        timezone: sourceEvent.timezone,
        status: "draft", // Always start as draft
        registration_url: null, // Clear registration URL
        featured_image_url: sourceEvent.featured_image_url,
        og_image_url: sourceEvent.og_image_url,
        logo_url: sourceEvent.logo_url,
        landing_page_settings: sourceEvent.landing_page_settings,
        section_colors: sourceEvent.section_colors,
      })
      .select()
      .single()

    if (createError || !newEvent) {
      console.error("Error creating duplicate event:", createError)
      return NextResponse.json(
        { error: createError?.message || "Failed to create duplicate event" },
        { status: 500 }
      )
    }

    // Copy ticket tiers and their features
    const { data: sourceTiers } = await supabase
      .from("ticket_tiers")
      .select("*, ticket_tier_features(*)")
      .eq("event_id", id)
      .order("display_order")

    if (sourceTiers && sourceTiers.length > 0) {
      for (const tier of sourceTiers) {
        const { data: newTier } = await supabase
          .from("ticket_tiers")
          .insert({
            event_id: newEvent.id,
            name: tier.name,
            description: tier.description,
            price: tier.price,
            currency: tier.currency,
            is_featured: tier.is_featured,
            display_order: tier.display_order,
            purchase_url: null, // Clear purchase URL
          })
          .select()
          .single()

        // Copy tier features
        if (newTier && tier.ticket_tier_features?.length > 0) {
          const features = tier.ticket_tier_features.map((f: any) => ({
            tier_id: newTier.id,
            feature_text: f.feature_text,
            is_included: f.is_included,
            display_order: f.display_order,
          }))

          await supabase.from("ticket_tier_features").insert(features)
        }
      }
    }

    // Copy FAQ links (references to FAQ templates, not the FAQs themselves)
    const { data: sourceFaqLinks } = await supabase
      .from("event_faq_links")
      .select("*")
      .eq("event_id", id)
      .order("display_order")

    if (sourceFaqLinks && sourceFaqLinks.length > 0) {
      const faqLinks = sourceFaqLinks.map((link) => ({
        event_id: newEvent.id,
        faq_id: link.faq_id,
        display_order: link.display_order,
      }))

      await supabase.from("event_faq_links").insert(faqLinks)
    }

    // Copy value propositions
    const { data: sourceProps } = await supabase
      .from("event_value_propositions")
      .select("*")
      .eq("event_id", id)
      .order("display_order")

    if (sourceProps && sourceProps.length > 0) {
      const props = sourceProps.map((prop) => ({
        event_id: newEvent.id,
        title: prop.title,
        description: prop.description,
        icon: prop.icon,
        display_order: prop.display_order,
      }))

      await supabase.from("event_value_propositions").insert(props)
    }

    // Copy sliders and their images
    const { data: sourceSliders } = await supabase
      .from("event_sliders")
      .select("*, event_slider_images(*)")
      .eq("event_id", id)
      .order("display_order")

    if (sourceSliders && sourceSliders.length > 0) {
      for (const slider of sourceSliders) {
        const { data: newSlider } = await supabase
          .from("event_sliders")
          .insert({
            event_id: newEvent.id,
            name: slider.name,
            section_key: slider.section_key,
            display_order: slider.display_order,
          })
          .select()
          .single()

        // Copy slider images
        if (newSlider && slider.event_slider_images?.length > 0) {
          const images = slider.event_slider_images.map((img: any) => ({
            slider_id: newSlider.id,
            image_url: img.image_url,
            caption: img.caption,
            alt_text: img.alt_text,
            display_order: img.display_order,
          }))

          await supabase.from("event_slider_images").insert(images)
        }
      }
    }

    // Copy section photos
    const { data: sourcePhotos } = await supabase
      .from("event_section_photos")
      .select("*")
      .eq("event_id", id)
      .order("display_order")

    if (sourcePhotos && sourcePhotos.length > 0) {
      const photos = sourcePhotos.map((photo) => ({
        event_id: newEvent.id,
        section_key: photo.section_key,
        image_url: photo.image_url,
        caption: photo.caption,
        alt_text: photo.alt_text,
        display_order: photo.display_order,
      }))

      await supabase.from("event_section_photos").insert(photos)
    }

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: `Event "${newEvent.name}" created successfully`,
    })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/duplicate:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
