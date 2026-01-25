import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { hunterService } from "@/lib/services/hunter"
import { youtubeService } from "@/lib/services/youtube"
import { anthropicService } from "@/lib/services/anthropic"
import { perplexityService } from "@/lib/services/perplexity"
import { googleBooksService } from "@/lib/services/google-books"

/**
 * GET /api/enhance
 *
 * Get enhancement status and available options
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Check Hunter.io configuration
    const hunterConfigured = hunterService.isConfigured()
    let hunterAccount = null

    if (hunterConfigured) {
      try {
        hunterAccount = await hunterService.getAccountInfo()
      } catch (e) {
        console.error("Failed to get Hunter account info:", e)
      }
    }

    // Get enhancement stats (totals and needs enhancement counts)
    const [
      { count: companiesTotal },
      { count: companiesNeedsEnhancement },
      { count: contactsTotal },
      { count: contactsNeedsEnhancement },
      { count: articlesTotal },
      { count: articlesNeedsEnhancement },
    ] = await Promise.all([
      // Companies
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }).is("description", null),
      // Contacts
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }).is("bio", null),
      // Articles
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("ai_enhanced", false),
    ])

    const stats = {
      companies: {
        total: companiesTotal || 0,
        needsEnhancement: companiesNeedsEnhancement || 0,
      },
      contacts: {
        total: contactsTotal || 0,
        needsEnhancement: contactsNeedsEnhancement || 0,
      },
      articles: {
        total: articlesTotal || 0,
        needsEnhancement: articlesNeedsEnhancement || 0,
      },
    }

    return NextResponse.json({
      services: {
        hunter: {
          configured: hunterConfigured,
          account: hunterAccount,
        },
        anthropic: {
          configured: anthropicService.isConfigured(),
        },
        youtube: {
          configured: youtubeService.isConfigured(),
        },
        perplexity: {
          configured: perplexityService.isConfigured(),
        },
      },
      stats,
    })
  } catch (error) {
    console.error("Error getting enhancement status:", error)
    return NextResponse.json(
      { error: "Failed to get enhancement status" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/enhance
 *
 * Enhance one or more entities
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { entityType, entityIds, enhancementType } = body

    if (!entityType || !entityIds || !Array.isArray(entityIds) || entityIds.length === 0) {
      return NextResponse.json(
        { error: "entityType and entityIds array are required" },
        { status: 400 }
      )
    }

    if (!["company", "contact", "article"].includes(entityType)) {
      return NextResponse.json(
        { error: "entityType must be 'company', 'contact', or 'article'" },
        { status: 400 }
      )
    }

    const results: Array<{
      id: string
      success: boolean
      error?: string
      fieldsUpdated?: string[]
    }> = []

    // Process each entity
    for (const entityId of entityIds) {
      try {
        let result

        if (entityType === "company") {
          result = await enhanceCompany(supabase, entityId, enhancementType)
        } else if (entityType === "contact") {
          result = await enhanceContact(supabase, entityId, enhancementType)
        } else if (entityType === "article") {
          result = await enhanceArticle(supabase, entityId, enhancementType)
        }

        results.push({
          id: entityId,
          success: true,
          fieldsUpdated: result?.fieldsUpdated || [],
        })
      } catch (error) {
        results.push({
          id: entityId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: failCount === 0,
      message: `Enhanced ${successCount} of ${entityIds.length} ${entityType}(s)`,
      results,
    })
  } catch (error) {
    console.error("Enhancement error:", error)
    return NextResponse.json(
      { error: "Failed to process enhancement request" },
      { status: 500 }
    )
  }
}

/**
 * Enhance a company with Hunter.io data
 *
 * Finds contacts with 50%+ confidence from Hunter.io
 */
async function enhanceCompany(
  supabase: Awaited<ReturnType<typeof createClient>>,
  companyId: string,
  enhancementType?: string
) {
  const startTime = Date.now()

  // Get company
  const { data: company, error: fetchError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single()

  if (fetchError || !company) {
    throw new Error("Company not found")
  }

  // Get domain from website or domain field
  const domain = company.domain || extractDomain(company.website)
  if (!domain) {
    throw new Error(`Company "${company.name}" has no domain or website. Please add a website URL to the company first.`)
  }

  const fieldsUpdated: string[] = []
  const updateData: Record<string, unknown> = {}
  let contactsCreated = 0
  let contactsSkipped = 0

  // Hunter.io enrichment
  if (hunterService.isConfigured() && (!enhancementType || enhancementType === "hunter")) {
    try {
      // Fetch more results to find quality contacts
      const hunterData = await hunterService.domainSearch(domain, {
        type: "personal",
        limit: 50, // Get more results to filter from
      })

      // Update company fields
      if (hunterData.organization && !company.name) {
        updateData.name = hunterData.organization
        fieldsUpdated.push("name")
      }
      if (hunterData.description && !company.description) {
        updateData.description = hunterData.description
        fieldsUpdated.push("description")
      }
      if (hunterData.industry) {
        updateData.industry = hunterData.industry
        fieldsUpdated.push("industry")
      }
      if (hunterData.headcount) {
        const count = parseHeadcount(hunterData.headcount)
        if (count) {
          updateData.employee_count = count
          fieldsUpdated.push("employee_count")
        }
      }
      if (hunterData.companyType) {
        updateData.company_type = hunterData.companyType
        fieldsUpdated.push("company_type")
      }
      if (hunterData.technologies && hunterData.technologies.length > 0) {
        updateData.technologies = hunterData.technologies
        fieldsUpdated.push("technologies")
      }

      // Social profiles
      if (hunterData.socialProfiles.linkedin) {
        updateData.linkedin_url = hunterData.socialProfiles.linkedin
        fieldsUpdated.push("linkedin_url")
      }
      if (hunterData.socialProfiles.twitter) {
        updateData.twitter_url = hunterData.socialProfiles.twitter
        fieldsUpdated.push("twitter_url")
      }
      if (hunterData.socialProfiles.facebook) {
        updateData.facebook_url = hunterData.socialProfiles.facebook
        fieldsUpdated.push("facebook_url")
      }
      if (hunterData.socialProfiles.instagram) {
        updateData.instagram_url = hunterData.socialProfiles.instagram
        fieldsUpdated.push("instagram_url")
      }

      updateData.hunter_enriched_at = new Date().toISOString()

      // Filter and create contacts from Hunter emails
      // Accept contacts with 80%+ confidence
      for (const email of hunterData.emails) {
        // Skip if no email
        if (!email.email) {
          contactsSkipped++
          continue
        }

        // Accept contacts with 80%+ confidence
        if (email.confidence < 80) {
          contactsSkipped++
          continue
        }

        // Check if contact exists
        const { data: existingContact } = await supabase
          .from("contacts")
          .select("id")
          .eq("email", email.email)
          .single()

        if (!existingContact) {
          // Create new contact with proper schema fields
          const firstName = email.firstName || "Unknown"
          const lastName = email.lastName || ""
          const fullName = [firstName, lastName].filter(Boolean).join(" ")

          const contactData = {
            company_id: companyId,
            email: email.email,
            name: fullName,
            first_name: firstName,
            last_name: lastName,
            title: email.position || null,
            linkedin_url: email.linkedin || null,
            phone: email.phone || null,
            source: "hunter",
            outreach_status: "not_contacted" as const,
            show_on_articles: false,
            hunter_confidence: email.confidence,
            seniority: email.seniority || null,
          }

          const { data: insertedContact, error: insertError } = await supabase
            .from("contacts")
            .insert(contactData)
            .select()
            .single()

          if (insertError) {
            console.error("Failed to insert contact:", {
              error: insertError,
              data: contactData,
            })
            fieldsUpdated.push(`Insert failed: ${insertError.message}`)
          } else {
            contactsCreated++
            console.log("Created contact:", insertedContact?.id, email.email)
          }
        } else {
          contactsSkipped++
        }
      }

      // Always report what we found (even if no contacts were created)
      const totalEmails = hunterData.emails.length
      fieldsUpdated.push(`Domain: ${domain}`)
      if (totalEmails > 0) {
        fieldsUpdated.push(`${totalEmails} emails found by Hunter`)
      } else {
        fieldsUpdated.push(`No emails found for domain`)
      }
      if (contactsCreated > 0) {
        fieldsUpdated.push(`${contactsCreated} contacts created`)
      } else if (totalEmails > 0) {
        fieldsUpdated.push(`0 contacts created (all filtered or already exist)`)
      }
      if (contactsSkipped > 0) {
        fieldsUpdated.push(`${contactsSkipped} skipped`)
      }

      // Log enhancement
      await logEnhancement(supabase, {
        entityType: "company",
        entityId: companyId,
        enhancementSource: "hunter",
        enhancementType: "company_enrichment",
        requestData: { domain },
        responseData: {
          ...hunterData,
          contactsCreated,
          contactsSkipped,
          totalEmailsFound: hunterData.emails.length,
        },
        fieldsUpdated,
        status: "completed",
        creditsUsed: 1,
        durationMs: Date.now() - startTime,
      })
    } catch (hunterError) {
      console.error("Hunter enrichment failed:", hunterError)
      await logEnhancement(supabase, {
        entityType: "company",
        entityId: companyId,
        enhancementSource: "hunter",
        enhancementType: "company_enrichment",
        requestData: { domain },
        responseData: {},
        fieldsUpdated: [],
        status: "failed",
        errorMessage: hunterError instanceof Error ? hunterError.message : "Unknown error",
        durationMs: Date.now() - startTime,
      })
      // Re-throw so the caller knows it failed
      throw hunterError
    }
  } else if (!hunterService.isConfigured()) {
    throw new Error("Hunter.io is not configured. Please add HUNTER_API_KEY to your environment variables.")
  }

  // Update company if we have changes
  if (Object.keys(updateData).length > 0) {
    await supabase
      .from("companies")
      .update(updateData)
      .eq("id", companyId)
  }

  return { fieldsUpdated, contactsCreated, contactsSkipped }
}

/**
 * Enhance a contact with Hunter.io data
 */
async function enhanceContact(
  supabase: Awaited<ReturnType<typeof createClient>>,
  contactId: string,
  enhancementType?: string
) {
  const startTime = Date.now()

  // Get contact (without join to avoid relationship issues)
  const { data: contact, error: fetchError } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .single()

  if (fetchError || !contact) {
    console.error("Contact fetch error:", fetchError)
    throw new Error("Contact not found")
  }

  // Get company separately if contact has company_id
  let company = null
  if (contact.company_id) {
    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("id", contact.company_id)
      .single()
    company = companyData
  }

  // Add company to contact object for later use
  const contactWithCompany = { ...contact, company }

  const fieldsUpdated: string[] = []
  const updateData: Record<string, unknown> = {}

  // Hunter.io enrichment - verify email or find email
  if (hunterService.isConfigured() && (!enhancementType || enhancementType === "hunter")) {
    try {
      // If we have an email, verify it
      if (contact.email) {
        const verifyResult = await hunterService.verifyEmail(contact.email)

        updateData.hunter_confidence = verifyResult.score
        updateData.hunter_verified_at = new Date().toISOString()
        fieldsUpdated.push("hunter_confidence", "hunter_verified_at")

        await logEnhancement(supabase, {
          entityType: "contact",
          entityId: contactId,
          enhancementSource: "hunter",
          enhancementType: "email_verification",
          requestData: { email: contact.email },
          responseData: { ...verifyResult },
          fieldsUpdated,
          status: "completed",
          creditsUsed: 1,
          durationMs: Date.now() - startTime,
        })
      }
      // If we have name and company domain, try to find email
      else if (contact.first_name && contact.last_name && company?.domain) {
        const findResult = await hunterService.emailFinder(
          company.domain,
          contact.first_name,
          contact.last_name
        )

        if (findResult.email) {
          updateData.email = findResult.email
          fieldsUpdated.push("email")
        }
        if (findResult.position && !contact.title) {
          updateData.title = findResult.position
          fieldsUpdated.push("title")
        }
        if (findResult.linkedin && !contact.linkedin_url) {
          updateData.linkedin_url = findResult.linkedin
          fieldsUpdated.push("linkedin_url")
        }
        if (findResult.twitter && !contact.twitter_url) {
          updateData.twitter_url = findResult.twitter
          fieldsUpdated.push("twitter_url")
        }
        if (findResult.phone && !contact.phone) {
          updateData.phone = findResult.phone
          fieldsUpdated.push("phone")
        }

        updateData.hunter_confidence = findResult.score
        updateData.hunter_verified_at = new Date().toISOString()
        fieldsUpdated.push("hunter_confidence", "hunter_verified_at")

        await logEnhancement(supabase, {
          entityType: "contact",
          entityId: contactId,
          enhancementSource: "hunter",
          enhancementType: "email_finder",
          requestData: {
            domain: company.domain,
            firstName: contact.first_name,
            lastName: contact.last_name,
          },
          responseData: { ...findResult },
          fieldsUpdated,
          status: "completed",
          creditsUsed: 1,
          durationMs: Date.now() - startTime,
        })
      }
    } catch (hunterError) {
      console.error("Hunter contact enrichment failed:", hunterError)
      await logEnhancement(supabase, {
        entityType: "contact",
        entityId: contactId,
        enhancementSource: "hunter",
        enhancementType: "contact_enrichment",
        requestData: { contactId },
        responseData: {},
        fieldsUpdated: [],
        status: "failed",
        errorMessage: hunterError instanceof Error ? hunterError.message : "Unknown error",
        durationMs: Date.now() - startTime,
      })
    }
  }

  // AI Profile Research using Perplexity
  if (perplexityService.isConfigured() && (!enhancementType || enhancementType === "profile")) {
    try {
      const fullName = `${contact.first_name} ${contact.last_name}`.trim()

      if (!fullName || fullName === "") {
        throw new Error("Contact must have a name for profile research")
      }

      console.log(`Researching profile for: ${fullName}`)

      const profileResult = await perplexityService.researchProfile({
        name: fullName,
        linkedinUrl: contact.linkedin_url,
        title: contact.title,
        company: company?.name,
      })

      if (profileResult) {
        updateData.bio = profileResult.bio
        updateData.ai_researched_at = new Date().toISOString()
        fieldsUpdated.push("bio")

        if (profileResult.highlights && profileResult.highlights.length > 0) {
          updateData.ai_highlights = profileResult.highlights
          fieldsUpdated.push("ai_highlights")
        }

        if (profileResult.expertise && profileResult.expertise.length > 0) {
          updateData.ai_expertise = profileResult.expertise
          fieldsUpdated.push("ai_expertise")
        }

        if (profileResult.sources && profileResult.sources.length > 0) {
          updateData.bio_sources = profileResult.sources
          fieldsUpdated.push("bio_sources")
        }

        await logEnhancement(supabase, {
          entityType: "contact",
          entityId: contactId,
          enhancementSource: "perplexity",
          enhancementType: "profile_research",
          requestData: {
            name: fullName,
            linkedinUrl: contact.linkedin_url,
            title: contact.title,
            company: company?.name,
          },
          responseData: profileResult,
          fieldsUpdated,
          status: "completed",
          durationMs: Date.now() - startTime,
        })

        console.log(`Profile research completed for ${fullName}`)
      } else {
        fieldsUpdated.push("No profile information found")

        await logEnhancement(supabase, {
          entityType: "contact",
          entityId: contactId,
          enhancementSource: "perplexity",
          enhancementType: "profile_research",
          requestData: {
            name: fullName,
            linkedinUrl: contact.linkedin_url,
          },
          responseData: {},
          fieldsUpdated: ["No results"],
          status: "completed",
          durationMs: Date.now() - startTime,
        })
      }
    } catch (profileError) {
      console.error("Profile research failed:", profileError)
      await logEnhancement(supabase, {
        entityType: "contact",
        entityId: contactId,
        enhancementSource: "perplexity",
        enhancementType: "profile_research",
        requestData: { contactId },
        responseData: {},
        fieldsUpdated: [],
        status: "failed",
        errorMessage: profileError instanceof Error ? profileError.message : "Unknown error",
        durationMs: Date.now() - startTime,
      })

      // Only throw if this was the requested enhancement type
      if (enhancementType === "profile") {
        throw profileError
      }
    }
  }

  // Search for YouTube videos, papers, and books for this person
  if (!enhancementType || enhancementType === "profile" || enhancementType === "media") {
    const fullName = `${contact.first_name} ${contact.last_name}`.trim()

    if (fullName) {
      // Clear existing enhancements for this contact (to avoid duplicates on re-enhance)
      await supabase
        .from("contact_enhancements")
        .delete()
        .eq("contact_id", contactId)

      let position = 0

      // Search YouTube for videos featuring/by this person
      if (youtubeService.isConfigured()) {
        try {
          console.log(`Searching YouTube for: ${fullName} at ${company?.name || "unknown company"}`)

          // Build a more specific search query using company context
          // This helps avoid wrong-person matches for common names
          let searchQuery: string
          if (company?.name) {
            // Include company name to narrow results to the right person
            searchQuery = `"${fullName}" "${company.name}" interview OR talk OR podcast`
          } else {
            // Without company, search is less reliable for common names
            searchQuery = `"${fullName}" ${contact.title || ""} interview OR talk OR podcast`
          }

          const videos = await youtubeService.searchVideos(searchQuery, {
            maxResults: 4,
            videoDuration: "medium", // Prefer medium-length content
            order: "relevance",
          })

          // Store videos as contact_enhancements
          for (const video of videos) {
            await supabase.from("contact_enhancements").insert({
              contact_id: contactId,
              type: "youtube",
              title: video.title,
              url: video.url,
              embed_code: `<iframe width="560" height="315" src="${video.embedUrl}" frameborder="0" allowfullscreen></iframe>`,
              metadata: {
                videoId: video.videoId,
                channel: video.channelTitle,
                duration: video.duration,
                viewCount: video.viewCount,
                thumbnail: video.thumbnails.high || video.thumbnails.medium,
                publishedAt: video.publishedAt,
              },
              position: position++,
            })
          }

          if (videos.length > 0) {
            fieldsUpdated.push(`${videos.length} YouTube videos`)
          }

          await logEnhancement(supabase, {
            entityType: "contact",
            entityId: contactId,
            enhancementSource: "youtube",
            enhancementType: "video_search",
            requestData: { query: searchQuery },
            responseData: { count: videos.length },
            fieldsUpdated: [`${videos.length} videos found`],
            status: "completed",
            durationMs: Date.now() - startTime,
          })
        } catch (ytError) {
          console.error("YouTube search failed for contact:", ytError)
        }
      }

      // Search for academic papers by this person (with company context to avoid wrong-person matches)
      if (perplexityService.isConfigured()) {
        try {
          console.log(`Searching papers for: ${fullName} at ${company?.name || "unknown company"}`)

          // Use the verified search method that requires company context
          const papers = await perplexityService.searchPapersByLeader(fullName, {
            company: company?.name,
            title: contact.title,
            industry: company?.industry,
            limit: 4,
          })

          for (const paper of papers) {
            await supabase.from("contact_enhancements").insert({
              contact_id: contactId,
              type: "scholar",
              title: paper.title,
              url: paper.url,
              metadata: {
                authors: paper.authors,
                year: paper.year,
                journal: paper.journal,
                abstract: paper.abstract,
                doi: paper.doi,
                citedBy: paper.citationCount,
              },
              position: position++,
            })
          }

          if (papers.length > 0) {
            fieldsUpdated.push(`${papers.length} academic papers`)
          } else {
            fieldsUpdated.push("No verified papers found")
          }

          await logEnhancement(supabase, {
            entityType: "contact",
            entityId: contactId,
            enhancementSource: "perplexity",
            enhancementType: "paper_search",
            requestData: { author: fullName, company: company?.name },
            responseData: { count: papers.length },
            fieldsUpdated: [`${papers.length} papers found`],
            status: "completed",
            durationMs: Date.now() - startTime,
          })
        } catch (paperError) {
          console.error("Paper search failed for contact:", paperError)
        }

        // Search for books by this person using Google Books API (real, verified books)
        try {
          console.log(`Searching books for: ${fullName} at ${company?.name || "unknown company"}`)

          // Use Google Books for verified, real book results
          const books = await googleBooksService.searchBooksByLeader(fullName, {
            company: company?.name,
            title: contact.title,
            industry: company?.industry,
            limit: 4,
          })

          for (const book of books) {
            await supabase.from("contact_enhancements").insert({
              contact_id: contactId,
              type: "book",
              title: book.title,
              url: book.url,
              metadata: {
                authors: book.authors,
                year: book.year,
                publisher: book.publisher,
                description: book.description,
                thumbnail: book.thumbnail,
                rating: book.rating,
              },
              position: position++,
            })
          }

          if (books.length > 0) {
            fieldsUpdated.push(`${books.length} books`)
          } else {
            fieldsUpdated.push("No verified books found")
          }

          await logEnhancement(supabase, {
            entityType: "contact",
            entityId: contactId,
            enhancementSource: "perplexity",
            enhancementType: "book_search",
            requestData: { author: fullName, company: company?.name },
            responseData: { count: books.length },
            fieldsUpdated: [`${books.length} books found`],
            status: "completed",
            durationMs: Date.now() - startTime,
          })
        } catch (bookError) {
          console.error("Book search failed for contact:", bookError)
        }
      }
    }
  }

  // Update contact if we have changes
  if (Object.keys(updateData).length > 0) {
    console.log(`Updating contact ${contactId} with:`, JSON.stringify(updateData, null, 2))
    const { error: updateError } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", contactId)

    if (updateError) {
      console.error("Failed to update contact:", updateError)
      fieldsUpdated.push(`Update failed: ${updateError.message}`)
    } else {
      console.log("Contact updated successfully")
    }
  } else {
    console.log("No contact fields to update")
  }

  return { fieldsUpdated }
}

/**
 * Enhance an article with AI-generated content and related media
 *
 * Enhancement types:
 * - "all" (default): Run all enhancements
 * - "excerpt": Generate AI excerpt only
 * - "youtube": Find related YouTube videos
 * - "scholar": Find related academic papers
 * - "books": Find related books
 */
async function enhanceArticle(
  supabase: Awaited<ReturnType<typeof createClient>>,
  articleId: string,
  enhancementType?: string
) {
  const startTime = Date.now()

  // Get article - use separate query to avoid join issues
  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single()

  if (fetchError || !article) {
    throw new Error("Article not found")
  }

  // Get company separately if needed
  let company = null
  if (article.company_id) {
    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("id", article.company_id)
      .single()
    company = companyData
  }

  const fieldsUpdated: string[] = []
  const updateData: Record<string, unknown> = {}
  const enhancementsCreated: Array<{
    type: string
    title: string
    url: string
  }> = []

  const runAll = !enhancementType || enhancementType === "all"
  const articleContent = article.content || article.excerpt || ""

  // Extract key people once and reuse for scholar and book searches
  // Use cached key_people if already extracted, otherwise extract with AI
  let keyPeople: string[] = article.key_people || []

  if (keyPeople.length === 0 && anthropicService.isConfigured()) {
    try {
      keyPeople = await anthropicService.extractKeyPeople(article.title, articleContent)
      console.log(`Extracted key people from article: ${keyPeople.join(", ") || "none found"}`)

      // Save to database for future use
      if (keyPeople.length > 0) {
        updateData.key_people = keyPeople
        fieldsUpdated.push(`key_people: ${keyPeople.join(", ")}`)
      }
    } catch (e) {
      console.error("Failed to extract key people:", e)
    }
  } else if (keyPeople.length > 0) {
    console.log(`Using cached key people: ${keyPeople.join(", ")}`)
  }

  // 1. Generate AI excerpt if missing or requested
  if ((runAll || enhancementType === "excerpt") && anthropicService.isConfigured()) {
    if (!article.excerpt || enhancementType === "excerpt") {
      try {
        const excerpt = await anthropicService.generateExcerpt(article.title, articleContent)
        if (excerpt) {
          updateData.excerpt = excerpt
          fieldsUpdated.push("excerpt")
        }
      } catch (e) {
        console.error("Failed to generate excerpt:", e)
        fieldsUpdated.push("excerpt generation failed")
      }
    }
  }

  // 2. Find related YouTube videos (requires YouTube API)
  if ((runAll || enhancementType === "youtube") && youtubeService.isConfigured()) {
    try {
      // Generate search queries using AI if available
      let queries = [article.title]
      if (anthropicService.isConfigured()) {
        const aiQueries = await anthropicService.generateSearchQueries(
          article.title,
          articleContent,
          "youtube"
        )
        if (aiQueries.length > 0) {
          queries = aiQueries
        }
      }

      // Search YouTube using YouTube Data API
      interface VideoResult {
        videoId: string
        title: string
        url: string
        channel: string
        duration: string
        thumbnail: string
        viewCount?: number
        definition?: string
      }

      const allVideos: VideoResult[] = []

      for (const query of queries.slice(0, 2)) {
        const videos = await youtubeService.searchVideos(query, {
          maxResults: 5,
          videoDuration: "medium", // 4-20 minutes - good for educational content
          order: "relevance",
        })
        allVideos.push(
          ...videos.map((v) => ({
            videoId: v.videoId,
            title: v.title,
            url: v.url,
            channel: v.channelTitle,
            duration: v.duration,
            thumbnail: v.thumbnails.high || v.thumbnails.medium,
            viewCount: v.viewCount,
            definition: v.definition,
          }))
        )
      }

      // Remove duplicates by video ID
      const uniqueVideos = allVideos.filter(
        (v, i, arr) => arr.findIndex((x) => x.videoId === v.videoId) === i
      )

      // Select best results using AI (4 videos for a nice 2x2 grid)
      let selectedVideos = uniqueVideos.slice(0, 4)
      if (anthropicService.isConfigured() && uniqueVideos.length > 4) {
        selectedVideos = await anthropicService.selectBestResults(
          article.title,
          articleContent,
          uniqueVideos,
          4,
          "YouTube videos"
        )
      }

      // Save to article_enhancements with rich metadata for lightweight display
      for (const video of selectedVideos) {
        const { error } = await supabase.from("article_enhancements").insert({
          article_id: articleId,
          type: "youtube",
          title: video.title,
          url: video.url,
          embed_code: `https://www.youtube.com/embed/${video.videoId}`,
          metadata: {
            videoId: video.videoId,
            channel: video.channel,
            duration: video.duration,
            thumbnail: video.thumbnail,
            viewCount: video.viewCount,
            definition: video.definition,
          },
        })
        if (!error) {
          enhancementsCreated.push({ type: "youtube", title: video.title, url: video.url })
        }
      }

      if (selectedVideos.length > 0) {
        fieldsUpdated.push(`${selectedVideos.length} YouTube videos`)
      }
    } catch (e) {
      console.error("Failed to find YouTube videos:", e)
      fieldsUpdated.push("YouTube search failed")
    }
  }

  // 3. Find related academic papers using Perplexity (required)
  if ((runAll || enhancementType === "scholar") && perplexityService.isConfigured()) {
    try {
      // Search for papers using Perplexity
      const allPapers = []

      // Use the shared keyPeople extracted earlier
      // Step 1: Search for papers by each key person
      for (const personName of keyPeople.slice(0, 3)) { // Limit to top 3 people
        console.log(`Searching for papers by: ${personName}`)
        const authorPapers = await perplexityService.searchByAuthor(personName, article.title, 4)
        allPapers.push(...authorPapers)
      }

      // Step 3: Also search by topic for additional papers
      let queries = [article.title]
      if (anthropicService.isConfigured()) {
        const aiQueries = await anthropicService.generateSearchQueries(
          article.title,
          articleContent,
          "scholar"
        )
        if (aiQueries.length > 0) {
          queries = aiQueries
        }
      }

      // Only search by topic if we didn't find many papers by key people
      if (allPapers.length < 4) {
        for (const query of queries.slice(0, 2)) {
          const papers = await perplexityService.searchPapers(query, { limit: 4 })
          allPapers.push(...papers)
        }
      }

      // Deduplicate by DOI or normalized title
      const seen = new Set<string>()
      const uniquePapers = allPapers.filter((p) => {
        if (p.doi) {
          const key = p.doi.toLowerCase()
          if (seen.has(key)) return false
          seen.add(key)
        }
        const titleKey = p.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50)
        if (seen.has(titleKey)) return false
        seen.add(titleKey)
        return true
      })

      // Select best papers using AI (4 papers for a nice 2x2 grid)
      let selectedPapers = uniquePapers.slice(0, 4)
      if (anthropicService.isConfigured() && uniquePapers.length > 4) {
        selectedPapers = await anthropicService.selectBestResults(
          article.title,
          articleContent,
          uniquePapers,
          4,
          "academic papers"
        )
      }

      for (const paper of selectedPapers) {
        const { error } = await supabase.from("article_enhancements").insert({
          article_id: articleId,
          type: "scholar",
          title: paper.title,
          url: paper.url,
          metadata: {
            authors: paper.authors,
            abstract: paper.abstract?.slice(0, 500),
            publication: paper.journal,
            citedBy: paper.citationCount,
            year: paper.year?.toString() || null,
            doi: paper.doi,
            source: "perplexity",
          },
        })
        if (!error) {
          enhancementsCreated.push({ type: "scholar", title: paper.title, url: paper.url })
        }
      }

      if (selectedPapers.length > 0) {
        fieldsUpdated.push(`${selectedPapers.length} academic papers`)
      }
    } catch (e) {
      console.error("Failed to find academic papers:", e)
      fieldsUpdated.push("Scholar search failed")
    }
  }

  // 4. Find related books using Perplexity (with Amazon links) - required
  if ((runAll || enhancementType === "books") && perplexityService.isConfigured()) {
    try {
      interface BookSearchResult {
        title: string
        url: string
        authors: string[]
        description: string | null
        thumbnail: string | null
        publishedDate: string | null
        rating: number | null
      }

      const allBooks: BookSearchResult[] = []

      // Use the shared keyPeople extracted earlier
      // Step 1: Search for books by each key person using Google Books (real, verified books)
      for (const personName of keyPeople.slice(0, 3)) { // Limit to top 3 people
        console.log(`Searching for books by: ${personName}`)
        const authorBooks = await googleBooksService.searchBooksByAuthor(personName, article.title, 4)
        allBooks.push(...authorBooks.map(b => ({
          title: b.title,
          url: b.url,
          authors: b.authors,
          description: b.description,
          thumbnail: b.thumbnail,
          publishedDate: b.year?.toString() || null,
          rating: b.rating,
        })))
      }

      // Step 3: Also search by topic for additional books
      let queries = [article.title]
      if (anthropicService.isConfigured()) {
        const aiQueries = await anthropicService.generateSearchQueries(
          article.title,
          articleContent,
          "books"
        )
        if (aiQueries.length > 0) {
          queries = aiQueries
        }
      }

      // Only search by topic if we didn't find many books by key people
      if (allBooks.length < 4) {
        for (const query of queries.slice(0, 2)) {
          const books = await googleBooksService.searchBooks(query, { limit: 4 })
          allBooks.push(...books.map(b => ({
            title: b.title,
            url: b.url,
            authors: b.authors,
            description: b.description,
            thumbnail: b.thumbnail,
            publishedDate: b.year?.toString() || null,
            rating: b.rating,
          })))
        }
      }

      // Remove duplicates by normalized title
      const seen = new Set<string>()
      const uniqueBooks = allBooks.filter((b) => {
        const titleKey = b.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40)
        if (seen.has(titleKey)) return false
        seen.add(titleKey)
        return true
      })

      // Select best books using AI
      let selectedBooks = uniqueBooks.slice(0, 4)
      if (anthropicService.isConfigured() && uniqueBooks.length > 4) {
        selectedBooks = await anthropicService.selectBestResults(
          article.title,
          articleContent,
          uniqueBooks,
          4,
          "books"
        )
      }

      for (const book of selectedBooks) {
        const { error } = await supabase.from("article_enhancements").insert({
          article_id: articleId,
          type: "book",
          title: book.title,
          url: book.url,
          metadata: {
            authors: book.authors,
            description: book.description?.slice(0, 500),
            thumbnail: book.thumbnail,
            publishedDate: book.publishedDate,
            rating: book.rating,
          },
        })
        if (!error) {
          enhancementsCreated.push({ type: "book", title: book.title, url: book.url })
        }
      }

      if (selectedBooks.length > 0) {
        fieldsUpdated.push(`${selectedBooks.length} books (Amazon)`)
      }
    } catch (e) {
      console.error("Failed to find books:", e)
      fieldsUpdated.push("Book search failed")
    }
  }

  // Update article if we have changes
  if (Object.keys(updateData).length > 0) {
    updateData.ai_enhanced = true
    console.log(`Updating article ${articleId} with:`, JSON.stringify(updateData, null, 2))
    const { error: updateError } = await supabase.from("articles").update(updateData).eq("id", articleId)
    if (updateError) {
      console.error("Failed to update article:", updateError)
    } else {
      console.log("Article updated successfully")
    }
  }

  // Mark article as AI enhanced if we created any enhancements
  if (enhancementsCreated.length > 0) {
    await supabase.from("articles").update({ ai_enhanced: true }).eq("id", articleId)
  }

  // Log enhancement
  await logEnhancement(supabase, {
    entityType: "article",
    entityId: articleId,
    enhancementSource: "ai",
    enhancementType: enhancementType || "all",
    requestData: { articleId, title: article.title },
    responseData: {
      fieldsUpdated,
      enhancementsCreated,
    },
    fieldsUpdated,
    status: "completed",
    durationMs: Date.now() - startTime,
  })

  return { fieldsUpdated, enhancementsCreated }
}

/**
 * Log an enhancement operation
 */
async function logEnhancement(
  supabase: Awaited<ReturnType<typeof createClient>>,
  data: {
    entityType: string
    entityId: string
    enhancementSource: string
    enhancementType: string
    requestData: Record<string, unknown>
    responseData: Record<string, unknown>
    fieldsUpdated: string[]
    status: string
    errorMessage?: string
    creditsUsed?: number
    durationMs?: number
  }
) {
  try {
    await supabase.from("enhancement_logs").insert({
      entity_type: data.entityType,
      entity_id: data.entityId,
      enhancement_source: data.enhancementSource,
      enhancement_type: data.enhancementType,
      request_data: data.requestData,
      response_data: data.responseData,
      fields_updated: data.fieldsUpdated,
      status: data.status,
      error_message: data.errorMessage,
      credits_used: data.creditsUsed || 0,
      duration_ms: data.durationMs,
      completed_at: data.status === "completed" ? new Date().toISOString() : null,
    })
  } catch (e) {
    // Table may not exist yet, that's okay
    console.error("Failed to log enhancement:", e)
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

/**
 * Parse headcount string to number
 */
function parseHeadcount(headcount: string): number | null {
  // Hunter returns strings like "11-50", "51-200", "1001-5000"
  const match = headcount.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : null
}
