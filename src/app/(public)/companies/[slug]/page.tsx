import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Building2, ExternalLink, ArrowLeft, Calendar, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LeaderCard, LeaderCardGrid } from "@/components/ui/leader-card"
import { ArticleCard, ArticleCardGrid } from "@/components/ui/article-card"

type PageProps = {
  params: Promise<{ slug: string }>
}

/**
 * Public Company Detail Page
 *
 * Shows company info, systems supported, related articles, and company leaders.
 * URL uses the company's slug (generated from company name).
 * Legacy domain-based URLs (e.g., /companies/functionhealth.com) redirect to the new slug format.
 */
export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Try to find company by slug first, then by domain (legacy), then by id
  let company = null
  let foundByLegacyUrl = false

  // First try by slug (company-name format) - exclude drafts (include NULL and false)
  const { data: companyBySlug } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .or("is_draft.is.null,is_draft.eq.false")
    .single()

  if (companyBySlug) {
    company = companyBySlug
  } else {
    // Try by domain (legacy URLs like functionhealth.com) - exclude drafts
    const { data: companyByDomain } = await supabase
      .from("companies")
      .select("*")
      .eq("domain", slug)
      .or("is_draft.is.null,is_draft.eq.false")
      .single()

    if (companyByDomain) {
      company = companyByDomain
      foundByLegacyUrl = true
    } else {
      // Fall back to ID lookup - exclude drafts
      const { data: companyById } = await supabase
        .from("companies")
        .select("*")
        .eq("id", slug)
        .or("is_draft.is.null,is_draft.eq.false")
        .single()
      if (companyById) {
        company = companyById
        foundByLegacyUrl = true
      }
    }
  }

  if (!company) {
    notFound()
  }

  // Redirect legacy URLs to the canonical slug-based URL
  if (foundByLegacyUrl && company.slug) {
    redirect(`/companies/${company.slug}`)
  }

  // Fetch related articles (published only)
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, published_at, featured_image_url")
    .eq("company_id", company.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  // Fetch category name from company_categories table
  let categoryName: string | null = null
  if (company.category) {
    const { data: categoryData } = await supabase
      .from("company_categories")
      .select("name")
      .eq("slug", company.category)
      .single()
    categoryName = categoryData?.name || null
  }

  // Fetch company leaders (for public display)
  const { data: leaders } = await supabase
    .from("company_leaders")
    .select("*")
    .eq("company_id", company.id)
    .order("name")

  // Fetch contacts marked as visible on articles
  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, slug, first_name, last_name, title, avatar_url, linkedin_url")
    .eq("company_id", company.id)
    .eq("show_on_articles", true)
    .order("last_name")

  // Fetch upcoming events where this company is participating
  const today = new Date().toISOString().split('T')[0]
  const { data: eventCompanies } = await supabase
    .from("event_companies")
    .select(`
      id,
      role,
      booth_number,
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
    .eq("company_id", company.id)
    .neq("status", "cancelled")

  // Filter to only upcoming events and non-draft events
  const upcomingEvents = (eventCompanies || [])
    .filter((ec: any) => {
      const event = Array.isArray(ec.event) ? ec.event[0] : ec.event
      if (!event) return false
      if (event.status === 'draft') return false
      const eventEndDate = event.end_date || event.start_date
      return eventEndDate >= today
    })
    .sort((a: any, b: any) => {
      const eventA = Array.isArray(a.event) ? a.event[0] : a.event
      const eventB = Array.isArray(b.event) ? b.event[0] : b.event
      return (eventA?.start_date || '').localeCompare(eventB?.start_date || '')
    })

  // Role labels for display
  const roleLabels: Record<string, string> = {
    platinum_sponsor: "Platinum Sponsor",
    gold_sponsor: "Gold Sponsor",
    silver_sponsor: "Silver Sponsor",
    bronze_sponsor: "Bronze Sponsor",
    exhibitor: "Exhibitor",
    media_partner: "Media Partner",
    supporting_organization: "Supporting Organization",
  }

  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companies Directory
            </Link>
            <div className="flex items-start gap-6">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-16 md:h-20 object-contain bg-white rounded-lg p-2"
                />
              ) : (
                <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-lg bg-white/10">
                  <Building2 className="h-8 w-8 text-gold" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {company.name}
                </h1>
                {(categoryName || company.category) && (
                  <p className="text-gold font-heading text-sm font-bold uppercase tracking-wider mt-2">
                    {categoryName || company.category}
                  </p>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-gold transition-colors mt-2"
                  >
                    {company.domain || company.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Description */}
          {company.description && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                About
              </h2>
              <div className="be-card" style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}>
                <p className="body-text whitespace-pre-wrap">{company.description}</p>
                {/* Show sources if available */}
                {company.description_sources && Array.isArray(company.description_sources) && company.description_sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-text-light font-medium mb-2">Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {(company.description_sources as { title: string; url: string }[]).map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-50 text-text-light hover:bg-gray-100 hover:text-navy transition-colors"
                        >
                          <span className="font-medium text-navy/60">[{idx + 1}]</span>
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Key Differentiators */}
          {company.differentiators && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                What Sets Them Apart
              </h2>
              <div className="be-card" style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}>
                {(() => {
                  const items = company.differentiators
                    .split(/\n/)
                    .map((item: string) => item.replace(/^\s*-\s*/, "").trim())
                    .filter((item: string) => item.length > 0)

                  if (items.length > 1) {
                    return (
                      <ul className="space-y-2.5">
                        {items.map((item: string, idx: number) => (
                          <li key={idx} className="flex gap-3 body-text">
                            <span className="h-2 w-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: "#017ab2" }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return <p className="body-text whitespace-pre-wrap">{company.differentiators}</p>
                })()}
              </div>
            </section>
          )}

          {/* Evidence/Credibility - no title, just content */}
          {company.evidence && (
            <section>
              <div className="be-card" style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}>
                {(() => {
                  const items = company.evidence
                    .split(/\n/)
                    .map((item: string) => item.replace(/^\s*-\s*/, "").trim())
                    .filter((item: string) => item.length > 0)

                  if (items.length > 1) {
                    return (
                      <ul className="space-y-2.5">
                        {items.map((item: string, idx: number) => (
                          <li key={idx} className="flex gap-3 body-text">
                            <span className="h-2 w-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: "#017ab2" }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return <p className="body-text whitespace-pre-wrap">{company.evidence}</p>
                })()}
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                {upcomingEvents.length === 1 ? "Upcoming Event" : "Upcoming Events"}
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((ec: any) => {
                  const event = Array.isArray(ec.event) ? ec.event[0] : ec.event
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
                  const roleLabel = roleLabels[ec.role] || ec.role

                  return (
                    <Link
                      key={ec.id}
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
                          {(roleLabel || ec.booth_number) && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-light mt-2">
                              {roleLabel && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(1, 122, 178, 0.1)', color: '#017ab2' }}>
                                  {roleLabel}
                                </span>
                              )}
                              {ec.booth_number && (
                                <span>Booth: {ec.booth_number}</span>
                              )}
                            </div>
                          )}
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

          {/* Articles */}
          {articles && articles.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Related Articles
              </h2>
              <ArticleCardGrid>
                {articles.map((article: any) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    publishedAt={article.published_at}
                    featuredImage={article.featured_image_url}
                  />
                ))}
              </ArticleCardGrid>
            </section>
          )}

          {/* Company Leaders (legacy company_leaders table) */}
          {leaders && leaders.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Leadership
              </h2>
              <LeaderCardGrid>
                {leaders.map((leader: any) => {
                  // Parse name into first/last for the component
                  const nameParts = leader.name.split(" ")
                  const firstName = nameParts[0] || ""
                  const lastName = nameParts.slice(1).join(" ") || ""
                  return (
                    <LeaderCard
                      key={leader.id}
                      id={leader.id}
                      firstName={firstName}
                      lastName={lastName}
                      title={leader.title}
                      avatarUrl={leader.image_url}
                      companyName={company.name}
                      href={leader.linkedin_url || "#"}
                    />
                  )
                })}
              </LeaderCardGrid>
            </section>
          )}

          {/* Published Contacts */}
          {contacts && contacts.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4">
                Leaders
              </h2>
              <LeaderCardGrid>
                {contacts.map((contact: any) => (
                  <LeaderCard
                    key={contact.id}
                    id={contact.id}
                    firstName={contact.first_name}
                    lastName={contact.last_name}
                    title={contact.title}
                    avatarUrl={contact.avatar_url}
                    slug={contact.slug}
                    companyName={company.name}
                  />
                ))}
              </LeaderCardGrid>
            </section>
          )}

        </div>
      </div>
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Try slug first, then domain (legacy), then ID
  let company = null

  const { data: companyBySlug } = await supabase
    .from("companies")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (companyBySlug) {
    company = companyBySlug
  } else {
    const { data: companyByDomain } = await supabase
      .from("companies")
      .select("name, description")
      .eq("domain", slug)
      .single()

    if (companyByDomain) {
      company = companyByDomain
    } else {
      const { data: companyById } = await supabase
        .from("companies")
        .select("name, description")
        .eq("id", slug)
        .single()
      company = companyById
    }
  }

  if (!company) {
    return {
      title: "Company Not Found | BioEdge",
    }
  }

  return {
    title: `${company.name} | Solutions Directory | BioEdge`,
    description: company.description || `Learn about ${company.name} and their longevity solutions.`,
  }
}
