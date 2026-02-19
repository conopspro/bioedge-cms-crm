import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/clinic-campaigns/[id]
 *
 * Fetch a single clinic campaign by ID with sender profile and recipient details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Optional server-side filter: ?recipientStatus=generated
    const { searchParams } = new URL(request.url)
    const recipientStatus = searchParams.get("recipientStatus")

    const recipientQuery = recipientStatus
      ? `id, clinic_id, recipient_email, recipient_name, subject, body, body_html, status, approved, generated_at, sent_at, delivered_at, opened_at, clicked_at, resend_id, error, created_at`
      : `id, clinic_id, recipient_email, recipient_name, subject, body, body_html, status, approved, generated_at, sent_at, delivered_at, opened_at, clicked_at, resend_id, error, created_at`

    let campaignQuery = supabase
      .from("clinic_campaigns")
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email, title, phone, signature),
        clinic_campaign_recipients!inner (${recipientQuery})
      `)
      .eq("id", id)

    if (recipientStatus) {
      campaignQuery = campaignQuery.eq(
        "clinic_campaign_recipients.status",
        recipientStatus
      )
    }

    const { data: campaign, error } = await campaignQuery.single()

    if (error) {
      // PGRST116 = no rows found. When filtering with !inner and no matching
      // recipients exist, Supabase also returns no rows — fall back to a
      // recipient-less fetch so the campaign shell still loads.
      if (error.code === "PGRST116" && recipientStatus) {
        const { data: campaignShell, error: shellError } = await supabase
          .from("clinic_campaigns")
          .select(`*, sender_profile:sender_profiles (id, name, email, title, phone, signature)`)
          .eq("id", id)
          .single()

        if (shellError) {
          return NextResponse.json(
            { error: "Clinic campaign not found" },
            { status: 404 }
          )
        }
        campaignShell.clinic_campaign_recipients = []
        campaignShell.clinic_campaign_events = []
        return NextResponse.json(campaignShell)
      }

      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Clinic campaign not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching clinic campaign:", error)
      return NextResponse.json(
        { error: "Failed to fetch clinic campaign" },
        { status: 500 }
      )
    }

    // Fetch campaign events separately (skip when filtering recipients — not needed for review queue)
    if (!recipientStatus) {
      const { data: campaignEvents, error: eventsError } = await supabase
        .from("clinic_campaign_events")
        .select(`
          id,
          event_id,
          events:events (id, name, start_date, end_date, city, state, slug, registration_url)
        `)
        .eq("clinic_campaign_id", id)

      if (eventsError) {
        console.warn("clinic_campaign_events query failed:", eventsError.message)
        campaign.clinic_campaign_events = []
      } else {
        campaign.clinic_campaign_events = campaignEvents || []
      }
    }

    // Enrich with clinic data (only for the recipients actually returned)
    if (campaign.clinic_campaign_recipients?.length > 0) {
      const clinicIds = campaign.clinic_campaign_recipients.map(
        (r: { clinic_id: string }) => r.clinic_id
      )

      const { data: clinics } = await supabase
        .from("clinics")
        .select("id, name, city, state, tags, google_rating, reviews_count")
        .in("id", clinicIds)

      const clinicMap = new Map(
        (clinics || []).map((c) => [c.id, c])
      )

      campaign.clinic_campaign_recipients = campaign.clinic_campaign_recipients.map(
        (r: { clinic_id: string }) => ({
          ...r,
          clinic: clinicMap.get(r.clinic_id) || null,
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
 * PATCH /api/clinic-campaigns/[id]
 *
 * Update a clinic campaign by ID.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

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
      "target_states",
      "target_cities",
      "target_tags",
      "send_window_start",
      "send_window_end",
      "min_delay_seconds",
      "max_delay_seconds",
      "daily_send_limit",
      "track_opens",
      "track_clicks",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("clinic_campaigns")
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
          { error: "Clinic campaign not found" },
          { status: 404 }
        )
      }
      console.error("Error updating clinic campaign:", error)
      return NextResponse.json(
        { error: `Failed to update clinic campaign: ${error.message}` },
        { status: 500 }
      )
    }

    // Handle event_ids separately (junction table)
    if ("event_ids" in body) {
      const eventIds: string[] = body.event_ids || []

      await supabase
        .from("clinic_campaign_events")
        .delete()
        .eq("clinic_campaign_id", id)

      if (eventIds.length > 0) {
        await supabase
          .from("clinic_campaign_events")
          .insert(
            eventIds.map((eventId: string) => ({
              clinic_campaign_id: id,
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
 * DELETE /api/clinic-campaigns/[id]
 *
 * Delete a clinic campaign by ID.
 * Cascades to delete all recipients and event links.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("clinic_campaigns")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting clinic campaign:", error)
      return NextResponse.json(
        { error: "Failed to delete clinic campaign" },
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
