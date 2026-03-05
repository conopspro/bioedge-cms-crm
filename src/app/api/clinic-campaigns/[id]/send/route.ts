import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { resendService } from "@/lib/services/resend"
import { buildUnsubscribeToken } from "@/lib/services/email-suppression"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/clinic-campaigns/[id]/send
 *
 * Send the next approved email in a clinic campaign.
 * Returns the sent recipient and recommended delay before next send.
 *
 * Used by the frontend for slow-drip sending.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()

    // Check if Resend is configured
    if (!resendService.isConfigured()) {
      return NextResponse.json(
        { error: "Resend API key not configured. Set RESEND_API_KEY environment variable." },
        { status: 500 }
      )
    }

    // Fetch campaign with sender profile
    const { data: campaign, error: campaignError } = await supabase
      .from("clinic_campaigns")
      .select("*, sender_profile:sender_profiles(*)")
      .eq("id", campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Clinic campaign not found" },
        { status: 404 }
      )
    }

    // Check campaign is in sending or ready status
    if (campaign.status !== "sending" && campaign.status !== "ready") {
      return NextResponse.json(
        { error: `Campaign is ${campaign.status}, not ready to send` },
        { status: 400 }
      )
    }

    // Enforce send window (EST timezone)
    const sendWindowStart = campaign.send_window_start ?? 9
    const sendWindowEnd = campaign.send_window_end ?? 17
    const nowEST = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
    const currentHour = nowEST.getHours()

    if (currentHour < sendWindowStart || currentHour >= sendWindowEnd) {
      let waitUntilHour = sendWindowStart
      if (currentHour >= sendWindowEnd) {
        waitUntilHour = sendWindowStart + 24
      }
      const hoursToWait = waitUntilHour - currentHour
      const secondsToWait = hoursToWait * 3600

      return NextResponse.json({
        outside_send_window: true,
        current_hour_est: currentHour,
        send_window: `${sendWindowStart}:00 - ${sendWindowEnd}:00 EST`,
        retry_after_seconds: secondsToWait,
        message: `Outside send window (${sendWindowStart}:00 - ${sendWindowEnd}:00 EST). Current time: ${currentHour}:00 EST.`,
      })
    }

    const senderProfile = campaign.sender_profile
    if (!senderProfile) {
      return NextResponse.json(
        { error: "Campaign has no sender profile" },
        { status: 400 }
      )
    }

    // Get next approved recipient (oldest first)
    const { data: recipient, error: recipError } = await supabase
      .from("clinic_campaign_recipients")
      .select("*")
      .eq("clinic_campaign_id", campaignId)
      .eq("status", "approved")
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (recipError || !recipient) {
      // No more recipients to send — mark campaign as completed
      await supabase
        .from("clinic_campaigns")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", campaignId)

      return NextResponse.json({
        message: "No more approved recipients. Campaign completed.",
        completed: true,
      })
    }

    // Check recipient has email
    if (!recipient.recipient_email) {
      await supabase
        .from("clinic_campaign_recipients")
        .update({ status: "failed", error: "No email address for this clinic" })
        .eq("id", recipient.id)

      return NextResponse.json({
        skipped: true,
        reason: "No email address",
        recipient_id: recipient.id,
      })
    }

    // Skip if clinic email has been bounced or unsubscribed since being added
    const { data: clinic } = await supabase
      .from("clinics")
      .select("bounced_at, unsubscribed_at")
      .eq("id", recipient.clinic_id)
      .single()

    if (clinic?.bounced_at) {
      await supabase
        .from("clinic_campaign_recipients")
        .update({ status: "suppressed", error: "Clinic email has bounced" })
        .eq("id", recipient.id)

      return NextResponse.json({ skipped: true, reason: "Bounced", recipient_id: recipient.id })
    }
    if (clinic?.unsubscribed_at) {
      await supabase
        .from("clinic_campaign_recipients")
        .update({ status: "suppressed", error: "Clinic has unsubscribed" })
        .eq("id", recipient.id)

      return NextResponse.json({ skipped: true, reason: "Unsubscribed", recipient_id: recipient.id })
    }

    // Build email HTML with signature
    let emailHtml = recipient.body_html || `<p>${(recipient.body || "").replace(/\n/g, "</p><p>")}</p>`

    if (senderProfile.signature) {
      const signatureHtml = senderProfile.signature
        .split("\n")
        .map((line: string) => line.trim())
        .join("<br>")
      emailHtml += `<br><br><span style="color:#666;font-size:13px">${signatureHtml}</span>`
    }

    // Unsubscribe footer
    const unsubToken = buildUnsubscribeToken(recipient.id, "clinic_campaign_recipients")
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bioedgelongevity.com"
    emailHtml += `<br><br><hr style="border:none;border-top:1px solid #eee;margin:16px 0"><p style="color:#999;font-size:11px;text-align:center;margin:0">You're receiving this because you opted in at bioedgelongevity.com. <a href="${siteUrl}/unsubscribe?t=${unsubToken}" style="color:#999;">Unsubscribe</a></p>`

    // Send via Resend
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
        .from("clinic_campaign_recipients")
        .update({
          status: "failed",
          error: sendError,
        })
        .eq("id", recipient.id)

      return NextResponse.json(
        { error: `Send failed: ${sendError}`, recipient_id: recipient.id },
        { status: 500 }
      )
    }

    // Update recipient status to sent
    await supabase
      .from("clinic_campaign_recipients")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        resend_id: resendId,
      })
      .eq("id", recipient.id)

    // Update campaign status to sending if it was ready
    if (campaign.status === "ready") {
      await supabase
        .from("clinic_campaigns")
        .update({ status: "sending", updated_at: new Date().toISOString() })
        .eq("id", campaignId)
    }

    // Calculate recommended delay
    const minDelay = campaign.min_delay_seconds || 120
    const maxDelay = campaign.max_delay_seconds || 300
    const recommendedDelay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay

    return NextResponse.json({
      sent: true,
      recipient_id: recipient.id,
      recipient_name: recipient.recipient_name,
      recipient_email: recipient.recipient_email,
      subject: recipient.subject,
      resend_id: resendId,
      recommended_delay_seconds: recommendedDelay,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
