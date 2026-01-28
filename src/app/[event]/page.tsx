import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, ChevronRight, Check, Play, Quote } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { CountdownTimer } from "@/components/events/public/countdown-timer"
import { TicketTierCard } from "@/components/events/public/ticket-tier-card"
import { FAQAccordion } from "@/components/events/public/faq-accordion"
import { PhotoSlider } from "@/components/events/public/photo-slider"
import { VideoPlaylist } from "@/components/events/public/video-playlist"
import { FinalCtaSection } from "@/components/events/final-cta-section"

// TODO: Re-enable caching for production
export const revalidate = 60

interface PageProps {
  params: Promise<{ event: string }>
}

// Section color types
interface SectionColors {
  background: string | null
  title: string
  subtitle: string
  text: string
  accent?: string        // Icons, links, highlights
  button_bg?: string     // Primary button background
  button_text?: string   // Primary button text
  card_bg?: string       // Card backgrounds within section
  card_title?: string    // Title text inside cards
  card_text?: string     // Body text inside cards
}

interface SectionColorsSettings {
  hero: SectionColors
  value_props: SectionColors
  testimonials: SectionColors
  leaders: SectionColors
  tickets: SectionColors
  venue: SectionColors
  companies: SectionColors
  faq: SectionColors
  cta: SectionColors
}

const defaultSectionColors: SectionColorsSettings = {
  hero: { background: null, title: "#ffffff", subtitle: "#cccccc", text: "#cccccc", accent: "#c9a227", button_bg: "#c9a227", button_text: "#ffffff", card_bg: "rgba(255,255,255,0.1)" },
  value_props: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#f3f4f6" },
  testimonials: { background: "#f8f9fa", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#ffffff" },
  leaders: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#ffffff" },
  tickets: { background: "#0a2540", title: "#ffffff", subtitle: "#c9a227", text: "#cccccc", accent: "#c9a227", button_bg: "#c9a227", button_text: "#ffffff", card_bg: "#ffffff", card_title: "#0a2540", card_text: "#374151" },
  venue: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227" },
  companies: { background: "#f8f9fa", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#ffffff" },
  faq: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227" },
  cta: { background: null, title: "#ffffff", subtitle: "#cccccc", text: "#cccccc", accent: "#c9a227", button_bg: "#c9a227", button_text: "#ffffff" },
}

function getSectionColors(eventColors: Partial<SectionColorsSettings> | null, section: keyof SectionColorsSettings): SectionColors {
  const defaults = defaultSectionColors[section]
  if (!eventColors || !eventColors[section]) return defaults
  return { ...defaults, ...eventColors[section] }
}

// Check if a color string is a gradient
function isGradient(color: string | null): boolean {
  if (!color) return false
  return color.includes('gradient') || color.includes('linear') || color.includes('radial')
}

// Get background style - supports solid colors and gradients
function getBackgroundStyle(color: string | null): React.CSSProperties {
  if (!color) return {}
  if (isGradient(color)) {
    return { background: color }
  }
  return { backgroundColor: color }
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "Date TBD"

  // Parse dates treating them as local dates (not UTC) to avoid timezone offset issues
  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const startDate = parseDate(start)

  if (!end || start.split('T')[0] === end.split('T')[0]) {
    return startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const endDate = parseDate(end)

  // Same month
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString("en-US", { month: "long" })} ${startDate.getDate()}–${endDate.getDate()}, ${startDate.getFullYear()}`
  }

  // Different months
  return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
}

/**
 * Public Event Landing Page
 *
 * High-converting event page following the 6 Essential Questions:
 * WHAT, WHEN, WHERE, WHY, WHO, HOW
 */
export default async function EventLandingPage({ params }: PageProps) {
  const { event: slug } = await params
  const supabase = await createClient()

  // Fetch event with all landing page fields
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch related data in parallel
  const [
    { data: leaders },
    { data: companies },
    { data: ticketTiers },
    { data: testimonials },
    { data: customFaqs },
    { data: linkedFaqs },
    { data: sectionPhotos },
    { data: sliders },
  ] = await Promise.all([
    // Leaders (featured only for landing page)
    supabase
      .from("event_contacts")
      .select(`
        *,
        contact:contacts(
          id, first_name, last_name, title, avatar_url, slug,
          company:companies(id, name, logo_url)
        )
      `)
      .eq("event_id", event.id)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .limit(8),

    // Companies grouped by tier
    supabase
      .from("event_companies")
      .select(`
        *,
        company:companies(id, name, slug, logo_url, website, is_draft)
      `)
      .eq("event_id", event.id)
      .order("role", { ascending: true })
      .order("display_order", { ascending: true }),

    // Ticket tiers with features
    supabase
      .from("event_ticket_tiers")
      .select(`
        *,
        features:event_ticket_features(*)
      `)
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Testimonials
    supabase
      .from("event_testimonials")
      .select(`
        *,
        contact:contacts(first_name, last_name, title, avatar_url, slug, company:companies(name))
      `)
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })
      .limit(6),

    // FAQs (custom)
    supabase
      .from("event_faqs")
      .select("*")
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // FAQs (from templates)
    supabase
      .from("event_faq_links")
      .select(`
        *,
        template:faq_templates(*)
      `)
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Section photos
    supabase
      .from("event_section_photos")
      .select("*")
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Photo sliders with images
    supabase
      .from("event_photo_sliders")
      .select(`
        *,
        images:event_slider_images(*)
      `)
      .eq("event_id", event.id)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),
  ])

  // Parse JSON fields safely
  const valueProps = Array.isArray(event.value_props) ? event.value_props : []
  const sectionColors = event.section_colors as Partial<SectionColorsSettings> | null
  // Value Prop item type
  interface ValuePropItem {
    id: string
    text: string
    icon?: string | null
    highlight?: boolean
  }

  const landingPageSettings = event.landing_page_settings as {
    hero?: {
      layout?: 'full_background' | 'split_image'
      split_image_url?: string | null
      split_image_position?: 'left' | 'right'
      // Content overrides
      logo_url?: string | null
      tagline?: string | null
      description?: string | null
      // CTA customization
      cta_text?: string | null
      cta_url?: string | null
      secondary_cta_text?: string | null
      secondary_cta_url?: string | null
      // Display options
      show_countdown?: boolean
      show_early_bird?: boolean
      early_bird_text?: string | null
      // Media
      overlay_opacity?: number
    }
    value_props?: {
      visible?: boolean
      title?: string
      subtitle?: string
      description?: string | null
      layout?: 'grid' | 'list' | 'cards'
      columns?: 2 | 3 | 4
      show_icons?: boolean
      icon_style?: 'check' | 'bullet' | 'number'
      use_custom_props?: boolean
      custom_value_props?: ValuePropItem[] | null
      fallback_description?: string | null
    }
    testimonials?: {
      visible?: boolean
      title?: string
      subtitle?: string
      description?: string | null
      layout?: 'grid' | 'carousel' | 'featured'
      columns?: 2 | 3
      max_testimonials?: number
      show_photos?: boolean
      show_company?: boolean
      show_title?: boolean
      show_video_link?: boolean
      show_quote_icon?: boolean
      card_style?: 'default' | 'minimal' | 'bordered'
    }
    photo_slider_1?: { visible?: boolean; title?: string; subtitle?: string; slider_id?: string | null; background?: string }
    photo_slider_2?: { visible?: boolean; title?: string; subtitle?: string; slider_id?: string | null; background?: string }
    video_playlist?: { visible?: boolean; title?: string; subtitle?: string; videos?: { url: string }[]; background?: string }
    custom_html?: { visible?: boolean; title?: string; subtitle?: string; html_content?: string; background?: string }
    faq?: {
      visible?: boolean
      title?: string
      subtitle?: string
      description?: string | null
      layout?: 'accordion' | 'two_column'
      show_contact_section?: boolean
      contact_text?: string | null
      contact_email?: string | null
      contact_button_text?: string | null
      show_categories?: boolean
      expand_first?: boolean
    }
    final_cta?: { visible?: boolean; title?: string; subtitle?: string; description?: string; button_text?: string }
    tickets?: { visible?: boolean; title?: string; subtitle?: string }
    leaders?: { visible?: boolean; title?: string; subtitle?: string }
    companies?: { visible?: boolean; title?: string; subtitle?: string }
    venue?: { visible?: boolean; title?: string; subtitle?: string }
    section_order?: string[]
  } | null

  // Get colors for each section
  const heroColors = getSectionColors(sectionColors, 'hero')
  const valuePropsColors = getSectionColors(sectionColors, 'value_props')
  const testimonialsColors = getSectionColors(sectionColors, 'testimonials')
  const leadersColors = getSectionColors(sectionColors, 'leaders')
  const ticketsColors = getSectionColors(sectionColors, 'tickets')
  const venueColors = getSectionColors(sectionColors, 'venue')
  const companiesColors = getSectionColors(sectionColors, 'companies')
  const faqColors = getSectionColors(sectionColors, 'faq')
  const ctaColors = getSectionColors(sectionColors, 'cta')

  // Get section photos
  const venuePhoto = sectionPhotos?.find(p => p.section === 'venue')
  const heroPhoto = sectionPhotos?.find(p => p.section === 'hero')

  // Group companies by role/tier (exclude draft companies - only skip if explicitly true)
  type EventCompany = NonNullable<typeof companies>[number]
  const companyGroups = (companies || []).reduce((acc, ec) => {
    // Handle Supabase returning arrays for single relations
    const rawCompany = ec.company
    const company = Array.isArray(rawCompany) ? rawCompany[0] : rawCompany
    // Skip draft companies (only if is_draft is explicitly true, not null)
    if (!company || company.is_draft === true) return acc
    const role = ec.role || "exhibitor"
    if (!acc[role]) acc[role] = []
    acc[role].push(ec)
    return acc
  }, {} as Record<string, EventCompany[]>)

  const tierOrder = ["title_sponsor", "platinum_sponsor", "gold_sponsor", "silver_sponsor", "bronze_sponsor", "exhibitor", "media_partner"]
  const activeTiers = tierOrder.filter(tier => companyGroups[tier]?.length > 0)

  const tierLabels: Record<string, string> = {
    title_sponsor: "Presented By",
    platinum_sponsor: "Platinum Sponsors",
    gold_sponsor: "Gold Sponsors",
    silver_sponsor: "Silver Sponsors",
    bronze_sponsor: "Bronze Sponsors",
    exhibitor: "Exhibitors",
    media_partner: "Media Partners",
  }

  const hasLeaders = (leaders?.length || 0) > 0 && (landingPageSettings?.leaders?.visible !== false)
  const hasCompanies = (companies?.length || 0) > 0 && (landingPageSettings?.companies?.visible !== false)
  const hasTickets = (ticketTiers?.length || 0) > 0 && (landingPageSettings?.tickets?.visible !== false)
  const hasTestimonials = (testimonials?.length || 0) > 0 && (landingPageSettings?.testimonials?.visible !== false)
  const hasValueProps = valueProps.length > 0 && (landingPageSettings?.value_props?.visible !== false)

  // Combine custom FAQs and linked template FAQs
  const allFaqs = [
    ...(customFaqs || []).map((faq: any) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      display_order: faq.display_order,
    })),
    ...(linkedFaqs || []).map((link: any) => ({
      id: link.id,
      question: link.question_override || link.template?.question || '',
      answer: link.answer_override || link.template?.answer || '',
      category: link.template?.category,
      display_order: link.display_order,
    })),
  ].sort((a, b) => a.display_order - b.display_order)

  const hasFAQs = allFaqs.length > 0

  // New section settings helpers (check these first to exclude from legacy system)
  const photoSlider1Settings = landingPageSettings?.photo_slider_1
  const photoSlider2Settings = landingPageSettings?.photo_slider_2
  const videoPlaylistSettings = landingPageSettings?.video_playlist
  const customHtmlSettings = landingPageSettings?.custom_html

  // Get IDs of sliders used in the new draggable section system (to exclude from legacy)
  const slidersUsedInDraggableSections = new Set<string>()
  if (photoSlider1Settings?.visible && photoSlider1Settings?.slider_id) {
    slidersUsedInDraggableSections.add(photoSlider1Settings.slider_id)
  }
  if (photoSlider2Settings?.visible && photoSlider2Settings?.slider_id) {
    slidersUsedInDraggableSections.add(photoSlider2Settings.slider_id)
  }

  // Group sliders by position (for backwards compatibility with position-based sliders)
  // EXCLUDE sliders that are used in the new draggable section system
  const slidersByPosition = (sliders || []).reduce((acc, slider) => {
    // Skip if this slider is used in the new draggable sections
    if (slidersUsedInDraggableSections.has(slider.id)) {
      return acc
    }
    const position = slider.position || 'after_hero'
    if (!acc[position]) acc[position] = []
    acc[position].push(slider)
    return acc
  }, {} as Record<string, typeof sliders>)

  // Helper to get slider by ID
  const getSliderById = (id: string | null | undefined) => {
    if (!id) return null
    return sliders?.find((s) => s.id === id) || null
  }

  // Get sliders for the new section-based approach
  const photoSlider1 = getSliderById(photoSlider1Settings?.slider_id)
  const photoSlider2 = getSliderById(photoSlider2Settings?.slider_id)

  // Determine hero layout type
  const heroLayout = landingPageSettings?.hero?.layout || 'full_background'
  const heroSplitImageUrl = landingPageSettings?.hero?.split_image_url
  const heroSplitImagePosition = landingPageSettings?.hero?.split_image_position || 'right'

  // Hero content settings (with fallbacks to event fields)
  const heroSettings = landingPageSettings?.hero
  const heroLogoUrl = heroSettings?.logo_url || event.logo_url
  const heroTagline = heroSettings?.tagline || event.tagline
  const heroDescription = heroSettings?.description || event.description
  const heroCtaText = heroSettings?.cta_text || "Register Now"
  const heroCtaUrl = heroSettings?.cta_url || event.registration_url
  const heroSecondaryCtaText = heroSettings?.secondary_cta_text
  const heroSecondaryCtaUrl = heroSettings?.secondary_cta_url
  const heroShowCountdown = heroSettings?.show_countdown !== false && event.show_countdown !== false
  const heroShowEarlyBird = heroSettings?.show_early_bird !== false
  const heroEarlyBirdText = heroSettings?.early_bird_text || event.early_bird_text
  const heroOverlayOpacity = heroSettings?.overlay_opacity ?? event.hero_overlay_opacity ?? 70

  return (
    <>
      {/* ============================================ */}
      {/* HERO SECTION - WHAT, WHEN, WHERE */}
      {/* ============================================ */}
      {heroLayout === 'split_image' && heroSplitImageUrl ? (
        // Split Layout Hero
        <section
          className="relative overflow-hidden"
          style={{
            ...(heroColors.background
              ? getBackgroundStyle(heroColors.background)
              : { background: 'linear-gradient(to bottom right, #0a2540, #1e3a5f, #3b82f6)' }
            ),
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
            <div className={`flex flex-col ${heroSplitImagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12 py-10 md:py-16`}>
              {/* Text Content - 50% */}
              <div className="flex-1 w-full md:w-1/2">
                {/* Event Logo */}
                {heroLogoUrl && (
                  <img
                    src={heroLogoUrl}
                    alt={event.name}
                    className="h-10 md:h-12 mb-4"
                  />
                )}

                {/* Event Name */}
                <h1
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
                  style={{ color: heroColors.title }}
                >
                  {event.name}
                </h1>

                {/* Tagline */}
                {heroTagline && (
                  <p
                    className="text-lg md:text-xl font-semibold mb-6"
                    style={{ color: heroColors.subtitle }}
                  >
                    {heroTagline}
                  </p>
                )}

                {/* Date & Location */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6" style={{ color: heroColors.text }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: heroColors.accent || '#c9a227' }} />
                    <span className="font-medium">{formatDateRange(event.start_date, event.end_date)}</span>
                  </div>
                  {(event.venue_name || event.city) && (
                    <>
                      <span className="hidden sm:block text-white/40">|</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: heroColors.accent || '#c9a227' }} />
                        <span>{event.city}{event.state && `, ${event.state}`}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Countdown Timer */}
                {heroShowCountdown && event.start_date && (
                  <div className="mb-6">
                    <CountdownTimer
                      targetDate={new Date(event.start_date)}
                      cardBg={heroColors.card_bg}
                      textColor={heroColors.title}
                      labelColor={heroColors.text}
                    />
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  {heroCtaUrl && (
                    <a
                      href={heroCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md transition-colors"
                      style={{
                        backgroundColor: heroColors.button_bg || '#c9a227',
                        color: heroColors.button_text || '#ffffff',
                      }}
                    >
                      {heroCtaText}
                    </a>
                  )}
                  {heroSecondaryCtaUrl && heroSecondaryCtaText && (
                    <a
                      href={heroSecondaryCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md border-2 transition-colors"
                      style={{
                        borderColor: heroColors.button_bg || '#c9a227',
                        color: heroColors.button_bg || '#c9a227',
                      }}
                    >
                      {heroSecondaryCtaText}
                    </a>
                  )}
                </div>

                {/* Early Bird Notice */}
                {heroShowEarlyBird && heroEarlyBirdText && (
                  <p className="mt-4 font-medium text-sm" style={{ color: heroColors.accent || '#c9a227' }}>
                    {heroEarlyBirdText}
                  </p>
                )}
              </div>

              {/* Image - 50% with padding */}
              <div className="flex-1 w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={heroSplitImageUrl}
                    alt={event.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Full Background Hero (default)
        <section
          className="relative overflow-hidden"
          style={{
            backgroundImage: event.hero_image_url ? `url(${event.hero_image_url})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            ...(!event.hero_image_url && heroColors.background ? getBackgroundStyle(heroColors.background) : {}),
          }}
        >
          {/* Overlay - use custom background color/gradient or default gradient */}
          <div
            className="absolute inset-0"
            style={{
              ...(heroColors.background
                ? getBackgroundStyle(heroColors.background)
                : { background: 'linear-gradient(to bottom right, #0a2540, #1e3a5f, #3b82f6)' }
              ),
              opacity: event.hero_image_url ? heroOverlayOpacity / 100 : 1,
            }}
          />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
            <div className="max-w-3xl">
              {/* Event Logo */}
              {heroLogoUrl && (
                <img
                  src={heroLogoUrl}
                  alt={event.name}
                  className="h-10 md:h-12 mb-4"
                />
              )}

              {/* Event Name */}
              <h1
                className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
                style={{ color: heroColors.title }}
              >
                {event.name}
              </h1>

              {/* Tagline */}
              {heroTagline && (
                <p
                  className="text-lg md:text-xl font-semibold mb-6 max-w-2xl"
                  style={{ color: heroColors.subtitle }}
                >
                  {heroTagline}
                </p>
              )}

              {/* Date & Location */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6" style={{ color: heroColors.text }}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: heroColors.accent || '#c9a227' }} />
                  <span className="font-medium">{formatDateRange(event.start_date, event.end_date)}</span>
                </div>
                {(event.venue_name || event.city) && (
                  <>
                    <span className="hidden sm:block text-white/40">|</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: heroColors.accent || '#c9a227' }} />
                      <span>{event.city}{event.state && `, ${event.state}`}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Countdown Timer */}
              {heroShowCountdown && event.start_date && (
                <div className="mb-6">
                  <CountdownTimer
                    targetDate={new Date(event.start_date)}
                    cardBg={heroColors.card_bg}
                    textColor={heroColors.title}
                    labelColor={heroColors.text}
                  />
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                {heroCtaUrl && (
                  <a
                    href={heroCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md transition-colors"
                    style={{
                      backgroundColor: heroColors.button_bg || '#c9a227',
                      color: heroColors.button_text || '#ffffff',
                    }}
                  >
                    {heroCtaText}
                  </a>
                )}
                {heroSecondaryCtaUrl && heroSecondaryCtaText && (
                  <a
                    href={heroSecondaryCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md border-2 transition-colors"
                    style={{
                      borderColor: heroColors.button_bg || '#c9a227',
                      color: heroColors.button_bg || '#c9a227',
                    }}
                  >
                    {heroSecondaryCtaText}
                  </a>
                )}
              </div>

              {/* Early Bird Notice */}
              {heroShowEarlyBird && heroEarlyBirdText && (
                <p className="mt-4 font-medium text-sm" style={{ color: heroColors.accent || '#c9a227' }}>
                  {heroEarlyBirdText}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* PHOTO SLIDERS - AFTER HERO */}
      {/* ============================================ */}
      {slidersByPosition['after_hero']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* VALUE PROPOSITION - WHY */}
      {/* ============================================ */}
      {(() => {
        const vpSettings = landingPageSettings?.value_props
        const vpVisible = vpSettings?.visible !== false
        const vpTitle = vpSettings?.title || "What You'll Get"
        const vpSubtitle = vpSettings?.subtitle || "Why Attend"
        const vpDescription = vpSettings?.description
        const vpLayout = vpSettings?.layout || 'grid'
        const vpColumns = vpSettings?.columns || 3
        const vpShowIcons = vpSettings?.show_icons !== false
        const vpIconStyle = vpSettings?.icon_style || 'check'
        const vpUseCustom = vpSettings?.use_custom_props === true
        const vpCustomProps = vpSettings?.custom_value_props
        const vpFallback = vpSettings?.fallback_description || event.description

        // Determine which value props to use
        const displayProps = vpUseCustom && vpCustomProps?.length
          ? vpCustomProps
          : valueProps

        const hasDisplayProps = displayProps.length > 0

        // Grid column classes based on settings
        const gridColsClass = vpLayout === 'list'
          ? 'max-w-2xl mx-auto space-y-2'
          : vpColumns === 2
            ? 'grid gap-3 md:grid-cols-2'
            : vpColumns === 4
              ? 'grid gap-3 md:grid-cols-2 lg:grid-cols-4'
              : 'grid gap-3 md:grid-cols-2 lg:grid-cols-3'

        // Render icon based on style
        const renderIcon = (index: number, highlight: boolean) => {
          if (!vpShowIcons) return null

          const iconBgClass = highlight ? "bg-gold text-white" : "bg-navy text-white"

          if (vpIconStyle === 'number') {
            return (
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${iconBgClass}`}>
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
            )
          }

          if (vpIconStyle === 'bullet') {
            return (
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${iconBgClass}`}>
                <span className="text-lg leading-none">•</span>
              </div>
            )
          }

          // Default: check
          return (
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${iconBgClass}`}>
              <Check className="h-4 w-4" />
            </div>
          )
        }

        if (!vpVisible) return null
        if (!hasDisplayProps && !vpFallback) return null

        return (
          <section className="py-5" style={getBackgroundStyle(valuePropsColors.background)}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center mb-5">
                <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: valuePropsColors.subtitle }}>{vpSubtitle}</p>
                <h2 className="font-heading text-2xl font-bold" style={{ color: valuePropsColors.title }}>{vpTitle}</h2>
                {vpDescription && (
                  <p className="mt-3 text-sm" style={{ color: valuePropsColors.text }}>{vpDescription}</p>
                )}
              </div>

              {hasDisplayProps ? (
                <div className={gridColsClass}>
                  {displayProps.map((prop: { text: string; icon?: string; highlight?: boolean }, index: number) => {
                    const isHighlight = prop.highlight || false

                    if (vpLayout === 'cards') {
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 transition-shadow hover:shadow-md ${
                            isHighlight ? "border-gold bg-gold/5" : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {renderIcon(index, isHighlight)}
                            <p className="text-sm font-medium" style={{ color: valuePropsColors.text }}>{prop.text}</p>
                          </div>
                        </div>
                      )
                    }

                    if (vpLayout === 'list') {
                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            isHighlight ? "bg-gold/10 border border-gold" : "bg-muted"
                          }`}
                        >
                          {renderIcon(index, isHighlight)}
                          <p className="text-sm font-medium" style={{ color: valuePropsColors.text }}>{prop.text}</p>
                        </div>
                      )
                    }

                    // Default: grid
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${
                          isHighlight ? "bg-gold/10 border border-gold" : "bg-muted"
                        }`}
                      >
                        {renderIcon(index, isHighlight)}
                        <p className="text-sm font-medium" style={{ color: valuePropsColors.text }}>{prop.text}</p>
                      </div>
                    )
                  })}
                </div>
              ) : vpFallback && (
                <div className="max-w-3xl mx-auto">
                  <p className="body-text text-center whitespace-pre-wrap" style={{ color: valuePropsColors.text }}>
                    {vpFallback}
                  </p>
                </div>
              )}
            </div>
          </section>
        )
      })()}

      {/* Sliders: After Value Props */}
      {slidersByPosition['after_value_props']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* SOCIAL PROOF - TESTIMONIALS */}
      {/* ============================================ */}
      {(() => {
        const testSettings = landingPageSettings?.testimonials
        const testVisible = testSettings?.visible !== false
        const testTitle = testSettings?.title || "Don't Take Our Word For It"
        const testSubtitle = testSettings?.subtitle || "What Attendees Say"
        const testDescription = testSettings?.description
        const testLayout = testSettings?.layout || 'grid'
        const testColumns = testSettings?.columns || 2
        const testMaxItems = testSettings?.max_testimonials || 6
        const testShowPhotos = testSettings?.show_photos !== false
        const testShowQuoteIcon = testSettings?.show_quote_icon !== false
        const testShowTitle = testSettings?.show_title !== false
        const testShowCompany = testSettings?.show_company !== false
        const testShowVideoLink = testSettings?.show_video_link !== false
        const testCardStyle = testSettings?.card_style || 'default'

        if (!testVisible || !hasTestimonials) return null

        // Limit testimonials displayed
        const displayTestimonials = testimonials?.slice(0, testMaxItems) || []

        // Grid column classes based on settings
        const gridColsClass = testLayout === 'featured'
          ? 'space-y-4'
          : testColumns === 2
            ? 'grid gap-4 md:grid-cols-2'
            : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'

        // Card style classes
        const getCardClass = (isFeatured = false) => {
          const baseClass = isFeatured ? 'p-6' : 'p-4'
          switch (testCardStyle) {
            case 'minimal':
              return `${baseClass} bg-transparent`
            case 'bordered':
              return `${baseClass} border-2 border-gray-200 rounded-lg bg-white`
            default:
              return `be-card relative ${baseClass}`
          }
        }

        return (
          <section className="py-5" style={getBackgroundStyle(testimonialsColors.background)}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center mb-5">
                <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: testimonialsColors.subtitle }}>{testSubtitle}</p>
                <h2 className="font-heading text-2xl font-bold" style={{ color: testimonialsColors.title }}>{testTitle}</h2>
                {testDescription && (
                  <p className="mt-3 text-sm" style={{ color: testimonialsColors.text }}>{testDescription}</p>
                )}
              </div>

              {testLayout === 'featured' && displayTestimonials.length > 0 ? (
                // Featured layout: first testimonial is large
                <div className="space-y-4">
                  {/* Featured testimonial */}
                  {(() => {
                    const featured = displayTestimonials[0]
                    const name = featured.contact
                      ? `${featured.contact.first_name} ${featured.contact.last_name}`
                      : featured.author_name
                    const title = featured.contact?.title || featured.author_title
                    const company = featured.contact?.company?.name || featured.author_company
                    const image = featured.contact?.avatar_url || featured.author_image_url
                    const leaderSlug = featured.contact?.slug

                    return (
                      <div className={`${getCardClass(true)} relative`}>
                        {testShowQuoteIcon && (
                          <Quote className="absolute top-4 right-4 h-8 w-8 text-gold/20" />
                        )}
                        <p className="mb-6 italic text-lg" style={{ color: testimonialsColors.text }}>&ldquo;{featured.quote}&rdquo;</p>
                        <div className="flex items-center gap-3">
                          {testShowPhotos && (
                            image ? (
                              <img src={image} alt={name || ""} className="w-14 h-14 rounded-full object-cover" />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center font-heading font-bold text-lg">
                                {name?.charAt(0) || "?"}
                              </div>
                            )
                          )}
                          <div>
                            {leaderSlug ? (
                              <a href={`/leaders/${leaderSlug}`} className="font-heading font-semibold text-navy hover:text-gold transition-colors">{name}</a>
                            ) : (
                              <p className="font-heading font-semibold text-navy">{name}</p>
                            )}
                            {(testShowTitle || testShowCompany) && (title || company) && (
                              <p className="text-sm text-text-light">
                                {testShowTitle && title}{testShowTitle && testShowCompany && title && company && ", "}{testShowCompany && company}
                              </p>
                            )}
                          </div>
                        </div>
                        {testShowVideoLink && featured.video_url && (
                          <a
                            href={featured.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:text-gold/80"
                          >
                            <Play className="h-4 w-4" />
                            Watch Video
                          </a>
                        )}
                      </div>
                    )
                  })()}

                  {/* Rest of testimonials in grid */}
                  {displayTestimonials.length > 1 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {displayTestimonials.slice(1).map((testimonial) => {
                        const name = testimonial.contact
                          ? `${testimonial.contact.first_name} ${testimonial.contact.last_name}`
                          : testimonial.author_name
                        const title = testimonial.contact?.title || testimonial.author_title
                        const company = testimonial.contact?.company?.name || testimonial.author_company
                        const image = testimonial.contact?.avatar_url || testimonial.author_image_url
                        const leaderSlug = testimonial.contact?.slug

                        return (
                          <div key={testimonial.id} className={`${getCardClass()} relative`}>
                            {testShowQuoteIcon && (
                              <Quote className="absolute top-3 right-3 h-6 w-6 text-gold/20" />
                            )}
                            <p className="mb-4 italic text-sm" style={{ color: testimonialsColors.text }}>&ldquo;{testimonial.quote}&rdquo;</p>
                            <div className="flex items-center gap-2">
                              {testShowPhotos && (
                                image ? (
                                  <img src={image} alt={name || ""} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-heading font-bold text-sm">
                                    {name?.charAt(0) || "?"}
                                  </div>
                                )
                              )}
                              <div>
                                {leaderSlug ? (
                                  <a href={`/leaders/${leaderSlug}`} className="font-heading font-semibold text-navy text-sm hover:text-gold transition-colors">{name}</a>
                                ) : (
                                  <p className="font-heading font-semibold text-navy text-sm">{name}</p>
                                )}
                                {(testShowTitle || testShowCompany) && (title || company) && (
                                  <p className="text-xs text-text-light">
                                    {testShowTitle && title}{testShowTitle && testShowCompany && title && company && ", "}{testShowCompany && company}
                                  </p>
                                )}
                              </div>
                            </div>
                            {testShowVideoLink && testimonial.video_url && (
                              <a
                                href={testimonial.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-xs text-gold hover:text-gold/80"
                              >
                                <Play className="h-3 w-3" />
                                Watch Video
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Standard grid layout
                <div className={gridColsClass}>
                  {displayTestimonials.map((testimonial) => {
                    const name = testimonial.contact
                      ? `${testimonial.contact.first_name} ${testimonial.contact.last_name}`
                      : testimonial.author_name
                    const title = testimonial.contact?.title || testimonial.author_title
                    const company = testimonial.contact?.company?.name || testimonial.author_company
                    const image = testimonial.contact?.avatar_url || testimonial.author_image_url
                    const leaderSlug = testimonial.contact?.slug

                    return (
                      <div key={testimonial.id} className={`${getCardClass()} relative`}>
                        {testShowQuoteIcon && (
                          <Quote className="absolute top-3 right-3 h-6 w-6 text-gold/20" />
                        )}
                        <p className="mb-4 italic text-sm" style={{ color: testimonialsColors.text }}>&ldquo;{testimonial.quote}&rdquo;</p>
                        <div className="flex items-center gap-2">
                          {testShowPhotos && (
                            image ? (
                              <img src={image} alt={name || ""} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-heading font-bold text-sm">
                                {name?.charAt(0) || "?"}
                              </div>
                            )
                          )}
                          <div>
                            {leaderSlug ? (
                              <a href={`/leaders/${leaderSlug}`} className="font-heading font-semibold text-navy text-sm hover:text-gold transition-colors">{name}</a>
                            ) : (
                              <p className="font-heading font-semibold text-navy text-sm">{name}</p>
                            )}
                            {(testShowTitle || testShowCompany) && (title || company) && (
                              <p className="text-xs text-text-light">
                                {testShowTitle && title}{testShowTitle && testShowCompany && title && company && ", "}{testShowCompany && company}
                              </p>
                            )}
                          </div>
                        </div>
                        {testShowVideoLink && testimonial.video_url && (
                          <a
                            href={testimonial.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs text-gold hover:text-gold/80"
                          >
                            <Play className="h-3 w-3" />
                            Watch Video
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )
      })()}

      {/* Sliders: After Testimonials */}
      {slidersByPosition['after_testimonials']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* LEADERS - WHO */}
      {/* ============================================ */}
      {hasLeaders && (
        <section className="py-5" style={getBackgroundStyle(leadersColors.background)}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: leadersColors.subtitle }}>{landingPageSettings?.leaders?.subtitle || "Who You'll Learn From"}</p>
                <h2 className="font-heading text-2xl font-bold" style={{ color: leadersColors.title }}>{landingPageSettings?.leaders?.title || "Featured Leaders"}</h2>
              </div>
              <Link
                href={`/${event.slug}/leaders`}
                className="hidden sm:flex items-center gap-1 font-medium text-sm hover:opacity-80"
                style={{ color: '#017ab2' }}
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {leaders?.map((leader) => {
                const contact = leader.contact
                if (!contact) return null

                const name = `${contact.first_name} ${contact.last_name}`
                const title = leader.title_override || contact.title
                const image = leader.headshot_url || contact.avatar_url

                return (
                  <Link
                    key={leader.id}
                    href={contact.slug ? `/leaders/${contact.slug}` : `/${event.slug}/leaders`}
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
                        {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
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

            <div className="mt-5 text-center sm:hidden">
              <Link
                href={`/${event.slug}/leaders`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full font-medium text-sm border hover:opacity-80"
                style={{ color: '#017ab2', borderColor: '#017ab2' }}
              >
                View All Leaders
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sliders: After Leaders (legacy position-based) */}
      {slidersByPosition['after_leaders']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* PHOTO SLIDER 1 - Draggable Section */}
      {/* ============================================ */}
      {photoSlider1Settings?.visible && photoSlider1 && photoSlider1.images?.length > 0 && (
        <section
          className="py-8 md:py-12"
          style={getBackgroundStyle(photoSlider1Settings.background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(photoSlider1Settings.title || photoSlider1Settings.subtitle) && (
              <div className="text-center mb-6">
                {photoSlider1Settings.subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {photoSlider1Settings.subtitle}
                  </p>
                )}
                {photoSlider1Settings.title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {photoSlider1Settings.title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={photoSlider1.images || []}
              showCaption={photoSlider1.show_captions}
            />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* TICKETS - HOW */}
      {/* ============================================ */}
      {hasTickets && (
        <section id="tickets" className="py-5" style={getBackgroundStyle(ticketsColors.background)}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-5">
              <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: ticketsColors.subtitle }}>
                {landingPageSettings?.tickets?.subtitle || "Reserve Your Spot"}
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold" style={{ color: ticketsColors.title }}>
                {landingPageSettings?.tickets?.title || "Choose Your Experience"}
              </h2>
            </div>

            <div className={`grid gap-4 ${
              ticketTiers!.length === 1 ? "max-w-md mx-auto" :
              ticketTiers!.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" :
              "md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {ticketTiers?.map((tier, index) => (
                <TicketTierCard
                  key={tier.id}
                  name={tier.name}
                  description={tier.description}
                  price={Number(tier.price)}
                  originalPrice={tier.original_price ? Number(tier.original_price) : null}
                  currency={tier.currency || "USD"}
                  features={tier.features || []}
                  registrationUrl={tier.registration_url}
                  isSoldOut={tier.is_sold_out || false}
                  waitlistUrl={tier.waitlist_url}
                  isHighlighted={tier.is_highlighted || false}
                  highlightText={tier.highlight_text}
                  cardBg={ticketsColors.card_bg}
                  titleColor={ticketsColors.card_title || ticketsColors.title}
                  textColor={ticketsColors.card_text || ticketsColors.text}
                  buttonBg={ticketsColors.button_bg}
                  buttonText={ticketsColors.button_text}
                  accentColor={ticketsColors.accent}
                  animateOnScroll={true}
                  animationDelay={index * 150}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sliders: After Tickets */}
      {slidersByPosition['after_tickets']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* VENUE - WHERE (detailed) */}
      {/* ============================================ */}
      {(event.venue_name || event.venue_description) && landingPageSettings?.venue?.visible !== false && (
        <section id="venue" className="py-5" style={getBackgroundStyle(venueColors.background)}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: venueColors.subtitle }}>{landingPageSettings?.venue?.subtitle || "The Venue"}</p>
                <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: venueColors.title }}>{landingPageSettings?.venue?.title || event.venue_name || "Event Location"}</h2>

                {event.venue_address && (
                  <p className="mb-3 text-sm" style={{ color: venueColors.text }}>
                    {event.venue_address}<br />
                    {event.city}{event.state && `, ${event.state}`} {event.country}
                  </p>
                )}

                {event.venue_description && (
                  <p className="mb-4 whitespace-pre-wrap text-sm" style={{ color: venueColors.text }}>
                    {event.venue_description}
                  </p>
                )}

                {event.transportation_info && (
                  <div className="mb-4">
                    <h3 className="font-heading font-semibold mb-1 text-sm" style={{ color: venueColors.title }}>Getting There</h3>
                    <p className="whitespace-pre-wrap text-sm" style={{ color: venueColors.text }}>{event.transportation_info}</p>
                  </div>
                )}

                {(event.hotel_booking_url || event.hotel_group_rate) && (
                  <div className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                    <h3 className="font-heading font-semibold text-navy mb-1 text-sm">Accommodations</h3>
                    {event.hotel_group_rate && (
                      <p className="text-text-dark mb-2 text-sm">{event.hotel_group_rate}</p>
                    )}
                    {event.hotel_booking_url && (
                      <a
                        href={event.hotel_booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold/80 font-medium inline-flex items-center gap-1 text-sm"
                      >
                        Book Hotel <ChevronRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-muted rounded-lg overflow-hidden aspect-video">
                {venuePhoto?.image_url ? (
                  <img
                    src={venuePhoto.image_url}
                    alt={venuePhoto.alt_text || event.venue_name || "Venue"}
                    className="w-full h-full object-cover"
                  />
                ) : event.hero_image_url ? (
                  <img
                    src={event.hero_image_url}
                    alt={event.venue_name || "Venue"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-light">
                    <MapPin className="h-12 w-12" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sliders: After Venue */}
      {slidersByPosition['after_venue']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* COMPANIES - WHO (sponsors/exhibitors) */}
      {/* ============================================ */}
      {hasCompanies && (
        <section className="py-5" style={getBackgroundStyle(companiesColors.background)}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: companiesColors.subtitle }}>{landingPageSettings?.companies?.subtitle || "Our Partners"}</p>
                <h2 className="font-heading text-2xl font-bold" style={{ color: companiesColors.title }}>{landingPageSettings?.companies?.title || "Companies & Sponsors"}</h2>
              </div>
              <Link
                href={`/${event.slug}/companies`}
                className="hidden sm:flex items-center gap-1 font-medium text-sm hover:opacity-80"
                style={{ color: '#017ab2' }}
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {activeTiers.slice(0, 3).map((tier) => (
                <div key={tier}>
                  <h3 className="font-heading text-sm font-semibold text-navy mb-3">
                    {tierLabels[tier]}
                  </h3>
                  <div className={`grid gap-3 ${
                    tier.includes("title") || tier.includes("platinum")
                      ? "grid-cols-2 md:grid-cols-3"
                      : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                  }`}>
                    {(companyGroups[tier] || []).slice(0, tier.includes("title") ? 3 : 12).map((ec: EventCompany) => (
                      <a
                        key={ec.id}
                        href={ec.company?.website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="be-card flex items-center justify-center p-3 hover:shadow-lg transition-shadow"
                      >
                        {ec.company?.logo_url ? (
                          <img
                            src={ec.company.logo_url}
                            alt={ec.company.name}
                            className="max-h-28 max-w-full object-contain"
                          />
                        ) : (
                          <span className="font-heading font-medium text-navy text-xs text-center">
                            {ec.company?.name}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link
                href={`/${event.slug}/companies`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full font-medium text-sm border hover:opacity-80"
                style={{ color: '#017ab2', borderColor: '#017ab2' }}
              >
                View All Companies
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sliders: After Companies */}
      {slidersByPosition['after_companies']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* VIDEO PLAYLIST - Draggable Section */}
      {/* ============================================ */}
      {videoPlaylistSettings?.visible && videoPlaylistSettings.videos && videoPlaylistSettings.videos.length > 0 && (
        <section
          className="py-8 md:py-12"
          style={getBackgroundStyle(videoPlaylistSettings.background || '#f8f9fa')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(videoPlaylistSettings.title || videoPlaylistSettings.subtitle) && (
              <div className="text-center mb-6">
                {videoPlaylistSettings.subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {videoPlaylistSettings.subtitle}
                  </p>
                )}
                {videoPlaylistSettings.title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {videoPlaylistSettings.title}
                  </h2>
                )}
              </div>
            )}
            <VideoPlaylist videos={videoPlaylistSettings.videos} />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* PHOTO SLIDER 2 - Draggable Section */}
      {/* ============================================ */}
      {photoSlider2Settings?.visible && photoSlider2 && photoSlider2.images?.length > 0 && (
        <section
          className="py-8 md:py-12"
          style={getBackgroundStyle(photoSlider2Settings.background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(photoSlider2Settings.title || photoSlider2Settings.subtitle) && (
              <div className="text-center mb-6">
                {photoSlider2Settings.subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {photoSlider2Settings.subtitle}
                  </p>
                )}
                {photoSlider2Settings.title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {photoSlider2Settings.title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={photoSlider2.images || []}
              showCaption={photoSlider2.show_captions}
            />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* FAQ */}
      {/* ============================================ */}
      {(() => {
        const faqSettings = landingPageSettings?.faq
        const faqVisible = faqSettings?.visible !== false
        const faqTitle = faqSettings?.title || "Frequently Asked Questions"
        const faqSubtitle = faqSettings?.subtitle || "Questions?"
        const faqDescription = faqSettings?.description
        const faqLayout = faqSettings?.layout || 'accordion'
        const faqShowContact = faqSettings?.show_contact_section !== false
        const faqContactText = faqSettings?.contact_text || "Still have questions?"
        const faqContactEmail = faqSettings?.contact_email || event.contact_email || null
        const faqContactButtonText = faqSettings?.contact_button_text || "Contact Us"
        const faqExpandFirst = faqSettings?.expand_first === true

        if (!faqVisible || !hasFAQs) return null

        return (
          <section id="faq" className="py-5" style={getBackgroundStyle(faqColors.background)}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-5">
                <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1" style={{ color: faqColors.subtitle }}>
                  {faqSubtitle}
                </p>
                <h2 className="font-heading text-2xl font-bold" style={{ color: faqColors.title }}>
                  {faqTitle}
                </h2>
                {faqDescription && (
                  <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: faqColors.text }}>
                    {faqDescription}
                  </p>
                )}
              </div>

              {faqLayout === 'two_column' ? (
                <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
                  {allFaqs.map((faq, index) => (
                    <div key={faq.id} className="p-4 rounded-lg bg-muted">
                      <h3 className="font-heading font-semibold mb-2" style={{ color: faqColors.title }}>
                        {faq.question}
                      </h3>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: faqColors.text }}>
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <FAQAccordion items={allFaqs} defaultOpen={faqExpandFirst ? 0 : undefined} />
                </div>
              )}

              {faqShowContact && faqContactEmail && (
                <div className="mt-5 text-center">
                  <p className="mb-2 text-sm" style={{ color: faqColors.text }}>{faqContactText}</p>
                  <a
                    href={`mailto:${faqContactEmail}`}
                    className="text-gold hover:text-gold/80 font-medium text-sm"
                  >
                    {faqContactButtonText}
                  </a>
                </div>
              )}
            </div>
          </section>
        )
      })()}

      {/* ============================================ */}
      {/* CUSTOM HTML - Draggable Section */}
      {/* ============================================ */}
      {customHtmlSettings?.visible && customHtmlSettings.html_content && (
        <section
          className="py-8 md:py-12"
          style={getBackgroundStyle(customHtmlSettings.background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(customHtmlSettings.title || customHtmlSettings.subtitle) && (
              <div className="text-center mb-6">
                {customHtmlSettings.subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {customHtmlSettings.subtitle}
                  </p>
                )}
                {customHtmlSettings.title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {customHtmlSettings.title}
                  </h2>
                )}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: customHtmlSettings.html_content }} />
          </div>
        </section>
      )}

      {/* Sliders: After FAQ */}
      {slidersByPosition['after_faq']?.map((slider: any) => (
        <section
          key={slider.id}
          className="py-8 md:py-12"
          style={getBackgroundStyle(slider.section_background || '#ffffff')}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {(slider.section_title || slider.section_subtitle) && (
              <div className="text-center mb-6">
                {slider.section_subtitle && (
                  <p className="font-heading text-xs font-bold uppercase tracking-[2px] mb-1 text-gold">
                    {slider.section_subtitle}
                  </p>
                )}
                {slider.section_title && (
                  <h2 className="font-heading text-2xl font-bold text-navy">
                    {slider.section_title}
                  </h2>
                )}
              </div>
            )}
            <PhotoSlider
              images={slider.images || []}
              showCaption={slider.show_captions}
            />
          </div>
        </section>
      ))}

      {/* ============================================ */}
      {/* FINAL CTA */}
      {/* ============================================ */}
      <FinalCtaSection
        event={event}
        sectionColors={sectionColors}
        landingPageSettings={landingPageSettings}
      />

      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-16 sm:hidden" />
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
    .select("name, tagline, description, og_image_url, meta_title, meta_description")
    .eq("slug", slug)
    .neq("status", "draft")
    .single()

  if (!event) {
    return { title: "Event Not Found" }
  }

  const title = event.meta_title || event.name
  const description = event.meta_description || event.tagline || event.description?.slice(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event.og_image_url ? [event.og_image_url] : [],
    },
  }
}
