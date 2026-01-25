import { createClient } from "@/lib/supabase/server"
import { DirectoryFilters } from "@/components/filters/directory-filters"
import { ArticlesGrid } from "@/components/directory/articles-grid"
import { Suspense } from "react"

export const metadata = {
  title: "Articles | bioEDGE Magazine",
  description: "Evidence-informed insights on longevity, health optimization, and the science of living better.",
}

interface Category {
  slug: string
  name: string
}

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

const PAGE_SIZE = 12

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeCategory = params.category
  const searchQuery = params.q
  const supabase = await createClient()

  // Fetch company categories for filter
  const { data: categoriesData } = await supabase
    .from("company_categories")
    .select("slug, name, display_order")
    .order("display_order", { ascending: true })

  const categories = (categoriesData || []) as Category[]

  // Fetch initial articles
  let query = supabase
    .from("articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image_url,
      youtube_url,
      company:companies (
        id,
        name,
        category
      )
    `)
    .eq("status", "published")
    .order("title", { ascending: true })
    .range(0, PAGE_SIZE - 1)

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }

  const { data } = await query

  let articles = data || []

  // Filter by category
  if (activeCategory) {
    articles = articles.filter(
      (article: any) =>
        article.company?.category === activeCategory
    )
  }

  const hasMore = data?.length === PAGE_SIZE

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            Insights & Research
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
            Articles
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Evidence-informed insights on longevity, health optimization, and the science of living better.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-24" />}>
            <DirectoryFilters
              categories={categories}
              basePath="/articles"
              searchPlaceholder="Search articles..."
              allLabel="All Categories"
            />
          </Suspense>
        </div>

        {/* Grid */}
        <Suspense fallback={<div className="h-96" />}>
          <ArticlesGrid
            initialArticles={articles as any}
            initialHasMore={hasMore}
          />
        </Suspense>
      </section>
    </div>
  )
}
