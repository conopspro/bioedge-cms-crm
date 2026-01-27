import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getSectionColors, getBackgroundStyle, SectionColorsSettings } from "@/lib/event-colors"
import { FinalCtaSection } from "@/components/events/final-cta-section"

interface PageProps {
  params: Promise<{ event: string }>
}

// Type for event_presentations with nested presentation data
interface EventPresentation {
  id: string
  scheduled_date: string | null
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  event_room_id: string | null
  event_track_id: string | null
  room: Array<{ id: string; name: string; color: string | null }> | { id: string; name: string; color: string | null } | null
  track: Array<{ id: string; name: string; color: string | null }> | { id: string; name: string; color: string | null } | null
  presentation: Array<{
    id: string
    title: string
    short_description: string | null
    session_type: string
    panelists: Array<{
      id: string
      role: string
      contact: {
        id: string
        first_name: string
        last_name: string
        title: string | null
        avatar_url: string | null
        company: { id: string; name: string } | null
      } | null
    }>
  }> | {
    id: string
    title: string
    short_description: string | null
    session_type: string
    panelists: Array<{
      id: string
      role: string
      contact: {
        id: string
        first_name: string
        last_name: string
        title: string | null
        avatar_url: string | null
        company: { id: string; name: string } | null
      } | null
    }>
  } | null
}

// Normalized presentation type for rendering
interface ScheduledPresentation {
  id: string
  title: string
  description: string | null
  presentation_type: string
  presentation_slug: string | null  // For linking to /presentations/[slug]
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  scheduled_date: string | null
  room: { id: string; name: string; color: string | null } | null
  track: { id: string; name: string; color: string | null } | null
  presenters: Array<{
    id: string
    role: string
    contact: {
      id: string
      first_name: string
      last_name: string
      title: string | null
      avatar_url: string | null
      company: { id: string; name: string } | null
    } | null
  }>
}

interface DaySchedule {
  date: string
  dateLabel: string
  presentations: ScheduledPresentation[]
}

function formatTime(time: string | null): string {
  if (!time) return ""
  // Handle HH:MM:SS or HH:MM format
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function formatDateLabel(dateStr: string): string {
  // Parse as local date to avoid UTC conversion issues
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

const presentationTypeLabels: Record<string, string> = {
  keynote: "Keynote",
  panel: "Panel Discussion",
  workshop: "Workshop",
  breakout: "Breakout Session",
  networking: "Networking",
  fireside_chat: "Fireside Chat",
  presentation: "Presentation",
  break: "Break",
  meal: "Meal",
  registration: "Registration",
  other: "Session",
}

/**
 * Public Event Agenda Page
 *
 * Displays the event schedule organized by day
 */
export default async function EventAgendaPage({ params }: PageProps) {
  const { event: slug } = await params
  const supabase = await createClient()

  // Fetch event with colors and hero image
  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, slug, start_date, end_date, venue_name, city, state, hero_image_url, hero_overlay_opacity, section_colors, registration_url, landing_page_settings, tagline")
    .eq("slug", slug)
    .neq("status", "draft")
    .single()

  if (error || !event) {
    notFound()
  }

  // Get section colors
  const sectionColors = event.section_colors as Partial<SectionColorsSettings> | null
  const heroColors = getSectionColors(sectionColors, 'hero')
  const valuePropsColors = getSectionColors(sectionColors, 'value_props')
  const ctaColors = getSectionColors(sectionColors, 'cta')

  // Get landing page settings for CTA content
  const landingPageSettings = event.landing_page_settings as {
    final_cta?: { title?: string; description?: string; button_text?: string }
  } | null

  // Fetch all event_presentations with linked presentation data
  const { data: eventPresentations, error: presentationsError } = await supabase
    .from("event_presentations")
    .select(`
      *,
      presentation:presentations(
        id,
        title,
        slug,
        short_description,
        session_type,
        contact:contacts(
          id, first_name, last_name, title, avatar_url,
          company:companies(id, name)
        ),
        panelists:presentation_panelists(
          id,
          role,
          contact:contacts(
            id, first_name, last_name, title, avatar_url,
            company:companies(id, name)
          )
        )
      )
    `)
    .eq("event_id", event.id)
    .order("scheduled_date", { ascending: true })
    .order("start_time", { ascending: true })

  // Debug: Log any errors
  if (presentationsError) {
    console.error("Error fetching event presentations:", presentationsError)
  }

  // Also fetch event_sessions (ad-hoc items: breaks, meals, networking, etc.)
  const { data: eventSessions } = await supabase
    .from("event_sessions")
    .select("*")
    .eq("event_id", event.id)
    .order("day_number", { ascending: true })
    .order("start_time", { ascending: true })
    .order("position", { ascending: true })

  // Fetch rooms for filtering
  const { data: rooms } = await supabase
    .from("event_rooms")
    .select("id, name, color")
    .eq("event_id", event.id)
    .order("position", { ascending: true })

  // Fetch tracks for filtering
  const { data: tracks } = await supabase
    .from("event_tracks")
    .select("id, name, color")
    .eq("event_id", event.id)
    .order("position", { ascending: true })

  // Helper to convert day_number to actual date based on event start date
  const eventStartDate = event.start_date
  function dayNumberToDate(dayNumber: number): string | null {
    if (!eventStartDate) return null
    // Parse as local date to avoid UTC issues
    const [year, month, day] = eventStartDate.split('T')[0].split('-').map(Number)
    const startDate = new Date(year, month - 1, day)
    startDate.setDate(startDate.getDate() + (dayNumber - 1))
    // Return as YYYY-MM-DD format
    return `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
  }

  // Helper to extract time from timestamp or time string
  function extractTime(timeValue: string | null): string | null {
    if (!timeValue) return null
    // If it's a full timestamp, extract just the time
    if (timeValue.includes('T')) {
      return timeValue.split('T')[1]?.split('.')[0] || null
    }
    return timeValue
  }

  // Normalize event_presentations to ScheduledPresentation format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedPresentations: ScheduledPresentation[] = ((eventPresentations || []) as any[])
    .filter((ep) => ep.presentation) // Only include items with linked presentations
    .map((ep) => {
      // Handle Supabase returning arrays for single relations
      const presentation = Array.isArray(ep.presentation) ? ep.presentation[0] : ep.presentation

      // Look up room and track from the fetched lists using IDs
      const room = ep.event_room_id ? rooms?.find(r => r.id === ep.event_room_id) || null : null
      const track = ep.event_track_id ? tracks?.find(t => t.id === ep.event_track_id) || null : null

      // Get primary contact from presentation (if no panelists)
      const primaryContact = Array.isArray(presentation?.contact)
        ? presentation.contact[0]
        : presentation?.contact || null

      // Normalize panelists contacts
      const panelists = (presentation?.panelists || []).map((panelist: any) => ({
        ...panelist,
        contact: Array.isArray(panelist.contact) ? panelist.contact[0] : panelist.contact || null,
      }))

      // Use panelists if available, otherwise use primary contact
      const presenters = panelists.length > 0
        ? panelists
        : primaryContact
          ? [{ id: 'primary', role: 'speaker', contact: primaryContact }]
          : []

      return {
        id: ep.id,
        title: presentation?.title || 'Untitled',
        description: presentation?.short_description || null,
        presentation_type: presentation?.session_type || 'presentation',
        presentation_slug: presentation?.slug || null,
        start_time: ep.start_time,
        end_time: ep.end_time,
        duration_minutes: ep.duration_minutes,
        scheduled_date: ep.scheduled_date,
        room: room || null,
        track: track || null,
        presenters,
      }
    })

  // Normalize event_sessions (ad-hoc items) to ScheduledPresentation format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedSessions: ScheduledPresentation[] = ((eventSessions || []) as any[]).map((es) => {
    return {
      id: es.id,
      title: es.title || 'Untitled',
      description: es.description || null,
      presentation_type: es.session_type || 'other',
      presentation_slug: null, // Ad-hoc sessions don't have presentation pages
      start_time: extractTime(es.start_time),
      end_time: extractTime(es.end_time),
      duration_minutes: null,
      scheduled_date: dayNumberToDate(es.day_number || 1),
      room: null,
      track: es.track ? { id: 'custom', name: es.track, color: null } : null,
      presenters: [],
    }
  })

  // Combine both lists
  const allItems = [...normalizedPresentations, ...normalizedSessions]

  // Group all items by date
  const schedule: DaySchedule[] = []
  const itemsByDate = new Map<string, ScheduledPresentation[]>()

  allItems.forEach((item) => {
    const date = item.scheduled_date || "unscheduled"
    if (!itemsByDate.has(date)) {
      itemsByDate.set(date, [])
    }
    itemsByDate.get(date)!.push(item)
  })

  // Sort by date and create schedule array
  Array.from(itemsByDate.entries())
    .filter(([date]) => date !== "unscheduled")
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, items]) => {
      // Sort items within each day by start_time
      const sortedItems = items.sort((a, b) => {
        if (!a.start_time && !b.start_time) return 0
        if (!a.start_time) return 1
        if (!b.start_time) return -1
        return a.start_time.localeCompare(b.start_time)
      })
      schedule.push({
        date,
        dateLabel: formatDateLabel(date),
        presentations: sortedItems,
      })
    })

  const hasRooms = (rooms?.length || 0) > 0
  const hasTracks = (tracks?.length || 0) > 0
  const hasSchedule = schedule.length > 0

  return (
    <>
      {/* Header - Uses hero colors */}
      <section
        className="relative overflow-hidden py-12"
        style={{
          backgroundImage: event.hero_image_url ? `url(${event.hero_image_url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...(!event.hero_image_url && heroColors.background ? getBackgroundStyle(heroColors.background) : {}),
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            ...(heroColors.background
              ? getBackgroundStyle(heroColors.background)
              : { background: 'linear-gradient(to bottom right, #0a2540, #1e3a5f, #3b82f6)' }
            ),
            opacity: event.hero_image_url ? (event.hero_overlay_opacity || 70) / 100 : 1,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <Link
            href={`/${event.slug}`}
            className="inline-flex items-center gap-2 mb-4 transition-colors"
            style={{ color: heroColors.text, opacity: 0.7 }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Event
          </Link>
          <h1
            className="font-heading text-3xl md:text-4xl font-bold mb-2"
            style={{ color: heroColors.title }}
          >
            Event Agenda
          </h1>
          <p className="text-lg" style={{ color: heroColors.subtitle }}>
            {event.name}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4" style={{ color: heroColors.text, opacity: 0.7 }}>
            {event.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: heroColors.accent || '#c9a227' }} />
                <span>
                  {(() => {
                    const [year, month, day] = event.start_date.split('T')[0].split('-').map(Number)
                    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  })()}
                  {event.end_date && event.end_date !== event.start_date && (
                    <>
                      {" - "}
                      {(() => {
                        const [year, month, day] = event.end_date.split('T')[0].split('-').map(Number)
                        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      })()}
                    </>
                  )}
                </span>
              </div>
            )}
            {(event.venue_name || event.city) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: heroColors.accent || '#c9a227' }} />
                <span>{event.venue_name || event.city}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Legend */}
      {(hasRooms || hasTracks) && (
        <section className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-wrap gap-6">
              {hasRooms && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-text-light">Rooms:</span>
                  {rooms?.map((room) => (
                    <div key={room.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: room.color || "#6366f1" }}
                      />
                      <span className="text-sm">{room.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {hasTracks && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-text-light">Tracks:</span>
                  {tracks?.map((track) => (
                    <div key={track.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: track.color || "#6366f1" }}
                      />
                      <span className="text-sm">{track.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Schedule - Uses value_props colors */}
      <section
        className="py-12"
        style={getBackgroundStyle(valuePropsColors.background)}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {!hasSchedule ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto mb-4" style={{ color: valuePropsColors.text, opacity: 0.5 }} />
              <h2
                className="text-xl font-heading font-semibold mb-2"
                style={{ color: valuePropsColors.title }}
              >
                Agenda Coming Soon
              </h2>
              <p className="max-w-md mx-auto" style={{ color: valuePropsColors.text }}>
                The full event agenda is being finalized. Check back soon for the complete schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {schedule.map((day) => (
                <div key={day.date}>
                  {/* Day Header */}
                  <div className="sticky top-32 z-20 bg-muted/95 backdrop-blur-sm py-3 px-4 rounded-lg mb-6 border">
                    <h2 className="font-heading text-xl font-bold text-navy">
                      {day.dateLabel}
                    </h2>
                  </div>

                  {/* Sessions */}
                  <div className="space-y-4">
                    {day.presentations.map((presentation) => (
                      <div
                        key={presentation.id}
                        className="be-card hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* Time Column */}
                          <div className="md:w-32 flex-shrink-0">
                            {presentation.start_time && (
                              <div className="flex items-center gap-2 text-navy font-heading font-semibold">
                                <Clock className="h-4 w-4 text-gold" />
                                {formatTime(presentation.start_time)}
                              </div>
                            )}
                            {presentation.end_time && (
                              <p className="text-sm text-text-light ml-6">
                                – {formatTime(presentation.end_time)}
                              </p>
                            )}
                            {presentation.duration_minutes && !presentation.end_time && (
                              <p className="text-sm text-text-light ml-6">
                                {presentation.duration_minutes} min
                              </p>
                            )}
                          </div>

                          {/* Content Column */}
                          <div className="flex-grow">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-navy/10 text-navy">
                                {presentationTypeLabels[presentation.presentation_type] || presentation.presentation_type}
                              </span>
                              {presentation.room && (
                                <span
                                  className="px-2 py-0.5 text-xs font-medium rounded text-white"
                                  style={{ backgroundColor: presentation.room.color || "#6366f1" }}
                                >
                                  {presentation.room.name}
                                </span>
                              )}
                              {presentation.track && (
                                <span
                                  className="px-2 py-0.5 text-xs font-medium rounded border"
                                  style={{
                                    borderColor: presentation.track.color || "#6366f1",
                                    color: presentation.track.color || "#6366f1",
                                  }}
                                >
                                  {presentation.track.name}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-lg font-semibold text-navy mb-2">
                              {presentation.presentation_slug ? (
                                <Link
                                  href={`/presentations/${presentation.presentation_slug}`}
                                  className="hover:text-gold transition-colors"
                                >
                                  {presentation.title}
                                </Link>
                              ) : (
                                presentation.title
                              )}
                            </h3>

                            {/* Description */}
                            {presentation.description && (
                              <p className="text-text-light text-sm mb-4 line-clamp-2">
                                {presentation.description}
                              </p>
                            )}

                            {/* Presenters */}
                            {presentation.presenters && presentation.presenters.length > 0 && (
                              <div className="flex flex-wrap items-center gap-3">
                                {presentation.presenters.map((presenter) => {
                                  const contact = presenter.contact
                                  if (!contact) return null

                                  return (
                                    <div key={presenter.id} className="flex items-center gap-2">
                                      {contact.avatar_url ? (
                                        <img
                                          src={contact.avatar_url}
                                          alt={`${contact.first_name} ${contact.last_name}`}
                                          className="w-8 h-8 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full be-avatar-gradient flex items-center justify-center text-white text-xs font-bold">
                                          {contact.first_name.charAt(0)}
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-navy">
                                          {contact.first_name} {contact.last_name}
                                        </p>
                                        {contact.company && (
                                          <p className="text-xs text-text-light">
                                            {contact.company.name}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <FinalCtaSection
        event={event}
        sectionColors={sectionColors}
        landingPageSettings={landingPageSettings}
      />

      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-20 sm:hidden" />
    </>
  )
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  const { event: slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("name, tagline")
    .eq("slug", slug)
    .neq("status", "draft")
    .single()

  if (!event) {
    return { title: "Agenda Not Found" }
  }

  return {
    title: `Agenda - ${event.name}`,
    description: `View the full event agenda and schedule for ${event.name}. ${event.tagline || ""}`,
  }
}
