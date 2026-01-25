import Link from "next/link"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

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
 * Styled to match LeaderCard with:
 * - Blue ring around card
 * - Hover shadow effect
 * - Consistent typography
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
        "be-card hover:shadow-lg transition-shadow group block",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {featuredImage && (
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
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
