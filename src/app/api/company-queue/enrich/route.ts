import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { perplexityService } from "@/lib/services/perplexity"

export const maxDuration = 300

/**
 * POST /api/company-queue/enrich
 *
 * Run Perplexity AI enrichment on the next batch of pending queue items.
 * Called repeatedly by the frontend until remaining === 0.
 *
 * Body: { batchSize?: number, ids?: string[] }
 *   batchSize - max items to process per call (default 3, max 5)
 *   ids       - optional: limit processing to these queue item IDs (batch scope)
 *
 * Response: { processed, errors, remaining }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json().catch(() => ({}))

    const batchSize = Math.min(5, Math.max(1, body.batchSize ?? 3))
    const scopeIds: string[] | undefined = Array.isArray(body.ids) && body.ids.length > 0
      ? body.ids
      : undefined

    if (!perplexityService.isConfigured()) {
      return NextResponse.json(
        { error: "Perplexity API key not configured" },
        { status: 500 }
      )
    }

    // Count remaining pending items (for progress reporting)
    let countQuery = supabase
      .from("company_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("enrich_status", "pending")

    if (scopeIds) countQuery = countQuery.in("id", scopeIds)
    const { count: totalRemaining } = await countQuery

    if (!totalRemaining || totalRemaining === 0) {
      return NextResponse.json({ processed: 0, errors: 0, remaining: 0 })
    }

    // Fetch next batch — mark as "enriching" to prevent double-processing
    let fetchQuery = supabase
      .from("company_queue")
      .select("id, name, website, domain")
      .eq("status", "pending")
      .eq("enrich_status", "pending")
      .order("created_at", { ascending: true })
      .limit(batchSize)

    if (scopeIds) fetchQuery = fetchQuery.in("id", scopeIds)
    const { data: items, error: fetchError } = await fetchQuery

    if (fetchError || !items || items.length === 0) {
      return NextResponse.json({ processed: 0, errors: 0, remaining: totalRemaining })
    }

    // Mark as enriching to prevent concurrent re-processing
    await supabase
      .from("company_queue")
      .update({ enrich_status: "enriching", updated_at: new Date().toISOString() })
      .in("id", items.map((i) => i.id))

    let processed = 0
    let errors = 0

    for (const item of items) {
      try {
        const research = await perplexityService.researchCompany({
          companyName: item.name,
          website: item.website,
        })

        if (!research) {
          throw new Error("Perplexity returned null")
        }

        await supabase
          .from("company_queue")
          .update({
            description: research.description || null,
            category: research.category || null,
            differentiators: research.differentiators || null,
            evidence: research.evidence || null,
            systems_supported: research.systems_supported?.length ? research.systems_supported : null,
            edge_categories: research.edge_categories?.length ? research.edge_categories : null,
            access_levels: research.access_levels?.length ? research.access_levels : null,
            has_affiliate: research.has_affiliate ?? false,
            bioedge_fit: research.bioedge_fit || null,
            description_sources: research.sources?.length ? research.sources : null,
            discovered_contacts: research.discovered_contacts?.length
              ? research.discovered_contacts
              : null,
            enrich_status: "enriched",
            enrich_error: null,
            enriched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        processed++
      } catch (err) {
        console.error(`[company-queue/enrich] Failed for ${item.name}:`, err)
        errors++

        await supabase
          .from("company_queue")
          .update({
            enrich_status: "error",
            enrich_error: err instanceof Error ? err.message : "Enrichment failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
      }
    }

    // Recount remaining after processing
    let remainQuery = supabase
      .from("company_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("enrich_status", "pending")

    if (scopeIds) remainQuery = remainQuery.in("id", scopeIds)
    const { count: remaining } = await remainQuery

    return NextResponse.json({
      processed,
      errors,
      remaining: remaining || 0,
    })
  } catch (error) {
    console.error("[company-queue/enrich]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
