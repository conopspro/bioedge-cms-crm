import { createClient } from "@/lib/supabase/server"
import { NewsFilters } from "@/components/directory/news-filters"
import { NewsGrid } from "@/components/directory/news-grid"
import { Suspense } from "react"
import type { Metadata } from "next"

const BE_LOGO_URL =
  "https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"

export const metadata: Metadata = {
  title: "Longevity News",
  description:
    "The latest longevity research, curated and analyzed through the EDGE Framework. Stay informed on breakthroughs in health optimization and aging science.",
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
    query = query.ilike("title", `%${params.q}%`)
  }

  const { data } = await query
  const articles = data || []
  const hasMore = articles.length === PAGE_SIZE

  // Get distinct source names for the filter dropdown
  const { data: sourcesData } = await supabase
    .from("news_articles")
    .select("source_name")
    .eq("status", "published")

  const sources = [
    ...new Set((sourcesData || []).map((s: { source_name: string }) => s.source_name)),
  ].sort()

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
      </section>
    </div>
  )
}
