import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { outreachEmailGeneratorService } from "@/lib/services/outreach-email-generator"

// PATCH /api/outreach-campaigns/[id]/recipients/[rid]
// Update a single recipient: approve, edit body/subject, regenerate, suppress
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; rid: string }> }
) {
  try {
    const { id, rid } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { action, subject, body: emailBody, body_html } = body

    // ── Fetch recipient ──────────────────────────────────────────────────────
    const { data: recipient, error: fetchError } = await supabase
      .from("outreach_campaign_recipients")
      .select("*")
      .eq("id", rid)
      .eq("outreach_campaign_id", id)
      .single()

    if (fetchError || !recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // ── approve ──────────────────────────────────────────────────────────────
    if (action === "approve") {
      const { data, error } = await supabase
        .from("outreach_campaign_recipients")
        .update({ status: "approved", approved: true })
        .eq("id", rid)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ recipient: data })
    }

    // ── unapprove ────────────────────────────────────────────────────────────
    if (action === "unapprove") {
      const { data, error } = await supabase
        .from("outreach_campaign_recipients")
        .update({ status: "generated", approved: false })
        .eq("id", rid)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ recipient: data })
    }

    // ── update body/subject (manual edit) ───────────────────────────────────
    if (action === "update") {
      const updates: Record<string, unknown> = {}
      if (subject !== undefined) updates.subject = subject
      if (emailBody !== undefined) {
        updates.body = emailBody
        updates.body_html =
          body_html ||
          emailBody
            .split(/\n\n+/)
            .map((p: string) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
            .join("\n")
      }

      const { data, error } = await supabase
        .from("outreach_campaign_recipients")
        .update(updates)
        .eq("id", rid)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ recipient: data })
    }

    // ── regenerate ───────────────────────────────────────────────────────────
    if (action === "regenerate") {
      if (!outreachEmailGeneratorService.isConfigured()) {
        return NextResponse.json(
          { error: "Anthropic API key not configured." },
          { status: 500 }
        )
      }

      // Fetch campaign + sender profile
      const { data: campaign } = await supabase
        .from("outreach_campaigns")
        .select(`*, sender_profiles (*)`)
        .eq("id", id)
        .single()

      if (!campaign?.sender_profiles) {
        return NextResponse.json(
          { error: "Campaign sender profile not found." },
          { status: 400 }
        )
      }

      const { subject: newSubject, body: newBody } =
        await outreachEmailGeneratorService.generateEmail(
          campaign,
          campaign.sender_profiles,
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

      const newBodyHtml = newBody
        .split(/\n\n+/)
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("\n")

      const { data, error } = await supabase
        .from("outreach_campaign_recipients")
        .update({
          subject: newSubject,
          body: newBody,
          body_html: newBodyHtml,
          status: "generated",
          approved: false,
          generated_at: new Date().toISOString(),
          error: null,
        })
        .eq("id", rid)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ recipient: data })
    }

    // ── suppress ─────────────────────────────────────────────────────────────
    if (action === "suppress") {
      const { data, error } = await supabase
        .from("outreach_campaign_recipients")
        .update({
          status: "suppressed",
          approved: false,
          error: body.reason || "Manually suppressed",
        })
        .eq("id", rid)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ recipient: data })
    }

    // ── delete ───────────────────────────────────────────────────────────────
    if (action === "delete") {
      const { error } = await supabase
        .from("outreach_campaign_recipients")
        .delete()
        .eq("id", rid)
        .eq("outreach_campaign_id", id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("Error updating outreach recipient:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/outreach-campaigns/[id]/recipients/[rid]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; rid: string }> }
) {
  try {
    const { id, rid } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("outreach_campaign_recipients")
      .delete()
      .eq("id", rid)
      .eq("outreach_campaign_id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error deleting outreach recipient:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
