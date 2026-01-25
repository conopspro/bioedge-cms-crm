import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Linkedin,
  Building2,
  Sparkles,
  BookOpen,
  Youtube,
  GraduationCap,
  FileText,
  Calendar,
  MapPin,
  Info,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { CompanyCard } from "@/components/ui/company-card"

type PageProps = {
  params: Promise<{ slug: string }>
}

/**
 * Public Leader Profile Page
 *
 * Shows a leader's full profile including:
 * - Photo, name, title, company
 * - Bio (AI-generated or manual)
 * - Career highlights
 * - Their YouTube videos
 * - Their academic papers
 * - Their books
 * - Related articles
 */
export default async function LeaderProfilePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch contact by slug (or fallback to id for backwards compatibility)
  let contact = null
  let error = null

  // First try to find by slug
  const { data: contactBySlug, error: slugError } = await supabase
    .from("contacts")
    .select("*")
    .eq("slug", slug)
    .eq("show_on_articles", true)
    .single()

  if (contactBySlug) {
    contact = contactBySlug
  } else {
    // Fallback: try to find by id (for backwards compatibility with old URLs)
    const { data: contactById, error: idError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", slug)
      .eq("show_on_articles", true)
      .single()
    contact = contactById
    error = idError
  }

  if (error || !contact) {
    notFound()
  }

  // Fetch company separately with more details
  let company = null
  if (contact.company_id) {
    const { data: companyData } = await supabase
      .from("companies")
      .select("id, name, slug, domain, website, logo_url, description, differentiators")
      .eq("id", contact.company_id)
      .single()
    company = companyData
  }

  // Fetch contact enhancements (YouTube, papers, books)
  let enhancements: any[] = []
  try {
    const { data: enhancementData } = await supabase
      .from("contact_enhancements")
      .select("*")
      .eq("contact_id", contact.id)
      .order("position")
    enhancements = enhancementData || []
  } catch {
    // Table may not exist yet
  }

  // Group enhancements by type
  const youtubeVideos = enhancements.filter(e => e.type === "youtube")
  const papers = enhancements.filter(e => e.type === "scholar")
  const books = enhancements.filter(e => e.type === "book")

  // Fetch related articles (where this contact's company is featured)
  let articles: any[] = []
  if (contact.company_id) {
    const { data: articleData } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, published_at")
      .eq("company_id", contact.company_id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4)
    articles = articleData || []
  }

  // Fetch upcoming events where this contact is participating
  const today = new Date().toISOString().split('T')[0]
  const { data: eventContacts } = await supabase
    .from("event_contacts")
    .select(`
      id,
      role,
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
    .eq("contact_id", contact.id)
    .neq("status", "cancelled")

  // Filter to only upcoming events and non-draft events
  const upcomingEvents = (eventContacts || [])
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
    keynote_speaker: "Keynote Speaker",
    speaker: "Speaker",
    panelist: "Panelist",
    moderator: "Moderator",
    workshop_leader: "Workshop Leader",
    mc: "MC",
    host: "Host",
    judge: "Judge",
    mentor: "Mentor",
    organizer: "Organizer",
  }

  // Parse JSON fields
  const highlights = contact.ai_highlights || []
  const bioSources = contact.bio_sources || []

  const fullName = `${contact.first_name} ${contact.last_name}`.trim()

  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-12 relative z-10">
          <Link
            href="/leaders"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leaders
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Avatar */}
            {contact.avatar_url ? (
              <img
                src={contact.avatar_url}
                alt={fullName}
                className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover ring-4 ring-gold/30 flex-shrink-0"
              />
            ) : (
              <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full bg-white/10 ring-4 ring-gold/30 flex-shrink-0">
                <span className="text-5xl md:text-6xl font-heading font-bold text-white">
                  {contact.first_name?.charAt(0) || "?"}
                </span>
              </div>
            )}

            {/* Name & Title */}
            <div className="text-center md:text-left">
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
                {fullName}
              </h1>
              {contact.title && (
                <p className="text-xl text-white/80 mt-2">{contact.title}</p>
              )}
              {company && (
                <Link
                  href={`/companies/${company.slug || company.domain || company.id}`}
                  className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors mt-2"
                >
                  <Building2 className="h-4 w-4" />
                  {company.name}
                </Link>
              )}

              {/* Social Links */}
              <div className="flex justify-center md:justify-start gap-3 mt-4">
                {contact.linkedin_url && (
                  <a
                    href={contact.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
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
          {/* Bio */}
          {contact.bio && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-gold" />
                About
              </h2>
              <div className="be-card">
                <div className="space-y-4">
                  {(() => {
                    const cleanBio = contact.bio.replace(/\[\d+\]/g, "").trim()
                    // If already has paragraph breaks, use them
                    if (cleanBio.includes("\n\n")) {
                      return cleanBio.split(/\n\n+/).map((paragraph: string, i: number) => (
                        <p key={i} className="body-text">{paragraph.trim()}</p>
                      ))
                    }
                    // Otherwise, split long text into paragraphs of ~3-4 sentences each
                    const sentences = cleanBio.split(/(?<=[.!?])\s+/)
                    const paragraphs: string[] = []
                    let currentParagraph: string[] = []
                    sentences.forEach((sentence: string) => {
                      currentParagraph.push(sentence)
                      if (currentParagraph.length >= 3) {
                        paragraphs.push(currentParagraph.join(" "))
                        currentParagraph = []
                      }
                    })
                    if (currentParagraph.length > 0) {
                      paragraphs.push(currentParagraph.join(" "))
                    }
                    return paragraphs.map((paragraph, i) => (
                      <p key={i} className="body-text">{paragraph}</p>
                    ))
                  })()}
                </div>
                {/* Sources */}
                {bioSources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-text-light font-medium mb-2">Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {bioSources.map((source: { title: string; url: string }, i: number) => (
                        <a
                          key={i}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-50 text-text-light hover:bg-gray-100 hover:text-navy transition-colors"
                        >
                          <span className="font-medium text-navy/60">[{i + 1}]</span>
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Career Highlights */}
          {highlights.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                Career Highlights
              </h2>
              <div className="be-card">
                <ul className="space-y-2.5">
                  {highlights.map((highlight: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-gold flex-shrink-0 mt-2" />
                      <span className="body-text">{highlight.replace(/\[\d+\]/g, "").trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
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
                          {roleLabel && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(1, 122, 178, 0.1)', color: '#017ab2' }}>
                                {roleLabel}
                              </span>
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

          {/* Company */}
          {company && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold" />
                About {company.name}
              </h2>
              <CompanyCard
                id={company.id}
                name={company.name}
                slug={company.slug || company.domain}
                logoUrl={company.logo_url}
                description={company.description}
                variant="horizontal"
                showCategory={false}
              />
            </section>
          )}

          {/* YouTube Videos */}
          {youtubeVideos.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Videos
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {youtubeVideos.map((video: any) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="be-card hover:shadow-lg transition-shadow group"
                  >
                    {video.metadata?.thumbnail && (
                      <div className="relative mb-3 rounded overflow-hidden">
                        <img
                          src={video.metadata.thumbnail}
                          alt={video.title}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-6 border-b-6 border-l-8 border-transparent border-l-white ml-1"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-navy group-hover:text-electric-blue transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    {video.metadata?.channel && (
                      <p className="text-sm text-text-light mt-1">{video.metadata.channel}</p>
                    )}
                    {video.metadata?.duration && (
                      <p className="text-xs text-text-light mt-1">{video.metadata.duration}</p>
                    )}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Academic Papers */}
          {papers.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold" />
                Research & Publications
              </h2>
              <div className="space-y-4">
                {papers.map((paper: any) => (
                  <a
                    key={paper.id}
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="be-card be-card-accent block hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-heading font-semibold text-navy hover:text-electric-blue transition-colors">
                      {paper.title}
                    </h3>
                    {paper.metadata?.authors && (
                      <p className="text-sm text-text-light mt-1">
                        {paper.metadata.authors.join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-light">
                      {paper.metadata?.journal && <span>{paper.metadata.journal}</span>}
                      {paper.metadata?.year && <span>{paper.metadata.year}</span>}
                      {paper.metadata?.citedBy && (
                        <span className="text-gold">{paper.metadata.citedBy} citations</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Books */}
          {books.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold" />
                Books
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {books.map((book: any) => (
                  <a
                    key={book.id}
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="be-card hover:shadow-lg transition-shadow flex gap-4"
                  >
                    {book.metadata?.thumbnail && (
                      <img
                        src={book.metadata.thumbnail}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-heading font-semibold text-navy hover:text-electric-blue transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                      {book.metadata?.authors && (
                        <p className="text-sm text-text-light mt-1">
                          {book.metadata.authors.join(", ")}
                        </p>
                      )}
                      {book.metadata?.rating && (
                        <p className="text-sm text-gold mt-1">
                          ★ {book.metadata.rating}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Related Articles */}
          {articles.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Related Articles
              </h2>
              <div className="space-y-4">
                {articles.map((article: any) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="be-card be-card-accent block hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-heading font-semibold text-navy text-lg mb-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-text-dark line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm mt-3" style={{ color: '#017ab2' }}>
                      Read Article
                      <ArrowLeft className="h-3 w-3 rotate-180" />
                    </span>
                  </Link>
                ))}
              </div>
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

  // Try slug first, then fallback to id
  let contact = null
  const { data: contactBySlug } = await supabase
    .from("contacts")
    .select("first_name, last_name, title, bio")
    .eq("slug", slug)
    .eq("show_on_articles", true)
    .single()

  if (contactBySlug) {
    contact = contactBySlug
  } else {
    const { data: contactById } = await supabase
      .from("contacts")
      .select("first_name, last_name, title, bio")
      .eq("id", slug)
      .eq("show_on_articles", true)
      .single()
    contact = contactById
  }

  if (!contact) {
    return {
      title: "Leader Not Found | BioEdge",
    }
  }

  const fullName = `${contact.first_name} ${contact.last_name}`.trim()

  return {
    title: `${fullName} | Leaders | BioEdge`,
    description: contact.bio?.slice(0, 160) || `Learn about ${fullName}${contact.title ? `, ${contact.title}` : ""}.`,
  }
}
