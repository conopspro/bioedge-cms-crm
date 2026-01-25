import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { perplexityService } from "@/lib/services/perplexity"
import { youtubeService } from "@/lib/services/youtube"
import { googleBooksService } from "@/lib/services/google-books"

/**
 * POST /api/enhance-contacts
 *
 * Single-action contact enhancement that runs all contact enrichment:
 * 1. Perplexity profile research (bio, highlights, expertise)
 * 2. YouTube videos, academic papers, and books search
 *
 * Note: Hunter.io is only used for companies (to find new contacts).
 * This endpoint focuses on enriching existing contacts with AI research.
 *
 * Can enhance a single contact or batch of contacts by company.
 */
export async function POST(request: NextRequest) {
  try {
    const { contactId, companyId } = await request.json()

    if (!contactId && !companyId) {
      return NextResponse.json(
        { error: "Either contactId or companyId is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const results: Array<{
      id: string
      name: string
      success: boolean
      fieldsUpdated: string[]
      error?: string
    }> = []

    // Get contacts to enhance
    let contacts: Array<{
      id: string
      first_name: string | null
      last_name: string | null
      email: string | null
      title: string | null
      linkedin_url: string | null
      company_id: string | null
      bio: string | null
    }> = []

    if (contactId) {
      // Single contact
      const { data, error } = await supabase
        .from("contacts")
        .select("id, first_name, last_name, email, title, linkedin_url, company_id, bio")
        .eq("id", contactId)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }
      contacts = [data]
    } else if (companyId) {
      // All contacts for a company
      const { data, error } = await supabase
        .from("contacts")
        .select("id, first_name, last_name, email, title, linkedin_url, company_id, bio")
        .eq("company_id", companyId)

      if (error) {
        return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
      }
      contacts = data || []
    }

    if (contacts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No contacts to enhance",
        results: [],
      })
    }

    // Process each contact
    for (const contact of contacts) {
      const contactResult = await enhanceContact(supabase, contact)
      results.push(contactResult)
    }

    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      success: true,
      message: `Enhanced ${successCount} of ${contacts.length} contact(s)`,
      results,
    })
  } catch (error) {
    console.error("Contact enhancement error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enhancement failed" },
      { status: 500 }
    )
  }
}

/**
 * Enhance a single contact with all available enrichment
 */
async function enhanceContact(
  supabase: Awaited<ReturnType<typeof createClient>>,
  contact: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string | null
    title: string | null
    linkedin_url: string | null
    company_id: string | null
    bio: string | null
  }
) {
  const fieldsUpdated: string[] = []
  const updateData: Record<string, unknown> = {}
  const fullName = `${contact.first_name || ""} ${contact.last_name || ""}`.trim()

  // Get company info if available
  let company: { name: string; domain: string | null; industry: string | null } | null = null
  if (contact.company_id) {
    const { data } = await supabase
      .from("companies")
      .select("name, domain, industry")
      .eq("id", contact.company_id)
      .single()
    company = data
  }

  try {
    // 1. Perplexity profile research
    if (perplexityService.isConfigured() && fullName) {
      try {
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
        }
      } catch (profileError) {
        console.error(`Profile research error for ${fullName}:`, profileError)
        fieldsUpdated.push("Profile research failed")
      }
    }

    // 2. Media search (YouTube, papers, books)
    if (fullName) {
      // Clear existing enhancements
      await supabase.from("contact_enhancements").delete().eq("contact_id", contact.id)

      let position = 0

      // YouTube search
      if (youtubeService.isConfigured()) {
        try {
          let searchQuery = `"${fullName}" interview OR talk OR podcast`
          if (company?.name) {
            searchQuery = `"${fullName}" "${company.name}" interview OR talk OR podcast`
          }

          const videos = await youtubeService.searchVideos(searchQuery, {
            maxResults: 4,
            videoDuration: "any",
            order: "relevance",
          })

          for (const video of videos) {
            await supabase.from("contact_enhancements").insert({
              contact_id: contact.id,
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
        } catch (ytError) {
          console.error(`YouTube search error for ${fullName}:`, ytError)
        }
      }

      // Academic papers search
      if (perplexityService.isConfigured()) {
        try {
          const papers = await perplexityService.searchPapersByLeader(fullName, {
            company: company?.name || undefined,
            title: contact.title || undefined,
            industry: company?.industry || undefined,
            limit: 4,
          })

          for (const paper of papers) {
            await supabase.from("contact_enhancements").insert({
              contact_id: contact.id,
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
            fieldsUpdated.push(`${papers.length} papers`)
          }
        } catch (paperError) {
          console.error(`Paper search error for ${fullName}:`, paperError)
        }

        // Books search (using Google Books API for real, verified books)
        try {
          const books = await googleBooksService.searchBooksByLeader(fullName, {
            company: company?.name || undefined,
            title: contact.title || undefined,
            industry: company?.industry || undefined,
            limit: 4,
          })

          for (const book of books) {
            await supabase.from("contact_enhancements").insert({
              contact_id: contact.id,
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
          }
        } catch (bookError) {
          console.error(`Book search error for ${fullName}:`, bookError)
        }
      }
    }

    // Update contact record
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("id", contact.id)

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`)
      }
    }

    return {
      id: contact.id,
      name: fullName || "Unknown",
      success: true,
      fieldsUpdated,
    }
  } catch (error) {
    return {
      id: contact.id,
      name: fullName || "Unknown",
      success: false,
      fieldsUpdated,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
