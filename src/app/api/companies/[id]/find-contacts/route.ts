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
    let contactsSkipped = 0

    // Create contacts from Hunter emails (50%+ confidence)
    for (const email of hunterData.emails) {
      if (!email.email || email.confidence < 50) {
        contactsSkipped++
        continue
      }

      // Check if contact exists by email
      const { data: existingByEmail } = await supabase
        .from("contacts")
        .select("id")
        .eq("email", email.email)
        .single()

      if (existingByEmail) {
        contactsSkipped++
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

    return NextResponse.json({
      success: true,
      contactsCreated,
      contactsSkipped,
      totalFound: hunterData.emails.length,
      message: contactsCreated > 0
        ? `Found ${contactsCreated} new contact${contactsCreated !== 1 ? "s" : ""}`
        : "No new contacts found (may already exist)",
    })
  } catch (error) {
    console.error("[find-contacts] Hunter.io error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hunter.io search failed" },
      { status: 500 }
    )
  }
}
