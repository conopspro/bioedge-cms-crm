import Link from "next/link"
import { Video, User, Play } from "lucide-react"
import { getYouTubeThumbnailUrl } from "@/lib/youtube"
import { YouTubeThumbnail } from "@/components/ui/youtube-thumbnail"

interface Presentation {
  id: string
  title: string
  slug: string | null
  short_description: string | null
  youtube_url?: string | null
  contact: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  } | null
  company: {
    name: string
  } | null
}

interface HomepageFeaturedPresentationsProps {
  label?: string | null
  title?: string | null
  presentations: Presentation[]
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

export function HomepageFeaturedPresentations({
  label = "PRESENTATIONS",
  title = "Featured Presentations",
  presentations,
  settings,
}: HomepageFeaturedPresentationsProps) {
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null

  const isDarkBg = bgColor ? isDarkColor(bgColor) : false
  const bgStyle: React.CSSProperties = bgColor ? { background: bgColor } : {}
  const bgClass = bgColor ? "" : "bg-off-white"

  if (presentations.length === 0) {
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
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Presentations Coming Soon</h3>
              <p className="text-deep-blue">Check back soon for featured presentations.</p>
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
          {presentations.slice(0, 4).map((presentation) => {
            const thumbnailUrl = presentation.youtube_url
              ? getYouTubeThumbnailUrl(presentation.youtube_url)
              : null

            return (
              <Link
                key={presentation.id}
                href={`/presentations/${presentation.slug || presentation.id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-navy/10 to-electric-blue/10">
                  {thumbnailUrl ? (
                    <YouTubeThumbnail
                      url={presentation.youtube_url!}
                      alt={presentation.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Play className="h-12 w-12 text-navy/20" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {/* Speaker Info */}
                  {presentation.contact && (
                    <div className="flex items-center gap-2 mb-3">
                      {presentation.contact.avatar_url ? (
                        <img
                          src={presentation.contact.avatar_url}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-electric-blue/20"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <span className="text-xs font-medium text-electric-blue truncate">
                        {presentation.contact.first_name} {presentation.contact.last_name}
                      </span>
                    </div>
                  )}

                  <h3
                    className="font-bold text-lg transition-colors group-hover:text-electric-blue line-clamp-2 mb-2"
                    style={{ color: textColor || "#0a2540" }}
                  >
                    {presentation.title}
                  </h3>

                  {presentation.short_description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {presentation.short_description}
                    </p>
                  )}

                  {presentation.company?.name && !presentation.contact && (
                    <p className="text-xs font-medium text-electric-blue mt-2">
                      {presentation.company.name}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/presentations"
            className="inline-flex items-center gap-2 text-electric-blue font-semibold hover:text-navy transition-colors"
          >
            View All Presentations →
          </Link>
        </div>
      </div>
    </section>
  )
}
