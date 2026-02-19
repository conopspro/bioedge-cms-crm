import { createClient } from "@/lib/supabase/server"
import { parseMonthSlug, getMonthSlug, getMonthLabel } from "@/lib/news-utils"
import { NewsFilters } from "@/components/directory/news-filters"
import { NewsCard } from "@/components/directory/news-card"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

const BE_LOGO_URL =
  "https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"

interface PageProps {
  params: Promise<{ monthSlug: string }>
  searchParams: Promise<{
    source?: string
    edge?: string
    system?: string
    q?: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { monthSlug } = await params
  const parsed = parseMonthSlug(monthSlug)

  if (!parsed) {
    return { title: "Not Found" }
  }

  return {
    title: `Longevity News — ${parsed.label}`,
    description: `Longevity research and health optimization news from ${parsed.label}, curated and analyzed through the EDGE Framework.`,
    alternates: {
      canonical: `/news/${monthSlug}`,
    },
    openGraph: {
      title: `Longevity News — ${parsed.label}`,
      description: `Longevity research and health optimization news from ${parsed.label}.`,
      images: [{ url: BE_LOGO_URL, width: 512, height: 512, alt: "bioEDGE" }],
    },
  }
}

export default async function MonthlyNewsPage({
  params,
  searchParams,
}: PageProps) {
  const { monthSlug } = await params
  const sp = await searchParams
  const parsed = parseMonthSlug(monthSlug)

  if (!parsed) notFound()

  const supabase = await createClient()

  // Build query for this month's articles
  let query = supabase
    .from("news_articles")
    .select(
      "id, title, url, source_name, published_at, author, summary, key_points, edge_significance, edge_categories, biological_systems"
    )
    .eq("status", "published")
    .gte("published_at", parsed.start)
    .lte("published_at", parsed.end)
    .order("published_at", { ascending: false })

  if (sp.source) {
    query = query.eq("source_name", sp.source)
  }
  if (sp.edge) {
    query = query.contains("edge_categories", [sp.edge])
  }
  if (sp.system) {
    query = query.contains("biological_systems", [sp.system])
  }
  if (sp.q) {
    query = query.or(
      `title.ilike.%${sp.q}%,summary.ilike.%${sp.q}%,edge_significance.ilike.%${sp.q}%,raw_content.ilike.%${sp.q}%`
    )
  }

  const [{ data: articles }, { data: sourcesData }, { data: adjacentData }] =
    await Promise.all([
      query,

      // Sources for filter dropdown
      supabase
        .from("news_articles")
        .select("source_name")
        .eq("status", "published"),

      // Get all published_at dates to find prev/next months
      supabase
        .from("news_articles")
        .select("published_at")
        .eq("status", "published")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false }),
    ])

  const sources = [
    ...new Set(
      (sourcesData || []).map(
        (s: { source_name: string }) => s.source_name
      )
    ),
  ].sort()

  // Build adjacent months for navigation
  const monthSet = new Set<string>()
  const allMonths: { slug: string; label: string }[] = []
  for (const row of adjacentData || []) {
    if (!row.published_at) continue
    const d = new Date(row.published_at)
    const slug = getMonthSlug(d)
    if (!monthSet.has(slug)) {
      monthSet.add(slug)
      allMonths.push({ slug, label: getMonthLabel(d) })
    }
  }

  // Find current month index for prev/next
  const currentIdx = allMonths.findIndex((m) => m.slug === monthSlug)
  const prevMonth = currentIdx > 0 ? allMonths[currentIdx - 1] : null
  const nextMonth =
    currentIdx < allMonths.length - 1 ? allMonths[currentIdx + 1] : null

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <div className="flex items-start gap-6">
            <img
              src={BE_LOGO_URL}
              alt="BioEdge"
              className="h-[100px] w-[100px] flex-shrink-0 hidden md:block"
            />
            <div>
              <Link
                href="/news"
                className="mb-3 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All News
              </Link>
              <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
                {parsed.label}
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                Longevity research from {parsed.label}, curated and analyzed
                through the EDGE Framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-24" />}>
            <NewsFilters
              sources={sources}
              basePath={`/news/${monthSlug}`}
            />
          </Suspense>
        </div>

        {/* Articles */}
        {!articles || articles.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold text-navy">
              {sp.source || sp.edge || sp.system || sp.q
                ? "No articles found"
                : `No articles for ${parsed.label}`}
            </h2>
            <p className="text-gray-600">
              {sp.source || sp.edge || sp.system || sp.q
                ? "Try adjusting your filters."
                : "Check back soon or browse other months."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {(articles as any[]).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Prev / Next month navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
          {nextMonth ? (
            <Link
              href={`/news/${nextMonth.slug}`}
              className="text-sm font-medium text-electric-blue hover:text-navy transition-colors"
            >
              &larr; {nextMonth.label}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/news"
            className="text-sm font-medium text-gray-500 hover:text-navy transition-colors"
          >
            All News
          </Link>
          {prevMonth ? (
            <Link
              href={`/news/${prevMonth.slug}`}
              className="text-sm font-medium text-electric-blue hover:text-navy transition-colors"
            >
              {prevMonth.label} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </div>
  )
}
