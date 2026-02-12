"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface EventCompany {
  id: string
  role?: string
  tier?: string
  company?: {
    id: string
    name: string
    slug?: string | null
    logo_url?: string | null
    website?: string | null
    is_draft?: boolean | null
  } | null
  [key: string]: any
}

interface CompaniesGridProps {
  /** Companies grouped by tier/role key */
  companyGroups: Record<string, EventCompany[]>
  /** Ordered list of active tier keys */
  activeTiers: string[]
  /** Label map for tiers */
  tierLabels: Record<string, string>
  /** How many items to show per tier initially (per row of 6) */
  initialRowSize?: number
  /** Grid class for title/platinum tiers */
  largeGridClass?: string
  /** Grid class for other tiers */
  smallGridClass?: string
  /** Section colors */
  colors?: {
    title?: string
    subtitle?: string
  }
}

const SMALL_ROW = 6 // grid-cols-6 for smaller tiers
const LARGE_ROW = 3 // grid-cols-3 for title/platinum tiers
const ROWS_TO_LOAD = 2

/**
 * Lazy-loading companies grid for event landing pages.
 * Shows all tiers with initial rows visible, loads more on scroll.
 */
export function CompaniesGrid({
  companyGroups,
  activeTiers,
  tierLabels,
  initialRowSize = ROWS_TO_LOAD,
  largeGridClass = "grid-cols-2 md:grid-cols-3",
  smallGridClass = "grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  colors,
}: CompaniesGridProps) {
  // Calculate initial visible counts per tier
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const tier of activeTiers) {
      const isLarge = tier.includes("title") || tier.includes("platinum")
      const rowSize = isLarge ? LARGE_ROW : SMALL_ROW
      initial[tier] = initialRowSize * rowSize
    }
    return initial
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  // Check if any tier has more to show
  const hasMore = activeTiers.some(
    (tier) => (visibleCounts[tier] || 0) < (companyGroups[tier]?.length || 0)
  )

  // Load more rows for the next tier that isn't fully visible
  const loadMore = useCallback(() => {
    setVisibleCounts((prev) => {
      const updated = { ...prev }
      for (const tier of activeTiers) {
        const total = companyGroups[tier]?.length || 0
        const current = updated[tier] || 0
        if (current < total) {
          const isLarge = tier.includes("title") || tier.includes("platinum")
          const rowSize = isLarge ? LARGE_ROW : SMALL_ROW
          updated[tier] = Math.min(current + ROWS_TO_LOAD * rowSize, total)
          break
        }
      }
      return updated
    })
  }, [activeTiers, companyGroups])

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "300px" }
    )

    const sentinel = sentinelRef.current
    if (sentinel) observer.observe(sentinel)

    return () => {
      if (sentinel) observer.unobserve(sentinel)
    }
  }, [hasMore, loadMore])

  return (
    <div className="space-y-6">
      {activeTiers.map((tier) => {
        const companies = companyGroups[tier] || []
        const visibleCount = visibleCounts[tier] || 0
        const visible = companies.slice(0, visibleCount)
        const isLarge = tier.includes("title") || tier.includes("platinum")

        if (visible.length === 0) return null

        return (
          <div key={tier}>
            <h3 className="font-heading text-sm font-semibold text-navy mb-3">
              {tierLabels[tier] || tier}
            </h3>
            <div className={`grid gap-3 ${isLarge ? largeGridClass : smallGridClass}`}>
              {visible.map((ec) => {
                const company = ec.company
                if (!company) return null

                return (
                  <a
                    key={ec.id}
                    href={company.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="be-card flex items-center justify-center p-3 hover:shadow-lg transition-shadow"
                  >
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="max-h-28 max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-heading font-medium text-navy text-xs text-center">
                        {company.name}
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Sentinel triggers loading more rows */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-electric-blue border-t-transparent" />
        </div>
      )}
    </div>
  )
}
