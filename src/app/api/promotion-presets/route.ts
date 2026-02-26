import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/promotion-presets
// Returns all active promotion presets ordered by sort_order
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("promotion_presets")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching promotion presets:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ presets: data ?? [] })
  } catch (err) {
    console.error("Unexpected error fetching promotion presets:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/promotion-presets
// Create a new promotion preset
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      name,
      type,
      icon,
      title,
      url,
      description,
      youtube_video_id,
      youtube_thumbnail_url,
      default_purpose,
      default_cta,
      is_active = true,
      sort_order = 0,
    } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: "name and type are required" },
        { status: 400 }
      )
    }

    const validTypes = ["book", "tool", "coaching", "summit", "youtube", "custom"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("promotion_presets")
      .insert({
        name,
        type,
        icon: icon || null,
        title: title || null,
        url: url || null,
        description: description || null,
        youtube_video_id: youtube_video_id || null,
        youtube_thumbnail_url: youtube_thumbnail_url || null,
        default_purpose: default_purpose || null,
        default_cta: default_cta || null,
        is_active,
        sort_order,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating promotion preset:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ preset: data }, { status: 201 })
  } catch (err) {
    console.error("Unexpected error creating promotion preset:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
