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

        // Generic role-based email local-parts that aren't real people
        const GENERIC_LOCALS = new Set([
          "info","contact","hello","hi","hey","support","help","admin","administrator",
          "office","team","staff","hr","sales","marketing","media","press","pr",
          "enquiries","enquiry","enquire","queries","query","general","mail","email",
          "webmaster","postmaster","noreply","no-reply","donotreply","do-not-reply",
          "billing","finance","accounting","accounts","legal","privacy","security",
          "careers","jobs","recruiting","recruitment","talent","partnerships",
          "partners","affiliate","affiliates","vendor","vendors","ops","operations",
        ])

        // Filter to confidence >= 80, then skip emails that would produce no usable name:
        // - Hunter has no first/last name AND
        // - the email local-part is a generic role address
        const contacts = (hunterData.emails || []).filter((e) => {
          if (!e.email || e.confidence < 80) return false
          if (!e.firstName && !e.lastName) {
            const local = e.email.split("@")[0].toLowerCase()
            if (GENERIC_LOCALS.has(local)) return false
          }
          return true
        })

        if (contacts.length === 0) {
          skipped++
          processed++
          continue
        }

        // Build contact rows.
        // When Hunter has no name, use the email local-part capitalised as first_name.
        // We never store "Unknown" — generic locals are already filtered out above.
        const contactRows = contacts.map((e) => {
          const emailLocal = e.email ? e.email.split("@")[0] : null
          const firstName = e.firstName || (emailLocal
            ? emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1)
            : null)
          if (!firstName) return null
          const lastName = e.lastName || null
          const fullName = lastName ? `${firstName} ${lastName}`.trim() : firstName
          return {
            company_id: company.id,
            name: fullName,
            first_name: firstName,
            last_name: lastName || null,
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
        }).filter((r): r is NonNullable<typeof r> => r !== null)

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
