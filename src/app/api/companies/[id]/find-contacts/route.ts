import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
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

  // Get company
  const { data: company, error: fetchError } = await supabase
    .from("companies")
    .select("id, name, domain, website")
    .eq("id", companyId)
    .single()

  if (fetchError || !company) {
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
    console.log(`[find-contacts] Running Hunter.io search for domain: ${domain}`)

    const hunterData = await hunterService.domainSearch(domain, {
      limit: 50,
    })

    let contactsCreated = 0
    let contactsLinked = 0
    let contactsSkipped = 0

    console.log(`[find-contacts] Hunter returned ${hunterData.emails.length} emails for ${domain}`)

    // Create contacts from Hunter emails (50%+ confidence)
    for (const email of hunterData.emails) {
      if (!email.email || email.confidence < 50) {
        console.log(`[find-contacts] Skipping ${email.email || "(no email)"}: confidence ${email.confidence}`)
        contactsSkipped++
        continue
      }

      // Check if contact with this email already exists
      const { data: existingByEmail } = await supabase
        .from("contacts")
        .select("id, company_id")
        .eq("email", email.email)
        .single()

      if (existingByEmail) {
        // If the contact exists but is NOT linked to this company, link them
        if (existingByEmail.company_id !== companyId) {
          // Only update if the contact has no company (don't steal from another company)
          if (!existingByEmail.company_id) {
            const { error: linkError } = await supabase
              .from("contacts")
              .update({ company_id: companyId })
              .eq("id", existingByEmail.id)

            if (!linkError) {
              contactsLinked++
              console.log(`[find-contacts] Linked existing contact ${email.email} to company`)
            } else {
              console.error("Failed to link contact:", linkError)
              contactsSkipped++
            }
          } else {
            console.log(`[find-contacts] Skipping ${email.email}: belongs to another company`)
            contactsSkipped++
          }
        } else {
          // Already linked to this company
          contactsSkipped++
        }
        continue
      }

      const firstName = email.firstName || "Unknown"
      const lastName = email.lastName || ""

      // Also check by name within the same company (only if we have a real name)
      if (firstName !== "Unknown" && lastName) {
        const { data: existingByName } = await supabase
          .from("contacts")
          .select("id")
          .eq("company_id", companyId)
          .ilike("first_name", firstName)
          .ilike("last_name", lastName)
          .single()

        if (existingByName) {
          contactsSkipped++
          continue
        }
      }

      // Create new contact
      const { error: contactError } = await supabase
        .from("contacts")
        .insert({
          company_id: companyId,
          email: email.email,
          first_name: firstName,
          last_name: lastName,
          title: email.position || null,
          linkedin_url: email.linkedin || null,
          phone: email.phone || null,
          source: "hunter",
          outreach_status: "not_contacted",
          show_on_articles: false,
          hunter_confidence: email.confidence,
          seniority: email.seniority || null,
        })

      if (!contactError) {
        contactsCreated++
      } else {
        console.error("Failed to create contact:", contactError)
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
    console.error("[find-contacts] Hunter.io error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hunter.io search failed" },
      { status: 500 }
    )
  }
}
