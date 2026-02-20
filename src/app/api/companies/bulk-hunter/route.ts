import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { hunterService } from "@/lib/services/hunter"

export const maxDuration = 300

/**
 * POST /api/companies/bulk-hunter
 *
 * Run Hunter.io domain search directly on a batch of existing companies
 * and store results into the contacts table.
 *
 * Used by the Companies Table "Run Hunter" bulk action after filtering
 * by "Added Within" to enrich newly imported companies that have no contacts.
 *
 * Body:
 *   ids        - array of company IDs to process (required)
 *   batchSize  - max companies per call (default 5, max 10)
 *               Frontend loops calling this until remaining === 0
 *
 * Response: { processed, contactsCreated, skipped, errors, remaining }
 *   remaining - count of provided IDs that still have 0 contacts after this batch
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json().catch(() => ({}))

    const { ids, batchSize: rawBatchSize } = body as {
      ids?: string[]
      batchSize?: number
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 })
    }

    if (!hunterService.isConfigured()) {
      return NextResponse.json({ error: "Hunter API key not configured" }, { status: 500 })
    }

    const batchSize = Math.min(10, Math.max(1, rawBatchSize ?? 5))

    // `attempted` is the set of IDs the frontend has already sent to us in prior calls.
    // We exclude these so we don't re-process them and so `remaining` converges to 0
    // even for companies where Hunter finds nothing (no domain, 0 results, all duped).
    const attempted: string[] = Array.isArray(body.attempted) ? body.attempted : []
    const attemptedSet = new Set(attempted)

    const notYetAttempted = ids.filter((id) => !attemptedSet.has(id))

    if (notYetAttempted.length === 0) {
      return NextResponse.json({
        processed: 0,
        contactsCreated: 0,
        skipped: 0,
        errors: [],
        remaining: 0,
        attemptedIds: [],
      })
    }

    // Take next batch
    const batch = notYetAttempted.slice(0, batchSize)

    // Fetch company records for this batch
    const { data: companies, error: fetchError } = await supabase
      .from("companies")
      .select("id, name, website, domain")
      .in("id", batch)

    if (fetchError || !companies || companies.length === 0) {
      return NextResponse.json({
        error: fetchError?.message || "Failed to fetch companies",
      }, { status: 500 })
    }

    let processed = 0
    let contactsCreated = 0
    let skipped = 0
    const errors: string[] = []

    for (const company of companies) {
      // Derive domain from stored field or website
      const domain = company.domain || (() => {
        try {
          if (!company.website) return null
          const url = company.website.startsWith("http")
            ? company.website
            : `https://${company.website}`
          return new URL(url).hostname.replace(/^www\./, "")
        } catch { return null }
      })()

      if (!domain) {
        skipped++
        processed++
        continue
      }

      try {
        const hunterData = await hunterService.domainSearch(domain, {
          type: "personal",
          limit: 50,
        })

        // Filter to confidence >= 80
        const contacts = (hunterData.emails || []).filter(
          (e) => e.email && e.confidence >= 80
        )

        if (contacts.length === 0) {
          skipped++
          processed++
          continue
        }

        // Build contact rows
        const contactRows = contacts.map((e) => {
          const firstName = e.firstName || "Unknown"
          const lastName = e.lastName || "-"
          return {
            company_id: company.id,
            name: `${firstName} ${lastName}`.trim(),
            first_name: firstName,
            last_name: lastName,
            title: e.position || null,
            email: e.email,
            linkedin_url: e.linkedin || null,
            phone: e.phone || null,
            source: "hunter" as const,
            outreach_status: "not_contacted",
            show_on_articles: false,
            hunter_confidence: e.confidence,
            seniority: e.seniority || null,
          }
        })

        // Dedup by email against existing contacts table
        const emailsToCheck = contactRows.map((c) => c.email).filter(Boolean)
        const { data: existingByEmail } = emailsToCheck.length > 0
          ? await supabase.from("contacts").select("email").in("email", emailsToCheck)
          : { data: [] }
        const existingEmails = new Set((existingByEmail || []).map((c) => c.email))

        // Dedup by name within company
        const namesSeen = new Set<string>()
        const filtered = contactRows.filter((c) => {
          if (existingEmails.has(c.email)) return false
          const key = `${c.first_name?.toLowerCase()}|${c.last_name?.toLowerCase()}`
          if (namesSeen.has(key)) return false
          namesSeen.add(key)
          return true
        })

        if (filtered.length === 0) {
          skipped++
          processed++
          continue
        }

        const { data: inserted, error: insertError } = await supabase
          .from("contacts")
          .insert(filtered)
          .select("id")

        if (insertError) {
          errors.push(`${company.name}: ${insertError.message}`)
        } else {
          contactsCreated += inserted?.length || 0
        }

        processed++
      } catch (err) {
        console.error(`[companies/bulk-hunter] Failed for ${company.name} (${domain}):`, err)
        errors.push(`${company.name}: ${err instanceof Error ? err.message : "Hunter search failed"}`)
        processed++
      }
    }

    // IDs processed in this batch — frontend accumulates these across calls
    const attemptedIds = companies.map((c) => c.id)
    const totalAttempted = attempted.length + attemptedIds.length
    const remaining = ids.length - totalAttempted

    return NextResponse.json({
      processed,
      contactsCreated,
      skipped,
      errors,
      remaining: Math.max(0, remaining),
      attemptedIds,
    })
  } catch (error) {
    console.error("[companies/bulk-hunter]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
