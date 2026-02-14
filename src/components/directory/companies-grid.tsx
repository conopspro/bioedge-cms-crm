"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { InfiniteScrollTrigger } from "@/components/infinite-scroll/infinite-scroll-trigger"

const EDGE_BADGE_STYLES: Record<string, string> = {
  eliminate: "bg-red-100 text-red-700",
  decode: "bg-blue-100 text-blue-700",
  gain: "bg-emerald-100 text-emerald-700",
  execute: "bg-amber-100 text-amber-700",
}

const EDGE_LABELS: Record<string, string> = {
  eliminate: "E",
  decode: "D",
  gain: "G",
  execute: "X",
}

const ACCESS_DOTS: Record<string, { color: string; label: string }> = {
  consumer: { color: "bg-green-500", label: "Consumer" },
  practitioner_facilitated: { color: "bg-yellow-500", label: "Practitioner-Facilitated" },
  practitioner_only: { color: "bg-red-500", label: "Practitioner Only" },
}

interface Company {
  id: string
  name: string
  slug: string | null
  domain: string | null
  logo_url: string | null
  category: string | null
  edge_categories: string[] | null
  access_levels: string[] | null
  has_affiliate: boolean | null
}

interface CompaniesGridProps {
  initialCompanies: Company[]
  initialHasMore: boolean
}

export function CompaniesGrid({ initialCompanies, initialHasMore }: CompaniesGridProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("q")
  const edge = searchParams.get("edge")

  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // Reset when filters change
  useEffect(() => {
    setCompanies(initialCompanies)
    setPage(0)
    setHasMore(initialHasMore)
  }, [initialCompanies, initialHasMore])

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

      const res = await fetch(`/api/directory/companies?${params}`)
      const data = await res.json()

      setCompanies((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasMore(data.hasMore)
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
        <h2 className="mb-2 text-xl font-semibold text-navy">
          {category || search || edge ? "No companies found" : "No companies yet"}
        </h2>
        <p className="text-gray-600">
          {category || search || edge ? "Try adjusting your filters." : "Check back soon!"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {companies.map((company) => {
          const edgeCategories = company.edge_categories || []
          const accessLevels = company.access_levels || []
          const hasAffiliate = company.has_affiliate || false
          const hasMetadata = edgeCategories.length > 0 || accessLevels.length > 0

          return (
            <Link
              key={company.id}
              href={`/companies/${company.slug || company.domain || company.id}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="px-2.5 py-4 text-center">
                <div className="mb-3 flex h-28 items-center justify-center">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="max-h-28 max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-navy transition-colors group-hover:text-electric-blue">
                  {company.name}
                </h3>
                {hasMetadata && (
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
                    {edgeCategories.map((ec) => (
                      <span
                        key={ec}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${EDGE_BADGE_STYLES[ec] || "bg-gray-100 text-gray-600"}`}
                        title={ec.charAt(0).toUpperCase() + ec.slice(1)}
                      >
                        {EDGE_LABELS[ec] || ec[0]?.toUpperCase()}
                      </span>
                    ))}
                    {accessLevels.length > 0 && edgeCategories.length > 0 && (
                      <span className="mx-0.5" />
                    )}
                    {accessLevels.map((al) => {
                      const dot = ACCESS_DOTS[al]
                      if (!dot) return null
                      return (
                        <span
                          key={al}
                          className={`inline-block h-2 w-2 rounded-full ${dot.color}`}
                          title={dot.label}
                        />
                      )
                    })}
                    {hasAffiliate && (
                      <span
                        className="text-[10px]"
                        title="Affiliate program"
                      >
                        💰
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <InfiniteScrollTrigger
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </>
  )
}
