"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { getArticleImageUrl } from "@/lib/youtube"
import { Play } from "lucide-react"

export interface ArticleCardProps {
  id: string
  title: string
  slug?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  featuredImage?: string | null
  youtubeUrl?: string | null
  className?: string
}

/**
 * ArticleCard - Consistent article display card
 *
 * Horizontal layout with:
 * - Thumbnail on left (33% width) when available
 * - Falls back to YouTube thumbnail if no featured image
 * - Title and excerpt on the right
 * - Blue ring around card
 * - Hover shadow effect
 */
export function ArticleCard({
  id,
  title,
  slug,
  excerpt,
  publishedAt,
  featuredImage,
  youtubeUrl,
  className,
}: ArticleCardProps) {
  const linkHref = `/articles/${slug || id}`

  // Use featured image, or fall back to YouTube thumbnail
  const imageUrl = getArticleImageUrl(featuredImage, youtubeUrl)
  const hasVideo = !featuredImage && youtubeUrl

  return (
    <Link
      href={linkHref}
      className={cn(
        "bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow group flex",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {imageUrl && (
        <div className="w-1/3 flex-shrink-0 overflow-hidden bg-gray-100 relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to hqdefault if maxresdefault doesn't exist
              const target = e.target as HTMLImageElement
              if (target.src.includes("maxresdefault")) {
                target.src = target.src.replace("maxresdefault", "hqdefault")
              }
            }}
          />
          {/* Play icon overlay for video thumbnails */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0 p-5">
        <h3
          className="font-heading font-semibold transition-colors line-clamp-2"
          style={{ color: "#0d2840" }}
        >
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm mt-2 line-clamp-2" style={{ color: "#5a6a7a" }}>
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

/**
 * ArticleCardGrid - Consistent grid layout for article cards
 */
export function ArticleCardGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}
