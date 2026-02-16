import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { CampaignInsert } from "@/types/database"

/**
 * GET /api/campaigns
 *
 * Fetch all campaigns with optional filtering.
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

    // Build query: campaigns with sender profile and recipient counts
    let query = supabase
      .from("campaigns")
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email),
        campaign_recipients (id, status)
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
      console.error("Error fetching campaigns:", error)
      return NextResponse.json(
        { error: "Failed to fetch campaigns" },
        { status: 500 }
      )
    }

    // Transform to include recipient counts
    const campaigns = (data || []).map((campaign) => {
      const recipients = campaign.campaign_recipients || []
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
      const { campaign_recipients, ...rest } = campaign

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
 * POST /api/campaigns
 *
 * Create a new campaign.
 *
 * Body: CampaignInsert fields
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Extract event_ids before building campaign insert data
    const eventIds: string[] = body.event_ids || []

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
      send_window_start: body.send_window_start ?? 9,
      send_window_end: body.send_window_end ?? 17,
      min_delay_seconds: body.min_delay_seconds ?? 120,
      max_delay_seconds: body.max_delay_seconds ?? 300,
      daily_send_limit: body.daily_send_limit ?? 50,
      one_per_company: body.one_per_company ?? true,
      track_opens: body.track_opens ?? false,
      track_clicks: body.track_clicks ?? false,
      company_cooldown_days: body.company_cooldown_days ?? 30,
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert(insertData)
      .select(`
        *,
        sender_profile:sender_profiles (id, name, email)
      `)
      .single()

    if (error) {
      console.error("Error creating campaign:", error)
      return NextResponse.json(
        { error: `Failed to create campaign: ${error.message}` },
        { status: 500 }
      )
    }

    // Link events to campaign via junction table
    if (eventIds.length > 0) {
      const campaignEventRows = eventIds.map((eventId: string) => ({
        campaign_id: data.id,
        event_id: eventId,
      }))

      const { error: eventError } = await supabase
        .from("campaign_events")
        .insert(campaignEventRows)

      if (eventError) {
        console.error("Error linking events to campaign:", eventError)
        // Non-fatal: campaign was created, events just didn't link
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
