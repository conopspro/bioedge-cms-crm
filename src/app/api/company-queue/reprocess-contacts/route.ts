import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

/**
 * POST /api/company-queue/reprocess-contacts
 *
 * Re-runs contact creation for approved queue items whose companies
 * have no contacts yet (e.g. after a bulk approve where contact inserts failed).
 *
 * Body: { ids?: string[] }  — optional, scopes to specific queue IDs.
 *                             Omit to process ALL approved items with 0 contacts.
 *
 * Response: { processed, contactsCreated, skipped, errors }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json().catch(() => ({}))
    const { ids } = body as { ids?: string[] }

    // Fetch approved queue items that have contact data and a linked company
    let query = supabase
      .from("company_queue")
      .select("id, name, imported_company_id, discovered_contacts, hunter_contacts")
      .eq("status", "approved")
      .not("imported_company_id", "is", null)

    if (ids && ids.length > 0) {
      query = query.in("id", ids)
    }

    const { data: queueItems, error: fetchError } = await query
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({ processed: 0, contactsCreated: 0, skipped: 0, errors: [] })
    }

    // Find which of these companies already have contacts — skip those
    const companyIds = queueItems.map((q) => q.imported_company_id!) as string[]
    const { data: existingContactRows } = await supabase
      .from("contacts")
      .select("company_id")
      .in("company_id", companyIds)

    const companiesWithContacts = new Set(
      (existingContactRows || []).map((c) => c.company_id)
    )

    const itemsToProcess = queueItems.filter(
      (q) => !companiesWithContacts.has(q.imported_company_id!)
    )

    let contactsCreated = 0
    let skipped = queueItems.length - itemsToProcess.length
    const errors: string[] = []

    for (const item of itemsToProcess) {
      const companyId = item.imported_company_id!
      const contactsToInsert: object[] = []

      // Perplexity contacts — skip any without email (contacts.email is NOT NULL)
      if (Array.isArray(item.discovered_contacts)) {
        for (const contact of item.discovered_contacts as {
          name: string; title?: string; email?: string; linkedin_url?: string
        }[]) {
          if (!contact.name || !contact.email) continue
          const parts = contact.name.trim().split(" ")
          const firstName = parts[0] || contact.email.split("@")[0]
          const lastName = parts.slice(1).join(" ") || "-"
          contactsToInsert.push({
            company_id: companyId,
            name: `${firstName} ${lastName}`.trim(),
            first_name: firstName,
            last_name: lastName,
            title: contact.title || null,
            email: contact.email,
            linkedin_url: contact.linkedin_url || null,
            source: "ai_research",
            outreach_status: "not_contacted",
            show_on_articles: false,
          })
        }
      }

      // Hunter contacts
      if (Array.isArray(item.hunter_contacts)) {
        for (const contact of item.hunter_contacts as {
          email: string; first_name?: string; last_name?: string;
          title?: string; confidence?: number; seniority?: string; linkedin?: string; phone?: string
        }[]) {
          if (!contact.email) continue
          const emailLocal = contact.email.split("@")[0].toLowerCase()
          const GENERIC_LOCALS = new Set(["info","contact","hello","hi","hey","support","help","admin","administrator","office","team","staff","hr","sales","marketing","media","press","pr","enquiries","enquiry","enquire","queries","query","general","mail","email","webmaster","postmaster","noreply","no-reply","donotreply","do-not-reply","billing","finance","accounting","accounts","legal","privacy","security","careers","jobs","recruiting","recruitment","talent","partnerships","partners","affiliate","affiliates","vendor","vendors","ops","operations"])
          if (!contact.first_name && !contact.last_name && GENERIC_LOCALS.has(emailLocal)) continue
          const firstName = contact.first_name || (emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1))
          const lastName = contact.last_name || null
          const fullName = lastName ? `${firstName} ${lastName}`.trim() : firstName
          contactsToInsert.push({
            company_id: companyId,
            name: fullName,
            first_name: firstName,
            last_name: lastName || "-",
            title: contact.title || null,
            email: contact.email,
            linkedin_url: contact.linkedin || null,
            phone: contact.phone || null,
            source: "hunter",
            outreach_status: "not_contacted",
            show_on_articles: false,
            hunter_confidence: contact.confidence || null,
            seniority: contact.seniority || null,
          })
        }
      }

      if (contactsToInsert.length === 0) {
        skipped++
        continue
      }

      // Dedup by email
      const emailsToCheck = contactsToInsert.map((c: any) => c.email).filter(Boolean) as string[]
      const { data: existingByEmail } = emailsToCheck.length > 0
        ? await supabase.from("contacts").select("email").in("email", emailsToCheck)
        : { data: [] }
      const existingEmails = new Set((existingByEmail || []).map((c) => c.email))

      // Dedup by name within company
      const namesSeen = new Set<string>()
      const filtered = contactsToInsert.filter((c: any) => {
        if (c.email && existingEmails.has(c.email)) return false
        const key = `${c.first_name?.toLowerCase()}|${c.last_name?.toLowerCase()}`
        if (namesSeen.has(key)) return false
        namesSeen.add(key)
        return true
      })

      if (filtered.length > 0) {
        const { data: inserted, error: contactError } = await supabase
          .from("contacts")
          .insert(filtered)
          .select("id")

        if (contactError) {
          errors.push(`${item.name}: ${contactError.message}`)
        } else {
          contactsCreated += inserted?.length || 0
        }
      }
    }

    return NextResponse.json({
      processed: itemsToProcess.length,
      contactsCreated,
      skipped,
      errors,
    })
  } catch (error) {
    console.error("[company-queue/reprocess-contacts]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
