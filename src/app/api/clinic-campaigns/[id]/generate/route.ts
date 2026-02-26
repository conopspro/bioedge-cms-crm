import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { clinicEmailGeneratorService } from "@/lib/services/clinic-email-generator"
import type { ClinicCampaign, SenderProfile } from "@/types/database"
import type { ClinicContext, ClinicCampaignEventContext } from "@/lib/services/clinic-email-generator"

type RouteParams = {
  params: Promise<{ id: string }>
}

const DEFAULT_BATCH_SIZE = 5

/**
 * POST /api/clinic-campaigns/[id]/generate
 *
 * Generate personalized emails for pending recipients in a clinic campaign.
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
        batchSize = Math.min(body.batchSize, 20)
      }
    } catch {
      // No body or invalid JSON — use default batch size
    }

    // Check if clinic email generator is configured
    if (!clinicEmailGeneratorService.isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable." },
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
        { error: "Campaign has no sender profile configured" },
        { status: 400 }
      )
    }

    // Fetch campaign events for AI context
    const { data: campaignEventRows } = await supabase
      .from("clinic_campaign_events")
      .select("events:events(name, start_date, end_date, city, state, slug, registration_url)")
      .eq("clinic_campaign_id", campaignId)

    const campaignEvents: ClinicCampaignEventContext[] = (campaignEventRows || [])
      .map((ce) => ce.events as unknown as ClinicCampaignEventContext)
      .filter(Boolean)

    // Count total pending BEFORE this batch
    const { count: totalPending } = await supabase
      .from("clinic_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("clinic_campaign_id", campaignId)
      .eq("status", "pending")

    // Count already-generated recipients (including errored — they're no longer pending)
    const { count: alreadyGenerated } = await supabase
      .from("clinic_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("clinic_campaign_id", campaignId)
      .in("status", ["generated", "approved", "sent", "delivered", "opened", "clicked", "error"])

    const totalRecipients = (totalPending || 0) + (alreadyGenerated || 0)

    if (!totalPending || totalPending === 0) {
      await supabase
        .from("clinic_campaigns")
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
      .from("clinic_campaign_recipients")
      .select("id, clinic_id")
      .eq("clinic_campaign_id", campaignId)
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

    // Update campaign status to generating
    if (campaign.status !== "generating") {
      await supabase
        .from("clinic_campaigns")
        .update({ status: "generating", updated_at: new Date().toISOString() })
        .eq("id", campaignId)
    }

    let generated = 0
    let errors = 0

    for (const recipient of batchRecipients) {
      try {
        // Fetch clinic details for context
        const { data: clinic } = await supabase
          .from("clinics")
          .select("name, city, state, tags, description, website, google_rating, reviews_count")
          .eq("id", recipient.clinic_id)
          .single()

        if (!clinic) {
          console.error(`Clinic not found: ${recipient.clinic_id}`)
          errors++
          continue
        }

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

        // Generate the email
        const { subject, body } = await clinicEmailGeneratorService.generateEmail(
          campaign as ClinicCampaign,
          senderProfile,
          clinicContext,
          campaignEvents
        )

        // Simple HTML conversion: wrap paragraphs
        const bodyHtml = body
          .split("\n\n")
          .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
          .join("")

        // Update recipient with generated content
        await supabase
          .from("clinic_campaign_recipients")
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
          `Error generating email for clinic recipient ${recipient.id}:`,
          err
        )
        errors++

        // Set status to "error" so this recipient is NOT picked up again on the
        // next batch call — leaving it as "pending" causes an infinite retry loop.
        await supabase
          .from("clinic_campaign_recipients")
          .update({
            status: "error",
            error: err instanceof Error ? err.message : "Generation failed",
          })
          .eq("id", recipient.id)
      }
    }

    // Check remaining pending after this batch
    const { count: remaining } = await supabase
      .from("clinic_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("clinic_campaign_id", campaignId)
      .eq("status", "pending")

    const remainingCount = remaining || 0

    // If no more pending, mark campaign as ready
    if (remainingCount === 0) {
      await supabase
        .from("clinic_campaigns")
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
