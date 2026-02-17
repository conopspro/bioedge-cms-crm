"use client"

import { ExternalLink } from "lucide-react"

interface NewsCardProps {
  article: {
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

export function NewsCard({ article }: NewsCardProps) {
  const date = formatDate(article.published_at)

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="p-6">
        {/* Source & Date */}
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium">{article.source_name}</span>
          {date && (
            <>
              <span className="text-gray-300">&bull;</span>
              <span>{date}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-4 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-electric-blue">
          {article.title}
        </h3>

        {/* Two-column body: Summary + Key Points (left) | Longevity Significance (right) */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column */}
          <div>
            {/* Summary */}
            {article.summary && (
              <p className="mb-3 text-sm leading-relaxed text-gray-600">
                {article.summary}
              </p>
            )}

            {/* Key Points */}
            {article.key_points && article.key_points.length > 0 && (
              <ul className="space-y-1">
                {article.key_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-electric-blue" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right column */}
          <div>
            {article.edge_significance && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                  Longevity Significance
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {article.edge_significance}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Related Systems + EDGE categories + Read Article */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {article.biological_systems.length > 0 && (
              <span className="text-xs text-electric-blue">
                {article.biological_systems.join(" · ")}
              </span>
            )}
            {article.edge_categories.length > 0 && (
              <span className="text-xs text-gray-500">
                {article.edge_categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)).join(" · ")}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-electric-blue transition-colors group-hover:text-navy">
            Read Article
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  )
}
