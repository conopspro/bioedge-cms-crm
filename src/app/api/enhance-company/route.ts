import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { perplexityService } from "@/lib/services/perplexity"
import { hunterService } from "@/lib/services/hunter"

/**
 * POST /api/enhance-company
 *
 * Single-action company enhancement that:
 * 1. Perplexity AI research for description, differentiators, evidence, systems
 * 2. Hunter.io domain search to find and create contacts
 *
 * This is the ONLY place Hunter.io is used - for finding contacts for companies.
 */
export async function POST(request: NextRequest) {
  try {
    const { companyId } = await request.json()

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      )
    }

    // Check if Perplexity is configured
    if (!perplexityService.isConfigured()) {
      return NextResponse.json(
        { error: "Perplexity API key not configured. Set PERPLEXITY_API_KEY environment variable." },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    // Fetch company
    const { data: company, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single()

    if (fetchError || !company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      )
    }

    console.log(`[enhance-company] Starting enhancement for: ${company.name} (ID: ${companyId})`)
    console.log(`[enhance-company] Company website: ${company.website || 'none'}, domain: ${company.domain || 'none'}`)

    // Research the company using Perplexity
    const research = await perplexityService.researchCompany({
      companyName: company.name,
      website: company.website || (company.domain ? `https://${company.domain}` : null),
      category: company.category,
    })

    if (!research) {
      console.error(`[enhance-company] Perplexity returned null for ${company.name}`)
      return NextResponse.json(
        { error: "Failed to research company. Please try again." },
        { status: 500 }
      )
    }

    console.log(`[enhance-company] Perplexity research completed for ${company.name}`)
    console.log(`[enhance-company] Research results:`, {
      hasDescription: !!research.description,
      descriptionLength: research.description?.length || 0,
      hasDifferentiators: !!research.differentiators,
      differentiatorsLength: research.differentiators?.length || 0,
      hasEvidence: !!research.evidence,
      evidenceLength: research.evidence?.length || 0,
      systemsCount: research.systems_supported?.length || 0,
      contactsCount: research.discovered_contacts?.length || 0,
      sourcesCount: research.sources?.length || 0,
    })

    // Build update data - always update with fresh AI research
    const updateData: Record<string, unknown> = {}
    const fieldsUpdated: string[] = []

    // Always update description with fresh research
    if (research.description) {
      updateData.description = research.description
      fieldsUpdated.push("description")
    }

    // Always update differentiators with fresh research
    if (research.differentiators) {
      updateData.differentiators = research.differentiators
      fieldsUpdated.push("differentiators")
    }

    // Always update evidence with fresh research
    if (research.evidence) {
      updateData.evidence = research.evidence
      fieldsUpdated.push("evidence")
    }

    // Update systems supported - merge existing with new, keeping unique values
    if (research.systems_supported && research.systems_supported.length > 0) {
      if (company.systems_supported && company.systems_supported.length > 0) {
        // Merge systems, keeping unique values
        const mergedSystems = [...new Set([...company.systems_supported, ...research.systems_supported])]
        updateData.systems_supported = mergedSystems
        fieldsUpdated.push("systems_supported (merged)")
      } else {
        updateData.systems_supported = research.systems_supported
        fieldsUpdated.push("systems_supported")
      }
    }

    // Update EDGE categories - merge existing with new
    if (research.edge_categories && research.edge_categories.length > 0) {
      const existingEdge = company.edge_categories || []
      const mergedEdge = [...new Set([...existingEdge, ...research.edge_categories])]
      updateData.edge_categories = mergedEdge
      fieldsUpdated.push("edge_categories")
    }

    // Update access levels - merge existing with new
    if (research.access_levels && research.access_levels.length > 0) {
      const existingAccess = company.access_levels || []
      const mergedAccess = [...new Set([...existingAccess, ...research.access_levels])]
      updateData.access_levels = mergedAccess
      fieldsUpdated.push("access_levels")
    }

    // Update affiliate flag (true wins)
    if (research.has_affiliate === true) {
      updateData.has_affiliate = true
      fieldsUpdated.push("has_affiliate")
    }

    // Always update sources if we have them
    if (research.sources && research.sources.length > 0) {
      updateData.description_sources = research.sources
      fieldsUpdated.push("description_sources")
    }

    // Update company if we have changes
    console.log(`[enhance-company] Fields to update:`, fieldsUpdated)
    console.log(`[enhance-company] Update data keys:`, Object.keys(updateData))

    if (Object.keys(updateData).length > 0) {
      console.log(`[enhance-company] Updating company ${companyId} in database...`)
      const { data: updateResult, error: updateError } = await supabase
        .from("companies")
        .update(updateData)
        .eq("id", companyId)
        .select()

      if (updateError) {
        console.error(`[enhance-company] Database update failed:`, updateError)
        return NextResponse.json(
          { error: `Failed to update company: ${updateError.message}` },
          { status: 500 }
        )
      }

      console.log(`[enhance-company] Database update successful for ${company.name}`)
      console.log(`[enhance-company] Updated record:`, updateResult?.[0] ? 'received' : 'not returned')
    } else {
      console.log(`[enhance-company] No update data to save - this should not happen if research returned data`)
    }

    // Create contacts for discovered people from Perplexity
    let contactsCreated = 0
    let contactsFromPerplexity = 0
    let contactsFromHunter = 0

    if (research.discovered_contacts && research.discovered_contacts.length > 0) {
      for (const contact of research.discovered_contacts) {
        // Check if contact already exists (by name and company)
        const nameParts = contact.name.split(" ")
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(" ") || nameParts[0]

        const { data: existingContact } = await supabase
          .from("contacts")
          .select("id")
          .eq("company_id", companyId)
          .ilike("first_name", firstName)
          .ilike("last_name", lastName)
          .single()

        if (!existingContact) {
          // Create new contact
          const { error: contactError } = await supabase
            .from("contacts")
            .insert({
              company_id: companyId,
              first_name: firstName,
              last_name: lastName,
              title: contact.title || null,
              email: contact.email || null,
              linkedin_url: contact.linkedin_url || null,
              source: "ai_research",
              show_on_articles: true, // Mark as key person by default
            })

          if (!contactError) {
            contactsCreated++
            contactsFromPerplexity++
          } else {
            console.error("Failed to create contact:", contactError)
          }
        }
      }
    }

    // Hunter.io contact search - find contacts by domain
    const domain = company.domain || extractDomain(company.website)
    if (hunterService.isConfigured() && domain) {
      try {
        console.log(`[enhance-company] Running Hunter.io search for domain: ${domain}`)
        const hunterData = await hunterService.domainSearch(domain, {
          type: "personal",
          limit: 50,
        })

        // Create contacts from Hunter emails (80%+ confidence)
        for (const email of hunterData.emails) {
          if (!email.email || email.confidence < 80) {
            continue
          }

          // Check if contact exists by email
          const { data: existingByEmail } = await supabase
            .from("contacts")
            .select("id")
            .eq("email", email.email)
            .single()

          if (!existingByEmail) {
            const firstName = email.firstName || "Unknown"
            const lastName = email.lastName || ""

            // Also check by name
            const { data: existingByName } = await supabase
              .from("contacts")
              .select("id")
              .eq("company_id", companyId)
              .ilike("first_name", firstName)
              .ilike("last_name", lastName || firstName)
              .single()

            if (!existingByName) {
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
                contactsFromHunter++
              }
            }
          }
        }

        if (contactsFromHunter > 0) {
          fieldsUpdated.push(`${contactsFromHunter} contacts from Hunter`)
        }
        console.log(`[enhance-company] Hunter found ${hunterData.emails.length} emails, created ${contactsFromHunter} contacts`)
      } catch (hunterError) {
        console.error(`[enhance-company] Hunter.io error:`, hunterError)
        fieldsUpdated.push("Hunter.io search failed")
      }
    } else if (!domain) {
      console.log(`[enhance-company] Skipping Hunter - no domain available`)
    } else {
      console.log(`[enhance-company] Skipping Hunter - not configured`)
    }

    // Fetch updated company data to return
    const { data: updatedCompany } = await supabase
      .from("companies")
      .select("description, differentiators, evidence, systems_supported")
      .eq("id", companyId)
      .single()

    return NextResponse.json({
      success: true,
      fieldsUpdated,
      contactsCreated,
      sources: research.sources,
      updatedCompany,
    })

  } catch (error) {
    console.error("Company enhancement error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enhancement failed" },
      { status: 500 }
    )
  }
}

/**
 * Extract domain from a URL
 */
function extractDomain(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}
