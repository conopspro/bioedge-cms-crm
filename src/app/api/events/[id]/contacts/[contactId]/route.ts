import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string; contactId: string }>
}

/**
 * DELETE /api/events/[id]/contacts/[contactId]
 * Remove a leader (contact) from the event
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, contactId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("event_contacts")
      .delete()
      .eq("id", contactId)
      .eq("event_id", id)

    if (error) {
      console.error("Error deleting event contact:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]/contacts/[contactId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]/contacts/[contactId]
 * Update a leader (contact) on the event
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id, contactId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("event_contacts")
      .update({
        ...(body.role !== undefined && { role: body.role }),
        ...(body.display_order !== undefined && { display_order: body.display_order }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.title_override !== undefined && { title_override: body.title_override || null }),
        ...(body.bio_override !== undefined && { bio_override: body.bio_override || null }),
        ...(body.headshot_url !== undefined && { headshot_url: body.headshot_url || null }),
        ...(body.is_featured !== undefined && { is_featured: body.is_featured }),
        ...(body.speaker_fee !== undefined && { speaker_fee: body.speaker_fee }),
        ...(body.payment_status !== undefined && { payment_status: body.payment_status }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      })
      .eq("id", contactId)
      .eq("event_id", id)
      .select("*")
      .single()

    if (error) {
      console.error("Error updating event contact:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]/contacts/[contactId]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
