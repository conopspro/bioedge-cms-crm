"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, X } from "lucide-react"

interface Category {
  slug: string
  name: string
}

const EDGE_FILTERS = [
  { value: "eliminate", label: "Eliminate" },
  { value: "decode", label: "Decode" },
  { value: "gain", label: "Gain" },
  { value: "execute", label: "Execute" },
]

const SYSTEM_FILTERS = [
  { value: "Breath", label: "Breath" },
  { value: "Circulation", label: "Circulation" },
  { value: "Consciousness", label: "Consciousness" },
  { value: "Defense", label: "Defense" },
  { value: "Detoxification", label: "Detoxification" },
  { value: "Digestive", label: "Digestive" },
  { value: "Emotional", label: "Emotional" },
  { value: "Energy Production", label: "Energy Production" },
  { value: "Hormonal", label: "Hormonal" },
  { value: "Hydration", label: "Hydration" },
  { value: "Nervous System", label: "Nervous System" },
  { value: "Regeneration", label: "Regeneration" },
  { value: "Stress Response", label: "Stress Response" },
  { value: "Structure & Movement", label: "Structure & Movement" },
  { value: "Temperature", label: "Temperature" },
]

interface DirectoryFiltersProps {
  categories: Category[]
  basePath: string
  searchPlaceholder?: string
  allLabel?: string
  showEdgeFilters?: boolean
  showSystemFilters?: boolean
  /** "pills" (default) renders pill buttons; "dropdowns" renders compact selects on one row */
  variant?: "pills" | "dropdowns"
}

export function DirectoryFilters({
  categories,
  basePath,
  searchPlaceholder = "Search articles, leaders, companies, presentations...",
  allLabel = "All",
  showEdgeFilters = false,
  showSystemFilters = false,
  variant = "pills",
}: DirectoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const activeEdge = searchParams.get("edge")
  const activeSystem = searchParams.get("system")
  const [searchValue, setSearchValue] = useState("")
  const [isPending, startTransition] = useTransition()

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    const queryString = params.toString()
    startTransition(() => {
      router.push(`${basePath}${queryString ? `?${queryString}` : ""}`)
    })
  }

  const handleCategoryClick = (categorySlug: string | null) => {
    updateParams({ category: categorySlug })
  }

  const handleEdgeClick = (edge: string | null) => {
    updateParams({ edge })
  }

  const handleSystemClick = (system: string | null) => {
    updateParams({ system })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim().length >= 2) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      })
    }
  }

  const handleClearSearch = () => {
    setSearchValue("")
  }

  // ─── Dropdown variant: search + category select + EDGE select on one row ───
  if (variant === "dropdowns") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 font-body text-sm text-navy placeholder:text-gray-400 focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isPending && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-electric-blue border-t-transparent" />
            </div>
          )}
        </form>

        {/* Category dropdown */}
        <select
          value={activeCategory || ""}
          onChange={(e) => handleCategoryClick(e.target.value || null)}
          className="h-[42px] rounded-lg border border-gray-200 bg-white px-3 font-body text-sm text-navy focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue"
        >
          <option value="">{allLabel}</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        {/* EDGE dropdown */}
        {showEdgeFilters && (
          <select
            value={activeEdge || ""}
            onChange={(e) => handleEdgeClick(e.target.value || null)}
            className="h-[42px] rounded-lg border border-gray-200 bg-white px-3 font-body text-sm text-navy focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue"
          >
            <option value="">All EDGE</option>
            {EDGE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        )}

        {/* Biological System dropdown */}
        {showSystemFilters && (
          <select
            value={activeSystem || ""}
            onChange={(e) => handleSystemClick(e.target.value || null)}
            className="h-[42px] rounded-lg border border-gray-200 bg-white px-3 font-body text-sm text-navy focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue"
          >
            <option value="">All Systems</option>
            {SYSTEM_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }

  // ─── Pills variant (default): stacked rows of pill buttons ───
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-navy placeholder:text-gray-400 focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isPending && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-electric-blue border-t-transparent" />
          </div>
        )}
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            !activeCategory
              ? "bg-electric-blue text-white"
              : "bg-white text-navy hover:bg-gray-100"
          }`}
        >
          {allLabel}
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === category.slug
                ? "bg-electric-blue text-white"
                : "bg-white text-navy hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* EDGE Framework Filter Pills */}
      {showEdgeFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">EDGE Framework</span>
          <button
            onClick={() => handleEdgeClick(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              !activeEdge
                ? "bg-electric-blue text-white"
                : "bg-white text-navy hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {EDGE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleEdgeClick(filter.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeEdge === filter.value
                  ? "bg-electric-blue text-white"
                  : "bg-white text-navy hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
