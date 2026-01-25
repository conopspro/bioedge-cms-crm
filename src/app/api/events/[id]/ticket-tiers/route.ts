import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/ticket-tiers
 * Fetch all ticket tiers for an event with their features
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()

    const { data: tiers, error } = await supabase
      .from("event_ticket_tiers")
      .select(`
        *,
        features:event_ticket_features(*)
      `)
      .eq("event_id", eventId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching ticket tiers:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Sort features by display_order
    const tiersWithSortedFeatures = tiers?.map(tier => ({
      ...tier,
      features: (tier.features || []).sort((a: any, b: any) => a.display_order - b.display_order)
    }))

    return NextResponse.json(tiersWithSortedFeatures)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/ticket-tiers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/events/[id]/ticket-tiers
 * Create a new ticket tier
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const {
      name,
      description,
      price,
      original_price,
      currency = "USD",
      max_quantity,
      registration_url,
      is_highlighted = false,
      highlight_text,
      available_from,
      available_until,
    } = body

    if (!name || price === undefined || !registration_url) {
      return NextResponse.json(
        { error: "Name, price, and registration_url are required" },
        { status: 400 }
      )
    }

    // Get max display order
    const { data: existing } = await supabase
      .from("event_ticket_tiers")
      .select("display_order")
      .eq("event_id", eventId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

    const { data: tier, error } = await supabase
      .from("event_ticket_tiers")
      .insert({
        event_id: eventId,
        name,
        description,
        price,
        original_price,
        currency,
        max_quantity,
        registration_url,
        display_order: displayOrder,
        is_highlighted,
        highlight_text,
        available_from,
        available_until,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating ticket tier:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...tier, features: [] }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/ticket-tiers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
