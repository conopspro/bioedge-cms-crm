import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resendService } from "@/lib/services/resend"

/**
 * POST /api/outreach-campaigns/[id]/send
 *
 * Sends the next approved recipient in the queue.
 * Returns a recommended delay before the next call.
 *
 * Pattern mirrors clinic-campaigns/[id]/send/route.ts exactly.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // ── Check Resend is configured ───────────────────────────────────────────
    if (!resendService.isConfigured()) {
      return NextResponse.json(
        { error: "Resend API key not configured. Set RESEND_API_KEY environment variable." },
        { status: 500 }
      )
    }

    // ── Fetch campaign ───────────────────────────────────────────────────────
    const { data: campaign, error: campaignError } = await supabase
      .from("outreach_campaigns")
      .select(`
        *,
        sender_profiles (
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

    if (campaign.status === "paused") {
      return NextResponse.json({ error: "Campaign is paused" }, { status: 400 })
    }

    if (campaign.status === "completed") {
      return NextResponse.json({ error: "Campaign is already completed" }, { status: 400 })
    }

    if (!campaign.sender_profiles) {
      return NextResponse.json(
        { error: "Campaign has no sender profile configured." },
        { status: 400 }
      )
    }

    const senderProfile = campaign.sender_profiles

    // ── Enforce send window (EST) ────────────────────────────────────────────
    const sendWindowStart = campaign.send_window_start ?? 9
    const sendWindowEnd = campaign.send_window_end ?? 17
    const nowEST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    )
    const currentHour = nowEST.getHours()

    if (currentHour < sendWindowStart || currentHour >= sendWindowEnd) {
      // Calculate seconds until window opens
      let hoursUntilOpen: number
      if (currentHour >= sendWindowEnd) {
        hoursUntilOpen = 24 - currentHour + sendWindowStart
      } else {
        hoursUntilOpen = sendWindowStart - currentHour
      }
      const retryAfterSeconds = hoursUntilOpen * 3600

      return NextResponse.json(
        {
          error: `Outside send window (${sendWindowStart}:00–${sendWindowEnd}:00 EST). Currently ${currentHour}:${String(nowEST.getMinutes()).padStart(2, "0")} EST.`,
          retry_after_seconds: retryAfterSeconds,
        },
        { status: 429 }
      )
    }

    // ── Check daily send limit ───────────────────────────────────────────────
    const dailyLimit = campaign.daily_send_limit ?? 50
    const startOfDayEST = new Date(nowEST)
    startOfDayEST.setHours(0, 0, 0, 0)

    const { count: todayCount } = await supabase
      .from("outreach_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("outreach_campaign_id", id)
      .gte("sent_at", startOfDayEST.toISOString())

    if ((todayCount ?? 0) >= dailyLimit) {
      return NextResponse.json(
        {
          error: `Daily send limit reached (${dailyLimit} emails). Resumes tomorrow.`,
          retry_after_seconds: (24 - currentHour) * 3600,
        },
        { status: 429 }
      )
    }

    // ── Get next approved recipient ──────────────────────────────────────────
    const { data: recipients, error: recipientsError } = await supabase
      .from("outreach_campaign_recipients")
      .select("*")
      .eq("outreach_campaign_id", id)
      .eq("status", "approved")
      .eq("approved", true)
      .order("created_at", { ascending: true })
      .limit(1)

    if (recipientsError) {
      return NextResponse.json({ error: recipientsError.message }, { status: 500 })
    }

    if (!recipients || recipients.length === 0) {
      // Check if any approved remain anywhere in the campaign
      const { count: approvedTotal } = await supabase
        .from("outreach_campaign_recipients")
        .select("id", { count: "exact", head: true })
        .eq("outreach_campaign_id", id)
        .eq("approved", true)
        .in("status", ["approved"])

      if (!approvedTotal || approvedTotal === 0) {
        // Mark campaign complete if nothing left to send
        const { count: anyQueued } = await supabase
          .from("outreach_campaign_recipients")
          .select("id", { count: "exact", head: true })
          .eq("outreach_campaign_id", id)
          .in("status", ["pending", "generated"])

        if (!anyQueued || anyQueued === 0) {
          await supabase
            .from("outreach_campaigns")
            .update({ status: "completed" })
            .eq("id", id)
        }
      }

      return NextResponse.json(
        { error: "No approved recipients remaining in the queue." },
        { status: 404 }
      )
    }

    const recipient = recipients[0]

    // ── Build HTML email with signature ─────────────────────────────────────
    let emailHtml =
      recipient.body_html ||
      `<p>${(recipient.body || "").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`

    // campaign.signature_override takes precedence over the sender profile's signature
    const signature = (campaign as { signature_override?: string | null }).signature_override || senderProfile.signature
    if (signature) {
      const signatureHtml = signature
        .split("\n")
        .map((line: string) => line.trim())
        .join("<br>")
      emailHtml += `<br><br><span style="color:#666;font-size:13px">${signatureHtml}</span>`
    }

    // ── Send via Resend ──────────────────────────────────────────────────────
    const fromAddress = `${senderProfile.name} <${senderProfile.email}>`
    const replyTo = campaign.reply_to || senderProfile.email

    const { id: resendId, error: sendError } = await resendService.sendEmail({
      from: fromAddress,
      to: recipient.recipient_email,
      subject: recipient.subject || "Quick note",
      html: emailHtml,
      replyTo,
      trackOpens: campaign.track_opens,
      trackClicks: campaign.track_clicks,
    })

    if (sendError) {
      await supabase
        .from("outreach_campaign_recipients")
        .update({
          status: "failed",
          error: sendError,
        })
        .eq("id", recipient.id)

      return NextResponse.json({ error: `Send failed: ${sendError}` }, { status: 500 })
    }

    // ── Update recipient record ──────────────────────────────────────────────
    await supabase
      .from("outreach_campaign_recipients")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        resend_id: resendId,
        error: null,
      })
      .eq("id", recipient.id)

    // ── Ensure campaign status is 'sending' ──────────────────────────────────
    if (campaign.status !== "sending") {
      await supabase
        .from("outreach_campaigns")
        .update({ status: "sending" })
        .eq("id", id)
    }

    // ── Calculate recommended delay ──────────────────────────────────────────
    const minDelay = campaign.min_delay_seconds ?? 120
    const maxDelay = campaign.max_delay_seconds ?? 300
    const recommendedDelay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay

    // ── Check if more approved recipients remain ─────────────────────────────
    const { count: remainingApproved } = await supabase
      .from("outreach_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("outreach_campaign_id", id)
      .eq("status", "approved")
      .eq("approved", true)

    // ── Mark campaign completed if nothing left ───────────────────────────────
    if (!remainingApproved || remainingApproved === 0) {
      await supabase
        .from("outreach_campaigns")
        .update({ status: "completed" })
        .eq("id", id)
    }

    return NextResponse.json({
      sent: true,
      recipient_email: recipient.recipient_email,
      resend_id: resendId,
      recommended_delay_seconds: recommendedDelay,
      remaining_approved: remainingApproved ?? 0,
    })
  } catch (err) {
    console.error("Unexpected error in outreach campaign send:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
