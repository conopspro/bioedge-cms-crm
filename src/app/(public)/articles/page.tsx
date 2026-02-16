import { createClient } from "@/lib/supabase/server"
import { DirectoryFilters } from "@/components/filters/directory-filters"
import { ArticlesGrid } from "@/components/directory/articles-grid"
import { Suspense } from "react"

export const metadata = {
  title: "Articles",
  description: "Evidence-informed insights on longevity, health optimization, and the science of living better.",
  openGraph: {
    title: "Articles",
    description: "Evidence-informed insights on longevity, health optimization, and the science of living better.",
  },
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
        category,
        is_draft
      )
    `)
    .eq("status", "published")
    .order("title", { ascending: true })
    .range(0, PAGE_SIZE - 1)

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }

  const { data } = await query

  // Hide draft companies from public display
  let articles = (data || []).map((a: any) => ({
    ...a,
    company: a.company?.is_draft === true ? null : a.company,
  }))

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
          <div className="flex items-start gap-6">
            <img
              src="https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"
              alt="BioEdge"
              className="h-[100px] w-[100px] flex-shrink-0 hidden md:block"
            />
            <div>
              <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
                Articles
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                Evidence-informed insights on longevity, health optimization, and the science of living better.
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
            <DirectoryFilters
              categories={categories}
              basePath="/articles"

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
