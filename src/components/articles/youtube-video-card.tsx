"use client"

import { useState } from "react"
import { Play, Clock, Eye, ExternalLink } from "lucide-react"
import type { YouTubeEnhancementMetadata } from "@/types/database"
import { DeleteEnhancementButton } from "./enhancement-actions"

interface YouTubeVideoCardProps {
  title: string
  url: string
  metadata: YouTubeEnhancementMetadata | null
  embedUrl?: string
  /** Enhancement ID for CRUD operations */
  enhancementId?: string
  /** Whether to show edit/delete controls */
  editable?: boolean
  /** Callback when deleted */
  onDeleted?: () => void
}

/**
 * YouTube Video Card with Facade Pattern
 *
 * Shows a thumbnail with play button overlay initially.
 * Only loads the iframe embed when the user clicks to play.
 * This dramatically improves page load performance.
 */
export function YouTubeVideoCard({
  title,
  url,
  metadata,
  embedUrl,
  enhancementId,
  editable = false,
  onDeleted,
}: YouTubeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const videoId = metadata?.videoId
  const thumbnail = metadata?.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null)
  const duration = metadata?.duration
  const channel = metadata?.channel
  const viewCount = metadata?.viewCount
  const isHD = metadata?.definition === "hd"

  // Format view count (e.g., 1234567 -> "1.2M")
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  // Determine embed URL
  const embed = embedUrl || (videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null)

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Video container */}
      <div className="relative aspect-video bg-black">
        {isPlaying && embed ? (
          // Embedded player
          <iframe
            src={embed}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Thumbnail facade
          <>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Play className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {/* Play button overlay */}
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              aria-label={`Play ${title}`}
            >
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg">
                <Play className="h-8 w-8 text-white ml-1" fill="white" />
              </div>
            </button>

            {/* Duration badge */}
            {duration && (
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                {duration}
              </div>
            )}

            {/* HD badge */}
            {isHD && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                HD
              </div>
            )}
          </>
        )}
      </div>

      {/* Video info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2 mb-1">
            {title}
          </h4>
          {editable && enhancementId && (
            <DeleteEnhancementButton
              enhancementId={enhancementId}
              enhancementTitle={title}
              onDeleted={onDeleted}
            />
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {channel && (
            <span className="truncate max-w-[150px]">{channel}</span>
          )}

          {viewCount !== undefined && viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViewCount(viewCount)} views
            </span>
          )}
        </div>

        {/* External link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Watch on YouTube
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
