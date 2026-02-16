import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/campaigns/[id]
 *
 * Fetch a single campaign by ID with sender profile and recipient details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email, title, phone, signature),
        campaign_recipients (
          id,
          contact_id,
          company_id,
          subject,
          body,
          body_html,
          status,
          approved,
          generated_at,
          sent_at,
          delivered_at,
          opened_at,
          clicked_at,
          resend_id,
          error,
          suppression_reason,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching campaign:", error)
      return NextResponse.json(
        { error: "Failed to fetch campaign" },
        { status: 500 }
      )
    }

    // Fetch campaign events separately (table may not exist yet if migration not applied)
    const { data: campaignEvents, error: eventsError } = await supabase
      .from("campaign_events")
      .select(`
        id,
        event_id,
        events:events (id, name, start_date, end_date, city, state, slug, registration_url)
      `)
      .eq("campaign_id", id)
    if (eventsError) {
      console.warn("campaign_events query failed (migration may not be applied):", eventsError.message)
      campaign.campaign_events = []
    } else {
      campaign.campaign_events = campaignEvents || []
    }

    // If we have recipients, fetch their contact and company details
    if (campaign.campaign_recipients?.length > 0) {
      const contactIds = campaign.campaign_recipients.map(
        (r: { contact_id: string }) => r.contact_id
      )
      const companyIds = campaign.campaign_recipients
        .map((r: { company_id: string | null }) => r.company_id)
        .filter(Boolean)

      // Fetch contacts
      const { data: contacts } = await supabase
        .from("contacts")
        .select("id, first_name, last_name, email, title, seniority")
        .in("id", contactIds)

      // Fetch companies
      const { data: companies } = companyIds.length > 0
        ? await supabase
            .from("companies")
            .select("id, name")
            .in("id", companyIds)
        : { data: [] }

      // Create lookup maps
      const contactMap = new Map(
        (contacts || []).map((c) => [c.id, c])
      )
      const companyMap = new Map(
        (companies || []).map((c) => [c.id, c])
      )

      // Enrich recipients with contact/company info
      campaign.campaign_recipients = campaign.campaign_recipients.map(
        (r: { contact_id: string; company_id: string | null }) => ({
          ...r,
          contact: contactMap.get(r.contact_id) || null,
          company: companyMap.get(r.company_id || "") || null,
        })
      )
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/campaigns/[id]
 *
 * Update a campaign by ID.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Allowed fields for update
    const allowedFields = [
      "name",
      "status",
      "sender_profile_id",
      "reply_to",
      "purpose",
      "tone",
      "context",
      "must_include",
      "must_avoid",
      "call_to_action",
      "max_words",
      "reference_email",
      "subject_prompt",
      "send_window_start",
      "send_window_end",
      "min_delay_seconds",
      "max_delay_seconds",
      "daily_send_limit",
      "one_per_company",
      "track_opens",
      "track_clicks",
      "company_cooldown_days",
    ]

    // Filter to allowed fields only
    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("campaigns")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        )
      }
      console.error("Error updating campaign:", error)
      return NextResponse.json(
        { error: `Failed to update campaign: ${error.message}` },
        { status: 500 }
      )
    }

    // Handle event_ids separately (junction table, not a column)
    if ("event_ids" in body) {
      const eventIds: string[] = body.event_ids || []

      // Delete existing campaign_events for this campaign
      await supabase
        .from("campaign_events")
        .delete()
        .eq("campaign_id", id)

      // Insert new ones
      if (eventIds.length > 0) {
        await supabase
          .from("campaign_events")
          .insert(
            eventIds.map((eventId: string) => ({
              campaign_id: id,
              event_id: eventId,
            }))
          )
      }
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
 * DELETE /api/campaigns/[id]
 *
 * Delete a campaign by ID.
 * Cascades to delete all campaign_recipients.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting campaign:", error)
      return NextResponse.json(
        { error: "Failed to delete campaign" },
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
