import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; faqId: string }>
}

/**
 * PATCH /api/events/[id]/faqs/[faqId]
 * Update a custom FAQ
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { faqId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "question",
      "answer",
      "category",
      "display_order",
      "is_visible",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: faq, error } = await supabase
      .from("event_faqs")
      .update(updateData)
      .eq("id", faqId)
      .select()
      .single()

    if (error) {
      console.error("Error updating FAQ:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/faqs/[faqId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[id]/faqs/[faqId]
 * Delete a custom FAQ
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { faqId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_faqs")
      .delete()
      .eq("id", faqId)

    if (error) {
      console.error("Error deleting FAQ:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/faqs/[faqId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
