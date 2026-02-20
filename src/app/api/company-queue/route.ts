import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const normalized = url.startsWith("http") ? url : `https://${url}`
    const parsed = new URL(normalized)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

/**
 * GET /api/company-queue
 *
 * List company queue items with optional filtering and pagination.
 *
 * Query params:
 *   status          - filter by queue status (pending | approved | rejected)
 *   enrich_status   - filter by enrich status
 *   hunter_status   - filter by hunter status
 *   q               - search by company name
 *   ids             - comma-separated list of IDs (for scoping to a batch)
 *   page            - page number (1-based, default 1)
 *   pageSize        - items per page (default 50, max 200)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const enrichStatus = searchParams.get("enrich_status")
    const hunterStatus = searchParams.get("hunter_status")
    const q = searchParams.get("q")
    const ids = searchParams.get("ids")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") || "50")))
    const offset = (page - 1) * pageSize

    let query = supabase
      .from("company_queue")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (status) query = query.eq("status", status)
    if (enrichStatus) query = query.eq("enrich_status", enrichStatus)
    if (hunterStatus) query = query.eq("hunter_status", hunterStatus)
    if (q) query = query.ilike("name", `%${q}%`)
    if (ids) {
      const idList = ids.split(",").map((id) => id.trim()).filter(Boolean)
      if (idList.length > 0) query = query.in("id", idList)
    }

    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      items: data || [],
      total: count || 0,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("[company-queue GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/company-queue
 *
 * Bulk-insert company queue items from a CSV parse result.
 *
 * Body: { companies: Array<{ name: string, website: string }> }
 *
 * Dedup logic:
 *   - Skip if domain already exists in companies table
 *   - Skip if name already exists in companies table (case-insensitive)
 *   - Skip if domain already pending/approved in company_queue
 *
 * Response: { inserted: number, duplicates: Array<{ name, website, reason }> }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { companies } = body as { companies: { name: string; website: string; event?: string }[] }

    if (!Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json({ error: "companies array is required" }, { status: 400 })
    }

    // Build domain list for dedup checks
    const domainsToInsert = companies.map((c) => extractDomain(c.website)).filter(Boolean) as string[]
    const namesToInsert = companies.map((c) => c.name.toLowerCase().trim())

    // Fetch existing companies matching these domains or names
    const [existingByDomain, existingByName, queueByDomain] = await Promise.all([
      domainsToInsert.length > 0
        ? supabase.from("companies").select("domain, name").in("domain", domainsToInsert)
        : Promise.resolve({ data: [] }),
      supabase.from("companies").select("name"),
      domainsToInsert.length > 0
        ? supabase
            .from("company_queue")
            .select("domain, name")
            .in("domain", domainsToInsert)
            .in("status", ["pending", "approved"])
        : Promise.resolve({ data: [] }),
    ])

    const existingDomains = new Set(
      (existingByDomain.data || []).map((c) => c.domain).filter(Boolean)
    )
    const existingNames = new Set(
      (existingByName.data || []).map((c) => c.name.toLowerCase().trim())
    )
    const queuedDomains = new Set(
      (queueByDomain.data || []).map((c) => c.domain).filter(Boolean)
    )

    const toInsert: object[] = []
    const duplicates: { name: string; website: string; reason: string }[] = []

    for (const company of companies) {
      const domain = extractDomain(company.website)
      const nameLower = company.name.toLowerCase().trim()

      if (domain && existingDomains.has(domain)) {
        duplicates.push({ name: company.name, website: company.website, reason: "Domain already exists in companies" })
        continue
      }
      if (existingNames.has(nameLower)) {
        duplicates.push({ name: company.name, website: company.website, reason: "Company name already exists" })
        continue
      }
      if (domain && queuedDomains.has(domain)) {
        duplicates.push({ name: company.name, website: company.website, reason: "Already in import queue" })
        continue
      }

      toInsert.push({
        name: company.name.trim(),
        website: company.website?.trim() || null,
        domain,
        source_event: company.event?.trim() || null,
      })

      // Track in-batch to prevent duplicate rows from same CSV
      if (domain) queuedDomains.add(domain)
      existingNames.add(nameLower)
    }

    if (toInsert.length === 0) {
      return NextResponse.json({ inserted: 0, duplicates, ids: [] })
    }

    const { data: inserted, error: insertError } = await supabase
      .from("company_queue")
      .insert(toInsert)
      .select("id")

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      inserted: inserted?.length || 0,
      duplicates,
      ids: (inserted || []).map((r) => r.id),
    })
  } catch (error) {
    console.error("[company-queue POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/company-queue
 *
 * Permanently remove queue items (only pending/error rows — never approved).
 *
 * Body: { ids: string[] }
 * Response: { deleted: number }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("company_queue")
      .delete()
      .in("id", ids)
      .in("status", ["pending", "rejected"])  // never delete approved rows
      .select("id")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ deleted: data?.length || 0 })
  } catch (error) {
    console.error("[company-queue DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
