import { createClient } from "@/lib/supabase/server"
import { getMonthSlug, getMonthLabel } from "@/lib/news-utils"
import { NewsFilters } from "@/components/directory/news-filters"
import { NewsGrid } from "@/components/directory/news-grid"
import Link from "next/link"
import { Suspense } from "react"
import type { Metadata } from "next"

const BE_LOGO_URL =
  "https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"

export const metadata: Metadata = {
  title: "Longevity News",
  description:
    "The latest longevity research, curated and analyzed through the EDGE Framework. Stay informed on breakthroughs in health optimization and aging science.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Longevity News",
    description:
      "The latest longevity research, curated and analyzed through the EDGE Framework.",
    images: [
      {
        url: BE_LOGO_URL,
        width: 512,
        height: 512,
        alt: "bioEDGE Longevity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [BE_LOGO_URL],
  },
}

interface PageProps {
  searchParams: Promise<{
    source?: string
    edge?: string
    system?: string
    q?: string
  }>
}

const PAGE_SIZE = 12

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query for initial articles
  let query = supabase
    .from("news_articles")
    .select(
      "id, title, url, source_name, published_at, author, summary, key_points, edge_significance, edge_categories, biological_systems"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(0, PAGE_SIZE - 1)

  if (params.source) {
    query = query.eq("source_name", params.source)
  }
  if (params.edge) {
    query = query.contains("edge_categories", [params.edge])
  }
  if (params.system) {
    query = query.contains("biological_systems", [params.system])
  }
  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,summary.ilike.%${params.q}%,edge_significance.ilike.%${params.q}%,raw_content.ilike.%${params.q}%`
    )
  }

  const { data } = await query
  const articles = data || []
  const hasMore = articles.length === PAGE_SIZE

  // Get distinct source names and all published dates (for monthly archives)
  const [{ data: sourcesData }, { data: datesData }] = await Promise.all([
    supabase
      .from("news_articles")
      .select("source_name")
      .eq("status", "published"),
    supabase
      .from("news_articles")
      .select("published_at")
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false }),
  ])

  const sources = [
    ...new Set((sourcesData || []).map((s: { source_name: string }) => s.source_name)),
  ].sort()

  // Build monthly archive list
  const monthSet = new Set<string>()
  const months: { slug: string; label: string }[] = []
  for (const row of datesData || []) {
    if (!row.published_at) continue
    const d = new Date(row.published_at)
    const slug = getMonthSlug(d)
    if (!monthSet.has(slug)) {
      monthSet.add(slug)
      months.push({ slug, label: getMonthLabel(d) })
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <div className="flex items-start gap-6">
            <img
              src={BE_LOGO_URL}
              alt="BioEdge"
              className="h-[100px] w-[100px] flex-shrink-0 hidden md:block"
            />
            <div>
              <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
                Longevity News
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                The latest longevity research, curated from leading sources and
                analyzed through the EDGE Framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-24" />}>
            <NewsFilters sources={sources} />
          </Suspense>
        </div>

        {/* Grid */}
        <Suspense fallback={<div className="h-96" />}>
          <NewsGrid
            initialArticles={articles as any}
            initialHasMore={hasMore}
          />
        </Suspense>

        {/* Monthly Archives */}
        {months.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-xl font-bold text-navy">
              Monthly Archives
            </h2>
            <div className="flex flex-wrap gap-2">
              {months.map((m) => (
                <Link
                  key={m.slug}
                  href={`/news/${m.slug}`}
                  className="rounded-lg border border-deep-blue/10 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-electric-blue hover:text-white transition-colors"
                >
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
