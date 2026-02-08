import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Search, FileText, Users, Building2, Calendar, Play, Sparkles, Brain } from "lucide-react"
import { SearchInput } from "@/components/search/search-input"
import { Suspense } from "react"

export const metadata = {
  title: "Search | bioEDGE",
  description: "Search articles, leaders, companies, presentations, spotlights, systems, and events across bioEDGE.",
}

// Static systems data (these are not in Supabase — they're hardcoded content pages)
const SYSTEMS = [
  { name: "Breath", slug: "breath", tagline: "Your Body's Bridge", description: "Respiratory system, oxygen delivery, breathing patterns" },
  { name: "Circulation", slug: "circulation", tagline: "Your Body's Delivery Network", description: "Heart, blood vessels, blood flow, cardiovascular health" },
  { name: "Consciousness", slug: "consciousness", tagline: "Your Body's Inner Witness", description: "Awareness, presence, thought quality, mental clarity" },
  { name: "Defense", slug: "defense", tagline: "Your Body's Intelligent Shield", description: "Immune function, inflammation, autoimmunity" },
  { name: "Detoxification", slug: "detoxification", tagline: "Your Body's Clearing House", description: "Liver function, lymphatic drainage, elimination" },
  { name: "Digestive", slug: "digestive", tagline: "Your Body's Transformation Engine", description: "Gut health, microbiome, nutrient absorption" },
  { name: "Emotional", slug: "emotional", tagline: "Your Body's Meaning Maker", description: "Mental wellbeing, mood regulation, psychological health" },
  { name: "Energy Production", slug: "energy-production", tagline: "Your Body's Power Grid", description: "Mitochondrial function, ATP, metabolic efficiency" },
  { name: "Hormonal", slug: "hormonal", tagline: "Your Body's Orchestra", description: "Endocrine system, hormone balance, thyroid, adrenals" },
  { name: "Hydration", slug: "hydration", tagline: "Your Body's Internal Ocean", description: "Fluid balance, electrolytes, cellular hydration" },
  { name: "Nervous System", slug: "nervous-system", tagline: "Your Body's Communication Network", description: "Brain-body connection, neural pathways, vagal tone" },
  { name: "Regeneration", slug: "regeneration", tagline: "Your Body's Rebuild Crew", description: "Cellular repair, stem cells, longevity pathways" },
  { name: "Stress Response", slug: "stress-response", tagline: "Your Body's Alert System", description: "Fight or flight, cortisol regulation, stress adaptation" },
  { name: "Structure & Movement", slug: "structure-movement", tagline: "Your Body's Living Architecture", description: "Bones, joints, connective tissue, muscles, mobility" },
  { name: "Temperature", slug: "temperature", tagline: "Your Body's Thermostat", description: "Heat regulation, cold tolerance, metabolic temperature" },
]

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

interface SystemResult {
  name: string
  slug: string
  tagline: string
  description: string
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
  let systems: SystemResult[] = []

  if (query.length >= 2) {
    // Search systems (static data — case-insensitive match on name, tagline, description)
    const lowerQuery = query.toLowerCase()
    systems = SYSTEMS.filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.tagline.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    )
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

  const totalResults = articles.length + leaders.length + companies.length + events.length + presentations.length + spotlights.length + systems.length
  const hasQuery = query.length >= 2

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="be-container py-16 md:py-20">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            Explore
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
            Search
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Find articles, leaders, companies, presentations, spotlights, systems, and events across bioEDGE.
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
      <section className="be-container py-12">
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
                <div className={`grid gap-6 ${presentations.length === 1 ? "grid-cols-1" : presentations.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {presentations.map((presentation) => (
                    <Link
                      key={presentation.id}
                      href={`/presentations/${presentation.slug || presentation.id}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                <div className={`grid gap-6 ${spotlights.length === 1 ? "grid-cols-1" : spotlights.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {spotlights.map((spotlight) => (
                    <Link
                      key={spotlight.id}
                      href={`/spotlight/${spotlight.slug || spotlight.id}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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

            {/* Systems */}
            {systems.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-electric-blue" />
                  <h2 className="text-lg font-bold text-navy">Biological Systems</h2>
                  <span className="text-sm text-gray-500">({systems.length})</span>
                </div>
                <div className={`grid gap-6 ${systems.length === 1 ? "grid-cols-1" : systems.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {systems.map((system) => (
                    <Link
                      key={system.slug}
                      href={`/systems/${system.slug}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <h3 className="font-semibold text-navy transition-colors group-hover:text-electric-blue">
                        {system.name}
                      </h3>
                      <p className="text-sm text-electric-blue mt-0.5">{system.tagline}</p>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {system.description}
                      </p>
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
                <div className={`grid gap-6 ${articles.length === 1 ? "grid-cols-1" : articles.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                <div className={`grid gap-6 ${leaders.length === 1 ? "grid-cols-1" : leaders.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {leaders.map((leader) => (
                    <Link
                      key={leader.id}
                      href={`/leaders/${leader.slug || leader.id}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                <div className={`grid gap-6 ${companies.length === 1 ? "grid-cols-1" : companies.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {companies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.slug || company.domain || company.id}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                <div className={`grid gap-6 ${events.length === 1 ? "grid-cols-1" : events.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug || event.id}`}
                      className="group overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
