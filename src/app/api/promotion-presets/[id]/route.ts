import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/promotion-presets/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("promotion_presets")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }

    return NextResponse.json({ preset: data })
  } catch (err) {
    console.error("Error fetching promotion preset:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/promotion-presets/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Only allow updating known fields
    const allowedFields = [
      "name", "type", "icon", "title", "url", "description",
      "youtube_video_id", "youtube_thumbnail_url",
      "default_purpose", "default_cta", "is_active", "sort_order",
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("promotion_presets")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating promotion preset:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ preset: data })
  } catch (err) {
    console.error("Unexpected error updating promotion preset:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/promotion-presets/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check if preset is used by any campaigns before deleting
    const { count } = await supabase
      .from("outreach_campaigns")
      .select("id", { count: "exact", head: true })
      .eq("promotion_preset_id", id)

    if (count && count > 0) {
      // Soft delete — deactivate instead of hard delete
      const { data, error } = await supabase
        .from("promotion_presets")
        .update({ is_active: false })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        preset: data,
        message: `Preset deactivated (used by ${count} campaign${count !== 1 ? "s" : ""}). It will no longer appear in the preset selector.`,
      })
    }

    const { error } = await supabase
      .from("promotion_presets")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting promotion preset:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Unexpected error deleting promotion preset:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
