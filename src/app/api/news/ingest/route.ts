/**
 * News Ingestion API
 *
 * GET  /api/news/ingest — called by Vercel cron (Authorization: Bearer CRON_SECRET)
 * POST /api/news/ingest — called by dashboard manual trigger (admin session)
 *
 * Fetches all 12 RSS feeds, deduplicates against existing articles,
 * runs Claude AI analysis on new articles, and inserts into news_articles.
 *
 * Streams progress events as newline-delimited JSON so the dashboard
 * can show real-time feedback for each article processed.
 *
 * Processes up to 20 articles per run to stay within timeout limits.
 * Call repeatedly (or let the cron handle it) to process all backlog.
 *
 * Protected by CRON_SECRET for Vercel cron jobs.
 * Can also be triggered manually from the dashboard.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchAllFeeds } from "@/lib/services/rss-parser"
import { anthropicService } from "@/lib/services/anthropic"

// Max articles to analyze per invocation (keeps within timeout)
const MAX_ARTICLES_PER_RUN = 20

// Allow up to 5 minutes for this route
export const maxDuration = 300

// Prevent Vercel from caching the GET response
export const dynamic = "force-dynamic"

// Vercel cron sends GET requests
export async function GET(request: NextRequest) {
  return handleIngest(request)
}

// Dashboard manual trigger sends POST requests
export async function POST(request: NextRequest) {
  return handleIngest(request)
}

async function handleIngest(request: NextRequest) {
  // Auth check: either CRON_SECRET header (Vercel cron) or admin session
  const cronSecret = request.headers.get("authorization")?.replace("Bearer ", "")
  const vercelCronSecret = request.headers.get("x-vercel-cron-secret") // Vercel-injected

  if (
    process.env.CRON_SECRET &&
    cronSecret !== process.env.CRON_SECRET &&
    vercelCronSecret !== process.env.CRON_SECRET
  ) {
    // Check for authenticated admin session as fallback
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!anthropicService.isConfigured()) {
    return Response.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    )
  }

  const supabase = await createClient()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: Record<string, unknown>) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
      }

      try {
        // 1. Fetch all RSS feeds
        send({ type: "status", message: "Fetching RSS feeds..." })
        const feedItems = await fetchAllFeeds()
        send({ type: "status", message: `Found ${feedItems.length} articles across all feeds` })

        if (feedItems.length === 0) {
          send({ type: "done", ingested: 0, skipped: 0, remaining: 0, errors: [], message: "No items found in RSS feeds" })
          controller.close()
          return
        }

        // 2. Get existing URLs for deduplication
        send({ type: "status", message: "Checking for duplicates..." })
        const urls = feedItems.map((item) => item.url)
        const { data: existing } = await supabase
          .from("news_articles")
          .select("url")
          .in("url", urls)

        const existingUrls = new Set((existing || []).map((e: { url: string }) => e.url))
        const allNewItems = feedItems.filter((item) => !existingUrls.has(item.url))

        // Sort newest first so we prioritize recent articles
        allNewItems.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })

        // Cap to MAX_ARTICLES_PER_RUN
        const newItems = allNewItems.slice(0, MAX_ARTICLES_PER_RUN)
        const remaining = allNewItems.length - newItems.length

        send({
          type: "status",
          message: `${allNewItems.length} new articles found (${existingUrls.size} already exist). Processing ${newItems.length} this batch.`,
        })

        if (newItems.length === 0) {
          send({ type: "done", ingested: 0, skipped: existingUrls.size, remaining: 0, errors: [], message: "All articles already ingested" })
          controller.close()
          return
        }

        // 3. Analyze and insert new articles
        const previousModel = anthropicService.getModel()
        anthropicService.setModel("fast") // Use Haiku for batch ingestion

        let ingested = 0
        const errors: string[] = []

        for (let i = 0; i < newItems.length; i++) {
          const item = newItems[i]
          send({
            type: "progress",
            current: i + 1,
            total: newItems.length,
            title: item.title,
            source: item.sourceName,
          })

          try {
            // Run AI analysis
            const analysis = await anthropicService.analyzeNewsArticle(
              item.title,
              item.url,
              item.content
            )

            // Insert into database
            const { error: insertError } = await supabase
              .from("news_articles")
              .insert({
                title: item.title,
                url: item.url,
                source_name: item.sourceName,
                source_feed_url: item.sourceFeedUrl,
                published_at: item.publishedAt,
                author: item.author,
                summary: analysis.summary || null,
                key_points: analysis.keyPoints,
                edge_significance: analysis.edgeSignificance || null,
                edge_categories: analysis.edgeCategories,
                biological_systems: analysis.biologicalSystems,
                raw_content: item.content || null,
                status: "published",
                ai_model: anthropicService.getModel(),
                analyzed_at: new Date().toISOString(),
              })

            if (insertError) {
              if (insertError.code === "23505") {
                send({ type: "skip", title: item.title, reason: "duplicate" })
                continue
              }
              errors.push(`Insert failed for "${item.title}": ${insertError.message}`)
              send({ type: "error", title: item.title, message: insertError.message })
            } else {
              ingested++
              send({ type: "ingested", title: item.title, source: item.sourceName, current: ingested })
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            errors.push(`Failed to process "${item.title}": ${message}`)
            send({ type: "error", title: item.title, message })
          }
        }

        // Restore previous model
        anthropicService.setModel(previousModel)

        send({
          type: "done",
          ingested,
          skipped: existingUrls.size,
          remaining,
          total_feed_items: feedItems.length,
          errors: errors.slice(0, 20),
        })
      } catch (err) {
        console.error("[News Ingest] Fatal error:", err)
        send({ type: "fatal", error: err instanceof Error ? err.message : "Unknown error" })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  })
}
