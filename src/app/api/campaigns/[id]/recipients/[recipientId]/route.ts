import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string; recipientId: string }>
}

/**
 * GET /api/campaigns/[id]/recipients/[recipientId]
 *
 * Fetch a single campaign recipient with full details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()

    const { data: recipient, error } = await supabase
      .from("campaign_recipients")
      .select("*")
      .eq("id", recipientId)
      .eq("campaign_id", campaignId)
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

    // Fetch contact and company details
    const { data: contact } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, title, seniority")
      .eq("id", recipient.contact_id)
      .single()

    let company = null
    if (recipient.company_id) {
      const { data } = await supabase
        .from("companies")
        .select("id, name, description, differentiators, bioedge_fit, warm_pitch, systems_supported, edge_categories, access_levels, category")
        .eq("id", recipient.company_id)
        .single()
      company = data
    }

    return NextResponse.json({
      ...recipient,
      contact,
      company,
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
 * PATCH /api/campaigns/[id]/recipients/[recipientId]
 *
 * Update a recipient (e.g., approve, edit subject/body, unsuppress).
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
      "suppression_reason",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    const { data, error } = await supabase
      .from("campaign_recipients")
      .update(updateData)
      .eq("id", recipientId)
      .eq("campaign_id", campaignId)
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
 * DELETE /api/campaigns/[id]/recipients/[recipientId]
 *
 * Remove a recipient from a campaign.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("campaign_recipients")
      .delete()
      .eq("id", recipientId)
      .eq("campaign_id", campaignId)

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
