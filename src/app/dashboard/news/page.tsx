import { createClient } from "@/lib/supabase/server"
import { NewsTable } from "@/components/news/news-table"

/**
 * News Admin Page
 *
 * Lists all ingested news articles with status management,
 * and a button to trigger manual ingestion.
 */
export default async function NewsAdminPage() {
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })

  if (error) {
    console.error("Error fetching news articles:", error)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Longevity News</h1>
          <p className="text-muted-foreground">
            Manage ingested news articles from RSS feeds.
          </p>
        </div>
      </div>

      {/* News Table */}
      <NewsTable articles={articles || []} />
    </div>
  )
}
