import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { LeaderCard, LeaderCardGrid } from "@/components/ui/leader-card"
import { CompanyCard } from "@/components/ui/company-card"
import { ArticleCard } from "@/components/ui/article-card"
import { getYouTubeThumbnailUrl } from "@/lib/youtube"

interface SpotlightPageProps {
  params: Promise<{ slug: string }>
}

const roleLabels: Record<string, string> = {
  moderator: "Moderator",
  panelist: "Panelist",
  presenter: "Presenter",
  host: "Host",
  guest: "Guest",
}

export async function generateMetadata({ params }: SpotlightPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: spotlight } = await supabase
    .from("spotlights")
    .select("title, short_description, recording_metadata, youtube_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!spotlight) {
    return {
      title: "Spotlight Not Found | bioEDGE",
    }
  }

  const ogImage = spotlight.recording_metadata?.thumbnail
    || getYouTubeThumbnailUrl(spotlight.youtube_url)

  return {
    title: `${spotlight.title} | bioEDGE`,
    description: spotlight.short_description,
    openGraph: {
      title: `${spotlight.title} | bioEDGE`,
      description: spotlight.short_description || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

export default async function SpotlightPage({ params }: SpotlightPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: spotlight } = await supabase
    .from("spotlights")
    .select(`
      *,
      contact:contacts(id, first_name, last_name, title, avatar_url, bio, linkedin_url, slug, ai_highlights, ai_expertise),
      company:companies(id, name, logo_url, domain, description, slug, is_draft),
      article:articles(id, title, slug, excerpt, featured_image_url, youtube_url),
      panelists:spotlight_panelists(
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

  if (!spotlight) {
    notFound()
  }

  // Hide draft companies from public display
  if (spotlight.company?.is_draft === true) {
    spotlight.company = null
  }
  if (spotlight.panelists) {
    spotlight.panelists = spotlight.panelists.map((p: any) => ({
      ...p,
      company: p.company?.is_draft === true ? null : p.company,
    }))
  }

  // Sort panelists by display_order
  const sortedPanelists = (spotlight.panelists || []).sort(
    (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
  )

  // Determine if this has multiple leaders
  const hasPanelists = sortedPanelists.length > 0
  const isPanel = sortedPanelists.length > 1

  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/spotlight"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Spotlight
            </Link>
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white mb-4">
              {spotlight.title}
            </h1>
            {spotlight.short_description && (
              <p className="text-lg text-white/80 leading-relaxed">
                {spotlight.short_description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        <article className="max-w-3xl mx-auto space-y-10">

          {/* Recording */}
          {spotlight.recording_embed && (
            <section>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={spotlight.recording_embed}
                  title={spotlight.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              {spotlight.recording_url && (
                <div className="mt-3 text-right">
                  <a
                    href={spotlight.recording_url}
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

          {/* Long Description */}
          {spotlight.long_description && (
            <section>
              <div className="space-y-4">
                {spotlight.long_description.split("\n\n").map((paragraph: string, idx: number) => (
                  <p key={idx} className="body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Leaders Section */}
          {hasPanelists && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                {isPanel ? "Leader Spotlight" : "Leader Spotlight"}
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
          {!hasPanelists && spotlight.contact && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Leader Spotlight
              </h2>
              <LeaderCard
                id={spotlight.contact.id}
                firstName={spotlight.contact.first_name}
                lastName={spotlight.contact.last_name}
                title={spotlight.contact.title}
                avatarUrl={spotlight.contact.avatar_url}
                slug={spotlight.contact.slug}
                companyName={spotlight.company?.name}
                companySlug={spotlight.company?.slug}
                variant="horizontal"
              />
            </section>
          )}

          {/* Company Section */}
          {spotlight.company && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                About {spotlight.company.name}
              </h2>
              <CompanyCard
                id={spotlight.company.id}
                name={spotlight.company.name}
                slug={spotlight.company.slug || spotlight.company.domain}
                logoUrl={spotlight.company.logo_url}
                description={spotlight.company.description}
                variant="horizontal"
                showCategory={false}
              />
            </section>
          )}

          {/* Related Article */}
          {spotlight.article && !hasPanelists && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Related Article
              </h2>
              <ArticleCard
                id={spotlight.article.id}
                title={spotlight.article.title}
                slug={spotlight.article.slug}
                excerpt={spotlight.article.excerpt}
                featuredImage={spotlight.article.featured_image_url}
                youtubeUrl={spotlight.article.youtube_url}
              />
            </section>
          )}
        </article>
      </div>
    </>
  )
}
