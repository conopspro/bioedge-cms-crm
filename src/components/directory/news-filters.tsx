"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Search } from "lucide-react"

interface NewsFiltersProps {
  sources: string[]
}

const BIOLOGICAL_SYSTEMS = [
  "Breath",
  "Circulation",
  "Consciousness",
  "Defense",
  "Detoxification",
  "Digestive",
  "Emotional",
  "Energy Production",
  "Hormonal",
  "Hydration",
  "Nervous System",
  "Regeneration",
  "Stress Response",
  "Structure & Movement",
  "Temperature",
]

export function NewsFilters({ sources }: NewsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")

  const activeSource = searchParams.get("source")
  const activeEdge = searchParams.get("edge")
  const activeSystem = searchParams.get("system")

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`/news?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())
      if (searchInput.trim()) {
        params.set("q", searchInput.trim())
      } else {
        params.delete("q")
      }
      params.delete("page")
      router.push(`/news?${params.toString()}`)
    },
    [searchInput, router, searchParams]
  )

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Source + System dropdowns */}
      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-48 rounded-md border bg-white pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Source dropdown */}
        <select
          value={activeSource || ""}
          onChange={(e) => updateFilter("source", e.target.value || null)}
          className="rounded-md border bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Sources</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>

        {/* EDGE dropdown */}
        <select
          value={activeEdge || ""}
          onChange={(e) => updateFilter("edge", e.target.value || null)}
          className="rounded-md border bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All EDGE</option>
          <option value="eliminate">Eliminate</option>
          <option value="decode">Decode</option>
          <option value="gain">Gain</option>
          <option value="execute">Execute</option>
        </select>

        {/* System dropdown */}
        <select
          value={activeSystem || ""}
          onChange={(e) => updateFilter("system", e.target.value || null)}
          className="rounded-md border bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Systems</option>
          {BIOLOGICAL_SYSTEMS.map((sys) => (
            <option key={sys} value={sys}>
              {sys}
            </option>
          ))}
        </select>

        {/* Search button */}
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition"
        >
          Search
        </button>
      </form>
    </div>
  )
}
