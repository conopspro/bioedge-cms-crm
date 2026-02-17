import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { clinicEmailGeneratorService } from "@/lib/services/clinic-email-generator"
import type { ClinicCampaign, SenderProfile } from "@/types/database"
import type { ClinicContext, ClinicCampaignEventContext } from "@/lib/services/clinic-email-generator"

type RouteParams = {
  params: Promise<{ id: string; recipientId: string }>
}

/**
 * POST /api/clinic-campaigns/[id]/recipients/[recipientId]/regenerate
 *
 * Regenerate the AI email for a single clinic campaign recipient.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()

    if (!clinicEmailGeneratorService.isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
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

    const senderProfile = campaign.sender_profile as SenderProfile | null
    if (!senderProfile) {
      return NextResponse.json(
        { error: "Campaign has no sender profile" },
        { status: 400 }
      )
    }

    // Fetch recipient
    const { data: recipient, error: recipError } = await supabase
      .from("clinic_campaign_recipients")
      .select("id, clinic_id")
      .eq("id", recipientId)
      .eq("clinic_campaign_id", campaignId)
      .single()

    if (recipError || !recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      )
    }

    // Fetch clinic details
    const { data: clinic } = await supabase
      .from("clinics")
      .select("name, city, state, tags, description, website, google_rating, reviews_count")
      .eq("id", recipient.clinic_id)
      .single()

    if (!clinic) {
      return NextResponse.json(
        { error: "Clinic not found" },
        { status: 404 }
      )
    }

    // Fetch campaign events for context
    const { data: campaignEventRows } = await supabase
      .from("clinic_campaign_events")
      .select("events:events(name, start_date, end_date, city, state, slug, registration_url)")
      .eq("clinic_campaign_id", campaignId)

    const campaignEvents: ClinicCampaignEventContext[] = (campaignEventRows || [])
      .map((ce) => ce.events as unknown as ClinicCampaignEventContext)
      .filter(Boolean)

    const clinicContext: ClinicContext = {
      name: clinic.name,
      city: clinic.city,
      state: clinic.state,
      tags: clinic.tags || [],
      description: clinic.description,
      website: clinic.website,
      google_rating: clinic.google_rating,
      reviews_count: clinic.reviews_count || 0,
    }

    // Regenerate the email
    const { subject, body } = await clinicEmailGeneratorService.generateEmail(
      campaign as ClinicCampaign,
      senderProfile,
      clinicContext,
      campaignEvents
    )

    const bodyHtml = body
      .split("\n\n")
      .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
      .join("")

    // Update recipient
    const { data: updated, error: updateError } = await supabase
      .from("clinic_campaign_recipients")
      .update({
        subject,
        body,
        body_html: bodyHtml,
        status: "generated",
        approved: false,
        generated_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", recipientId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update recipient" },
        { status: 500 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
