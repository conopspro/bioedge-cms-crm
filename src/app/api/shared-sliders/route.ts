import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/shared-sliders
 * List all shared photo sliders with their images
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: sliders, error } = await supabase
      .from("shared_photo_sliders")
      .select(`
        *,
        images:shared_slider_images(*)
      `)
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching shared sliders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Sort images by display_order
    const slidersWithSortedImages = sliders.map((slider) => ({
      ...slider,
      images: (slider.images || []).sort(
        (a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order
      ),
    }))

    return NextResponse.json(slidersWithSortedImages)
  } catch (error) {
    console.error("Error in GET /api/shared-sliders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/shared-sliders
 * Create a new shared photo slider
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, description, slug } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const { data: slider, error } = await supabase
      .from("shared_photo_sliders")
      .insert({
        name,
        slug: finalSlug,
        description: description || null,
        auto_play: body.auto_play ?? true,
        auto_play_interval: body.auto_play_interval ?? 5000,
        show_navigation: body.show_navigation ?? true,
        show_dots: body.show_dots ?? true,
        show_captions: body.show_captions ?? true,
        section_title: body.section_title || null,
        section_subtitle: body.section_subtitle || null,
        section_background: body.section_background || "white",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating shared slider:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...slider, images: [] })
  } catch (error) {
    console.error("Error in POST /api/shared-sliders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
