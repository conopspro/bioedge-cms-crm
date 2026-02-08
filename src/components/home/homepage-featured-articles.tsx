import Link from "next/link"
import { FileText } from "lucide-react"
import { getArticleImageUrl } from "@/lib/youtube"
import { YouTubeThumbnail } from "@/components/ui/youtube-thumbnail"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url?: string | null
  youtube_url?: string | null
  company: {
    name: string
  } | null
}

interface HomepageFeaturedArticlesProps {
  label?: string | null
  title?: string | null
  articles: Article[]
  settings?: {
    bg_color?: string | null
    title_color?: string | null
    label_bg_color?: string | null
    text_color?: string | null
  }
}

// Helper to determine if a color is dark (for text contrast)
const isDarkColor = (color: string | null | undefined): boolean => {
  if (!color) return false
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.5
  }
  return color.includes('navy') || color.includes('0a2540') || color.includes('gradient')
}

export function HomepageFeaturedArticles({
  label = "ARTICLES",
  title = "Featured Articles",
  articles,
  settings,
}: HomepageFeaturedArticlesProps) {
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null

  const isDarkBg = bgColor ? isDarkColor(bgColor) : false
  const bgStyle: React.CSSProperties = bgColor ? { background: bgColor } : {}
  const bgClass = bgColor ? "" : "bg-off-white"

  if (articles.length === 0) {
    return (
      <section className={`py-12 px-8 ${bgClass}`} style={bgStyle}>
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 text-center">
            {label && (
              <span
                className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
                style={{ backgroundColor: labelBgColor }}
              >
                {label}
              </span>
            )}
            {title && (
              <h2
                className="text-[30px] font-bold tracking-wide"
                style={{ color: titleColor || (isDarkBg ? "#ffffff" : "#0a2540") }}
              >
                {title}
              </h2>
            )}
          </div>
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl bg-white shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Articles Coming Soon</h3>
              <p className="text-deep-blue">Check back soon for featured articles.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-12 px-8 ${bgClass}`} style={bgStyle}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 text-center">
          {label && (
            <span
              className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
              style={{ backgroundColor: labelBgColor }}
            >
              {label}
            </span>
          )}
          {title && (
            <h2
              className="text-[30px] font-bold tracking-wide"
              style={{ color: titleColor || (isDarkBg ? "#ffffff" : "#0a2540") }}
            >
              {title}
            </h2>
          )}
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {articles.slice(0, 4).map((article) => {
            const imageUrl = getArticleImageUrl(article.featured_image_url, article.youtube_url)
            const hasVideo = !article.featured_image_url && article.youtube_url

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    {hasVideo ? (
                      <YouTubeThumbnail
                        url={article.youtube_url!}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                <div className="p-6">
                  {article.company?.name && (
                    <span className="mb-3 block text-xs font-medium text-electric-blue">
                      {article.company.name}
                    </span>
                  )}

                  <h3
                    className="font-bold text-lg transition-colors group-hover:text-electric-blue line-clamp-2 mb-2"
                    style={{ color: textColor || "#0a2540" }}
                  >
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-electric-blue font-semibold hover:text-navy transition-colors"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  )
}
