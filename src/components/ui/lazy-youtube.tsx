"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { extractYouTubeVideoId, getYouTubeThumbnailUrl, getYouTubeEmbedUrl } from "@/lib/youtube"

interface LazyYouTubeProps {
  url: string
  title?: string
  className?: string
  thumbnailQuality?: "maxresdefault" | "sddefault" | "hqdefault" | "mqdefault"
  autoplayOnClick?: boolean
}

export function LazyYouTube({
  url,
  title = "Video",
  className,
  thumbnailQuality = "hqdefault",
  autoplayOnClick = true,
}: LazyYouTubeProps) {
  const [loaded, setLoaded] = useState(false)
  const videoId = extractYouTubeVideoId(url)

  if (!videoId) return null

  const thumbnailUrl = getYouTubeThumbnailUrl(videoId, thumbnailQuality)
  const embedUrl = getYouTubeEmbedUrl(url, { autoplay: autoplayOnClick })

  if (loaded && embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className || "absolute inset-0 w-full h-full border-0"}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className={className || "absolute inset-0 w-full h-full border-0 p-0 cursor-pointer group"}
      aria-label={`Play ${title}`}
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center transition-colors shadow-lg">
          <Play className="h-8 w-8 text-white ml-1" fill="white" />
        </div>
      </div>
    </button>
  )
}
