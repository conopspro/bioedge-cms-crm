/**
 * News Test API
 *
 * POST /api/news/test
 *
 * Fetches feeds and analyzes just ONE article (the newest) without saving to DB.
 * Returns the full AI analysis so you can preview the output and tweak the prompt.
 *
 * Protected by admin session only (not for cron).
 */

import { createClient } from "@/lib/supabase/server"
import { fetchAllFeeds } from "@/lib/services/rss-parser"
import { anthropicService } from "@/lib/services/anthropic"

export const maxDuration = 60

export async function POST() {
  // Auth: admin session only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!anthropicService.isConfigured()) {
    return Response.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    )
  }

  try {
    // 1. Fetch all RSS feeds
    const feedItems = await fetchAllFeeds()

    if (feedItems.length === 0) {
      return Response.json(
        { error: "No items found in RSS feeds" },
        { status: 404 }
      )
    }

    // 2. Get existing URLs for deduplication
    const urls = feedItems.map((item) => item.url)
    const { data: existing } = await supabase
      .from("news_articles")
      .select("url")
      .in("url", urls)

    const existingUrls = new Set((existing || []).map((e: { url: string }) => e.url))
    const newItems = feedItems.filter((item) => !existingUrls.has(item.url))

    // Sort newest first
    newItems.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })

    if (newItems.length === 0) {
      return Response.json(
        { error: "All articles already ingested — nothing new to test" },
        { status: 404 }
      )
    }

    // 3. Analyze just the first (newest) article
    const item = newItems[0]

    const previousModel = anthropicService.getModel()
    anthropicService.setModel("fast") // Use Haiku like batch

    const analysis = await anthropicService.analyzeNewsArticle(
      item.title,
      item.url,
      item.content
    )

    anthropicService.setModel(previousModel)

    // 4. Return the full preview (NOT saved to DB)
    return Response.json({
      preview: {
        title: item.title,
        url: item.url,
        source_name: item.sourceName,
        published_at: item.publishedAt,
        author: item.author,
        content_preview: item.content.slice(0, 500),
        // AI analysis results
        summary: analysis.summary,
        key_points: analysis.keyPoints,
        edge_significance: analysis.edgeSignificance,
        edge_categories: analysis.edgeCategories,
        biological_systems: analysis.biologicalSystems,
      },
      stats: {
        total_feed_items: feedItems.length,
        already_ingested: existingUrls.size,
        new_available: newItems.length,
      },
    })
  } catch (err) {
    console.error("[News Test] Error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
