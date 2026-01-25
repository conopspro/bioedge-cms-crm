import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; companyId: string }>
}

/**
 * DELETE /api/events/[id]/companies/[companyId]
 * Remove a company from the event
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, companyId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_companies")
      .delete()
      .eq("id", companyId)
      .eq("event_id", id)

    if (error) {
      console.error("Error deleting event company:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/companies/[companyId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/companies/[companyId]
 * Update a company on the event
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, companyId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("event_companies")
      .update({
        ...(body.role !== undefined && { role: body.role }),
        ...(body.tier !== undefined && { tier: body.tier }),
        ...(body.booth_number !== undefined && { booth_number: body.booth_number || null }),
        ...(body.booth_size !== undefined && { booth_size: body.booth_size || null }),
        ...(body.booth_price !== undefined && { booth_price: body.booth_price }),
        ...(body.sponsorship_price !== undefined && { sponsorship_price: body.sponsorship_price }),
        ...(body.total_amount !== undefined && { total_amount: body.total_amount }),
        ...(body.payment_status !== undefined && { payment_status: body.payment_status }),
        ...(body.display_order !== undefined && { display_order: body.display_order }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.is_featured !== undefined && { is_featured: body.is_featured }),
        ...(body.contact_name !== undefined && { contact_name: body.contact_name || null }),
        ...(body.contact_email !== undefined && { contact_email: body.contact_email || null }),
        ...(body.contact_phone !== undefined && { contact_phone: body.contact_phone || null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      })
      .eq("id", companyId)
      .eq("event_id", id)
      .select(`
        *,
        company:companies!event_companies_company_id_fkey(id, name, logo_url, website, description)
      `)
      .single()

    if (error) {
      console.error("Error updating event company:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/companies/[companyId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
