import { createClient } from "@/lib/supabase/server"
import { DirectoryFilters } from "@/components/filters/directory-filters"
import { CompaniesGrid } from "@/components/directory/companies-grid"
import { Suspense } from "react"

export const metadata = {
  title: "Longevity Solutions",
  description: "Organizations and solutions that support longevity and health optimization.",
  openGraph: {
    title: "Longevity Solutions",
    description: "Organizations and solutions that support longevity and health optimization.",
  },
}

interface Category {
  slug: string
  name: string
}

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; edge?: string; audience?: string }>
}

const PAGE_SIZE = 12

export default async function CompaniesDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeCategory = params.category
  const searchQuery = params.q
  const activeEdge = params.edge
  const activeAudience = params.audience
  const supabase = await createClient()

  // Fetch company categories for filter
  const { data: categoriesData } = await supabase
    .from("company_categories")
    .select("slug, name, display_order")
    .order("display_order", { ascending: true })

  const categories = (categoriesData || []) as Category[]

  // Fetch initial companies (exclude drafts)
  let query = supabase
    .from("companies")
    .select("id, name, slug, domain, logo_url, category, edge_categories, access_levels, has_affiliate")
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

  if (activeAudience === "consumer") {
    query = query.contains("access_levels", ["consumer"])
  }

  const { data } = await query

  // Apply practitioner filter post-query (companies without "consumer" in access_levels)
  let filtered = data || []
  if (activeAudience === "practitioner") {
    filtered = filtered.filter(
      (c) => !c.access_levels || !c.access_levels.includes("consumer")
    )
  }

  // Sort: companies with logos first, then alphabetical within each group
  const sorted = filtered.sort((a, b) => {
    const aHasLogo = a.logo_url ? 0 : 1
    const bHasLogo = b.logo_url ? 0 : 1
    if (aHasLogo !== bHasLogo) return aHasLogo - bHasLogo
    return a.name.localeCompare(b.name)
  })

  const totalCount = sorted.length
  const companies = sorted.slice(0, PAGE_SIZE)
  const hasMore = sorted.length > PAGE_SIZE

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
                Longevity Solutions
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                Companies and organizations that support longevity and health optimization.
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
              basePath="/companies"
              allLabel="All Categories"
              showEdgeFilters
              showAudienceFilter
            />
          </Suspense>
        </div>

        {/* Grid */}
        <Suspense fallback={<div className="h-96" />}>
          <CompaniesGrid
            initialCompanies={companies}
            initialHasMore={hasMore}
            initialTotalCount={totalCount}
          />
        </Suspense>
      </section>
    </div>
  )
}
