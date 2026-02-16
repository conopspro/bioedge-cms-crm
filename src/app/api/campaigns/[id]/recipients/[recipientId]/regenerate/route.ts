import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { emailGeneratorService } from "@/lib/services/email-generator"
import type { Campaign, SenderProfile } from "@/types/database"

type RouteParams = {
  params: Promise<{ id: string; recipientId: string }>
}

/**
 * POST /api/campaigns/[id]/recipients/[recipientId]/regenerate
 *
 * Regenerate the AI email for a single recipient.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId, recipientId } = await params
    const supabase = await createClient()

    if (!emailGeneratorService.isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
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

    const senderProfile = campaign.sender_profile as SenderProfile | null
    if (!senderProfile) {
      return NextResponse.json(
        { error: "Campaign has no sender profile" },
        { status: 400 }
      )
    }

    // Fetch recipient
    const { data: recipient, error: recipError } = await supabase
      .from("campaign_recipients")
      .select("id, contact_id, company_id")
      .eq("id", recipientId)
      .eq("campaign_id", campaignId)
      .single()

    if (recipError || !recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      )
    }

    // Fetch contact
    const { data: contact } = await supabase
      .from("contacts")
      .select(
        "first_name, last_name, title, seniority, ai_expertise, ai_outreach_suggestions"
      )
      .eq("id", recipient.contact_id)
      .single()

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      )
    }

    // Fetch company
    let companyData = {
      name: "Unknown Company",
      description: null as string | null,
      differentiators: null as string | null,
      bioedge_fit: null as string | null,
      warm_pitch: null as string | null,
      events: [] as string[],
      systems_supported: [] as string[],
      edge_categories: [] as string[],
      access_levels: [] as string[],
      category: null as string | null,
    }

    if (recipient.company_id) {
      const { data: company } = await supabase
        .from("companies")
        .select(
          "name, description, differentiators, bioedge_fit, warm_pitch, systems_supported, edge_categories, access_levels, category"
        )
        .eq("id", recipient.company_id)
        .single()

      if (company) {
        const { data: eventCompanies } = await supabase
          .from("event_companies")
          .select("events:events!event_companies_event_id_fkey(name)")
          .eq("company_id", recipient.company_id)

        const events = (eventCompanies || [])
          .map((ec) => (ec.events as unknown as { name: string } | null)?.name)
          .filter(Boolean) as string[]

        companyData = {
          name: company.name,
          description: company.description,
          differentiators: company.differentiators,
          bioedge_fit: company.bioedge_fit,
          warm_pitch: company.warm_pitch,
          events,
          systems_supported: company.systems_supported || [],
          edge_categories: company.edge_categories || [],
          access_levels: company.access_levels || [],
          category: company.category,
        }
      }
    }

    // Regenerate the email
    const { subject, body } = await emailGeneratorService.generateEmail(
      campaign as Campaign,
      senderProfile,
      {
        first_name: contact.first_name,
        last_name: contact.last_name,
        title: contact.title,
        seniority: contact.seniority,
        ai_expertise: contact.ai_expertise,
        ai_outreach_suggestions: contact.ai_outreach_suggestions,
      },
      companyData
    )

    const bodyHtml = body
      .split("\n\n")
      .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
      .join("")

    // Update recipient
    const { data: updated, error: updateError } = await supabase
      .from("campaign_recipients")
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
