import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { outreachEmailGeneratorService } from "@/lib/services/outreach-email-generator"

/**
 * POST /api/outreach-campaigns/[id]/generate
 *
 * Generates AI emails for pending recipients in batches of 5.
 * The frontend polls this endpoint until remaining === 0.
 *
 * Pattern mirrors clinic-campaigns/[id]/generate/route.ts
 *
 * Body params (optional):
 *   batchSize  number  1–20, default 5
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    let batchSize = 5
    try {
      const body = await request.json()
      if (body.batchSize) {
        batchSize = Math.min(20, Math.max(1, parseInt(body.batchSize, 10)))
      }
    } catch {
      // body is optional
    }

    // ── Validate campaign ────────────────────────────────────────────────────
    const { data: campaign, error: campaignError } = await supabase
      .from("outreach_campaigns")
      .select(`
        *,
        sender_profiles (
          id,
          name,
          email,
          title,
          signature
        )
      `)
      .eq("id", id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (!["draft", "generating"].includes(campaign.status)) {
      return NextResponse.json(
        { error: `Cannot generate for a campaign with status '${campaign.status}'` },
        { status: 400 }
      )
    }

    if (!outreachEmailGeneratorService.isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable." },
        { status: 500 }
      )
    }

    if (!campaign.sender_profiles) {
      return NextResponse.json(
        { error: "Campaign has no sender profile. Please select a sender first." },
        { status: 400 }
      )
    }

    // ── Mark campaign as generating ──────────────────────────────────────────
    if (campaign.status === "draft") {
      await supabase
        .from("outreach_campaigns")
        .update({ status: "generating" })
        .eq("id", id)
    }

    // ── Fetch next batch of pending recipients ───────────────────────────────
    const { data: recipients, error: recipientsError } = await supabase
      .from("outreach_campaign_recipients")
      .select("*")
      .eq("outreach_campaign_id", id)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(batchSize)

    if (recipientsError) {
      return NextResponse.json({ error: recipientsError.message }, { status: 500 })
    }

    // ── Count remaining pending after this batch ─────────────────────────────
    const { count: remainingCount } = await supabase
      .from("outreach_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("outreach_campaign_id", id)
      .eq("status", "pending")

    const remainingAfterBatch = Math.max(0, (remainingCount ?? 0) - (recipients?.length ?? 0))

    if (!recipients || recipients.length === 0) {
      // All generated — mark as ready
      await supabase
        .from("outreach_campaigns")
        .update({ status: "ready" })
        .eq("id", id)

      return NextResponse.json({ generated: 0, remaining: 0, errors: [] })
    }

    // ── Generate emails for this batch ───────────────────────────────────────
    const errors: string[] = []
    let generatedCount = 0

    const senderProfile = campaign.sender_profiles

    for (const recipient of recipients) {
      try {
        const { subject, body } = await outreachEmailGeneratorService.generateEmail(
          campaign,
          senderProfile,
          {
            recipient_email: recipient.recipient_email,
            recipient_business_type: recipient.recipient_business_type,
            recipient_practice_name: recipient.recipient_practice_name,
            recipient_city: recipient.recipient_city,
            recipient_state: recipient.recipient_state,
            recipient_total_opens: recipient.recipient_total_opens ?? 0,
            recipient_total_clicks: recipient.recipient_total_clicks ?? 0,
          }
        )

        // Convert body to HTML (preserve paragraphs)
        const bodyHtml = body
          .split(/\n\n+/)
          .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
          .join("\n")

        await supabase
          .from("outreach_campaign_recipients")
          .update({
            subject,
            body,
            body_html: bodyHtml,
            status: "generated",
            generated_at: new Date().toISOString(),
          })
          .eq("id", recipient.id)

        generatedCount++
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        console.error(`Failed to generate email for recipient ${recipient.id}:`, err)
        errors.push(`${recipient.recipient_email}: ${errMsg}`)

        // Mark as failed so it doesn't block the queue
        await supabase
          .from("outreach_campaign_recipients")
          .update({
            status: "failed",
            error: errMsg,
          })
          .eq("id", recipient.id)
      }
    }

    // ── Update campaign status ───────────────────────────────────────────────
    if (remainingAfterBatch === 0) {
      await supabase
        .from("outreach_campaigns")
        .update({ status: "ready" })
        .eq("id", id)
    }

    return NextResponse.json({
      generated: generatedCount,
      remaining: remainingAfterBatch,
      errors,
    })
  } catch (err) {
    console.error("Unexpected error in outreach campaign generate:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
