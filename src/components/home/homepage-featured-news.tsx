import Link from "next/link"
import { ExternalLink, Newspaper } from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  url: string
  source_name: string
  published_at: string | null
  summary: string | null
  edge_categories: string[]
  biological_systems: string[]
}

interface HomepageFeaturedNewsProps {
  articles: NewsArticle[]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

export function HomepageFeaturedNews({ articles }: HomepageFeaturedNewsProps) {
  if (articles.length === 0) return null

  return (
    <section className="bg-off-white py-12 px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white bg-electric-blue">
            News
          </span>
          <h2 className="text-[30px] font-bold tracking-wide text-navy">
            Longevity News
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => {
            const date = formatDate(article.published_at)

            return (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex flex-1 flex-col p-6">
                  {/* Source & Date */}
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-electric-blue">
                      {article.source_name}
                    </span>
                    {date && (
                      <>
                        <span className="text-gray-300">&bull;</span>
                        <span>{date}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-electric-blue line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  {article.summary && (
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {article.summary}
                    </p>
                  )}

                  {/* Footer: Systems + Read link */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex flex-wrap gap-1">
                      {article.biological_systems.slice(0, 3).map((system) => (
                        <span
                          key={system}
                          className="rounded-full bg-electric-blue/10 px-2 py-0.5 text-[10px] font-medium text-electric-blue"
                        >
                          {system}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-electric-blue transition-colors group-hover:text-navy">
                      Read
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
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
