"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { InfiniteScrollTrigger } from "@/components/infinite-scroll/infinite-scroll-trigger"

interface Company {
  id: string
  name: string
  slug: string | null
  domain: string | null
  logo_url: string | null
  category: string | null
  edge_categories: string[] | null
  access_levels: string[] | null
}

interface ConsumerDirectoryProps {
  initialCompanies: Company[]
  initialHasMore: boolean
  initialTotalCount: number
}

const CATEGORY_LABELS: Record<string, string> = {
  diagnostics_testing: "Diagnostics & Testing",
  energy_light_therapy: "Energy & Light Therapy",
  environment: "Environment",
  fitness: "Fitness",
  mind_neurotech: "Mind & Neurotech",
  recovery: "Recovery",
  sleep_technology: "Sleep Technology",
  supplements_compounds: "Supplements & Compounds",
  wearables_monitoring: "Wearables & Monitoring",
  longevity_clinics: "Longevity Clinics",
}

export function ConsumerDirectory({
  initialCompanies,
  initialHasMore,
  initialTotalCount,
}: ConsumerDirectoryProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("q")
  const edge = searchParams.get("edge")

  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(initialTotalCount)

  // Reset when filters change
  useEffect(() => {
    setCompanies(initialCompanies)
    setPage(0)
    setHasMore(initialHasMore)
    setTotalCount(initialTotalCount)
  }, [initialCompanies, initialHasMore, initialTotalCount])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams()
      params.set("page", String(nextPage))
      if (category) params.set("category", category)
      if (search) params.set("q", search)
      if (edge) params.set("edge", edge)

      const res = await fetch(`/api/directory/consumer-companies?${params}`)
      const data = await res.json()

      setCompanies((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasMore(data.hasMore)
      if (data.totalCount !== undefined) {
        setTotalCount(data.totalCount)
      }
    } catch (error) {
      console.error("Failed to load more companies:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading, category, search, edge])

  if (companies.length === 0) {
    return (
      <div className="py-16 text-center">
        <Building2 className="mx-auto mb-4 h-16 w-16 text-navy/20" />
        <p className="mb-2 text-xl font-body font-semibold text-navy">
          {category || search || edge ? "No companies found" : "No companies yet"}
        </p>
        <p className="font-body text-gray-600">
          {category || search || edge
            ? "Try adjusting your filters."
            : "Check back soon!"}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Count */}
      <p className="mb-4 font-body text-sm text-text-light">
        {totalCount} {totalCount === 1 ? "company" : "companies"}
      </p>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {companies.map((company) => {
          const categoryLabel = company.category
            ? CATEGORY_LABELS[company.category] || company.category
            : null
          const edgeLabel = company.edge_categories?.length
            ? company.edge_categories
                .map((ec) => ec.charAt(0).toUpperCase() + ec.slice(1))
                .join(", ")
            : null

          return (
            <Link
              key={company.id}
              href={`/companies/${company.slug || company.domain || company.id}`}
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white rounded-lg"
            >
              {/* Logo */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="max-h-10 max-w-[40px] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* Company name + metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-body font-semibold text-navy transition-colors group-hover:text-electric-blue">
                    {company.name}
                  </span>
                  {categoryLabel && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="font-body text-sm text-text-light">
                        {categoryLabel}
                      </span>
                    </>
                  )}
                  {edgeLabel && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="font-body text-sm text-text-light">
                        {edgeLabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Infinite scroll trigger */}
      <InfiniteScrollTrigger
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />

      {/* All loaded indicator */}
      {!hasMore && companies.length > 0 && (
        <p className="py-6 text-center font-body text-sm text-text-light">
          All {totalCount} {totalCount === 1 ? "company" : "companies"} shown
        </p>
      )}
    </>
  )
}
