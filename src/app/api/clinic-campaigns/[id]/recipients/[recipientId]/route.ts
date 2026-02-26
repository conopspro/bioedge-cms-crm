import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string; recipientId: string }>
}

/**
 * GET /api/clinic-campaigns/[id]/recipients/[recipientId]
 *
 * Fetch a single clinic campaign recipient with full clinic details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()

    const { data: recipient, error } = await supabase
      .from("clinic_campaign_recipients")
      .select("*")
      .eq("id", recipientId)
      .eq("clinic_campaign_id", campaignId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Recipient not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching recipient:", error)
      return NextResponse.json(
        { error: "Failed to fetch recipient" },
        { status: 500 }
      )
    }

    // Fetch clinic details
    const { data: clinic } = await supabase
      .from("clinics")
      .select("id, name, city, state, tags, email, description, website, google_rating, reviews_count")
      .eq("id", recipient.clinic_id)
      .single()

    return NextResponse.json({
      ...recipient,
      clinic,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/clinic-campaigns/[id]/recipients/[recipientId]
 *
 * Update a recipient (e.g., approve, edit subject/body).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "subject",
      "body",
      "body_html",
      "status",
      "approved",
      "recipient_email",
      "error",  // allow clearing the error field when retrying
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    const { data, error } = await supabase
      .from("clinic_campaign_recipients")
      .update(updateData)
      .eq("id", recipientId)
      .eq("clinic_campaign_id", campaignId)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Recipient not found" },
          { status: 404 }
        )
      }
      console.error("Error updating recipient:", error)
      return NextResponse.json(
        { error: `Failed to update recipient: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clinic-campaigns/[id]/recipients/[recipientId]
 *
 * Remove a recipient from a clinic campaign.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("clinic_campaign_recipients")
      .delete()
      .eq("id", recipientId)
      .eq("clinic_campaign_id", campaignId)

    if (error) {
      console.error("Error removing recipient:", error)
      return NextResponse.json(
        { error: "Failed to remove recipient" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
