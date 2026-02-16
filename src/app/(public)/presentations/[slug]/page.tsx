import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Calendar, MapPin } from "lucide-react"
import { LeaderCard, LeaderCardGrid } from "@/components/ui/leader-card"
import { CompanyCard } from "@/components/ui/company-card"
import { ArticleCard } from "@/components/ui/article-card"
import { getYouTubeThumbnailUrl } from "@/lib/youtube"
import { VideoJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld"

interface PresentationPageProps {
  params: Promise<{ slug: string }>
}

const roleLabels: Record<string, string> = {
  moderator: "Moderator",
  panelist: "Panelist",
  presenter: "Presenter",
  host: "Host",
  guest: "Guest",
}

export async function generateMetadata({ params }: PresentationPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: presentation } = await supabase
    .from("presentations")
    .select("title, short_description, recording_metadata, youtube_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!presentation) {
    return {
      title: "Presentation Not Found",
    }
  }

  const ogImage = presentation.recording_metadata?.thumbnail
    || getYouTubeThumbnailUrl(presentation.youtube_url)
    || "https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"

  return {
    title: presentation.title,
    description: presentation.short_description,
    openGraph: {
      title: presentation.title,
      description: presentation.short_description || undefined,
      type: "video.other",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: presentation.title,
      description: presentation.short_description || undefined,
      images: [ogImage],
    },
  }
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: presentation } = await supabase
    .from("presentations")
    .select(`
      *,
      contact:contacts(id, first_name, last_name, title, avatar_url, bio, linkedin_url, slug, ai_highlights, ai_expertise),
      company:companies(id, name, logo_url, domain, description, slug, is_draft),
      article:articles(id, title, slug, excerpt, featured_image_url, youtube_url),
      panelists:presentation_panelists(
        id,
        contact_id,
        role,
        company_id,
        article_id,
        display_order,
        contact:contacts(id, first_name, last_name, title, avatar_url, bio, linkedin_url, slug),
        company:companies(id, name, logo_url, domain, slug, is_draft),
        article:articles(id, title, slug)
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!presentation) {
    notFound()
  }

  // Hide draft companies from public display
  if (presentation.company?.is_draft === true) {
    presentation.company = null
  }
  if (presentation.panelists) {
    presentation.panelists = presentation.panelists.map((p: any) => ({
      ...p,
      company: p.company?.is_draft === true ? null : p.company,
    }))
  }

  // Fetch upcoming events where this presentation is scheduled
  const today = new Date().toISOString().split('T')[0]
  const { data: eventPresentations } = await supabase
    .from("event_presentations")
    .select(`
      id,
      scheduled_date,
      start_time,
      end_time,
      room,
      track,
      event:events(
        id,
        name,
        slug,
        start_date,
        end_date,
        venue_name,
        city,
        state,
        status
      )
    `)
    .eq("presentation_id", presentation.id)
    .neq("status", "cancelled")

  // Filter to only upcoming events (event start_date >= today) and non-draft events
  const upcomingEvents = (eventPresentations || [])
    .filter((ep: any) => {
      const event = Array.isArray(ep.event) ? ep.event[0] : ep.event
      if (!event) return false
      if (event.status === 'draft') return false
      // Check if event end_date (or start_date if no end) is >= today
      const eventEndDate = event.end_date || event.start_date
      return eventEndDate >= today
    })
    .sort((a: any, b: any) => {
      const eventA = Array.isArray(a.event) ? a.event[0] : a.event
      const eventB = Array.isArray(b.event) ? b.event[0] : b.event
      return (eventA?.start_date || '').localeCompare(eventB?.start_date || '')
    })

  // Sort panelists by display_order
  const sortedPanelists = (presentation.panelists || []).sort(
    (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
  )

  // Determine if this is a panel (multiple leaders) or single leader
  const hasPanelists = sortedPanelists.length > 0
  const isPanel = sortedPanelists.length > 1

  const thumbnailUrl = presentation.recording_metadata?.thumbnail
    || getYouTubeThumbnailUrl(presentation.youtube_url)

  return (
    <>
      <VideoJsonLd
        title={presentation.title}
        slug={presentation.slug}
        description={presentation.short_description}
        thumbnailUrl={thumbnailUrl}
        uploadDate={presentation.created_at}
        youtubeUrl={presentation.youtube_url}
        basePath="presentations"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Presentations", href: "/presentations" },
          { name: presentation.title, href: `/presentations/${presentation.slug}` },
        ]}
      />

      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/presentations"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Presentations
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white mb-4">
              {presentation.title}
            </h1>
            {presentation.short_description && (
              <p className="text-lg text-white/80 leading-relaxed">
                {presentation.short_description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        <article className="max-w-3xl mx-auto space-y-10">

          {/* Recording */}
          {presentation.recording_embed && (
            <section>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={presentation.recording_embed}
                  title={presentation.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              {presentation.recording_url && (
                <div className="mt-3 text-right">
                  <a
                    href={presentation.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm hover:underline"
                    style={{ color: '#017ab2' }}
                  >
                    Watch on YouTube
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                {upcomingEvents.length === 1 ? "Upcoming Event" : "Upcoming Events"}
              </h2>
              <div className="space-y-4">
              {upcomingEvents.map((ep: any) => {
                const event = Array.isArray(ep.event) ? ep.event[0] : ep.event
                if (!event) return null

                // Format event date
                const formatEventDate = (dateStr: string) => {
                  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
                  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }

                const location = [event.venue_name, event.city, event.state].filter(Boolean).join(", ")

                return (
                  <Link
                    key={ep.id}
                    href={`/${event.slug}`}
                    className="block bg-gradient-to-r from-navy/5 to-electric-blue/5 rounded-xl p-5 border border-navy/10 hover:border-[#017ab2]/50 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-navy text-lg mb-2">
                          {event.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-dark">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" style={{ color: '#017ab2' }} />
                            {formatEventDate(event.start_date)}
                            {event.end_date && event.end_date !== event.start_date && (
                              <> - {formatEventDate(event.end_date)}</>
                            )}
                          </span>
                          {location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" style={{ color: '#017ab2' }} />
                              {location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: '#017ab2' }}>
                          View Event
                          <ArrowLeft className="h-3 w-3 rotate-180" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
              </div>
            </section>
          )}

          {/* Long Description - displayed directly like article content */}
          {presentation.long_description && (
            <section>
              <div className="space-y-4">
                {presentation.long_description.split("\n\n").map((paragraph: string, idx: number) => (
                  <p key={idx} className="body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Leaders Section - New multi-leader support */}
          {hasPanelists && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                {isPanel ? "Panel Leaders" : "Featured Leader"}
              </h2>
              <LeaderCardGrid>
                {sortedPanelists.map((panelist: any) => (
                  <LeaderCard
                    key={panelist.id}
                    id={panelist.contact?.id}
                    firstName={panelist.contact?.first_name || ""}
                    lastName={panelist.contact?.last_name || ""}
                    title={panelist.contact?.title}
                    avatarUrl={panelist.contact?.avatar_url}
                    slug={panelist.contact?.slug}
                    companyName={panelist.company?.name}
                    companySlug={panelist.company?.slug}
                    size={isPanel ? "sm" : "md"}
                  />
                ))}
              </LeaderCardGrid>
            </section>
          )}

          {/* Legacy single leader section - fallback if no panelists */}
          {!hasPanelists && presentation.contact && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Featured Leader
              </h2>
              <LeaderCard
                id={presentation.contact.id}
                firstName={presentation.contact.first_name}
                lastName={presentation.contact.last_name}
                title={presentation.contact.title}
                avatarUrl={presentation.contact.avatar_url}
                slug={presentation.contact.slug}
                companyName={presentation.company?.name}
                companySlug={presentation.company?.slug}
                variant="horizontal"
              />
            </section>
          )}

          {/* Company Section */}
          {presentation.company && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                About {presentation.company.name}
              </h2>
              <CompanyCard
                id={presentation.company.id}
                name={presentation.company.name}
                slug={presentation.company.slug || presentation.company.domain}
                logoUrl={presentation.company.logo_url}
                description={presentation.company.description}
                variant="horizontal"
                showCategory={false}
              />
            </section>
          )}

          {/* Related Article - Show if presentation has one and no panelists have articles */}
          {presentation.article && !hasPanelists && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Related Article
              </h2>
              <ArticleCard
                id={presentation.article.id}
                title={presentation.article.title}
                slug={presentation.article.slug}
                excerpt={presentation.article.excerpt}
                featuredImage={presentation.article.featured_image_url}
                youtubeUrl={presentation.article.youtube_url}
              />
            </section>
          )}
        </article>
      </div>
    </>
  )
}
