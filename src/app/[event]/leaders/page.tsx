import { notFound } from "next/navigation"
import Link from "next/link"
import { Users, ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getSectionColors, getBackgroundStyle, SectionColorsSettings } from "@/lib/event-colors"
import { FinalCtaSection } from "@/components/events/final-cta-section"

interface PageProps {
  params: Promise<{ event: string }>
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Role display labels
const roleLabels: Record<string, string> = {
  speaker: "Speaker",
  panelist: "Panelist",
  moderator: "Moderator",
  host: "Host",
  keynote: "Keynote",
  workshop_lead: "Workshop Lead",
  mc: "MC",
  facilitator: "Facilitator",
}

/**
 * Event Leaders Page
 *
 * Shows all leaders presenting at a specific event.
 */
export default async function EventLeadersPage({ params }: PageProps) {
  const { event: slug } = await params
  const supabase = await createClient()

  // Fetch event with colors and hero image
  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, slug, status, tagline, hero_image_url, hero_overlay_opacity, section_colors, registration_url, landing_page_settings")
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

  // Fetch leaders for this event with contact data
  const { data: leaders } = await supabase
    .from("event_contacts")
    .select(`
      id,
      role,
      display_order,
      is_featured,
      title_override,
      bio_override,
      headshot_url,
      contact:contacts(
        id,
        first_name,
        last_name,
        title,
        avatar_url,
        linkedin_url,
        slug,
        bio,
        company:companies(id, name, logo_url)
      )
    `)
    .eq("event_id", event.id)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })

  // Normalize contacts (Supabase returns arrays for single relations)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizedLeaders = (leaders || []).map((l: any) => ({
    ...l,
    contact: Array.isArray(l.contact) ? l.contact[0] : l.contact,
  }))

  // Separate featured and regular leaders
  const featuredLeaders = normalizedLeaders.filter((l) => l.is_featured && l.contact)
  const regularLeaders = normalizedLeaders.filter((l) => !l.is_featured && l.contact)

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
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8" style={{ color: heroColors.accent || '#c9a227' }} />
            <h1
              className="font-heading text-3xl md:text-4xl font-bold"
              style={{ color: heroColors.title }}
            >
              Event Leaders
            </h1>
          </div>
          <p className="text-lg" style={{ color: heroColors.subtitle }}>
            Meet the expert leaders presenting at {event.name}
          </p>
        </div>
      </section>

      {/* Content - Uses value_props colors */}
      <section
        className="py-12"
        style={getBackgroundStyle(valuePropsColors.background)}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {!leaders || leaders.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto mb-4" style={{ color: valuePropsColors.text, opacity: 0.5 }} />
              <h2
                className="text-xl font-heading font-semibold mb-2"
                style={{ color: valuePropsColors.title }}
              >
                Leaders Coming Soon
              </h2>
              <p className="max-w-md mx-auto" style={{ color: valuePropsColors.text }}>
                The speaker lineup is being finalized. Check back soon to meet our expert leaders.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Leaders */}
              {featuredLeaders.length > 0 && (
                <div>
                  <h2
                    className="font-heading text-2xl md:text-3xl font-bold mb-6"
                    style={{ color: valuePropsColors.title }}
                  >
                    Featured
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {featuredLeaders.map((leader) => {
                      const contact = leader.contact
                      if (!contact) return null

                      const name = `${contact.first_name} ${contact.last_name}`
                      const title = leader.title_override || contact.title
                      const image = leader.headshot_url || contact.avatar_url

                      return (
                        <Link
                          key={leader.id}
                          href={`/leaders/${contact.slug || contact.id}`}
                          className="be-card hover:shadow-lg transition-shadow text-center group"
                          style={{ boxShadow: '0 0 0 2px rgba(1, 122, 178, 0.3)' }}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                              style={{ boxShadow: '0 0 0 4px rgba(1, 122, 178, 0.2)' }}
                            />
                          ) : (
                            <div
                              className="w-20 h-20 rounded-full mx-auto mb-3 be-avatar-gradient flex items-center justify-center text-white text-xl font-heading font-bold"
                              style={{ boxShadow: '0 0 0 4px rgba(1, 122, 178, 0.2)' }}
                            >
                              {getInitials(contact.first_name, contact.last_name)}
                            </div>
                          )}
                          <h3
                            className="font-heading font-semibold transition-colors"
                            style={{ color: '#0d2840' }}
                          >
                            {name}
                          </h3>
                          {title && (
                            <p className="text-sm mt-1" style={{ color: '#0d2840' }}>
                              {title}
                            </p>
                          )}
                          {contact.company && (
                            <p className="text-xs font-medium mt-1" style={{ color: '#017ab2' }}>
                              {contact.company.name}
                            </p>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Regular Leaders */}
              {regularLeaders.length > 0 && (
                <div>
                  {featuredLeaders.length > 0 && (
                    <h2
                      className="font-heading text-2xl md:text-3xl font-bold mb-6"
                      style={{ color: valuePropsColors.title }}
                    >
                      All Presenters
                    </h2>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {regularLeaders.map((leader) => {
                      const contact = leader.contact
                      if (!contact) return null

                      const name = `${contact.first_name} ${contact.last_name}`
                      const title = leader.title_override || contact.title
                      const image = leader.headshot_url || contact.avatar_url

                      return (
                        <Link
                          key={leader.id}
                          href={`/leaders/${contact.slug || contact.id}`}
                          className="be-card hover:shadow-lg transition-shadow text-center group"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 be-avatar-gradient flex items-center justify-center text-white text-xl font-heading font-bold">
                              {getInitials(contact.first_name, contact.last_name)}
                            </div>
                          )}
                          <h3
                            className="font-heading font-semibold transition-colors"
                            style={{ color: '#0d2840' }}
                          >
                            {name}
                          </h3>
                          {title && (
                            <p className="text-sm mt-1" style={{ color: '#0d2840' }}>
                              {title}
                            </p>
                          )}
                          {contact.company && (
                            <p className="text-xs font-medium mt-1" style={{ color: '#017ab2' }}>
                              {contact.company.name}
                            </p>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
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
    return { title: "Leaders Not Found" }
  }

  return {
    title: `Leaders - ${event.name}`,
    description: `Meet the expert speakers and panelists at ${event.name}. ${event.tagline || ""}`,
  }
}
