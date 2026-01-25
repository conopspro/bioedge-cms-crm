import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

// TODO: Re-enable caching for production
// export const revalidate = 60

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ event: string }>
}

interface OtherEvent {
  slug: string
  city: string | null
  start_date: string | null
  end_date: string | null
}

/**
 * Format date range for display (e.g., "July 10-11" or "July 10 - Aug 2")
 */
function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) return ""

  const start = new Date(startDate + "T00:00:00")
  const startMonth = start.toLocaleDateString("en-US", { month: "long" })
  const startDay = start.getDate()

  if (!endDate || endDate === startDate) {
    return `${startMonth} ${startDay}`
  }

  const end = new Date(endDate + "T00:00:00")
  const endMonth = end.toLocaleDateString("en-US", { month: "long" })
  const endDay = end.getDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

/**
 * Event-specific layout with dedicated navigation
 *
 * Features:
 * - Wrapping navigation (not hamburger menu) for mobile
 * - Sticky header with CTA
 * - Event branding
 * - Other upcoming events displayed (excluding current event)
 * - Consistent container width throughout
 */
export default async function EventLayout({ children, params }: LayoutProps) {
  const { event: slug } = await params
  const supabase = await createClient()

  // Fetch current event with related content counts
  const { data: event } = await supabase
    .from("events")
    .select(`
      id, name, slug, logo_url, registration_url, status,
      event_contacts(id),
      event_companies(id),
      event_presentations(id),
      event_faqs(id)
    `)
    .eq("slug", slug)
    .neq("status", "draft")
    .single()

  if (!event) {
    notFound()
  }

  // Fetch all upcoming published events (including current event)
  const today = new Date().toISOString().split('T')[0]
  const { data: allEventsData } = await supabase
    .from("events")
    .select("slug, city, start_date, end_date")
    .eq("status", "published")
    .gte("end_date", today)
    .order("start_date", { ascending: true })
    .limit(3)

  const allEvents: OtherEvent[] = allEventsData || []

  // Extract counts from the joined data
  const leadersCount = event.event_contacts?.length || 0
  const companiesCount = event.event_companies?.length || 0
  const presentationsCount = event.event_presentations?.length || 0
  const faqCount = event.event_faqs?.length || 0

  const navItems = [
    { label: "Overview", href: `/${event.slug}` },
    leadersCount > 0 && { label: "Leaders", href: `/${event.slug}/leaders` },
    presentationsCount > 0 && { label: "Agenda", href: `/${event.slug}/agenda` },
    { label: "Venue", href: `/${event.slug}#venue` },
    companiesCount > 0 && { label: "Companies", href: `/${event.slug}/companies` },
    faqCount > 0 && { label: "FAQ", href: `/${event.slug}#faq` },
  ].filter(Boolean) as { label: string; href: string }[]

  const showTicketButton = event.registration_url && event.status === "registration_open"

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0d598a' }}>
      {/* Event Header - Full width #0d598a background */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#0d598a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Top row: Logo left, Other Events right */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3">
            {/* Main Site Logo + Event Name */}
            <div className="flex items-center gap-4">
              {/* BioEdge Main Logo */}
              <Link href="/" className="font-heading font-bold flex-shrink-0 flex items-baseline">
                <span className="text-white text-base">BIO</span>
                <span className="text-gold text-2xl">EDGE</span>
              </Link>

              {/* Divider */}
              <span className="text-white/30">|</span>

              {/* Event Name/Logo */}
              <Link href={`/${event.slug}`} className="flex items-center">
                {event.logo_url ? (
                  <img src={event.logo_url} alt={event.name} className="h-6" />
                ) : (
                  <span className="font-heading font-semibold text-white text-sm">{event.name}</span>
                )}
              </Link>
            </div>

            {/* Event Links - right justified on desktop */}
            {allEvents.length > 0 && (
              <div className="flex flex-col sm:items-end gap-0.5">
                {allEvents.map((eventItem) => (
                  <Link
                    key={eventItem.slug}
                    href={`/${eventItem.slug}`}
                    className="font-mono font-semibold text-gold text-sm hover:text-white transition-colors"
                  >
                    {eventItem.city && <span>{eventItem.city}</span>}
                    {eventItem.city && eventItem.start_date && <span className="mx-2">•</span>}
                    {eventItem.start_date && (
                      <span>{formatDateRange(eventItem.start_date, eventItem.end_date)}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation row with CTA */}
          <nav className="py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-sm font-bold text-white hover:text-white hover:bg-white/10 rounded-md transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
              {/* Ticket button in nav on mobile */}
              {showTicketButton && (
                <a
                  href={event.registration_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden px-3 py-1.5 text-sm font-bold text-white bg-gold hover:bg-gold/90 rounded-md transition-colors whitespace-nowrap"
                >
                  Tickets
                </a>
              )}
            </div>
            {/* CTA Button - Desktop */}
            {showTicketButton && (
              <a
                href={event.registration_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex be-pill be-pill-primary text-sm py-2"
              >
                Get Tickets
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content - Full width container, sections handle their own backgrounds */}
      <main className="flex-1">
        {children}
      </main>

      {/* Sticky Mobile CTA */}
      {showTicketButton && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm border-t border-border sm:hidden z-40">
          <div className="max-w-5xl mx-auto">
            <a
              href={event.registration_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center be-pill be-pill-primary py-3"
            >
              Get Tickets
            </a>
          </div>
        </div>
      )}

      {/* Footer - Full width #0d598a background */}
      <footer style={{ backgroundColor: '#0d598a' }} className="text-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="font-heading font-bold flex items-baseline">
                <span className="text-white text-base">BIO</span>
                <span className="text-gold text-2xl">EDGE</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <Link href={`/${event.slug}`} className="hover:text-white">
                {event.name}
              </Link>
              <a href="mailto:events@bioedge.com" className="hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-white/50 max-w-3xl mx-auto">
              This content is for educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before making health decisions.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-white/50">
            © {new Date().getFullYear()} BIOEDGE LONGEVITY LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
