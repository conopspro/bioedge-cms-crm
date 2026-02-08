import { notFound } from "next/navigation"
import Link from "next/link"
import { Building2, ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getSectionColors, getBackgroundStyle, SectionColorsSettings } from "@/lib/event-colors"
import { FinalCtaSection } from "@/components/events/final-cta-section"

interface PageProps {
  params: Promise<{ event: string }>
}

// Tier labels for display
const tierLabels: Record<string, string> = {
  platinum: "Platinum Sponsors",
  gold: "Gold Sponsors",
  silver: "Silver Sponsors",
  bronze: "Bronze Sponsors",
  exhibitor: "Exhibitors",
  contributor: "Contributors",
}

// Tier order for display
const tierOrder = [
  "platinum",
  "gold",
  "silver",
  "bronze",
  "exhibitor",
  "contributor",
]

// Category labels will be fetched from database

/**
 * Event Companies Page
 *
 * Shows all companies exhibiting/sponsoring at a specific event.
 */
export default async function EventCompaniesPage({ params }: PageProps) {
  const { event: slug } = await params
  const supabase = await createClient()

  // Fetch event with colors, hero image, and landing page settings
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

  // Fetch categories for labels
  const { data: categoriesData } = await supabase
    .from("company_categories")
    .select("name, slug")
    .order("display_order", { ascending: true })

  // Build category labels map from database
  const categoryLabels: Record<string, string> = {}
  ;(categoriesData || []).forEach((cat: { slug: string; name: string }) => {
    categoryLabels[cat.slug] = cat.name
  })

  // Fetch companies for this event
  const { data: eventCompanies } = await supabase
    .from("event_companies")
    .select(`
      id,
      tier,
      display_order,
      booth_number,
      is_featured,
      notes,
      company:companies(
        id,
        name,
        slug,
        logo_url,
        website,
        description,
        category,
        is_draft
      )
    `)
    .eq("event_id", event.id)
    .order("tier", { ascending: true })
    .order("display_order", { ascending: true })

  // Group by tier (exclude draft companies)
  type EventCompany = NonNullable<typeof eventCompanies>[number]
  const companiesByTier = (eventCompanies || []).reduce((acc, ec) => {
    if (!ec.company) return acc
    // Handle Supabase returning arrays for single relations
    const rawCompany = ec.company
    const company = Array.isArray(rawCompany) ? rawCompany[0] : rawCompany
    // Skip draft companies (treat NULL as not-draft)
    if (!company || company.is_draft === true) return acc
    const tier = ec.tier || "exhibitor"
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(ec)
    return acc
  }, {} as Record<string, EventCompany[]>)

  const activeTiers = tierOrder.filter((tier) => (companiesByTier[tier]?.length ?? 0) > 0)
  const hasCompanies = (eventCompanies?.length || 0) > 0

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
            <Building2 className="h-8 w-8" style={{ color: heroColors.accent || '#c9a227' }} />
            <h1
              className="font-heading text-3xl md:text-4xl font-bold"
              style={{ color: heroColors.title }}
            >
              Partners & Exhibitors
            </h1>
          </div>
          <p className="text-lg" style={{ color: heroColors.subtitle }}>
            Companies sponsoring and exhibiting at {event.name}
          </p>
        </div>
      </section>

      {/* Content - Uses value_props colors */}
      <section
        className="py-12"
        style={getBackgroundStyle(valuePropsColors.background)}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {!hasCompanies ? (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 mx-auto mb-4" style={{ color: valuePropsColors.text, opacity: 0.5 }} />
              <h2
                className="text-xl font-heading font-semibold mb-2"
                style={{ color: valuePropsColors.title }}
              >
                Partners Coming Soon
              </h2>
              <p className="max-w-md mx-auto" style={{ color: valuePropsColors.text }}>
                We're finalizing our sponsor and exhibitor lineup. Check back soon for the full list of companies.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {activeTiers.map((tier) => {
                const companies = companiesByTier[tier] || []

                return (
                  <div key={tier}>
                    <h2
                      className="font-heading text-2xl md:text-3xl font-bold mb-6"
                      style={{ color: valuePropsColors.title }}
                    >
                      {tierLabels[tier] || tier}
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {companies.map((ec) => {
                        // Handle Supabase returning arrays for single relations
                        const rawCompany = ec.company
                        const company = Array.isArray(rawCompany) ? rawCompany[0] : rawCompany
                        if (!company) return null

                        return (
                          <Link
                            key={ec.id}
                            href={`/companies/${company.slug || company.id}`}
                            className="be-card hover:shadow-lg transition-shadow block text-center"
                          >
                            {/* Logo */}
                            {company.logo_url ? (
                              <div className="flex items-center justify-center mb-2 h-32">
                                <img
                                  src={company.logo_url}
                                  alt={company.name}
                                  className="object-contain max-h-32"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center bg-navy/5 rounded-lg mb-2 h-32">
                                <Building2 className="h-16 w-16 text-navy/30" />
                              </div>
                            )}

                            {/* Company Name */}
                            <h3
                              className="font-heading font-semibold mb-2"
                              style={{ color: '#0d2840' }}
                            >
                              {company.name}
                            </h3>

                            {/* Category Tag */}
                            {company.category && (
                              <span
                                className="inline-block px-2 py-0.5 text-xs font-medium rounded-md"
                                style={{ backgroundColor: 'rgba(1, 122, 178, 0.1)', color: '#017ab2' }}
                              >
                                {categoryLabels[company.category] || company.category}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
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
    return { title: "Companies Not Found" }
  }

  return {
    title: `Partners & Exhibitors - ${event.name}`,
    description: `Meet our sponsors and exhibitors at ${event.name}. ${event.tagline || ""}`,
  }
}
