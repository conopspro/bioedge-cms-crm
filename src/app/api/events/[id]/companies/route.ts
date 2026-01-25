import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/companies
 * Get all companies for an event
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_companies")
      .select(`
        *,
        company:companies!event_companies_company_id_fkey(id, name, logo_url, website, description)
      `)
      .eq("event_id", id)
      .order("tier", { ascending: true })
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching event companies:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/companies:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events/[id]/companies
 * Add a company to the event
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.company_id) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 }
      )
    }

    // Check if company is already added to this event
    const { data: existing } = await supabase
      .from("event_companies")
      .select("id")
      .eq("event_id", id)
      .eq("company_id", body.company_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "This company is already added to this event" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("event_companies")
      .insert({
        event_id: id,
        company_id: body.company_id,
        role: body.role || "exhibitor",
        tier: body.tier || "exhibitor",
        booth_number: body.booth_number || null,
        booth_size: body.booth_size || null,
        booth_price: body.booth_price || null,
        sponsorship_price: body.sponsorship_price || null,
        total_amount: body.total_amount || null,
        payment_status: body.payment_status || "unpaid",
        display_order: body.display_order || body.position || 0,
        status: "confirmed",
        is_featured: body.is_featured || false,
        contact_name: body.contact_name || null,
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        notes: body.notes || null,
      })
      .select(`
        *,
        company:companies!event_companies_company_id_fkey(id, name, logo_url, website, description)
      `)
      .single()

    if (error) {
      console.error("Error creating event company:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/companies:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
