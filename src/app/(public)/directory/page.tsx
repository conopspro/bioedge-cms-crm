import { createClient } from "@/lib/supabase/server"
import { DirectoryFilters } from "@/components/filters/directory-filters"
import { ConsumerDirectory } from "@/components/directory/consumer-directory"
import { Suspense } from "react"

export const metadata = {
  title: "Consumer Directory",
  description:
    "Browse consumer-accessible longevity solutions: supplements, wearables, diagnostics, and more.",
  openGraph: {
    title: "Consumer Directory",
    description:
      "Browse consumer-accessible longevity solutions: supplements, wearables, diagnostics, and more.",
  },
}

interface Category {
  slug: string
  name: string
}

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; edge?: string; system?: string }>
}

const PAGE_SIZE = 20

export default async function ConsumerDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeCategory = params.category
  const searchQuery = params.q
  const activeEdge = params.edge
  const activeSystem = params.system
  const supabase = await createClient()

  // Fetch company categories for filter pills
  const { data: categoriesData } = await supabase
    .from("company_categories")
    .select("slug, name, display_order")
    .order("display_order", { ascending: true })

  const categories = (categoriesData || []) as Category[]

  // Fetch initial consumer companies (SSR)
  let query = supabase
    .from("companies")
    .select("id, name, slug, domain, logo_url, category, edge_categories, access_levels, systems_supported")
    .contains("access_levels", ["consumer"])
    .or("is_draft.is.null,is_draft.eq.false")

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`)
  }

  if (activeCategory) {
    query = query.eq("category", activeCategory)
  }

  if (activeEdge) {
    query = query.contains("edge_categories", [activeEdge])
  }

  if (activeSystem) {
    query = query.contains("systems_supported", [activeSystem])
  }

  const { data } = await query

  // Sort: companies with logos first, then alphabetical within each group
  const sorted = (data || []).sort((a, b) => {
    const aHasLogo = a.logo_url ? 0 : 1
    const bHasLogo = b.logo_url ? 0 : 1
    if (aHasLogo !== bHasLogo) return aHasLogo - bHasLogo
    return a.name.localeCompare(b.name)
  })

  const companies = sorted.slice(0, PAGE_SIZE)
  const hasMore = sorted.length > PAGE_SIZE

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            Directory
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
            Consumer Directory
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Products and solutions you can access directly. No prescription or practitioner required.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-12" />}>
            <DirectoryFilters
              categories={categories}
              basePath="/directory"
              searchPlaceholder="Search companies..."
              allLabel="All Categories"
              showEdgeFilters
              showSystemFilters
              variant="dropdowns"
            />
          </Suspense>
        </div>

        {/* List */}
        <Suspense fallback={<div className="h-96" />}>
          <ConsumerDirectory
            initialCompanies={companies}
            initialHasMore={hasMore}
            initialTotalCount={sorted.length}
          />
        </Suspense>
      </section>
    </div>
  )
}
