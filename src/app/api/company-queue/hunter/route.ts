import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { hunterService } from "@/lib/services/hunter"

export const maxDuration = 300

/**
 * POST /api/company-queue/hunter
 *
 * Run Hunter.io domain search on the next batch of enriched queue items.
 * Only runs on items where enrich_status = "enriched" AND hunter_status = "pending".
 * Called repeatedly by the frontend until remaining === 0.
 *
 * Body: { batchSize?: number, ids?: string[] }
 *   batchSize - max items to process per call (default 10, max 20)
 *   ids       - optional: limit to these queue IDs (batch scope)
 *
 * Response: { processed, errors, remaining }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json().catch(() => ({}))

    const batchSize = Math.min(20, Math.max(1, body.batchSize ?? 10))
    const scopeIds: string[] | undefined = Array.isArray(body.ids) && body.ids.length > 0
      ? body.ids
      : undefined

    if (!hunterService.isConfigured()) {
      return NextResponse.json(
        { error: "Hunter API key not configured" },
        { status: 500 }
      )
    }

    // Count remaining eligible items
    let countQuery = supabase
      .from("company_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("enrich_status", "enriched")
      .eq("hunter_status", "pending")

    if (scopeIds) countQuery = countQuery.in("id", scopeIds)
    const { count: totalRemaining } = await countQuery

    if (!totalRemaining || totalRemaining === 0) {
      return NextResponse.json({ processed: 0, errors: 0, remaining: 0 })
    }

    // Fetch next batch
    let fetchQuery = supabase
      .from("company_queue")
      .select("id, name, website, domain")
      .eq("status", "pending")
      .eq("enrich_status", "enriched")
      .eq("hunter_status", "pending")
      .order("created_at", { ascending: true })
      .limit(batchSize)

    if (scopeIds) fetchQuery = fetchQuery.in("id", scopeIds)
    const { data: items, error: fetchError } = await fetchQuery

    if (fetchError || !items || items.length === 0) {
      return NextResponse.json({ processed: 0, errors: 0, remaining: totalRemaining })
    }

    // Mark as searching to prevent concurrent re-processing
    await supabase
      .from("company_queue")
      .update({ hunter_status: "searching", updated_at: new Date().toISOString() })
      .in("id", items.map((i) => i.id))

    let processed = 0
    let errors = 0

    for (const item of items) {
      const domain = item.domain || (() => {
        try {
          if (!item.website) return null
          const url = item.website.startsWith("http") ? item.website : `https://${item.website}`
          return new URL(url).hostname.replace(/^www\./, "")
        } catch { return null }
      })()

      if (!domain) {
        await supabase
          .from("company_queue")
          .update({
            hunter_status: "not_found",
            hunter_error: "No domain available",
            hunter_searched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
        processed++
        continue
      }

      try {
        const hunterData = await hunterService.domainSearch(domain, {
          type: "personal",
          limit: 50,
        })

        // Filter to confidence >= 80 before storing
        const contacts = (hunterData.emails || [])
          .filter((e) => e.email && e.confidence >= 80)
          .map((e) => ({
            email: e.email,
            first_name: e.firstName || null,
            last_name: e.lastName || null,
            title: e.position || null,
            confidence: e.confidence,
            seniority: e.seniority || null,
            linkedin: e.linkedin || null,
            phone: e.phone || null,
          }))

        await supabase
          .from("company_queue")
          .update({
            hunter_contacts: contacts.length > 0 ? contacts : null,
            hunter_status: contacts.length > 0 ? "found" : "not_found",
            hunter_error: null,
            hunter_searched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        processed++
      } catch (err) {
        console.error(`[company-queue/hunter] Failed for ${item.name} (${domain}):`, err)
        errors++

        await supabase
          .from("company_queue")
          .update({
            hunter_status: "error",
            hunter_error: err instanceof Error ? err.message : "Hunter search failed",
            hunter_searched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
      }
    }

    // Recount remaining
    let remainQuery = supabase
      .from("company_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("enrich_status", "enriched")
      .eq("hunter_status", "pending")

    if (scopeIds) remainQuery = remainQuery.in("id", scopeIds)
    const { count: remaining } = await remainQuery

    return NextResponse.json({
      processed,
      errors,
      remaining: remaining || 0,
    })
  } catch (error) {
    console.error("[company-queue/hunter]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
