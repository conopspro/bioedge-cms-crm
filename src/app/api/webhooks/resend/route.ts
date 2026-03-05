import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import {
  applyBounceToEmail,
  applyUnsubscribeToEmail,
  applyReplyToEmail,
} from "@/lib/services/email-suppression"

/**
 * POST /api/webhooks/resend
 *
 * Resend webhook endpoint for delivery event tracking.
 * Updates recipient records AND source contact tables based on email events.
 *
 * Events handled:
 * - email.delivered       → status: delivered
 * - email.opened          → status: opened
 * - email.clicked         → status: clicked
 * - email.bounced         → status: bounced  + marks source contact bounced_at
 * - email.complained      → status: failed   + marks source contact unsubscribed_at
 * - email.failed          → status: failed   + stores error message
 * - email.delivery_delayed→ status: delayed  + stores reason
 * - email.suppressed      → status: suppressed + marks source contact bounced_at
 * - email.received        → sets last_replied_at on matching contact (inbound reply)
 *
 * Lookup order: campaign_recipients → clinic_campaign_recipients → outreach_campaign_recipients
 *
 * Setup: Configure webhook URL in Resend dashboard → Webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
    }

    // Verify webhook signature if configured
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = request.headers.get("svix-signature")
      if (!signature) {
        console.warn("Resend webhook: missing signature header")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }
      // Note: For full HMAC verification install the svix package and verify here
    }

    const supabase = createAdminClient()

    // ── email.received — inbound reply, no resend_id to look up ─────────────
    if (type === "email.received") {
      const senderEmail = data.from
        ? String(data.from).replace(/.*<(.+)>/, "$1").trim()
        : null
      if (senderEmail) {
        await applyReplyToEmail(senderEmail, supabase)
        console.log(`Resend webhook: email.received from ${senderEmail}`)
      }
      return NextResponse.json({ received: true })
    }

    const resendId = data.email_id
    if (!resendId) {
      return NextResponse.json({ received: true })
    }

    // ── Map event type to recipient status update ────────────────────────────
    let updateData: Record<string, unknown> | null = null
    let recipientEmail: string | null = null // populated after DB lookup for suppression events

    switch (type) {
      case "email.delivered":
        updateData = { status: "delivered", delivered_at: new Date().toISOString() }
        break

      case "email.opened":
        updateData = { status: "opened", opened_at: new Date().toISOString() }
        break

      case "email.clicked":
        updateData = { status: "clicked", clicked_at: new Date().toISOString() }
        break

      case "email.bounced":
        updateData = {
          status: "bounced",
          error: data.bounce_type ? `Bounced: ${data.bounce_type}` : "Email bounced",
        }
        break

      case "email.complained":
        updateData = { status: "failed", error: "Spam complaint received" }
        break

      case "email.failed":
        updateData = {
          status: "failed",
          error: data.error?.message || data.reason || "Send failed",
        }
        break

      case "email.delivery_delayed":
        updateData = {
          status: "delayed",
          error: data.reason || "Delivery temporarily delayed — Resend will retry",
        }
        break

      case "email.suppressed":
        updateData = {
          status: "suppressed",
          error: "Suppressed by Resend (prior bounce or complaint)",
        }
        break

      default:
        console.log(`Resend webhook: unhandled event type "${type}"`)
        return NextResponse.json({ received: true })
    }

    // ── Update recipient record across all three tables ─────────────────────
    // Try campaign_recipients first
    const { data: campaignMatch, error: campaignError } = await supabase
      .from("campaign_recipients")
      .update(updateData)
      .eq("resend_id", resendId)
      .select("id, recipient_email")

    if (campaignError) {
      console.error(`Resend webhook: campaign_recipients update error for ${resendId}:`, campaignError)
    }

    if (campaignMatch && campaignMatch.length > 0) {
      recipientEmail = campaignMatch[0]?.recipient_email ?? null
      console.log(`Resend webhook: ${type} for ${resendId} (company campaign)`)
    } else {
      // Try clinic_campaign_recipients
      const { data: clinicMatch, error: clinicError } = await supabase
        .from("clinic_campaign_recipients")
        .update(updateData)
        .eq("resend_id", resendId)
        .select("id, recipient_email")

      if (clinicError) {
        console.error(`Resend webhook: clinic_campaign_recipients update error for ${resendId}:`, clinicError)
      }

      if (clinicMatch && clinicMatch.length > 0) {
        recipientEmail = clinicMatch[0]?.recipient_email ?? null
        console.log(`Resend webhook: ${type} for ${resendId} (clinic campaign)`)
      } else {
        // Try outreach_campaign_recipients
        const { data: outreachMatch, error: outreachError } = await supabase
          .from("outreach_campaign_recipients")
          .update(updateData)
          .eq("resend_id", resendId)
          .select("id, recipient_email")

        if (outreachError) {
          console.error(`Resend webhook: outreach_campaign_recipients update error for ${resendId}:`, outreachError)
        }

        if (outreachMatch && outreachMatch.length > 0) {
          recipientEmail = outreachMatch[0]?.recipient_email ?? null
          console.log(`Resend webhook: ${type} for ${resendId} (outreach campaign)`)
        } else {
          console.warn(`Resend webhook: no recipient found for resend_id ${resendId}`)
        }
      }
    }

    // ── Apply source contact suppression for bounce/complaint/suppressed ─────
    if (recipientEmail) {
      if (type === "email.bounced" || type === "email.suppressed") {
        await applyBounceToEmail(recipientEmail, supabase)
      } else if (type === "email.complained") {
        await applyUnsubscribeToEmail(recipientEmail, supabase)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Resend webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
