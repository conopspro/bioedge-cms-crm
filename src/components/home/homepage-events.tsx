import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"

interface Event {
  id: string
  name: string
  slug: string
  tagline: string | null
  start_date: string | null
  end_date: string | null
  city: string | null
  state: string | null
  venue_name: string | null
  featured_image_url: string | null
  venue?: { photo_url: string | null } | null
  section_photos?: { image_url: string | null; section: string }[] | null
}

interface FeaturedEvent {
  id: string
  event_id: string
  custom_title: string | null
  custom_tagline: string | null
  custom_image_url: string | null
  event: Event
}

interface HomepageEventsProps {
  label?: string | null
  title?: string | null
  background?: string
  columns?: number
  events: FeaturedEvent[]
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
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    // Using luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.5
  }
  // Handle gradient or other - assume dark if contains "navy" or dark colors
  return color.includes('navy') || color.includes('0a2540') || color.includes('gradient')
}

// Format date for display in Eastern timezone
const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  // Parse the date string and treat it as a local date (not UTC)
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Homepage Events Section
 *
 * Displays featured events in a configurable grid.
 */
export function HomepageEvents({
  label = "UPCOMING EVENTS",
  title = "Join Us at a Summit",
  background = "muted",
  columns = 1,
  events,
  settings,
}: HomepageEventsProps) {
  // Determine colors - use settings if provided, otherwise fallback to defaults
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null

  // Determine if background is dark for text contrast
  const isDarkBg = bgColor ? isDarkColor(bgColor) : (background === "navy" || background === "gradient")

  // Build background style
  const bgStyle: React.CSSProperties = bgColor
    ? { background: bgColor }
    : {}

  // Fallback class if no custom color
  const bgClass = bgColor ? "" : (
    background === "navy" ? "bg-navy" :
    background === "gradient" ? "bg-gradient-to-br from-navy via-deep-blue to-electric-blue" :
    background === "muted" ? "bg-off-white" :
    "bg-white"
  )

  // Get grid columns class — banners are always full-width
  const getGridCols = () => {
    if (events.length === 0) return ""
    const effectiveColumns = Math.min(columns, events.length)
    switch (effectiveColumns) {
      case 2:
        return "grid-cols-1 md:grid-cols-2"
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      default:
        return "grid-cols-1"
    }
  }

  // If no events, show coming soon
  if (events.length === 0) {
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
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Events Coming Soon</h3>
              <p className="text-deep-blue">
                Stay tuned for upcoming bioEDGE Longevity Summit events near you.
              </p>
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

        <div className={`grid gap-8 ${getGridCols()}`}>
          {events.map((fe) => {
            const event = fe.event
            const displayTitle = fe.custom_title || event.name
            const displayTagline = fe.custom_tagline || event.tagline
            // Get venue photo from event section photos
            const venuePhoto = event.section_photos?.find(p => p.section === 'venue')?.image_url
            // Priority: custom image > event featured image > venue section photo > venue table photo
            const displayImage = fe.custom_image_url || event.featured_image_url || venuePhoto || event.venue?.photo_url

            return (
              <Link
                key={fe.id}
                href={`/${event.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-navy via-deep-blue to-electric-blue transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.25)]"
              >
                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-electric-blue transition-transform duration-400 group-hover:scale-x-100" />
                <div className="flex items-center gap-6 px-6 py-4 md:gap-8 md:px-8">

                  {/* Event image thumbnail */}
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={displayTitle}
                      className="h-28 w-44 flex-shrink-0 rounded object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-28 w-44 flex-shrink-0 items-center justify-center rounded bg-white/5 shadow-xl transition-transform duration-300 group-hover:scale-105">
                      <Calendar className="h-10 w-10 text-electric-blue/50" />
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {displayTitle}
                    </h3>
                    <div className="mt-3 hidden sm:block space-y-1.5">
                      {displayTagline && (
                        <p className="text-sm italic text-white/80">
                          &ldquo;{displayTagline}&rdquo;
                        </p>
                      )}
                      {event.start_date && (
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>
                            {formatDate(event.start_date)}
                            {event.end_date && formatDate(event.end_date) !== formatDate(event.start_date) && (
                              <> &ndash; {formatDate(event.end_date)}</>
                            )}
                          </span>
                        </div>
                      )}
                      {(event.city || event.venue_name) && (
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{event.venue_name || `${event.city}${event.state ? `, ${event.state}` : ""}`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <span className="hidden flex-shrink-0 items-center gap-2 rounded-full bg-electric-blue px-5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-white group-hover:text-navy sm:inline-flex">
                    Learn More
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>

                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
