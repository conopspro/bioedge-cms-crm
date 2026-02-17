/**
 * RSS Feed Parser Service
 *
 * Fetches and normalizes articles from 13 curated longevity RSS feeds.
 * Used by the /api/news/ingest endpoint to populate the news_articles table.
 */

import Parser from "rss-parser"

const parser = new Parser({
  timeout: 15_000,
  headers: {
    "User-Agent": "bioEDGE-Longevity-News/1.0",
  },
})

/** A feed source with display name and RSS URL */
export interface FeedSource {
  name: string
  url: string
}

/** Normalized article from any RSS feed */
export interface FeedItem {
  title: string
  url: string
  content: string           // first 4000 chars of article content
  publishedAt: string | null // ISO date string
  author: string | null
  sourceName: string
  sourceFeedUrl: string
}

/**
 * The 13 curated longevity RSS feed sources
 */
export const FEED_SOURCES: FeedSource[] = [
  { name: "LifeSpan.io", url: "https://www.lifespan.io/feed" },
  { name: "Longevity.Technology", url: "https://longevity.technology/feed" },
  { name: "LT Wire", url: "https://longevity.technology/category/lt-wire/feed" },
  { name: "Nature Aging", url: "https://www.nature.com/nataging.rss" },
  { name: "Nature - npj Aging", url: "https://www.nature.com/npjamd.rss" },
  { name: "Neuroscience News", url: "https://neurosciencenews.com/neuroscience-terms/longevity/feed" },
  { name: "Peter Attia MD", url: "https://peterattiamd.com/feed" },
  { name: "Princeton Longevity Center", url: "https://princetonlongevitycenter.com/feed" },
  {
    name: "SAGE Research on Aging",
    url: "https://journals.sagepub.com/action/showFeed?ui=0&mi=ehikzz&ai=2b4&jc=jaga&type=etoc&feed=rss",
  },
  { name: "Stanford Longevity Center", url: "https://longevity.stanford.edu/feed" },
  {
    name: "The Conversation - Longevity",
    url: "https://theconversation.com/topics/longevity-20168/articles.atom",
  },
  {
    name: "The Lancet Healthy Longevity",
    url: "https://www.thelancet.com/rssfeed/lanhl_current.xml",
  },
  {
    name: "Wiley Aging Cell",
    url: "https://onlinelibrary.wiley.com/action/showFeed?jc=14749726&type=etoc&feed=rss",
  },
]

// Only ingest articles published on or after this date
const EARLIEST_DATE = new Date("2026-02-01T00:00:00Z")

/**
 * Strip HTML tags and decode entities to get plain text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Fetch and parse a single RSS feed, returning normalized items
 */
export async function fetchFeed(
  feedUrl: string,
  sourceName: string
): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl)

    return (feed.items || [])
      .filter((item) => {
        if (!item.title || !item.link) return false
        // Skip articles published before Feb 1, 2026
        const pubDate = item.isoDate || item.pubDate
        if (pubDate) {
          const date = new Date(pubDate)
          if (!isNaN(date.getTime()) && date < EARLIEST_DATE) return false
        }
        return true
      })
      .map((item) => {
        // Get content from whichever field has it
        const rawContent =
          item["content:encoded"] ||
          item.content ||
          item.contentSnippet ||
          item.summary ||
          item.description ||
          ""

        const plainContent = stripHtml(rawContent).slice(0, 4000)

        return {
          title: stripHtml(item.title || "").slice(0, 500),
          url: item.link!,
          content: plainContent,
          publishedAt: item.isoDate || item.pubDate || null,
          author: item.creator || item["dc:creator"] || item.author || null,
          sourceName,
          sourceFeedUrl: feedUrl,
        }
      })
  } catch (error) {
    console.error(`[RSS] Failed to fetch ${sourceName} (${feedUrl}):`, error)
    return []
  }
}

/**
 * Fetch all 13 feeds in parallel and return a flat array of normalized items.
 * Feeds that fail are silently skipped (logged to console).
 */
export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchFeed(source.url, source.name))
  )

  const items: FeedItem[] = []
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value)
    }
  }

  return items
}
