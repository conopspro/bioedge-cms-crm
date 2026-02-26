import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/outreach-campaigns
// List all campaigns with recipient counts
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: campaigns, error } = await supabase
      .from("outreach_campaigns")
      .select(`
        *,
        sender_profiles (
          name,
          email,
          title
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch recipient status counts for all campaigns in one query
    const campaignIds = (campaigns ?? []).map((c) => c.id)

    let countsMap: Record<string, Record<string, number>> = {}

    if (campaignIds.length > 0) {
      const { data: counts } = await supabase
        .from("outreach_campaign_recipients")
        .select("outreach_campaign_id, status")
        .in("outreach_campaign_id", campaignIds)

      for (const row of counts ?? []) {
        if (!countsMap[row.outreach_campaign_id]) {
          countsMap[row.outreach_campaign_id] = {}
        }
        const map = countsMap[row.outreach_campaign_id]
        map[row.status] = (map[row.status] ?? 0) + 1
      }
    }

    const stuckIds: string[] = []

    const enriched = (campaigns ?? []).map((campaign) => {
      const statusMap = countsMap[campaign.id] ?? {}
      const total = Object.values(statusMap).reduce((a, b) => a + b, 0)
      const sent = (statusMap.sent ?? 0) + (statusMap.delivered ?? 0) +
        (statusMap.opened ?? 0) + (statusMap.clicked ?? 0)

      // Auto-correct campaigns stuck in "sending" when all recipients are sent
      const approvedRemaining = statusMap.approved ?? 0
      let resolvedStatus = campaign.status
      if (
        campaign.status === "sending" &&
        total > 0 &&
        approvedRemaining === 0 &&
        sent === total
      ) {
        resolvedStatus = "completed"
        stuckIds.push(campaign.id)
      }

      return {
        ...campaign,
        status: resolvedStatus,
        recipient_count: total,
        pending_count: statusMap.pending ?? 0,
        generated_count: statusMap.generated ?? 0,
        approved_count: approvedRemaining,
        sent_count: sent,
      }
    })

    // Persist auto-corrections to DB in the background
    if (stuckIds.length > 0) {
      supabase
        .from("outreach_campaigns")
        .update({ status: "completed" })
        .in("id", stuckIds)
        .then(() => {})
    }

    return NextResponse.json({ campaigns: enriched })
  } catch (err) {
    console.error("Error fetching outreach campaigns:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/outreach-campaigns
// Create a new campaign and snapshot matching contacts as recipients
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      name,
      sender_profile_id,
      reply_to,
      promotion_preset_id,
      promotion_type,
      promotion_title,
      promotion_url,
      promotion_description,
      target_business_types = [],
      target_states = [],
      target_engagement = "any",
      exclude_emailed_within_days,
      purpose,
      tone,
      context,
      must_include,
      must_avoid,
      call_to_action,
      reference_email,
      max_words = 100,
      subject_prompt,
      send_window_start = 9,
      send_window_end = 17,
      min_delay_seconds = 120,
      max_delay_seconds = 300,
      daily_send_limit = 50,
      track_opens = true,
      track_clicks = true,
      contact_limit,   // optional cap: only take the first N matching contacts
      signature_override,
    } = body

    if (!name) {
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 })
    }

    // ── 1. Create the campaign ───────────────────────────────────────────────
    const { data: campaign, error: campaignError } = await supabase
      .from("outreach_campaigns")
      .insert({
        name,
        status: "draft",
        sender_profile_id: sender_profile_id || null,
        reply_to: reply_to || null,
        promotion_preset_id: promotion_preset_id || null,
        promotion_type: promotion_type || null,
        promotion_title: promotion_title || null,
        promotion_url: promotion_url || null,
        promotion_description: promotion_description || null,
        target_business_types,
        target_states,
        target_engagement,
        exclude_emailed_within_days: exclude_emailed_within_days ?? null,
        purpose: purpose || null,
        tone: tone || null,
        context: context || null,
        must_include: must_include || null,
        must_avoid: must_avoid || null,
        call_to_action: call_to_action || null,
        reference_email: reference_email || null,
        max_words,
        subject_prompt: subject_prompt || null,
        send_window_start,
        send_window_end,
        min_delay_seconds,
        max_delay_seconds,
        daily_send_limit,
        track_opens,
        track_clicks,
        // signature_override is only included when non-empty.
        // Requires migration: ALTER TABLE outreach_campaigns ADD COLUMN signature_override TEXT;
        ...(signature_override ? { signature_override } : {}),
      })
      .select()
      .single()

    if (campaignError || !campaign) {
      console.error("Error creating outreach campaign:", campaignError)
      return NextResponse.json(
        { error: campaignError?.message ?? "Failed to create campaign" },
        { status: 500 }
      )
    }

    // ── 2. Build contact query matching the filter criteria ──────────────────

    // Resolve recently-emailed contact IDs first so we can exclude them.
    // Snap to start of the UTC calendar day to avoid rolling-window edge cases
    // (e.g. a 9 AM send on the boundary day being missed when running at 3 PM).
    let recentlyEmailedContactIds: string[] = []
    if (exclude_emailed_within_days && exclude_emailed_within_days > 0) {
      const cutoff = new Date()
      cutoff.setUTCDate(cutoff.getUTCDate() - exclude_emailed_within_days)
      cutoff.setUTCHours(0, 0, 0, 0)

      const { data: recentRecipients } = await supabase
        .from("outreach_campaign_recipients")
        .select("outreach_contact_id")
        .not("sent_at", "is", null)
        .gte("sent_at", cutoff.toISOString())

      recentlyEmailedContactIds = (recentRecipients ?? [])
        .map((r) => r.outreach_contact_id)
        .filter(Boolean)
    }

    let contactQuery = supabase
      .from("outreach_contacts")
      .select(
        "id, email, business_type, practice_name, city, state, total_opens, total_clicks"
      )

    if (target_business_types && target_business_types.length > 0) {
      contactQuery = contactQuery.in("business_type", target_business_types)
    }

    if (target_states && target_states.length > 0) {
      contactQuery = contactQuery.in("state", target_states)
    }

    if (target_engagement === "clicked") {
      contactQuery = contactQuery.gt("total_clicks", 0)
    } else if (target_engagement === "opened") {
      contactQuery = contactQuery.gt("total_opens", 0)
    }

    if (recentlyEmailedContactIds.length > 0) {
      contactQuery = contactQuery.not(
        "id",
        "in",
        `(${recentlyEmailedContactIds.join(",")})`
      )
    }

    if (contact_limit && contact_limit > 0) {
      contactQuery = contactQuery.limit(contact_limit)
    }

    const { data: contacts, error: contactsError } = await contactQuery
      .order("created_at", { ascending: true })

    if (contactsError) {
      // Campaign was created but we failed to add recipients — clean up
      await supabase.from("outreach_campaigns").delete().eq("id", campaign.id)
      return NextResponse.json({ error: contactsError.message }, { status: 500 })
    }

    if (!contacts || contacts.length === 0) {
      // No contacts match — campaign created in draft with 0 recipients
      return NextResponse.json({
        campaign: { ...campaign, recipient_count: 0 },
        recipient_count: 0,
        message: "Campaign created. No contacts matched the filter criteria.",
      }, { status: 201 })
    }

    // ── 3. Snapshot contacts as recipients (batched for large lists) ─────────
    const BATCH_SIZE = 500
    let totalInserted = 0

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE).map((contact) => ({
        outreach_campaign_id: campaign.id,
        outreach_contact_id: contact.id,
        recipient_email: contact.email,
        recipient_business_type: contact.business_type ?? null,
        recipient_practice_name: contact.practice_name ?? null,
        recipient_city: contact.city ?? null,
        recipient_state: contact.state ?? null,
        recipient_total_opens: contact.total_opens ?? 0,
        recipient_total_clicks: contact.total_clicks ?? 0,
        status: "pending",
        approved: false,
      }))

      const { error: insertError } = await supabase
        .from("outreach_campaign_recipients")
        .insert(batch)

      if (insertError) {
        console.error(`Recipient batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, insertError)
        // Continue with remaining batches even if one fails
      } else {
        totalInserted += batch.length
      }
    }

    return NextResponse.json({
      campaign: { ...campaign, recipient_count: totalInserted },
      recipient_count: totalInserted,
    }, { status: 201 })
  } catch (err) {
    console.error("Unexpected error creating outreach campaign:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
