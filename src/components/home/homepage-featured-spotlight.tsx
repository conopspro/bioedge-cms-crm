import Link from "next/link"
import { Sparkles, User, Play } from "lucide-react"
import { getYouTubeThumbnailUrl } from "@/lib/youtube"
import { YouTubeThumbnail } from "@/components/ui/youtube-thumbnail"
import { FeaturedCardSlider } from "@/components/ui/featured-card-slider"

interface Spotlight {
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

interface HomepageFeaturedSpotlightProps {
  label?: string | null
  title?: string | null
  spotlights: Spotlight[]
  totalCount?: number
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

export function HomepageFeaturedSpotlight({
  label = "EDUCATION SPOTLIGHT",
  title = "Education Spotlight",
  spotlights,
  totalCount,
  settings,
}: HomepageFeaturedSpotlightProps) {
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null

  const isDarkBg = bgColor ? isDarkColor(bgColor) : false
  const bgStyle: React.CSSProperties = bgColor ? { background: bgColor } : {}
  const bgClass = bgColor ? "" : "bg-off-white"

  if (spotlights.length === 0) {
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
                <Link href="/spotlight" className="hover:text-electric-blue transition-colors">
                  {title}
                </Link>
              </h2>
            )}
          </div>
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl bg-white shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Spotlights Coming Soon</h3>
              <p className="text-deep-blue">Check back soon for featured spotlight content.</p>
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
              <Link href="/spotlight" className="hover:text-electric-blue transition-colors">
                {title}
              </Link>
            </h2>
          )}
        </div>

        <FeaturedCardSlider>
          {spotlights.map((spotlight) => {
            const thumbnailUrl = spotlight.youtube_url
              ? getYouTubeThumbnailUrl(spotlight.youtube_url)
              : null

            return (
              <Link
                key={spotlight.id}
                href={`/spotlight/${spotlight.slug || spotlight.id}`}
                className="group flex-shrink-0 w-[85vw] sm:w-[280px] overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-navy/10 to-electric-blue/10">
                  {thumbnailUrl ? (
                    <YouTubeThumbnail
                      url={spotlight.youtube_url!}
                      alt={spotlight.title}
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
                  {spotlight.contact && (
                    <div className="flex items-center gap-2 mb-3">
                      {spotlight.contact.avatar_url ? (
                        <img
                          src={spotlight.contact.avatar_url}
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
                        {spotlight.contact.first_name} {spotlight.contact.last_name}
                      </span>
                    </div>
                  )}

                  <h3
                    className="font-bold text-lg transition-colors group-hover:text-electric-blue line-clamp-2 mb-2"
                    style={{ color: textColor || "#0a2540" }}
                  >
                    {spotlight.title}
                  </h3>

                  {spotlight.short_description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {spotlight.short_description}
                    </p>
                  )}

                  {spotlight.company?.name && !spotlight.contact && (
                    <p className="text-xs font-medium text-electric-blue mt-2">
                      {spotlight.company.name}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </FeaturedCardSlider>

        <div className="mt-8 text-center">
          <Link
            href="/spotlight"
            className="inline-flex items-center gap-2 text-electric-blue font-semibold hover:text-navy transition-colors"
          >
            View All {totalCount ? `${totalCount} ` : ""}Spotlights →
          </Link>
        </div>
      </div>
    </section>
  )
}
