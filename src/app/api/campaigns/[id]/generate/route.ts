import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { emailGeneratorService } from "@/lib/services/email-generator"
import type { Campaign, SenderProfile } from "@/types/database"

type RouteParams = {
  params: Promise<{ id: string }>
}

const DEFAULT_BATCH_SIZE = 5

/**
 * POST /api/campaigns/[id]/generate
 *
 * Generate personalized emails for pending recipients in a campaign.
 * Processes a small batch per request to stay within Vercel's 60s timeout.
 * The frontend calls this repeatedly until all recipients are done.
 *
 * Request body (optional):
 *   { batchSize?: number }  — max recipients to process per call (default: 5)
 *
 * Response:
 *   { generated, errors, remaining, total, status }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()

    // Parse optional batch size from request body
    let batchSize = DEFAULT_BATCH_SIZE
    try {
      const body = await request.json()
      if (body?.batchSize && typeof body.batchSize === "number" && body.batchSize > 0) {
        batchSize = Math.min(body.batchSize, 20) // Cap at 20 to stay safe
      }
    } catch {
      // No body or invalid JSON — use default batch size
    }

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

    // Count total pending BEFORE this batch (for progress tracking)
    const { count: totalPending } = await supabase
      .from("campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .eq("status", "pending")

    // Count already-generated recipients (for progress display)
    const { count: alreadyGenerated } = await supabase
      .from("campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .in("status", ["generated", "approved", "queued", "sent", "delivered", "opened", "clicked"])

    const totalRecipients = (totalPending || 0) + (alreadyGenerated || 0)

    if (!totalPending || totalPending === 0) {
      // Nothing left to generate — mark as ready
      await supabase
        .from("campaigns")
        .update({ status: "ready", updated_at: new Date().toISOString() })
        .eq("id", campaignId)

      return NextResponse.json({
        generated: 0,
        errors: 0,
        remaining: 0,
        total: totalRecipients,
        status: "ready",
      })
    }

    // Get this batch of pending recipients
    const { data: batchRecipients, error: recipError } = await supabase
      .from("campaign_recipients")
      .select("id, contact_id, company_id")
      .eq("campaign_id", campaignId)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(batchSize)

    if (recipError) {
      return NextResponse.json(
        { error: "Failed to fetch pending recipients" },
        { status: 500 }
      )
    }

    if (!batchRecipients || batchRecipients.length === 0) {
      return NextResponse.json({
        generated: 0,
        errors: 0,
        remaining: 0,
        total: totalRecipients,
        status: "ready",
      })
    }

    // Update campaign status to generating (if not already)
    if (campaign.status !== "generating") {
      await supabase
        .from("campaigns")
        .update({ status: "generating", updated_at: new Date().toISOString() })
        .eq("id", campaignId)
    }

    let generated = 0
    let errors = 0

    for (const recipient of batchRecipients) {
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

        // Brief delay between API calls (1 second)
        if (generated < batchRecipients.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
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

    // Check remaining pending after this batch
    const { count: remaining } = await supabase
      .from("campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .eq("status", "pending")

    const remainingCount = remaining || 0

    // If no more pending, mark campaign as ready
    if (remainingCount === 0) {
      await supabase
        .from("campaigns")
        .update({ status: "ready", updated_at: new Date().toISOString() })
        .eq("id", campaignId)
    }

    return NextResponse.json({
      generated,
      errors,
      remaining: remainingCount,
      total: totalRecipients,
      status: remainingCount === 0 ? "ready" : "generating",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
