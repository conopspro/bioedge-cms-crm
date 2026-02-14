"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, X } from "lucide-react"

interface Category {
  slug: string
  name: string
}

interface EdgeFilter {
  value: string
  label: string
  color: string
  activeColor: string
}

const EDGE_FILTERS: EdgeFilter[] = [
  { value: "eliminate", label: "Eliminate", color: "bg-red-50 text-red-700 hover:bg-red-100", activeColor: "bg-red-600 text-white" },
  { value: "decode", label: "Decode", color: "bg-blue-50 text-blue-700 hover:bg-blue-100", activeColor: "bg-blue-600 text-white" },
  { value: "gain", label: "Gain", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", activeColor: "bg-emerald-600 text-white" },
  { value: "execute", label: "Execute", color: "bg-amber-50 text-amber-700 hover:bg-amber-100", activeColor: "bg-amber-600 text-white" },
]

interface DirectoryFiltersProps {
  categories: Category[]
  basePath: string
  searchPlaceholder?: string
  allLabel?: string
  showEdgeFilters?: boolean
}

export function DirectoryFilters({
  categories,
  basePath,
  searchPlaceholder = "Search articles, leaders, companies, presentations...",
  allLabel = "All",
  showEdgeFilters = false,
}: DirectoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const activeEdge = searchParams.get("edge")
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
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">EDGE</span>
          <button
            onClick={() => handleEdgeClick(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              !activeEdge
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  ? filter.activeColor
                  : filter.color
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
