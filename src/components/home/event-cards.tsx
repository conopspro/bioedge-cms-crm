import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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
  status: string
  registration_url: string | null
}

interface EventCardsProps {
  className?: string
  sectionTitle?: string
  background?: "white" | "muted" | "navy" | "gradient"
}

// Determine background style
const getBackgroundClass = (bg: string) => {
  switch (bg) {
    case "navy":
      return "bg-navy"
    case "gradient":
      return "bg-gradient-to-br from-navy via-deep-blue to-electric-blue"
    case "muted":
      return "bg-off-white"
    default:
      return "bg-white"
  }
}

// Format date for display in Eastern timezone
const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  // Parse the date string and treat it as a local date (not UTC)
  // This prevents timezone offset issues with date-only strings
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// Get grid columns based on number of events
const getGridCols = (count: number) => {
  switch (count) {
    case 1:
      return "max-w-lg mx-auto"
    case 2:
      return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
    default:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }
}

/**
 * Event Cards Section
 *
 * Displays 1-3 published event cards in a responsive row.
 * Automatically fetches published events from the database.
 */
export async function EventCards({
  className,
  sectionTitle = "Join Us at a Summit",
  background = "muted",
}: EventCardsProps) {
  const supabase = await createClient()

  const isDarkBg = background === "navy" || background === "gradient"
  const bgClass = getBackgroundClass(background)

  // Fetch published events, ordered by start date
  const { data: events, error } = await supabase
    .from("events")
    .select("id, name, slug, tagline, start_date, end_date, city, state, venue_name, featured_image_url, status, registration_url")
    .eq("status", "published")
    .order("start_date", { ascending: true })
    .limit(3)

  // If no published events, show coming soon
  if (error || !events || events.length === 0) {
    return (
      <section className={`py-12 px-8 ${bgClass} ${className || ""}`}>
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 text-center">
            <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
              UPCOMING EVENTS
            </span>
            <h2 className={`text-[30px] font-bold tracking-wide ${isDarkBg ? "text-white" : "text-navy"}`}>
              {sectionTitle}
            </h2>
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

  // Show event cards
  return (
    <section className={`py-12 px-8 ${bgClass} ${className || ""}`}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            UPCOMING EVENTS
          </span>
          {sectionTitle && (
            <h2 className={`text-[30px] font-bold tracking-wide ${isDarkBg ? "text-white" : "text-navy"}`}>
              {sectionTitle}
            </h2>
          )}
        </div>

        <div className={`grid gap-8 ${getGridCols(events.length)}`}>
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/${event.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                {event.featured_image_url ? (
                  <img
                    src={event.featured_image_url}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {event.name}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {event.tagline && (
                  <p className="text-deep-blue mb-4 line-clamp-2 text-[17px]">
                    {event.tagline}
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
                    <div className="flex items-center gap-2 text-[15px] text-gray-600">
                      <MapPin className="h-4 w-4 text-electric-blue" />
                      <span>{event.venue_name || `${event.city}${event.state ? `, ${event.state}` : ""}`}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-electric-blue font-semibold group-hover:text-navy transition-colors text-[15px]">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="absolute top-0 left-0 right-0 h-1 bg-gold origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
