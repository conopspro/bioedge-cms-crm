"use client"

import { ExternalLink, BookOpen, Quote, Users } from "lucide-react"
import type { ScholarEnhancementMetadata } from "@/types/database"
import { DeleteEnhancementButton } from "./enhancement-actions"

interface ScholarPaperCardProps {
  title: string
  url: string
  metadata: ScholarEnhancementMetadata | null
  /** Enhancement ID for CRUD operations */
  enhancementId?: string
  /** Whether to show edit/delete controls */
  editable?: boolean
  /** Callback when deleted */
  onDeleted?: () => void
}

/**
 * Scholar Paper Card
 *
 * Displays an academic paper reference with rich metadata from
 * Semantic Scholar, PubMed, CrossRef, or Google Scholar.
 */
export function ScholarPaperCard({
  title,
  url,
  metadata,
  enhancementId,
  editable = false,
  onDeleted,
}: ScholarPaperCardProps) {
  const authors = metadata?.authors || []
  const publication = metadata?.publication
  const year = metadata?.year
  const citedBy = metadata?.citedBy
  const abstract = metadata?.abstract || metadata?.snippet
  const doi = metadata?.doi
  const source = metadata?.source

  // Determine the link text based on source
  const getLinkText = () => {
    if (url.includes("pubmed.ncbi.nlm.nih.gov")) return "View on PubMed"
    if (url.includes("semanticscholar.org")) return "View on Semantic Scholar"
    if (url.includes("doi.org")) return "View Paper (DOI)"
    return "View Paper"
  }

  return (
    <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
      {/* Header with icon */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title with delete button */}
          <div className="flex items-start justify-between gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sm hover:text-primary hover:underline line-clamp-2"
            >
              {title}
            </a>
            {editable && enhancementId && (
              <DeleteEnhancementButton
                enhancementId={enhancementId}
                enhancementTitle={title}
                onDeleted={onDeleted}
              />
            )}
          </div>

          {/* Authors */}
          {authors.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="truncate">
                {authors.length > 3
                  ? `${authors.slice(0, 3).join(", ")} et al.`
                  : authors.join(", ")}
              </span>
            </p>
          )}

          {/* Publication info */}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
            {publication && (
              <span className="truncate max-w-[200px] italic">{publication}</span>
            )}
            {year && (
              <>
                {publication && <span>•</span>}
                <span>{year}</span>
              </>
            )}
            {citedBy !== null && citedBy !== undefined && citedBy > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Quote className="h-3 w-3" />
                  {citedBy.toLocaleString()} citations
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Abstract */}
      {abstract && (
        <p className="mt-3 text-xs text-muted-foreground line-clamp-3">
          {abstract}
        </p>
      )}

      {/* Footer with DOI and link */}
      <div className="mt-3 flex items-center justify-between">
        {doi && (
          <span className="text-xs text-muted-foreground font-mono">
            DOI: {doi.length > 30 ? `${doi.slice(0, 30)}...` : doi}
          </span>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {getLinkText()}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Source badge */}
      {source && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            via Perplexity
          </span>
        </div>
      )}
    </div>
  )
}
