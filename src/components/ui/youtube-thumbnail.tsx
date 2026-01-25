"use client"

import { useState } from "react"
import { getYouTubeThumbnailUrl } from "@/lib/youtube"

interface YouTubeThumbnailProps {
  url: string
  alt: string
  className?: string
  showPlayButton?: boolean
}

/**
 * YouTube Thumbnail with automatic fallback
 *
 * Attempts to load maxresdefault, falls back to hqdefault if not available.
 * This is a client component to handle the onError event.
 */
export function YouTubeThumbnail({
  url,
  alt,
  className = "h-full w-full object-cover",
  showPlayButton = true,
}: YouTubeThumbnailProps) {
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">("maxresdefault")

  const thumbnailUrl = getYouTubeThumbnailUrl(url, quality)

  if (!thumbnailUrl) return null

  return (
    <>
      <img
        src={thumbnailUrl}
        alt={alt}
        className={className}
        onError={() => {
          if (quality === "maxresdefault") {
            setQuality("hqdefault")
          }
        }}
      />
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="rounded-full bg-red-600 p-2 shadow-lg">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </>
  )
}
