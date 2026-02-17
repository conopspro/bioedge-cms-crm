import Link from "next/link"
import { NewsCard } from "@/components/directory/news-card"

interface NewsArticle {
  id: string
  title: string
  url: string
  source_name: string
  published_at: string | null
  summary: string | null
  key_points: string[]
  edge_significance: string | null
  edge_categories: string[]
  biological_systems: string[]
}

interface HomepageFeaturedNewsProps {
  articles: NewsArticle[]
}

export function HomepageFeaturedNews({ articles }: HomepageFeaturedNewsProps) {
  if (articles.length === 0) return null

  return (
    <section className="bg-off-white py-12 px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 text-center">
          <h2 className="text-[30px] font-bold tracking-wide text-navy">
            <Link href="/news" className="hover:text-electric-blue transition-colors">
              Longevity News
            </Link>
          </h2>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-electric-blue font-semibold hover:text-navy transition-colors"
          >
            View All Longevity News →
          </Link>
        </div>
      </div>
    </section>
  )
}
