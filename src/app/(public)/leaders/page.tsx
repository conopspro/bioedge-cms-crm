import { createClient } from "@/lib/supabase/server"
import { DirectoryFilters } from "@/components/filters/directory-filters"
import { LeadersGrid } from "@/components/directory/leaders-grid"
import { Suspense } from "react"

export const metadata = {
  title: "Longevity Leaders",
  description: "Industry experts and thought leaders in the longevity space.",
  openGraph: {
    title: "Longevity Leaders",
    description: "Industry experts and thought leaders in the longevity space.",
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

export default async function LeadersDirectoryPage({ searchParams }: PageProps) {
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

  // Fetch initial leaders
  let query = supabase
    .from("contacts")
    .select(`
      id,
      slug,
      first_name,
      last_name,
      title,
      avatar_url,
      linkedin_url,
      bio,
      company:companies(name, logo_url, category, is_draft)
    `)
    .eq("show_on_articles", true)
    .order("last_name", { ascending: true })
    .range(0, PAGE_SIZE - 1)

  if (searchQuery) {
    query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
  }

  const { data: rawData } = await query

  // Hide draft companies from public display
  const data = (rawData || []).map((leader: any) => ({
    ...leader,
    company: leader.company?.is_draft === true ? null : leader.company,
  }))

  let leaders = data || []

  // Filter by category
  if (activeCategory) {
    leaders = leaders.filter(
      (leader: any) =>
        leader.company?.category === activeCategory
    )
  }

  const hasMore = data?.length === PAGE_SIZE

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            Directory
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
            Longevity Leaders
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Industry experts and thought leaders pioneering the future of longevity and health optimization.
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
              basePath="/leaders"

              allLabel="All Categories"
            />
          </Suspense>
        </div>

        {/* Grid */}
        <Suspense fallback={<div className="h-96" />}>
          <LeadersGrid
            initialLeaders={leaders as any}
            initialHasMore={hasMore}
          />
        </Suspense>
      </section>
    </div>
  )
}
