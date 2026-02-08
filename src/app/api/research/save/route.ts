import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { CompanyResearchOutput, CompanyResearchInput } from "@/types/database"

/**
 * Generate a URL-friendly slug from company name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Trim hyphens from start/end
}

/**
 * Extract domain from a URL
 */
function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

interface SaveResearchBody {
  input: CompanyResearchInput & { existing_company_id?: string }
  research: CompanyResearchOutput
  createArticle: boolean
  createContact: boolean
}

/**
 * POST /api/research/save
 *
 * Save research results to the database:
 * - Creates the company record
 * - Optionally creates the contact
 * - Optionally creates the article draft
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: SaveResearchBody = await request.json()
    const { input, research, createArticle, createContact } = body

    // Debug logging
    console.log("=== RESEARCH SAVE DEBUG ===")
    console.log("createArticle:", createArticle)
    console.log("createContact:", createContact)
    console.log("input.contact_first_name:", input.contact_first_name)
    console.log("input.contact_last_name:", input.contact_last_name)
    console.log("input.contact_email:", input.contact_email)
    console.log("input.contact_phone:", input.contact_phone)
    console.log("input.contact_linkedin_url:", input.contact_linkedin_url)
    console.log("input.contact_youtube_channel_url:", input.contact_youtube_channel_url)
    console.log("research.article_title:", research.article_title ? "present" : "MISSING")
    console.log("research.article_content:", research.article_content ? `${research.article_content.length} chars` : "MISSING")
    console.log("research.discovered_contacts:", research.discovered_contacts?.length || 0)
    console.log("===========================")

    // Validate required fields
    if (!research.company_name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      )
    }

    // 1. Create or update the company
    // Auto-generate slug from company name
    const slug = generateSlug(research.company_name)
    // Auto-extract domain from website
    const domain = extractDomain(input.website)

    let company: any
    let companyError: any

    if (input.existing_company_id) {
      // Update existing company - use maybeSingle() to handle case where company doesn't exist
      const { data: existingCompany, error: fetchError } = await supabase
        .from("companies")
        .select("events")
        .eq("id", input.existing_company_id)
        .maybeSingle()

      if (fetchError) {
        console.error("Error fetching existing company:", fetchError)
        return NextResponse.json(
          { error: "Failed to fetch existing company: " + fetchError.message },
          { status: 500 }
        )
      }

      if (!existingCompany) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        )
      }

      // Merge events (add new event if not already present)
      const existingEvents = existingCompany?.events || []
      const updatedEvents = existingEvents.includes(input.event)
        ? existingEvents
        : [...existingEvents, input.event]

      const { data, error } = await supabase
        .from("companies")
        .update({
          description: research.description,
          category: research.category,
          systems_supported: research.systems_supported,
          differentiators: research.differentiators,
          evidence: research.evidence,
          bioedge_fit: research.bioedge_fit,
          warm_pitch: research.warm_pitch,
          research_notes: research.research_notes,
          researched_at: new Date().toISOString(),
          events: updatedEvents,
        })
        .eq("id", input.existing_company_id)
        .select()
        .single()

      company = data
      companyError = error
    } else {
      // Create new company
      const { data, error } = await supabase
        .from("companies")
        .insert({
          name: research.company_name,
          website: input.website,
          domain: domain,
          slug: slug,
          description: research.description,
          analysis: null, // Can be filled later
          status: "researching",
          events: [input.event],
          category: research.category,
          systems_supported: research.systems_supported,
          differentiators: research.differentiators,
          evidence: research.evidence,
          bioedge_fit: research.bioedge_fit,
          warm_pitch: research.warm_pitch,
          research_notes: research.research_notes,
          researched_at: new Date().toISOString(),
        })
        .select()
        .single()

      company = data
      companyError = error
    }

    if (companyError) {
      console.error("Error saving company:", companyError)
      return NextResponse.json(
        { error: "Failed to save company: " + companyError.message },
        { status: 500 }
      )
    }

    let contactId: string | null = null
    let articleId: string | null = null
    let contactsCreated = 0
    let contactError: string | null = null

    // 2. Optionally create contacts
    if (createContact) {
      const contactsToCreate: Array<{
        first_name: string
        last_name: string
        email?: string | null
        phone?: string | null
        title?: string | null
        linkedin_url?: string | null
        youtube_channel_url?: string | null
      }> = []

      // Helper to split full name into first/last (for discovered contacts)
      const splitName = (fullName: string) => {
        const parts = fullName.trim().split(/\s+/)
        return {
          first_name: parts[0] || "Unknown",
          last_name: parts.slice(1).join(" ") || ""
        }
      }

      // Add contact from user input (requires at least a first name)
      if (input.contact_first_name) {
        contactsToCreate.push({
          first_name: input.contact_first_name,
          last_name: input.contact_last_name || "",
          email: input.contact_email || null,
          phone: input.contact_phone || null,
          title: input.contact_title || null,
          linkedin_url: input.contact_linkedin_url || null,
          youtube_channel_url: input.contact_youtube_channel_url || null,
        })
      }

      // Add contacts discovered by AI research
      if (research.discovered_contacts && research.discovered_contacts.length > 0) {
        for (const dc of research.discovered_contacts) {
          if (dc.name) {
            // Skip if we already have this email (when both have emails)
            if (dc.email && contactsToCreate.some(c => c.email && c.email.toLowerCase() === dc.email!.toLowerCase())) {
              continue
            }
            const names = splitName(dc.name)
            contactsToCreate.push({
              first_name: names.first_name,
              last_name: names.last_name,
              email: dc.email || null,
              title: dc.title || null,
              linkedin_url: dc.linkedin_url || null,
            })
          }
        }
      }

      // Create all contacts - collect all errors instead of just the last one
      const contactErrors: string[] = []

      for (const contactData of contactsToCreate) {
        const { data: contact, error: createContactError } = await supabase
          .from("contacts")
          .insert({
            company_id: company.id,
            first_name: contactData.first_name,
            last_name: contactData.last_name,
            email: contactData.email || null,
            phone: contactData.phone || null,
            title: contactData.title,
            linkedin_url: contactData.linkedin_url || null,
            youtube_channel_url: contactData.youtube_channel_url || null,
            source: input.event,
            outreach_status: "not_contacted",
            show_on_articles: false,
          })
          .select()
          .single()

        if (createContactError) {
          console.error("Error creating contact:", createContactError)
          contactErrors.push(`${contactData.email}: ${createContactError.message}`)
        } else {
          contactsCreated++
          // Set first contact as primary
          if (!contactId) {
            contactId = contact.id
            const { error: primaryContactError } = await supabase
              .from("companies")
              .update({ primary_contact_id: contact.id })
              .eq("id", company.id)

            if (primaryContactError) {
              console.error("Error setting primary contact:", primaryContactError)
              contactErrors.push(`Failed to set primary contact: ${primaryContactError.message}`)
            }
          }
        }
      }

      // Aggregate all contact errors
      if (contactErrors.length > 0) {
        contactError = contactErrors.join("; ")
      }

      // If user wanted contacts but we couldn't create any
      if (contactsToCreate.length === 0) {
        contactError = "No contacts were found to create"
      }
    }

    // 3. Optionally create the article draft
    let articleError: string | null = null
    if (createArticle && research.article_title && research.article_content) {
      // Generate slug from title with timestamp to ensure uniqueness
      const baseSlug = research.article_title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Check if slug exists and add suffix if needed
      const { data: existingSlugs } = await supabase
        .from("articles")
        .select("slug")
        .like("slug", `${baseSlug}%`)

      let slug = baseSlug
      if (existingSlugs && existingSlugs.length > 0) {
        // Add a numeric suffix
        slug = `${baseSlug}-${existingSlugs.length + 1}`
      }

      const { data: article, error: createArticleError } = await supabase
        .from("articles")
        .insert({
          company_id: company.id,
          title: research.article_title,
          slug: slug,
          content: research.article_content,
          excerpt: research.article_excerpt || null,
          status: "draft",
        })
        .select()
        .single()

      if (createArticleError) {
        console.error("Error creating article:", createArticleError)
        articleError = createArticleError.message
      } else {
        articleId = article.id

        // Update company status to article_draft
        const { error: statusUpdateError } = await supabase
          .from("companies")
          .update({ status: "article_draft" })
          .eq("id", company.id)

        if (statusUpdateError) {
          console.error("Error updating company status:", statusUpdateError)
          // Article was created successfully, but status update failed - include in response
          articleError = `Article created but failed to update company status: ${statusUpdateError.message}`
        }
      }
    } else if (createArticle) {
      // User wanted article but AI didn't generate content
      articleError = "Article title or content was not generated by AI"
    }

    return NextResponse.json({
      success: true,
      company_id: company.id,
      contact_id: contactId,
      contacts_created: contactsCreated,
      contact_error: contactError,
      article_id: articleId,
      article_error: articleError,
    })
  } catch (error) {
    console.error("Save research error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    )
  }
}
