import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { resendService } from "@/lib/services/resend"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/clinic-campaigns/[id]/test-send
 *
 * Send a test email to a specified address without any side effects.
 * No status changes, no tracking updates.
 *
 * Body: { recipientId: string, sendTo: string }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { recipientId, sendTo } = body

    if (!recipientId || !sendTo) {
      return NextResponse.json(
        { error: "recipientId and sendTo are required" },
        { status: 400 }
      )
    }

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

    const senderProfile = campaign.sender_profile
    if (!senderProfile) {
      return NextResponse.json(
        { error: "Campaign has no sender profile. Assign one before sending tests." },
        { status: 400 }
      )
    }

    // Fetch the recipient
    const { data: recipient, error: recipError } = await supabase
      .from("clinic_campaign_recipients")
      .select("*")
      .eq("id", recipientId)
      .eq("clinic_campaign_id", campaignId)
      .single()

    if (recipError || !recipient) {
      return NextResponse.json(
        { error: "Recipient not found in this campaign" },
        { status: 404 }
      )
    }

    // Build email HTML with signature
    let emailHtml =
      recipient.body_html ||
      `<p>${(recipient.body || "").replace(/\n/g, "</p><p>")}</p>`

    if (senderProfile.signature) {
      const signatureHtml = senderProfile.signature
        .split("\n")
        .map((line: string) => line.trim())
        .join("<br>")
      emailHtml += `<br><br><span style="color:#666;font-size:13px">${signatureHtml}</span>`
    }

    // Send via Resend to the TEST address with [TEST] prefix
    const fromAddress = `${senderProfile.name} <${senderProfile.email}>`
    const replyTo = campaign.reply_to || senderProfile.email

    const { id: resendId, error: sendError } = await resendService.sendEmail({
      from: fromAddress,
      to: sendTo,
      subject: `[TEST] ${recipient.subject || "Quick note"}`,
      html: emailHtml,
      replyTo,
    })

    if (sendError) {
      return NextResponse.json(
        { error: `Send failed: ${sendError}` },
        { status: 500 }
      )
    }

    // NO side effects — no status change, no tracking updates

    return NextResponse.json({
      sent: true,
      resendId,
      sendTo,
    })
  } catch (error) {
    console.error("Test send error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
