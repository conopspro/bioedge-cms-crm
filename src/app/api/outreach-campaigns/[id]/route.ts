import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/outreach-campaigns/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: campaign, error } = await supabase
      .from("outreach_campaigns")
      .select(`
        *,
        sender_profiles (
          name,
          email,
          title,
          signature
        ),
        promotion_presets (
          name,
          type,
          icon,
          title,
          url
        )
      `)
      .eq("id", id)
      .single()

    if (error || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Status counts
    const { data: counts } = await supabase
      .from("outreach_campaign_recipients")
      .select("status")
      .eq("outreach_campaign_id", id)

    const statusMap: Record<string, number> = {}
    for (const row of counts ?? []) {
      statusMap[row.status] = (statusMap[row.status] ?? 0) + 1
    }

    const total = Object.values(statusMap).reduce((a, b) => a + b, 0)
    const sent = (statusMap.sent ?? 0) + (statusMap.delivered ?? 0) +
      (statusMap.opened ?? 0) + (statusMap.clicked ?? 0)

    return NextResponse.json({
      campaign: {
        ...campaign,
        recipient_count: total,
        pending_count: statusMap.pending ?? 0,
        generated_count: statusMap.generated ?? 0,
        approved_count: statusMap.approved ?? 0,
        sent_count: sent,
        bounced_count: statusMap.bounced ?? 0,
        failed_count: statusMap.failed ?? 0,
      },
    })
  } catch (err) {
    console.error("Error fetching outreach campaign:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/outreach-campaigns/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "name", "status", "sender_profile_id", "reply_to",
      "promotion_preset_id", "promotion_type", "promotion_title",
      "promotion_url", "promotion_description",
      "target_business_types", "target_states", "target_engagement",
      "exclude_emailed_within_days",
      "purpose", "tone", "context", "must_include", "must_avoid",
      "call_to_action", "reference_email", "max_words", "subject_prompt",
      "send_window_start", "send_window_end",
      "min_delay_seconds", "max_delay_seconds", "daily_send_limit",
      "track_opens", "track_clicks",
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("outreach_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ campaign: data })
  } catch (err) {
    console.error("Error updating outreach campaign:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/outreach-campaigns/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Recipients are deleted by CASCADE on the FK
    const { error } = await supabase
      .from("outreach_campaigns")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error deleting outreach campaign:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
