"use client"

import { Book, Star, ShoppingCart } from "lucide-react"
import type { BookEnhancementMetadata } from "@/types/database"
import { DeleteEnhancementButton } from "./enhancement-actions"

interface BookCardProps {
  title: string
  url: string
  metadata: BookEnhancementMetadata | null
  /** Enhancement ID for CRUD operations */
  enhancementId?: string
  /** Whether to show edit/delete controls */
  editable?: boolean
  /** Callback when deleted */
  onDeleted?: () => void
}

/**
 * Book Card
 *
 * Displays a book reference with author, thumbnail, and description.
 * Supports Amazon links (via Perplexity) and Google Books.
 */
export function BookCard({
  title,
  url,
  metadata,
  enhancementId,
  editable = false,
  onDeleted,
}: BookCardProps) {
  // Support both old (author) and new (authors) formats
  const authors = metadata?.authors?.length
    ? metadata.authors
    : metadata?.author
      ? [metadata.author]
      : []
  const description = metadata?.description || metadata?.snippet
  const thumbnail = metadata?.thumbnail
  const rating = metadata?.rating
  const publishedDate = metadata?.publishedDate

  return (
    <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
      {/* Header with thumbnail or icon */}
      <div className="flex items-start gap-3">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="flex-shrink-0 w-16 h-20 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="flex-shrink-0 w-16 h-20 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Book className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        )}

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
            <p className="mt-1 text-xs text-muted-foreground">
              by {authors.join(", ")}
            </p>
          )}

          {/* Rating and year */}
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {rating && (
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
            {publishedDate && (
              <span>{publishedDate.split("-")[0]}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-3 text-xs text-muted-foreground line-clamp-3">
          {description}
        </p>
      )}

      {/* External link - Amazon */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline"
      >
        <ShoppingCart className="h-3 w-3" />
        View on Amazon
      </a>
    </div>
  )
}
