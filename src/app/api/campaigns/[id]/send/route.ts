import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { resendService } from "@/lib/services/resend"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/campaigns/[id]/send
 *
 * Send the next approved email in a campaign.
 * Returns the sent recipient and recommended delay before next send.
 *
 * Used by the campaign-sender script for slow-drip sending.
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
      .from("campaigns")
      .select("*, sender_profile:sender_profiles(*)")
      .eq("id", campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    // Check campaign is in sending status
    if (campaign.status !== "sending" && campaign.status !== "ready") {
      return NextResponse.json(
        { error: `Campaign is ${campaign.status}, not ready to send` },
        { status: 400 }
      )
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
      .from("campaign_recipients")
      .select("*")
      .eq("campaign_id", campaignId)
      .eq("status", "approved")
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (recipError || !recipient) {
      // No more recipients to send
      // Mark campaign as completed
      await supabase
        .from("campaigns")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", campaignId)

      return NextResponse.json({
        message: "No more approved recipients. Campaign completed.",
        completed: true,
      })
    }

    // Fetch contact for recipient
    const { data: contact } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, outreach_status")
      .eq("id", recipient.contact_id)
      .single()

    if (!contact || !contact.email) {
      // Skip this recipient
      await supabase
        .from("campaign_recipients")
        .update({ status: "failed", error: "Contact has no email address" })
        .eq("id", recipient.id)

      return NextResponse.json({
        skipped: true,
        reason: "No email address",
        recipient_id: recipient.id,
      })
    }

    // Build email HTML with signature
    let emailHtml = recipient.body_html || `<p>${(recipient.body || "").replace(/\n/g, "</p><p>")}</p>`

    // Append signature if sender has one
    if (senderProfile.signature) {
      const signatureHtml = senderProfile.signature
        .split("\n")
        .map((line: string) => line.trim())
        .join("<br>")
      emailHtml += `<br><br><span style="color:#666;font-size:13px">${signatureHtml}</span>`
    }

    // Send via Resend
    const fromAddress = `${senderProfile.name} <${senderProfile.email}>`
    const replyTo = campaign.reply_to || senderProfile.email

    const { id: resendId, error: sendError } = await resendService.sendEmail({
      from: fromAddress,
      to: contact.email,
      subject: recipient.subject || "Quick note",
      html: emailHtml,
      replyTo,
      trackOpens: campaign.track_opens,
      trackClicks: campaign.track_clicks,
    })

    if (sendError) {
      // Update recipient with error
      await supabase
        .from("campaign_recipients")
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
      .from("campaign_recipients")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        resend_id: resendId,
      })
      .eq("id", recipient.id)

    // Log to outreach_log
    await supabase.from("outreach_log").insert({
      contact_id: contact.id,
      date: new Date().toISOString().split("T")[0],
      type: "email",
      notes: `[Campaign: ${campaign.name}] Subject: ${recipient.subject}`,
      response_received: false,
    })

    // Update contact outreach_status to "contacted" (only if currently "not_contacted")
    if (contact.outreach_status === "not_contacted") {
      await supabase
        .from("contacts")
        .update({ outreach_status: "contacted" })
        .eq("id", contact.id)
    }

    // Update campaign status to sending if it was ready
    if (campaign.status === "ready") {
      await supabase
        .from("campaigns")
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
      contact_name: `${contact.first_name} ${contact.last_name}`,
      contact_email: contact.email,
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
