import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

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
    timeZone: "America/New_York",
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

  // Get grid columns class
  const getGridCols = () => {
    if (events.length === 0) return "max-w-lg mx-auto"
    const effectiveColumns = Math.min(columns, events.length)
    switch (effectiveColumns) {
      case 1:
        return "max-w-lg mx-auto"
      case 2:
        return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={displayTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {displayTitle}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {displayTagline && (
                    <p className="text-deep-blue mb-4 line-clamp-2">
                      {displayTagline}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {event.start_date && (
                      <div className="flex items-center gap-2 text-[15px] text-gray-600">
                        <Calendar className="h-4 w-4 text-electric-blue" />
                        <span>
                          {formatDate(event.start_date)}
                          {event.end_date && formatDate(event.end_date) !== formatDate(event.start_date) && (
                            <> – {formatDate(event.end_date)}</>
                          )}
                        </span>
                      </div>
                    )}
                    {(event.city || event.venue_name) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-electric-blue" />
                        <span>{event.venue_name || `${event.city}${event.state ? `, ${event.state}` : ""}`}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-electric-blue font-semibold group-hover:text-navy transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="absolute top-0 left-0 right-0 h-1 bg-gold origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
