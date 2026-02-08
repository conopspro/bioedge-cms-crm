import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Search, FileText, Users, Building2, Calendar, Play, Sparkles } from "lucide-react"
import { SearchInput } from "@/components/search/search-input"
import { Suspense } from "react"

export const metadata = {
  title: "Search | bioEDGE",
  description: "Search articles, leaders, companies, presentations, spotlights, and events across bioEDGE.",
}

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

interface ArticleResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
}

interface LeaderResult {
  id: string
  slug: string | null
  first_name: string
  last_name: string
  title: string | null
  company: { name: string } | null
}

interface CompanyResult {
  id: string
  name: string
  slug: string | null
  domain: string | null
}

interface EventResult {
  id: string
  title: string
  slug: string | null
  start_date: string | null
}

interface PresentationResult {
  id: string
  title: string
  slug: string | null
  short_description: string | null
}

interface SpotlightResult {
  id: string
  title: string
  slug: string | null
  short_description: string | null
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q?.trim() || ""
  const supabase = await createClient()

  let articles: ArticleResult[] = []
  let leaders: LeaderResult[] = []
  let companies: CompanyResult[] = []
  let events: EventResult[] = []
  let presentations: PresentationResult[] = []
  let spotlights: SpotlightResult[] = []

  if (query.length >= 2) {
    // Run all searches in parallel for better performance
    const [
      articlesRes,
      leadersRes,
      companiesRes,
      eventsRes,
      presentationsRes,
      spotlightsRes,
    ] = await Promise.all([
      // Search articles - title, excerpt, and body content
      supabase
        .from("articles")
        .select("id, title, slug, excerpt")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(10),

      // Search leaders (contacts) - name, title, and bio
      supabase
        .from("contacts")
        .select("id, slug, first_name, last_name, title, company:companies(name)")
        .eq("show_on_articles", true)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,title.ilike.%${query}%,bio.ilike.%${query}%`)
        .limit(10),

      // Search companies - name, description, and differentiators
      supabase
        .from("companies")
        .select("id, name, slug, domain, is_draft")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,differentiators.ilike.%${query}%`)
        .limit(20),

      // Search events - title and description
      supabase
        .from("events")
        .select("id, title, slug, start_date")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10),

      // Search presentations - title, short description, and long description
      supabase
        .from("presentations")
        .select("id, title, slug, short_description")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,short_description.ilike.%${query}%,long_description.ilike.%${query}%`)
        .limit(10),

      // Search spotlights - title, short description, and long description
      supabase
        .from("spotlights")
        .select("id, title, slug, short_description")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,short_description.ilike.%${query}%,long_description.ilike.%${query}%`)
        .limit(10),
    ])

    articles = (articlesRes.data || []) as ArticleResult[]
    leaders = (leadersRes.data || []) as unknown as LeaderResult[]

    // Filter out draft companies
    companies = ((companiesRes.data || []) as (CompanyResult & { is_draft?: boolean })[])
      .filter(c => c.is_draft !== true)
      .slice(0, 10) as CompanyResult[]

    events = (eventsRes.data || []) as EventResult[]
    presentations = (presentationsRes.data || []) as PresentationResult[]
    spotlights = (spotlightsRes.data || []) as SpotlightResult[]
  }

  const totalResults = articles.length + leaders.length + companies.length + events.length + presentations.length + spotlights.length
  const hasQuery = query.length >= 2

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            Explore
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
            Search
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Find articles, leaders, companies, presentations, spotlights, and events across bioEDGE.
          </p>

          {/* Search Input */}
          <div className="mt-8 max-w-xl">
            <Suspense fallback={<div className="h-14 rounded-lg bg-white/10" />}>
              <SearchInput defaultValue={query} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {!hasQuery ? (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-navy/20" />
            <h2 className="mb-2 text-xl font-semibold text-navy">Start searching</h2>
            <p className="text-gray-600">Enter at least 2 characters to search.</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-navy/20" />
            <h2 className="mb-2 text-xl font-semibold text-navy">No results found</h2>
            <p className="text-gray-600">Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Summary */}
            <p className="text-sm text-gray-600">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>

            {/* Presentations */}
            {presentations.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Presentations</h2>
                  <span className="text-sm text-gray-500">({presentations.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {presentations.map((presentation) => (
                    <Link
                      key={presentation.id}
                      href={`/presentations/${presentation.slug || presentation.id}`}
                      className="group rounded-xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {presentation.title}
                      </h3>
                      {presentation.short_description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {presentation.short_description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Spotlights */}
            {spotlights.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Spotlights</h2>
                  <span className="text-sm text-gray-500">({spotlights.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {spotlights.map((spotlight) => (
                    <Link
                      key={spotlight.id}
                      href={`/spotlight/${spotlight.slug || spotlight.id}`}
                      className="group rounded-xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {spotlight.title}
                      </h3>
                      {spotlight.short_description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {spotlight.short_description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            {articles.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Articles</h2>
                  <span className="text-sm text-gray-500">({articles.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="group rounded-xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Leaders */}
            {leaders.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Leaders</h2>
                  <span className="text-sm text-gray-500">({leaders.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {leaders.map((leader) => (
                    <Link
                      key={leader.id}
                      href={`/leaders/${leader.slug || leader.id}`}
                      className="group rounded-xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {leader.first_name} {leader.last_name}
                      </h3>
                      {leader.title && (
                        <p className="text-sm text-gray-600">{leader.title}</p>
                      )}
                      {leader.company?.name && (
                        <p className="text-xs text-electric-blue">{leader.company.name}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Companies */}
            {companies.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Companies</h2>
                  <span className="text-sm text-gray-500">({companies.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {companies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.slug || company.domain || company.id}`}
                      className="group rounded-xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {company.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {events.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Events</h2>
                  <span className="text-sm text-gray-500">({events.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug || event.id}`}
                      className="group rounded-xl bg-white p-4 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {event.title}
                      </h3>
                      {event.start_date && (
                        <p className="text-sm text-gray-600">
                          {new Date(event.start_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
