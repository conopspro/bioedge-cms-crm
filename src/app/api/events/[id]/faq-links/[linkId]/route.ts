import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; linkId: string }>
}

/**
 * PATCH /api/events/[id]/faq-links/[linkId]
 * Update a FAQ template link (overrides, visibility, order)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { linkId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "question_override",
      "answer_override",
      "display_order",
      "is_visible",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: link, error } = await supabase
      .from("event_faq_links")
      .update(updateData)
      .eq("id", linkId)
      .select(`
        *,
        template:faq_templates(*)
      `)
      .single()

    if (error) {
      console.error("Error updating FAQ link:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/faq-links/[linkId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[id]/faq-links/[linkId]
 * Unlink a FAQ template from an event
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { linkId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_faq_links")
      .delete()
      .eq("id", linkId)

    if (error) {
      console.error("Error deleting FAQ link:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/faq-links/[linkId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
