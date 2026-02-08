import Link from "next/link"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"

export interface PresentationCardProps {
  id: string
  title: string
  slug?: string | null
  shortDescription?: string | null
  thumbnailUrl?: string | null
  className?: string
}

/**
 * PresentationCard - Consistent presentation display card
 *
 * Horizontal layout with:
 * - Thumbnail on left (33% width) with play icon overlay
 * - Title and description on the right
 * - Blue ring around card
 * - Hover shadow effect
 */
export function PresentationCard({
  id,
  title,
  slug,
  shortDescription,
  thumbnailUrl,
  className,
}: PresentationCardProps) {
  const linkHref = `/presentations/${slug || id}`

  return (
    <Link
      href={linkHref}
      className={cn(
        "bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow group flex",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {thumbnailUrl && (
        <div className="w-1/3 flex-shrink-0 overflow-hidden bg-gray-100 relative aspect-video">
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0 p-5">
        <h3
          className="font-heading font-semibold transition-colors line-clamp-2"
          style={{ color: "#0d2840" }}
        >
          {title}
        </h3>
        {shortDescription && (
          <p className="text-sm mt-2 line-clamp-2" style={{ color: "#5a6a7a" }}>
            {shortDescription}
          </p>
        )}
      </div>
    </Link>
  )
}

/**
 * PresentationCardGrid - Consistent grid layout for presentation cards
 */
export function PresentationCardGrid({
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
