import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * POST /api/company-queue/approve
 *
 * Approve selected queue items: inserts into companies table (is_draft: true)
 * and creates contacts from Perplexity + Hunter results (all show_on_articles: false).
 *
 * Body: { ids: string[] }
 *
 * Response: { processed, companiesCreated, contactsCreated, skipped, errors }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 })
    }

    // Fetch the queue items to approve
    const { data: items, error: fetchError } = await supabase
      .from("company_queue")
      .select("*")
      .in("id", ids)
      .eq("status", "pending")

    if (fetchError || !items || items.length === 0) {
      return NextResponse.json({ error: "No eligible items found" }, { status: 404 })
    }

    // Re-check for duplicates (safety — domain may have been added since import)
    const domains = items.map((i) => i.domain).filter(Boolean) as string[]
    const { data: existingCompanies } = domains.length > 0
      ? await supabase.from("companies").select("domain, id").in("domain", domains)
      : { data: [] }

    const existingDomainMap = new Map(
      (existingCompanies || []).map((c) => [c.domain, c.id])
    )

    // Fetch all existing slugs that share prefixes with our new company names
    const baseSlugs = items.map((item) => generateSlug(item.name))
    const { data: existingSlugRows } = await supabase
      .from("companies")
      .select("slug")
      .or(baseSlugs.map((b) => `slug.like.${b}%`).join(","))

    const existingSlugs = new Set((existingSlugRows || []).map((c) => c.slug))
    const assignedThisBatch = new Set<string>()

    const skipped: { name: string; reason: string }[] = []
    const companyRows: object[] = []
    const itemsToInsert: typeof items = []

    for (const item of items) {
      // Skip duplicates
      if (item.domain && existingDomainMap.has(item.domain)) {
        skipped.push({ name: item.name, reason: "Domain already exists in companies" })
        continue
      }

      // Generate unique slug
      const base = generateSlug(item.name)
      let slug = base
      if (existingSlugs.has(slug) || assignedThisBatch.has(slug)) {
        let suffix = 2
        while (existingSlugs.has(`${base}-${suffix}`) || assignedThisBatch.has(`${base}-${suffix}`)) {
          suffix++
        }
        slug = `${base}-${suffix}`
      }
      assignedThisBatch.add(slug)

      companyRows.push({
        name: item.name,
        slug,
        website: item.website || null,
        domain: item.domain || null,
        description: item.description || null,
        category: item.category || null,
        differentiators: item.differentiators || null,
        evidence: item.evidence || null,
        systems_supported: item.systems_supported || [],
        edge_categories: item.edge_categories || [],
        access_levels: item.access_levels || [],
        has_affiliate: item.has_affiliate ?? false,
        bioedge_fit: item.bioedge_fit || null,
        description_sources: item.description_sources || null,
        status: "researching",
        is_draft: true,
        researched_at: item.enriched_at || new Date().toISOString(),
        events: item.source_event ? [item.source_event] : [],
      })
      itemsToInsert.push(item)
    }

    if (companyRows.length === 0) {
      return NextResponse.json({
        processed: 0,
        companiesCreated: 0,
        contactsCreated: 0,
        skipped,
        errors: [],
      })
    }

    // Bulk insert all companies
    const { data: insertedCompanies, error: insertError } = await supabase
      .from("companies")
      .insert(companyRows)
      .select("id, slug, domain")

    if (insertError) {
      return NextResponse.json(
        { error: `Company insert failed: ${insertError.message}` },
        { status: 500 }
      )
    }

    const companiesCreated = insertedCompanies?.length || 0

    // Build slug → company mapping for contact creation and queue update
    const slugToCompany = new Map(
      (insertedCompanies || []).map((c) => [c.slug, c])
    )

    let contactsCreated = 0
    const errors: string[] = []
    const now = new Date().toISOString()

    // Create contacts and update queue items per company
    for (let i = 0; i < itemsToInsert.length; i++) {
      const item = itemsToInsert[i]
      const slug = assignedThisBatch.has(generateSlug(item.name))
        // Find which slug was assigned — iterate to match by position
        ? Array.from(assignedThisBatch)[i]
        : generateSlug(item.name)

      // Find the inserted company by matching the queue item's position
      const insertedCompany = insertedCompanies?.[i]
      if (!insertedCompany) continue

      const companyId = insertedCompany.id
      const contactsToInsert: object[] = []

      // Collect Perplexity contacts (email is NOT NULL in contacts table — skip rows without one)
      if (Array.isArray(item.discovered_contacts)) {
        for (const contact of item.discovered_contacts as {
          name: string; title?: string; email?: string; linkedin_url?: string
        }[]) {
          if (!contact.name) continue
          if (!contact.email) continue  // contacts table requires email NOT NULL
          const parts = contact.name.trim().split(" ")
          const firstName = parts[0] || contact.email.split("@")[0]
          const lastName = parts.slice(1).join(" ") || null
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

      // Collect Hunter contacts (confidence already filtered to >= 80 at search time)
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
            last_name: lastName || null,
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

      if (contactsToInsert.length === 0) continue

      // Dedup by email: fetch any existing emails before inserting
      const emailsToCheck = contactsToInsert
        .map((c: any) => c.email)
        .filter(Boolean) as string[]

      const { data: existingByEmail } = emailsToCheck.length > 0
        ? await supabase.from("contacts").select("email").in("email", emailsToCheck)
        : { data: [] }

      const existingEmails = new Set((existingByEmail || []).map((c) => c.email))

      // Also dedup by name within this company
      const namesSeen = new Set<string>()
      const { data: existingByName } = await supabase
        .from("contacts")
        .select("first_name, last_name")
        .eq("company_id", companyId)

      for (const c of existingByName || []) {
        namesSeen.add(`${c.first_name?.toLowerCase()}|${c.last_name?.toLowerCase()}`)
      }

      const filtered = contactsToInsert.filter((c: any) => {
        if (c.email && existingEmails.has(c.email)) return false
        const nameKey = `${c.first_name?.toLowerCase()}|${c.last_name?.toLowerCase()}`
        if (namesSeen.has(nameKey)) return false
        namesSeen.add(nameKey)
        return true
      })

      if (filtered.length > 0) {
        const { data: insertedContacts, error: contactError } = await supabase
          .from("contacts")
          .insert(filtered)
          .select("id")

        if (contactError) {
          errors.push(`Contacts for ${item.name}: ${contactError.message}`)
        } else {
          contactsCreated += insertedContacts?.length || 0
        }
      }
    }

    // Bulk update queue items to approved
    const approvedIds = itemsToInsert.map((item, i) => ({
      id: item.id,
      companyId: insertedCompanies?.[i]?.id,
    }))

    await Promise.all(
      approvedIds.map(({ id, companyId }) =>
        supabase
          .from("company_queue")
          .update({
            status: "approved",
            imported_company_id: companyId || null,
            imported_at: now,
            updated_at: now,
          })
          .eq("id", id)
      )
    )

    return NextResponse.json({
      processed: itemsToInsert.length,
      companiesCreated,
      contactsCreated,
      skipped,
      errors,
    })
  } catch (error) {
    console.error("[company-queue/approve]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
