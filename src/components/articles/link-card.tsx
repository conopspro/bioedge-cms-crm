"use client"

import { ExternalLink, Link as LinkIcon } from "lucide-react"
import { DeleteEnhancementButton } from "./enhancement-actions"

interface LinkCardProps {
  title: string
  url: string
  /** Enhancement ID for CRUD operations */
  enhancementId?: string
  /** Whether to show edit/delete controls */
  editable?: boolean
  /** Callback when deleted */
  onDeleted?: () => void
}

/**
 * Link Card
 *
 * Displays a generic link enhancement.
 */
export function LinkCard({
  title,
  url,
  enhancementId,
  editable = false,
  onDeleted,
}: LinkCardProps) {
  // Extract domain from URL for display
  let domain = ""
  try {
    const urlObj = new URL(url)
    domain = urlObj.hostname.replace("www.", "")
  } catch {
    domain = url
  }

  return (
    <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
      {/* Header with icon */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <LinkIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm hover:text-primary hover:underline line-clamp-2"
          >
            {title || url}
          </a>

          {/* Domain */}
          <p className="mt-1 text-xs text-muted-foreground truncate">
            {domain}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {editable && enhancementId && (
            <DeleteEnhancementButton
              enhancementId={enhancementId}
              enhancementTitle={title}
              onDeleted={onDeleted}
            />
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
