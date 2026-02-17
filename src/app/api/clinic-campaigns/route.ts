import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/clinic-campaigns
 *
 * Fetch all clinic campaigns with optional filtering.
 *
 * Query params:
 * - status: Filter by campaign status (draft, generating, ready, sending, paused, completed)
 * - search: Search by campaign name
 * - sort: Sort field (default: created_at)
 * - order: Sort order (asc/desc, default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"

    let query = supabase
      .from("clinic_campaigns")
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email),
        clinic_campaign_recipients (id, status)
      `)

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    query = query.order(sort, { ascending: order === "asc" })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching clinic campaigns:", error)
      return NextResponse.json(
        { error: "Failed to fetch clinic campaigns" },
        { status: 500 }
      )
    }

    // Transform to include recipient counts
    const campaigns = (data || []).map((campaign) => {
      const recipients = campaign.clinic_campaign_recipients || []
      const totalRecipients = recipients.length
      const sentCount = recipients.filter(
        (r: { status: string }) =>
          ["sent", "delivered", "opened", "clicked"].includes(r.status)
      ).length
      const generatedCount = recipients.filter(
        (r: { status: string }) => r.status === "generated"
      ).length
      const approvedCount = recipients.filter(
        (r: { status: string }) => r.status === "approved"
      ).length

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { clinic_campaign_recipients, ...rest } = campaign

      return {
        ...rest,
        recipient_counts: {
          total: totalRecipients,
          sent: sentCount,
          generated: generatedCount,
          approved: approvedCount,
        },
      }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clinic-campaigns
 *
 * Create a new clinic campaign.
 *
 * Body: campaign fields + event_ids[] + clinic_ids[]
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Extract linked IDs before building campaign insert data
    const eventIds: string[] = body.event_ids || []
    const clinicIds: string[] = body.clinic_ids || []

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Campaign name is required" },
        { status: 400 }
      )
    }

    if (!body.purpose) {
      return NextResponse.json(
        { error: "Campaign purpose is required" },
        { status: 400 }
      )
    }

    // Build insert data with explicit fields
    const insertData: Record<string, unknown> = {
      name: body.name,
      purpose: body.purpose,
      status: body.status || "draft",
      sender_profile_id: body.sender_profile_id || null,
      reply_to: body.reply_to || null,
      tone: body.tone || null,
      context: body.context || null,
      reference_email: body.reference_email || null,
      must_include: body.must_include || null,
      must_avoid: body.must_avoid || null,
      call_to_action: body.call_to_action || null,
      max_words: body.max_words || 100,
      subject_prompt: body.subject_prompt || null,
      target_states: body.target_states || [],
      target_cities: body.target_cities || [],
      target_tags: body.target_tags || [],
      send_window_start: body.send_window_start ?? 9,
      send_window_end: body.send_window_end ?? 17,
      min_delay_seconds: body.min_delay_seconds ?? 120,
      max_delay_seconds: body.max_delay_seconds ?? 300,
      daily_send_limit: body.daily_send_limit ?? 50,
      track_opens: body.track_opens ?? false,
      track_clicks: body.track_clicks ?? false,
    }

    const { data, error } = await supabase
      .from("clinic_campaigns")
      .insert(insertData)
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email)
      `)
      .single()

    if (error) {
      console.error("Error creating clinic campaign:", error)
      return NextResponse.json(
        { error: `Failed to create clinic campaign: ${error.message}` },
        { status: 500 }
      )
    }

    // Link events to campaign via junction table
    if (eventIds.length > 0) {
      const eventRows = eventIds.map((eventId: string) => ({
        clinic_campaign_id: data.id,
        event_id: eventId,
      }))

      const { error: eventError } = await supabase
        .from("clinic_campaign_events")
        .insert(eventRows)

      if (eventError) {
        console.error("Error linking events to clinic campaign:", eventError)
      }
    }

    // Add clinics as recipients
    if (clinicIds.length > 0) {
      // Fetch clinic details for email and name
      const { data: clinics } = await supabase
        .from("clinics")
        .select("id, name, email")
        .in("id", clinicIds)

      if (clinics && clinics.length > 0) {
        // Also check clinic_contacts for email fallback
        const clinicIdsWithoutEmail = clinics
          .filter((c) => !c.email)
          .map((c) => c.id)

        let contactEmailMap = new Map<string, string>()
        if (clinicIdsWithoutEmail.length > 0) {
          const { data: contacts } = await supabase
            .from("clinic_contacts")
            .select("clinic_id, email")
            .in("clinic_id", clinicIdsWithoutEmail)
            .not("email", "is", null)

          if (contacts) {
            // Take the first email per clinic
            for (const c of contacts) {
              if (c.email && !contactEmailMap.has(c.clinic_id)) {
                contactEmailMap.set(c.clinic_id, c.email)
              }
            }
          }
        }

        const recipientRows = clinics.map((clinic) => ({
          clinic_campaign_id: data.id,
          clinic_id: clinic.id,
          recipient_email: clinic.email || contactEmailMap.get(clinic.id) || null,
          recipient_name: clinic.name,
          status: "pending" as const,
          approved: false,
        }))

        const { error: recipError } = await supabase
          .from("clinic_campaign_recipients")
          .insert(recipientRows)

        if (recipError) {
          console.error("Error adding clinic recipients:", recipError)
        }
      }
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
