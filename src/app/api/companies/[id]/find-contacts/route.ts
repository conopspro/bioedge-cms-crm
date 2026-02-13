import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { hunterService } from "@/lib/services/hunter"

function extractDomain(website: string | null): string | null {
  if (!website) return null
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`)
    return url.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function getDbClient() {
  try {
    return createAdminClient()
  } catch {
    // Fall back to regular client if service role key is not available (local dev)
    return null
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: companyId } = await params
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if Hunter is configured
  if (!hunterService.isConfigured()) {
    return NextResponse.json(
      { error: "Hunter.io API is not configured" },
      { status: 400 }
    )
  }

  // Use admin client if available, otherwise fall back to auth client
  const db = getDbClient() || supabase

  // Get company
  const { data: company, error: fetchError } = await db
    .from("companies")
    .select("id, name, domain, website")
    .eq("id", companyId)
    .single()

  if (fetchError || !company) {
    console.error("[find-contacts] Company fetch error:", fetchError)
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }

  // Get domain (normalize both fields through extractDomain to ensure bare domain)
  const domain = extractDomain(company.domain) || extractDomain(company.website)
  if (!domain) {
    return NextResponse.json(
      { error: "Company has no domain or website. Please add a website URL first." },
      { status: 400 }
    )
  }

  try {
    console.log(`[find-contacts] Searching Hunter.io for domain: ${domain}, companyId: ${companyId}`)

    const hunterData = await hunterService.domainSearch(domain, {
      limit: 50,
    })

    console.log(`[find-contacts] Hunter returned ${hunterData.emails.length} emails (totalResults: ${hunterData.totalResults})`)

    if (hunterData.emails.length === 0) {
      return NextResponse.json({
        success: true,
        contactsCreated: 0,
        contactsLinked: 0,
        contactsSkipped: 0,
        totalFound: 0,
        message: "Hunter.io returned no emails for this domain",
      })
    }

    let contactsCreated = 0
    let contactsLinked = 0
    let contactsSkipped = 0

    for (const hunterEmail of hunterData.emails) {
      const emailAddr = hunterEmail.email
      console.log(`[find-contacts] Processing: ${emailAddr} (confidence: ${hunterEmail.confidence}, name: ${hunterEmail.firstName || "?"} ${hunterEmail.lastName || "?"})`)

      if (!emailAddr || hunterEmail.confidence < 50) {
        console.log(`[find-contacts]   → Skipped: below confidence threshold`)
        contactsSkipped++
        continue
      }

      // Check if contact with this email already exists
      const { data: existingContacts, error: lookupError } = await db
        .from("contacts")
        .select("id, company_id")
        .eq("email", emailAddr)

      if (lookupError) {
        console.error(`[find-contacts]   → Lookup error for ${emailAddr}:`, lookupError)
        contactsSkipped++
        continue
      }

      const existingByEmail = existingContacts && existingContacts.length > 0 ? existingContacts[0] : null

      if (existingByEmail) {
        console.log(`[find-contacts]   → Found existing contact ${existingByEmail.id}, company_id: ${existingByEmail.company_id}`)
        if (existingByEmail.company_id !== companyId) {
          if (!existingByEmail.company_id) {
            // Contact exists but has no company — link them
            const { error: linkError } = await db
              .from("contacts")
              .update({ company_id: companyId })
              .eq("id", existingByEmail.id)

            if (!linkError) {
              contactsLinked++
              console.log(`[find-contacts]   → Linked to company`)
            } else {
              console.error(`[find-contacts]   → Failed to link:`, linkError)
              contactsSkipped++
            }
          } else {
            console.log(`[find-contacts]   → Skipped: belongs to another company (${existingByEmail.company_id})`)
            contactsSkipped++
          }
        } else {
          console.log(`[find-contacts]   → Skipped: already linked to this company`)
          contactsSkipped++
        }
        continue
      }

      const firstName = hunterEmail.firstName || "Unknown"
      const lastName = hunterEmail.lastName || ""

      // Check by name within the same company (only if we have a real name)
      if (firstName !== "Unknown" && lastName) {
        const { data: nameMatches } = await db
          .from("contacts")
          .select("id")
          .eq("company_id", companyId)
          .ilike("first_name", firstName)
          .ilike("last_name", lastName)

        if (nameMatches && nameMatches.length > 0) {
          console.log(`[find-contacts]   → Skipped: name match found (${firstName} ${lastName})`)
          contactsSkipped++
          continue
        }
      }

      // Create new contact
      const insertData = {
        company_id: companyId,
        email: emailAddr,
        first_name: firstName,
        last_name: lastName,
        title: hunterEmail.position || null,
        linkedin_url: hunterEmail.linkedin || null,
        phone: hunterEmail.phone || null,
        source: "hunter",
        outreach_status: "not_contacted",
        show_on_articles: false,
        hunter_confidence: hunterEmail.confidence,
        seniority: hunterEmail.seniority || null,
      }

      console.log(`[find-contacts]   → Inserting new contact: ${firstName} ${lastName} <${emailAddr}>`)

      const { error: contactError } = await db
        .from("contacts")
        .insert(insertData)

      if (!contactError) {
        contactsCreated++
        console.log(`[find-contacts]   → Created successfully`)
      } else {
        console.error(`[find-contacts]   → Insert failed:`, contactError)
        contactsSkipped++
      }
    }

    const totalAdded = contactsCreated + contactsLinked
    let message = ""
    if (totalAdded > 0) {
      const parts: string[] = []
      if (contactsCreated > 0) parts.push(`${contactsCreated} new`)
      if (contactsLinked > 0) parts.push(`${contactsLinked} linked`)
      message = `Found ${parts.join(" and ")} contact${totalAdded !== 1 ? "s" : ""}`
    } else {
      message = "No new contacts found (may already exist)"
    }

    console.log(`[find-contacts] Done: ${contactsCreated} created, ${contactsLinked} linked, ${contactsSkipped} skipped out of ${hunterData.emails.length} total`)

    return NextResponse.json({
      success: true,
      contactsCreated,
      contactsLinked,
      contactsSkipped,
      totalFound: hunterData.emails.length,
      message,
    })
  } catch (error) {
    console.error("[find-contacts] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hunter.io search failed" },
      { status: 500 }
    )
  }
}
