import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { NewsCard } from "./news-card"

interface SystemNewsProps {
  /** The biological system name exactly as stored in DB, e.g. "Breath", "Energy Production" */
  system: string
  /** Display label for the heading, e.g. "Breath" or "Energy Production" */
  label: string
}

/**
 * Server component that fetches and displays the 6 most recent published
 * news articles related to a specific biological system. Designed to be
 * embedded on each system detail page, above or below the SystemDirectory.
 */
export async function SystemNews({ system, label }: SystemNewsProps) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("news_articles")
    .select(
      "id, title, url, source_name, published_at, summary, key_points, edge_significance, edge_categories, biological_systems"
    )
    .eq("status", "published")
    .contains("biological_systems", [system])
    .order("published_at", { ascending: false })
    .limit(6)

  if (!data || data.length === 0) return null

  return (
    <div id="news" className="scroll-mt-16 border-t border-border pt-10 mt-10">
      <h2 className="font-heading font-bold text-2xl text-navy mb-2">
        Related Longevity News
      </h2>
      <p className="text-text-light mb-6">
        Recent research and developments related to the {label} system.
      </p>

      <div className="grid gap-6">
        {data.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={`/news?system=${encodeURIComponent(system)}`}
          className="text-sm font-medium text-electric-blue hover:text-navy transition-colors"
        >
          Longevity News &rarr;
        </Link>
      </div>
    </div>
  )
}
