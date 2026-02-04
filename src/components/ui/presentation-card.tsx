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
 * Styled to match ArticleCard with:
 * - Blue ring around card
 * - Hover shadow effect
 * - Optional thumbnail with play icon overlay
 * - Consistent typography
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
        "be-card hover:shadow-lg transition-shadow group block",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-4 relative">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
      )}
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
