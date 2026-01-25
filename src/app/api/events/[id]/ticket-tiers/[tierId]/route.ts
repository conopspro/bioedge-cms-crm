import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; tierId: string }>
}

/**
 * GET /api/events/[id]/ticket-tiers/[tierId]
 * Fetch a specific ticket tier with features
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { tierId } = await params
    const supabase = await createClient()

    const { data: tier, error } = await supabase
      .from("event_ticket_tiers")
      .select(`
        *,
        features:event_ticket_features(*)
      `)
      .eq("id", tierId)
      .single()

    if (error) {
      console.error("Error fetching ticket tier:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!tier) {
      return NextResponse.json({ error: "Ticket tier not found" }, { status: 404 })
    }

    return NextResponse.json(tier)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/ticket-tiers/[tierId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/events/[id]/ticket-tiers/[tierId]
 * Update a ticket tier
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { tierId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "name",
      "description",
      "price",
      "original_price",
      "currency",
      "max_quantity",
      "sold_count",
      "is_sold_out",
      "waitlist_url",
      "registration_url",
      "display_order",
      "is_highlighted",
      "is_visible",
      "highlight_text",
      "available_from",
      "available_until",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: tier, error } = await supabase
      .from("event_ticket_tiers")
      .update(updateData)
      .eq("id", tierId)
      .select()
      .single()

    if (error) {
      console.error("Error updating ticket tier:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(tier)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/ticket-tiers/[tierId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[id]/ticket-tiers/[tierId]
 * Delete a ticket tier (cascade deletes features)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { tierId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_ticket_tiers")
      .delete()
      .eq("id", tierId)

    if (error) {
      console.error("Error deleting ticket tier:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/ticket-tiers/[tierId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
