import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; tierId: string; featureId: string }>
}

/**
 * PATCH /api/events/[id]/ticket-tiers/[tierId]/features/[featureId]
 * Update a ticket feature
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { featureId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "feature_text",
      "dollar_value",
      "display_order",
      "is_highlighted",
      "tooltip",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: feature, error } = await supabase
      .from("event_ticket_features")
      .update(updateData)
      .eq("id", featureId)
      .select()
      .single()

    if (error) {
      console.error("Error updating ticket feature:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(feature)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/ticket-tiers/[tierId]/features/[featureId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[id]/ticket-tiers/[tierId]/features/[featureId]
 * Delete a ticket feature
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { featureId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_ticket_features")
      .delete()
      .eq("id", featureId)

    if (error) {
      console.error("Error deleting ticket feature:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/ticket-tiers/[tierId]/features/[featureId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
