import Link from "next/link"
import { getArticleImageUrl } from "@/lib/youtube"

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  companyName?: string | null
  featuredImageUrl?: string | null
  youtubeUrl?: string | null
}

/**
 * Article card for the public article list page
 * Clean, minimalist design following BioEdge brand style
 * Uses YouTube thumbnail as fallback if no featured image
 */
export function ArticleCard({
  title,
  slug,
  excerpt,
  publishedAt,
  companyName,
  featuredImageUrl,
  youtubeUrl,
}: ArticleCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const imageUrl = getArticleImageUrl(featuredImageUrl, youtubeUrl)
  const hasVideo = !featuredImageUrl && youtubeUrl

  return (
    <article className="group be-card hover:shadow-lg transition-all duration-200 overflow-hidden">
      <Link href={`/articles/${slug}`} className="block">
        {imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden -mx-6 -mt-6 mb-4">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to hqdefault if maxresdefault doesn't exist
                const target = e.target as HTMLImageElement
                if (target.src.includes("maxresdefault")) {
                  target.src = target.src.replace("maxresdefault", "hqdefault")
                }
              }}
            />
            {hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="rounded-full bg-red-600 p-3 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        <h3 className="font-heading text-xl font-semibold tracking-tight text-navy group-hover:text-gold transition-colors mb-2">
          {title}
        </h3>

        {excerpt && (
          <p className="text-text-light leading-relaxed mb-3 line-clamp-2">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm text-text-light">
          {formattedDate && <time>{formattedDate}</time>}
          {companyName && (
            <>
              <span>•</span>
              <span className="text-gold font-medium">{companyName}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
