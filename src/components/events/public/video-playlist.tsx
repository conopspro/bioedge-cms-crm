"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface Video {
  url: string
  title?: string
  thumbnail?: string
}

interface VideoPlaylistProps {
  videos: Video[]
  className?: string
}

function getVideoId(url: string): { type: "youtube" | "vimeo" | null; id: string | null } {
  // YouTube patterns
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  if (youtubeMatch) {
    return { type: "youtube", id: youtubeMatch[1] }
  }

  // Vimeo patterns
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return { type: "vimeo", id: vimeoMatch[1] }
  }

  return { type: null, id: null }
}

function getEmbedUrl(url: string): string | null {
  const { type, id } = getVideoId(url)
  if (!id) return null

  if (type === "youtube") {
    return `https://www.youtube.com/embed/${id}`
  }
  if (type === "vimeo") {
    return `https://player.vimeo.com/video/${id}`
  }
  return null
}

function getThumbnail(url: string): string | null {
  const { type, id } = getVideoId(url)
  if (!id) return null

  if (type === "youtube") {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  }
  // Vimeo thumbnails require API call, so we'll use a placeholder
  return null
}

export function VideoPlaylist({ videos, className }: VideoPlaylistProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!videos || videos.length === 0) {
    return null
  }

  const validVideos = videos.filter((v) => getEmbedUrl(v.url))
  if (validVideos.length === 0) {
    return null
  }

  const currentVideo = validVideos[selectedIndex]
  const embedUrl = getEmbedUrl(currentVideo.url)

  return (
    <div className={cn("w-full", className)}>
      {/* Main Video Player */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
        {embedUrl && (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.title || "Video"}
          />
        )}
      </div>

      {/* Video Thumbnails / Playlist */}
      {validVideos.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {validVideos.map((video, index) => {
            const thumbnail = video.thumbnail || getThumbnail(video.url)
            const isActive = index === selectedIndex

            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                  isActive
                    ? "border-gold ring-2 ring-gold/20"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={video.title || `Video ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Play overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                    isActive ? "opacity-0" : "opacity-100 hover:opacity-60"
                  )}
                >
                  <Play className="h-8 w-8 text-white" />
                </div>

                {/* Video number badge */}
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
