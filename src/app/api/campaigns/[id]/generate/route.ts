import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { emailGeneratorService } from "@/lib/services/email-generator"
import type { Campaign, SenderProfile } from "@/types/database"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/campaigns/[id]/generate
 *
 * Generate personalized emails for all pending recipients in a campaign.
 * Processes sequentially with brief delays to respect Claude rate limits.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()

    // Check if email generator is configured
    if (!emailGeneratorService.isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable." },
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
        { error: "Campaign has no sender profile configured" },
        { status: 400 }
      )
    }

    // Fetch campaign events for AI context
    const { data: campaignEventRows } = await supabase
      .from("campaign_events")
      .select("events:events(name, start_date, end_date, city, state, slug, registration_url)")
      .eq("campaign_id", campaignId)

    const campaignEvents = (campaignEventRows || [])
      .map((ce) => ce.events as unknown as { name: string; start_date: string | null; end_date: string | null; city: string | null; state: string | null; slug: string | null; registration_url: string | null })
      .filter(Boolean)

    // Get all pending recipients
    const { data: pendingRecipients, error: recipError } = await supabase
      .from("campaign_recipients")
      .select("id, contact_id, company_id")
      .eq("campaign_id", campaignId)
      .eq("status", "pending")
      .order("created_at", { ascending: true })

    if (recipError) {
      return NextResponse.json(
        { error: "Failed to fetch pending recipients" },
        { status: 500 }
      )
    }

    if (!pendingRecipients || pendingRecipients.length === 0) {
      return NextResponse.json({
        message: "No pending recipients to generate",
        generated: 0,
      })
    }

    // Update campaign status to generating
    await supabase
      .from("campaigns")
      .update({ status: "generating", updated_at: new Date().toISOString() })
      .eq("id", campaignId)

    let generated = 0
    let errors = 0

    for (const recipient of pendingRecipients) {
      try {
        // Fetch contact details
        const { data: contact } = await supabase
          .from("contacts")
          .select(
            "first_name, last_name, title, seniority, ai_expertise, ai_outreach_suggestions"
          )
          .eq("id", recipient.contact_id)
          .single()

        if (!contact) {
          console.error(`Contact not found: ${recipient.contact_id}`)
          errors++
          continue
        }

        // Fetch company details
        let companyData = null
        if (recipient.company_id) {
          const { data: company } = await supabase
            .from("companies")
            .select(
              "name, description, differentiators, bioedge_fit, warm_pitch, systems_supported, edge_categories, access_levels, category"
            )
            .eq("id", recipient.company_id)
            .single()

          if (company) {
            // Get events this company has attended
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

        if (!companyData) {
          companyData = {
            name: "Unknown Company",
            description: null,
            differentiators: null,
            bioedge_fit: null,
            warm_pitch: null,
            events: [],
            systems_supported: [],
            edge_categories: [],
            access_levels: [],
            category: null,
          }
        }

        // Generate the email
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
          companyData,
          campaignEvents
        )

        // Simple HTML conversion: wrap lines in paragraphs
        const bodyHtml = body
          .split("\n\n")
          .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
          .join("")

        // Update recipient with generated content
        await supabase
          .from("campaign_recipients")
          .update({
            subject,
            body,
            body_html: bodyHtml,
            status: "generated",
            generated_at: new Date().toISOString(),
          })
          .eq("id", recipient.id)

        generated++

        // Brief delay between API calls (1.5 seconds)
        if (generated < pendingRecipients.length) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }
      } catch (err) {
        console.error(
          `Error generating email for recipient ${recipient.id}:`,
          err
        )
        errors++

        // Update recipient with error
        await supabase
          .from("campaign_recipients")
          .update({
            error:
              err instanceof Error ? err.message : "Generation failed",
          })
          .eq("id", recipient.id)
      }
    }

    // Check if there are still pending recipients
    const { data: remainingPending } = await supabase
      .from("campaign_recipients")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("status", "pending")
      .limit(1)

    // Update campaign status
    const newStatus =
      remainingPending && remainingPending.length > 0
        ? "draft"
        : "ready"

    await supabase
      .from("campaigns")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId)

    return NextResponse.json({
      generated,
      errors,
      total: pendingRecipients.length,
      status: newStatus,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
