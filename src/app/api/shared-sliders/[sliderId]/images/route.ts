import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ sliderId: string }>
}

/**
 * GET /api/shared-sliders/[sliderId]/images
 * Get all images for a shared slider
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()

    const { data: images, error } = await supabase
      .from("shared_slider_images")
      .select("*")
      .eq("slider_id", sliderId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching shared slider images:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error in GET /api/shared-sliders/[sliderId]/images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/shared-sliders/[sliderId]/images
 * Add an image to a shared slider
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { sliderId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { image_url, thumbnail_url, alt_text, caption, link_url } = body

    if (!image_url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Get max display order
    const { data: existingImages } = await supabase
      .from("shared_slider_images")
      .select("display_order")
      .eq("slider_id", sliderId)
      .order("display_order", { ascending: false })
      .limit(1)

    const maxOrder = existingImages?.[0]?.display_order ?? -1

    const { data: image, error } = await supabase
      .from("shared_slider_images")
      .insert({
        slider_id: sliderId,
        image_url,
        thumbnail_url: thumbnail_url || null,
        alt_text: alt_text || null,
        caption: caption || null,
        link_url: link_url || null,
        display_order: maxOrder + 1,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding shared slider image:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error in POST /api/shared-sliders/[sliderId]/images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
