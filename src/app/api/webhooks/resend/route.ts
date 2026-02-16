import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/webhooks/resend
 *
 * Resend webhook endpoint for delivery event tracking.
 * Updates campaign_recipients status based on email events.
 *
 * Events handled:
 * - email.delivered → delivered
 * - email.opened → opened
 * - email.clicked → clicked
 * - email.bounced → bounced
 * - email.complained → failed (spam complaint)
 *
 * Setup: Configure this URL in Resend dashboard → Webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Resend webhook payload structure
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      )
    }

    // Verify webhook signature if configured
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = request.headers.get("svix-signature")
      if (!signature) {
        console.warn("Resend webhook: missing signature header")
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 401 }
        )
      }
      // Note: For full signature verification, use the svix package
      // For now, we just check that a signature header is present
    }

    const resendId = data.email_id
    if (!resendId) {
      // Some events don't have email_id, just acknowledge
      return NextResponse.json({ received: true })
    }

    const supabase = createAdminClient()

    // Map event type to status update
    let updateData: Record<string, unknown> | null = null

    switch (type) {
      case "email.delivered":
        updateData = {
          status: "delivered",
          delivered_at: new Date().toISOString(),
        }
        break

      case "email.opened":
        updateData = {
          status: "opened",
          opened_at: new Date().toISOString(),
        }
        break

      case "email.clicked":
        updateData = {
          status: "clicked",
          clicked_at: new Date().toISOString(),
        }
        break

      case "email.bounced":
        updateData = {
          status: "bounced",
          error: data.bounce_type
            ? `Bounced: ${data.bounce_type}`
            : "Email bounced",
        }
        break

      case "email.complained":
        updateData = {
          status: "failed",
          error: "Spam complaint received",
        }
        break

      default:
        // Unhandled event type, just acknowledge
        console.log(`Resend webhook: unhandled event type "${type}"`)
        return NextResponse.json({ received: true })
    }

    if (updateData) {
      const { error } = await supabase
        .from("campaign_recipients")
        .update(updateData)
        .eq("resend_id", resendId)

      if (error) {
        console.error(
          `Resend webhook: failed to update recipient for ${resendId}:`,
          error
        )
      } else {
        console.log(
          `Resend webhook: ${type} for ${resendId}`
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Resend webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
