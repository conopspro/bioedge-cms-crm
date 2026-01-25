import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { anthropicService } from "@/lib/services/anthropic"
import { perplexityService } from "@/lib/services/perplexity"
import { youtubeService } from "@/lib/services/youtube"
import { googleBooksService } from "@/lib/services/google-books"

/**
 * POST /api/enhance-articles
 *
 * Single-action article enhancement that leverages company and contact context:
 * 1. Generate AI excerpt using company/contact context
 * 2. Extract key people from article content
 * 3. Find related YouTube videos
 * 4. Find related academic papers
 * 5. Find related books
 *
 * Can enhance a single article or batch of articles by company.
 */
export async function POST(request: NextRequest) {
  try {
    const { articleId, companyId } = await request.json()

    if (!articleId && !companyId) {
      return NextResponse.json(
        { error: "Either articleId or companyId is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const results: Array<{
      id: string
      title: string
      success: boolean
      fieldsUpdated: string[]
      enhancementsCreated: number
      error?: string
    }> = []

    // Get articles to enhance
    let articles: Array<{
      id: string
      title: string
      content: string | null
      excerpt: string | null
      company_id: string | null
      key_people: string[] | null
    }> = []

    if (articleId) {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, content, excerpt, company_id, key_people")
        .eq("id", articleId)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
      articles = [data]
    } else if (companyId) {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, content, excerpt, company_id, key_people")
        .eq("company_id", companyId)

      if (error) {
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
      }
      articles = data || []
    }

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No articles to enhance",
        results: [],
      })
    }

    // Process each article
    for (const article of articles) {
      const articleResult = await enhanceArticle(supabase, article)
      results.push(articleResult)
    }

    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      success: true,
      message: `Enhanced ${successCount} of ${articles.length} article(s)`,
      results,
    })
  } catch (error) {
    console.error("Article enhancement error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enhancement failed" },
      { status: 500 }
    )
  }
}

/**
 * Enhance a single article with all available enrichment
 */
async function enhanceArticle(
  supabase: Awaited<ReturnType<typeof createClient>>,
  article: {
    id: string
    title: string
    content: string | null
    excerpt: string | null
    company_id: string | null
    key_people: string[] | null
  }
) {
  const fieldsUpdated: string[] = []
  const updateData: Record<string, unknown> = {}
  let enhancementsCreated = 0
  const articleContent = article.content || article.excerpt || ""

  // Get company context
  let company: {
    name: string
    description: string | null
    differentiators: string | null
  } | null = null
  if (article.company_id) {
    const { data } = await supabase
      .from("companies")
      .select("name, description, differentiators")
      .eq("id", article.company_id)
      .single()
    company = data
  }

  // Get contacts context (key people for this company)
  let companyContacts: Array<{ first_name: string; last_name: string; title: string | null }> = []
  if (article.company_id) {
    const { data } = await supabase
      .from("contacts")
      .select("first_name, last_name, title")
      .eq("company_id", article.company_id)
      .eq("show_on_articles", true)
      .limit(5)
    companyContacts = data || []
  }

  try {
    // 1. Extract key people from article content
    let keyPeople: string[] = article.key_people || []

    if (keyPeople.length === 0 && anthropicService.isConfigured()) {
      try {
        keyPeople = await anthropicService.extractKeyPeople(article.title, articleContent)
        if (keyPeople.length > 0) {
          updateData.key_people = keyPeople
          fieldsUpdated.push(`key_people: ${keyPeople.join(", ")}`)
        }
      } catch (e) {
        console.error("Failed to extract key people:", e)
      }
    }

    // Add company contacts to key people if not already included
    for (const contact of companyContacts) {
      const contactName = `${contact.first_name} ${contact.last_name}`.trim()
      if (contactName && !keyPeople.includes(contactName)) {
        keyPeople.push(contactName)
      }
    }

    // 2. Generate AI excerpt with company/contact context
    if (anthropicService.isConfigured()) {
      try {
        // Build context string
        let context = ""
        if (company) {
          context += `Company: ${company.name}\n`
          if (company.description) {
            context += `About: ${company.description.slice(0, 500)}\n`
          }
          if (company.differentiators) {
            context += `Key differentiators: ${company.differentiators.slice(0, 300)}\n`
          }
        }
        if (keyPeople.length > 0) {
          context += `Key people: ${keyPeople.slice(0, 5).join(", ")}\n`
        }

        const excerpt = await anthropicService.generateExcerpt(
          article.title,
          articleContent,
          context
        )
        if (excerpt) {
          updateData.excerpt = excerpt
          fieldsUpdated.push("excerpt")
        }
      } catch (e) {
        console.error("Failed to generate excerpt:", e)
        fieldsUpdated.push("excerpt generation failed")
      }
    }

    // 3. Clear existing enhancements before adding new ones
    await supabase.from("article_enhancements").delete().eq("article_id", article.id)

    // 4. Find related YouTube videos
    if (youtubeService.isConfigured()) {
      try {
        const allVideos: Array<{
          videoId: string
          title: string
          url: string
          channel: string
          duration: string
          thumbnail: string
          viewCount?: number
        }> = []

        // First, search for videos featuring key people (company contacts + extracted people)
        for (const personName of keyPeople.slice(0, 3)) {
          const searchQuery = company?.name
            ? `"${personName}" "${company.name}" interview OR talk OR podcast`
            : `"${personName}" interview OR talk OR podcast`

          const videos = await youtubeService.searchVideos(searchQuery, {
            maxResults: 4,
            videoDuration: "medium",
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
            }))
          )
        }

        // Then, search by topic if we don't have enough videos
        if (allVideos.length < 4) {
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

          for (const query of queries.slice(0, 2)) {
            const videos = await youtubeService.searchVideos(query, {
              maxResults: 5,
              videoDuration: "medium",
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
              }))
            )
          }
        }

        // Deduplicate
        const uniqueVideos = allVideos.filter(
          (v, i, arr) => arr.findIndex((x) => x.videoId === v.videoId) === i
        )

        // Select best 4
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

        for (const video of selectedVideos) {
          const { error } = await supabase.from("article_enhancements").insert({
            article_id: article.id,
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
            },
          })
          if (!error) enhancementsCreated++
        }

        if (selectedVideos.length > 0) {
          fieldsUpdated.push(`${selectedVideos.length} YouTube videos`)
        }
      } catch (e) {
        console.error("Failed to find YouTube videos:", e)
      }
    }

    // 5. Find related academic papers
    if (perplexityService.isConfigured()) {
      try {
        const allPapers: Array<{
          title: string
          url: string
          authors: string[]
          abstract?: string | null
          journal?: string | null
          citationCount?: number | null
          year?: number | null
          doi?: string | null
        }> = []

        // Search by key people first
        for (const personName of keyPeople.slice(0, 3)) {
          const authorPapers = await perplexityService.searchByAuthor(personName, article.title, 4)
          allPapers.push(...authorPapers)
        }

        // Search by topic if we don't have enough
        if (allPapers.length < 4) {
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

          for (const query of queries.slice(0, 2)) {
            const papers = await perplexityService.searchPapers(query, { limit: 4 })
            allPapers.push(...papers)
          }
        }

        // Deduplicate
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

        // Select best 4
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
            article_id: article.id,
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
            },
          })
          if (!error) enhancementsCreated++
        }

        if (selectedPapers.length > 0) {
          fieldsUpdated.push(`${selectedPapers.length} papers`)
        }
      } catch (e) {
        console.error("Failed to find papers:", e)
      }

      // 6. Find related books using Google Books API (real, verified books)
      try {
        const allBooks: Array<{
          title: string
          url: string
          authors: string[]
          description: string | null
          thumbnail: string | null
          publishedDate: string | null
          rating: number | null
        }> = []

        // Search by key people first (using Google Books for real results)
        for (const personName of keyPeople.slice(0, 3)) {
          const authorBooks = await googleBooksService.searchBooksByAuthor(personName, article.title, 4)
          allBooks.push(
            ...authorBooks.map((b) => ({
              title: b.title,
              url: b.url,
              authors: b.authors,
              description: b.description,
              thumbnail: b.thumbnail,
              publishedDate: b.year?.toString() || null,
              rating: b.rating,
            }))
          )
        }

        // Search by topic if we don't have enough
        if (allBooks.length < 4) {
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

          for (const query of queries.slice(0, 2)) {
            const books = await googleBooksService.searchBooks(query, { limit: 4 })
            allBooks.push(
              ...books.map((b) => ({
                title: b.title,
                url: b.url,
                authors: b.authors,
                description: b.description,
                thumbnail: b.thumbnail,
                publishedDate: b.year?.toString() || null,
                rating: b.rating,
              }))
            )
          }
        }

        // Deduplicate
        const seen = new Set<string>()
        const uniqueBooks = allBooks.filter((b) => {
          const titleKey = b.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40)
          if (seen.has(titleKey)) return false
          seen.add(titleKey)
          return true
        })

        // Select best 4
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
            article_id: article.id,
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
          if (!error) enhancementsCreated++
        }

        if (selectedBooks.length > 0) {
          fieldsUpdated.push(`${selectedBooks.length} books`)
        }
      } catch (e) {
        console.error("Failed to find books:", e)
      }
    }

    // Update article record
    if (Object.keys(updateData).length > 0 || enhancementsCreated > 0) {
      updateData.ai_enhanced = true
      const { error: updateError } = await supabase
        .from("articles")
        .update(updateData)
        .eq("id", article.id)

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`)
      }
    }

    return {
      id: article.id,
      title: article.title,
      success: true,
      fieldsUpdated,
      enhancementsCreated,
    }
  } catch (error) {
    return {
      id: article.id,
      title: article.title,
      success: false,
      fieldsUpdated,
      enhancementsCreated,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
