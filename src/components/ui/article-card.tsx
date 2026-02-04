import Link from "next/link"
import { cn } from "@/lib/utils"

export interface ArticleCardProps {
  id: string
  title: string
  slug?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  featuredImage?: string | null
  className?: string
}

/**
 * ArticleCard - Consistent article display card
 *
 * Horizontal layout with:
 * - Thumbnail on left (33% width) when available
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
  className,
}: ArticleCardProps) {
  const linkHref = `/articles/${slug || id}`

  return (
    <Link
      href={linkHref}
      className={cn(
        "be-card hover:shadow-lg transition-shadow group flex gap-4",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {featuredImage && (
        <div className="w-1/3 flex-shrink-0 aspect-video overflow-hidden rounded-lg bg-gray-100">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
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
