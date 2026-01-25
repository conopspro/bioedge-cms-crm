import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; tierId: string }>
}

/**
 * GET /api/events/[id]/ticket-tiers/[tierId]/features
 * Fetch all features for a ticket tier
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { tierId } = await params
    const supabase = await createClient()

    const { data: features, error } = await supabase
      .from("event_ticket_features")
      .select("*")
      .eq("tier_id", tierId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching ticket features:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(features)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/ticket-tiers/[tierId]/features:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/events/[id]/ticket-tiers/[tierId]/features
 * Create a new feature for a ticket tier
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { tierId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { feature_text, dollar_value, is_highlighted = false, tooltip } = body

    if (!feature_text) {
      return NextResponse.json(
        { error: "feature_text is required" },
        { status: 400 }
      )
    }

    // Get max display order
    const { data: existing } = await supabase
      .from("event_ticket_features")
      .select("display_order")
      .eq("tier_id", tierId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

    const { data: feature, error } = await supabase
      .from("event_ticket_features")
      .insert({
        tier_id: tierId,
        feature_text,
        dollar_value,
        is_highlighted,
        tooltip,
        display_order: displayOrder,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating ticket feature:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/ticket-tiers/[tierId]/features:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
