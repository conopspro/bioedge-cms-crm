"use client"

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
 * Displays a book reference with author, thumbnail, and rating.
 * Matches the leaders page card style.
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
  const thumbnail = metadata?.thumbnail
  const rating = metadata?.rating

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="be-card hover:shadow-lg transition-shadow flex gap-4 relative"
    >
      {editable && enhancementId && (
        <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}>
          <DeleteEnhancementButton
            enhancementId={enhancementId}
            enhancementTitle={title}
            onDeleted={onDeleted}
          />
        </div>
      )}

      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="w-16 h-24 object-cover rounded flex-shrink-0"
        />
      )}

      <div className="min-w-0">
        <h3 className="font-heading font-semibold text-navy hover:text-electric-blue transition-colors line-clamp-2">
          {title}
        </h3>
        {authors.length > 0 && (
          <p className="text-sm text-text-light mt-1">
            {authors.join(", ")}
          </p>
        )}
        {rating && (
          <p className="text-sm text-gold mt-1">
            ★ {rating.toFixed(1)}
          </p>
        )}
      </div>
    </a>
  )
}
