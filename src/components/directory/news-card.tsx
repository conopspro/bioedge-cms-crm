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
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex flex-1 flex-col p-6">
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
        <h3 className="mb-2 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-electric-blue">
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {article.summary}
          </p>
        )}

        {/* Key Points */}
        {article.key_points && article.key_points.length > 0 && (
          <ul className="mb-3 space-y-1">
            {article.key_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-electric-blue" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Longevity Significance */}
        {article.edge_significance && (
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
              Longevity Significance
            </p>
            <p className="mt-0.5 text-xs italic leading-relaxed text-gray-700">
              {article.edge_significance}
            </p>
          </div>
        )}

        {/* Related Biological Systems */}
        {article.biological_systems.length > 0 && (
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
              Related Biological Systems
            </p>
            <p className="mt-0.5 text-xs text-electric-blue">
              {article.biological_systems.join(" · ")}
            </p>
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="mt-auto" />

        {/* Footer: EDGE categories (left) + Read Article (right) */}
        <div className="flex items-center justify-between">
          {article.edge_categories.length > 0 ? (
            <span className="text-xs text-gray-500">
              {article.edge_categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)).join(" · ")}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-electric-blue transition-colors group-hover:text-navy">
            Read Article
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  )
}
