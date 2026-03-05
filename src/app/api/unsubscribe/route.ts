import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { decodeUnsubscribeToken, applyUnsubscribeToEmail } from "@/lib/services/email-suppression"

/**
 * POST /api/unsubscribe
 *
 * Processes an unsubscribe request from a recipient clicking the footer link.
 * Decodes the signed token, looks up the recipient email, and marks the
 * source contact as unsubscribed globally across all contact tables.
 *
 * Body: { token: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    const payload = decodeUnsubscribeToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or tampered token" }, { status: 400 })
    }

    const { recipientId, table } = payload
    const validTables = [
      "outreach_campaign_recipients",
      "clinic_campaign_recipients",
      "campaign_recipients",
    ]
    if (!validTables.includes(table)) {
      return NextResponse.json({ error: "Invalid table in token" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Look up the recipient email from the appropriate table
    const { data: recipient, error: lookupError } = await supabase
      .from(table as any)
      .select("recipient_email")
      .eq("id", recipientId)
      .single()

    if (lookupError || !recipient?.recipient_email) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    const email = recipient.recipient_email

    // Mark the recipient record itself as unsubscribed
    await supabase
      .from(table as any)
      .update({ status: "suppressed", error: "Unsubscribed" })
      .eq("id", recipientId)

    // Mark the source contact globally across all tables
    await applyUnsubscribeToEmail(email, supabase)

    return NextResponse.json({ success: true, email })
  } catch (err) {
    console.error("unsubscribe error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
