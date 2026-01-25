"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, X } from "lucide-react"

interface Category {
  slug: string
  name: string
}

interface DirectoryFiltersProps {
  categories: Category[]
  basePath: string
  searchPlaceholder?: string
  allLabel?: string
}

export function DirectoryFilters({
  categories,
  basePath,
  searchPlaceholder = "Search by name...",
  allLabel = "All"
}: DirectoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")
  const currentSearch = searchParams.get("q") || ""
  const [searchValue, setSearchValue] = useState(currentSearch)
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ q: searchValue.trim() || null })
  }

  const handleClearSearch = () => {
    setSearchValue("")
    updateParams({ q: null })
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
        {(searchValue || currentSearch) && (
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
    </div>
  )
}
