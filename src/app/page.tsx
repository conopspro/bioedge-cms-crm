import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

import { PublicHeader } from "@/components/brand/public-header"
import { PublicFooter } from "@/components/brand/public-footer"
import { HomepageHero } from "@/components/home/homepage-hero"
import { HomepageEvents } from "@/components/home/homepage-events"
import { EdgeFramework } from "@/components/home/edge-framework"
import { PhotoSliderSection } from "@/components/home/photo-slider-section"
import { HomepageVideo } from "@/components/home/homepage-video"
import { HomepageHtml } from "@/components/home/homepage-html"
import { HomepageCta } from "@/components/home/homepage-cta"
import { HomepageFeaturedLeaders } from "@/components/home/homepage-featured-leaders"
import { HomepageFeaturedCompanies } from "@/components/home/homepage-featured-companies"
import { HomepageFeaturedPresentations } from "@/components/home/homepage-featured-presentations"
import { HomepageFeaturedArticles } from "@/components/home/homepage-featured-articles"
import { HomepageFeaturedSpotlight } from "@/components/home/homepage-featured-spotlight"
import { WebSiteJsonLd } from "@/components/seo/json-ld"

/**
 * Homepage
 *
 * The public-facing homepage for bioEDGE Longevity Summit.
 * Renders sections dynamically from database configuration.
 */
export default async function HomePage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Fetch all homepage data in parallel
  const [
    { data: settings },
    { data: headerEvents },
    { data: headerNavItems },
    { data: footerNavItems },
    { data: sections },
    { data: featuredEvents },
    { data: featuredLeaders },
    { data: featuredCompanies },
    { data: featuredPresentations },
    { data: featuredArticles },
    { data: featuredSpotlights },
    { count: totalLeadersCount },
    { count: totalCompaniesCount },
    { count: totalPresentationsCount },
    { count: totalArticlesCount },
    { count: totalSpotlightsCount },
  ] = await Promise.all([
    // Homepage settings
    supabase
      .from("homepage_settings")
      .select("*")
      .single(),

    // Upcoming events for header (all "live" statuses)
    supabase
      .from("events")
      .select("name, slug, city, start_date, end_date")
      .in("status", ["published", "registration_open", "announced", "sold_out"])
      .gte("end_date", today)
      .order("start_date", { ascending: true })
      .limit(3),

    // Navigation items for header
    supabase
      .from("navigation_items")
      .select("id, label, href, is_external, display_order, parent_id")
      .eq("location", "main_header")
      .is("event_id", null)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Navigation items for footer
    supabase
      .from("navigation_items")
      .select("id, label, href, is_external, display_order, parent_id")
      .eq("location", "main_footer")
      .is("event_id", null)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Visible sections ordered by display_order
    supabase
      .from("homepage_sections")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Featured events with venue photo from section photos
    supabase
      .from("homepage_events")
      .select(`
        *,
        event:events(
          id, name, slug, tagline, start_date, end_date,
          city, state, venue_name, featured_image_url, status,
          venue:venues(photo_url),
          section_photos:event_section_photos(image_url, section)
        )
      `)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),

    // Featured leaders (contacts with is_featured = true)
    supabase
      .from("contacts")
      .select(`
        id, slug, first_name, last_name, title, avatar_url, linkedin_url,
        company:companies(name)
      `)
      .eq("is_featured", true)
      .eq("show_on_articles", true)
      .order("last_name")
      .limit(12),

    // Featured companies (exclude drafts - include NULL and false)
    supabase
      .from("companies")
      .select("id, name, slug, domain, logo_url")
      .eq("is_featured", true)
      .or("is_draft.is.null,is_draft.eq.false")
      .order("name")
      .limit(12),

    // Featured presentations
    supabase
      .from("presentations")
      .select(`
        id, title, slug, short_description, youtube_url,
        contact:contacts(id, first_name, last_name, avatar_url),
        company:companies(name)
      `)
      .eq("is_featured", true)
      .eq("status", "published")
      .order("title")
      .limit(12),

    // Featured articles
    supabase
      .from("articles")
      .select(`
        id, title, slug, excerpt, featured_image_url, youtube_url,
        company:companies(name)
      `)
      .eq("is_featured", true)
      .eq("status", "published")
      .order("title")
      .limit(12),

    // Featured spotlights
    supabase
      .from("spotlights")
      .select(`
        id, title, slug, short_description, youtube_url,
        contact:contacts(id, first_name, last_name, avatar_url),
        company:companies(name)
      `)
      .eq("is_featured", true)
      .eq("status", "published")
      .order("title")
      .limit(12),

    // Count queries for "View All" links
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("show_on_articles", true),

    supabase
      .from("companies")
      .select("id", { count: "exact", head: true })
      .or("is_draft.is.null,is_draft.eq.false"),

    supabase
      .from("presentations")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),

    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),

    supabase
      .from("spotlights")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
  ])

  // Prefetch slider data for any slider sections (avoids per-component DB queries)
  const sliderIds = (sections || [])
    .filter((s: any) => s.section_type === "slider" && s.settings?.slider_id)
    .map((s: any) => s.settings.slider_id)

  let slidersMap: Record<string, any> = {}
  if (sliderIds.length > 0) {
    const { data: sliders } = await supabase
      .from("shared_photo_sliders")
      .select(`*, images:shared_slider_images(*)`)
      .eq("is_active", true)
      .in("id", sliderIds)

    for (const slider of sliders || []) {
      slidersMap[slider.id] = slider
    }
  }

  // Filter to only published/live events
  const publishedEvents = (featuredEvents || []).filter(
    (fe) => fe.event?.status === "published" ||
            fe.event?.status === "announced" ||
            fe.event?.status === "registration_open" ||
            fe.event?.status === "sold_out"
  )

  // Render section based on type
  const renderSection = (section: any) => {
    switch (section.section_type) {
      case "events":
        return (
          <HomepageEvents
            key={section.id}
            label={section.label}
            title={section.title}
            background={section.background}
            columns={section.settings?.columns || 1}
            events={publishedEvents}
            settings={section.settings}
          />
        )
      case "edge_framework":
        return (
          <EdgeFramework
            key={section.id}
            label={section.label}
            title={section.title}
            description={section.description}
            settings={section.settings}
          />
        )
      case "slider":
        if (!section.settings?.slider_id) return null
        return (
          <PhotoSliderSection
            key={section.id}
            sliderId={section.settings.slider_id}
            label={section.label}
            title={section.title}
            settings={section.settings}
            prefetchedSlider={slidersMap[section.settings.slider_id]}
          />
        )
      case "video":
        if (!section.settings?.video_url) return null
        return (
          <HomepageVideo
            key={section.id}
            label={section.label}
            title={section.title}
            videoUrl={section.settings.video_url}
            background={section.background}
            settings={section.settings}
          />
        )
      case "html":
        if (!section.settings?.html_content) return null
        return (
          <HomepageHtml
            key={section.id}
            htmlContent={section.settings.html_content}
            background={section.background}
            settings={section.settings}
          />
        )
      case "cta":
        return (
          <HomepageCta
            key={section.id}
            label={section.label}
            title={section.title}
            description={section.description}
            buttonText={section.settings?.button_text}
            buttonUrl={section.settings?.button_url}
            background={section.background}
            settings={section.settings}
          />
        )
      case "featured_leaders":
        return (
          <HomepageFeaturedLeaders
            key={section.id}
            label={section.label}
            title={section.title}
            leaders={(featuredLeaders || []) as any}
            totalCount={totalLeadersCount || undefined}
            settings={section.settings}
          />
        )
      case "featured_companies":
        return (
          <HomepageFeaturedCompanies
            key={section.id}
            label={section.label}
            title={section.title}
            companies={(featuredCompanies || []) as any}
            totalCount={totalCompaniesCount || undefined}
            settings={section.settings}
          />
        )
      case "featured_presentations":
        return (
          <HomepageFeaturedPresentations
            key={section.id}
            label={section.label}
            title={section.title}
            presentations={(featuredPresentations || []) as any}
            totalCount={totalPresentationsCount || undefined}
            settings={section.settings}
          />
        )
      case "featured_articles":
        return (
          <HomepageFeaturedArticles
            key={section.id}
            label={section.label}
            title={section.title}
            articles={(featuredArticles || []) as any}
            totalCount={totalArticlesCount || undefined}
            settings={section.settings}
          />
        )
      case "featured_spotlight":
        return (
          <HomepageFeaturedSpotlight
            key={section.id}
            label={section.label}
            title={section.title}
            spotlights={(featuredSpotlights || []) as any}
            totalCount={totalSpotlightsCount || undefined}
            settings={section.settings}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <WebSiteJsonLd />
      <PublicHeader events={headerEvents || []} navItems={headerNavItems || undefined} />
      <main className="flex-1">
        {/* Hero is always first */}
        <HomepageHero settings={settings} />

        {/* Dynamic sections */}
        {(sections || []).map(renderSection)}
      </main>
      <PublicFooter navItems={footerNavItems || undefined} />
    </div>
  )
}

export async function generateMetadata() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from("homepage_settings")
    .select("page_title, meta_description, og_image_url")
    .single()

  return {
    title: settings?.page_title || "bioEDGE Longevity Summit",
    description: settings?.meta_description || "A transformational live experience bringing the EDGE Framework to cities across America.",
    openGraph: {
      title: settings?.page_title || "bioEDGE Longevity Summit",
      description: settings?.meta_description || "A transformational live experience bringing the EDGE Framework to cities across America.",
      type: "website",
      ...(settings?.og_image_url ? { images: [{ url: settings.og_image_url }] } : {}),
    },
    twitter: {
      card: settings?.og_image_url ? "summary_large_image" : "summary",
      title: settings?.page_title || "bioEDGE Longevity Summit",
      description: settings?.meta_description || "A transformational live experience bringing the EDGE Framework to cities across America.",
      ...(settings?.og_image_url ? { images: [settings.og_image_url] } : {}),
    },
  }
}
