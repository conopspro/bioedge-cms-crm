"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"

interface ClinicFiltersProps {
  states: string[]
  cities: { city: string; clinic_count: number }[]
  allTags: { tag: string; count: number }[]
}

export function ClinicFilters({ states, cities, allTags }: ClinicFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [zipInput, setZipInput] = useState(searchParams.get("zip") || "")
  const [cityOptions, setCityOptions] = useState(cities)
  const [loadingCities, setLoadingCities] = useState(false)

  const activeState = searchParams.get("state")
  const activeCity = searchParams.get("city")
  const activeTag = searchParams.get("tag")
  const activeRadius = searchParams.get("radius") || "25"
  const activeZip = searchParams.get("zip")

  // Update city options when server-provided cities change (e.g., page navigation)
  useEffect(() => {
    setCityOptions(cities)
  }, [cities])

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 when filtering
      params.delete("page")
      router.push(`/clinics?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleStateChange = useCallback(
    async (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("state", value)
      } else {
        params.delete("state")
      }
      // Clear city when state changes
      params.delete("city")
      params.delete("page")
      router.push(`/clinics?${params.toString()}`)

      // Fetch cities for new state
      if (value) {
        setLoadingCities(true)
        try {
          const res = await fetch(
            `/api/clinics/cities?state=${encodeURIComponent(value)}`
          )
          const json = await res.json()
          setCityOptions(json.data || [])
        } catch {
          setCityOptions([])
        } finally {
          setLoadingCities(false)
        }
      } else {
        setCityOptions([])
      }
    },
    [router, searchParams]
  )

  const handleRadiusChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("radius", value)
      params.delete("page")
      router.push(`/clinics?${params.toString()}`)
    },
    [router, searchParams]
  )

  // Combined submit: triggers both name search and zip search together
  const handleCombinedSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())

      // Name search
      if (searchInput.trim()) {
        params.set("q", searchInput.trim())
      } else {
        params.delete("q")
      }

      // ZIP proximity
      if (zipInput.trim()) {
        params.set("zip", zipInput.trim())
        if (!params.get("radius")) {
          params.set("radius", "25")
        }
        // ZIP overrides geolocation
        params.delete("near")
      } else if (!params.get("near")) {
        // Only clear location if not using geolocation
        params.delete("zip")
        params.delete("radius")
        params.delete("lat")
        params.delete("lng")
      }

      params.delete("page")
      router.push(`/clinics?${params.toString()}`)
    },
    [searchInput, zipInput, router, searchParams]
  )

  return (
    <div className="space-y-3">
      {/* Single row: Search + State + City + ZIP + Radius + Go */}
      <form onSubmit={handleCombinedSubmit} className="flex flex-wrap items-center gap-2">
        {/* Name search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clinics..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-44 rounded-md border bg-white pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* State filter */}
        <select
          value={activeState || ""}
          onChange={(e) => handleStateChange(e.target.value || null)}
          className="rounded-md border bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City filter — shown when a state is selected */}
        {activeState && (
          <select
            value={activeCity || ""}
            onChange={(e) => updateFilter("city", e.target.value || null)}
            disabled={loadingCities}
            className="rounded-md border bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          >
            <option value="">
              {loadingCities ? "Loading..." : "All Cities"}
            </option>
            {cityOptions.map(({ city, clinic_count }) => (
              <option key={city} value={city}>
                {city} ({clinic_count})
              </option>
            ))}
          </select>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* ZIP proximity */}
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="ZIP"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            className="w-24 rounded-md border bg-white pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            maxLength={10}
          />
        </div>

        {/* Radius dropdown */}
        <select
          value={activeRadius}
          onChange={(e) => {
            if (zipInput.trim() || activeZip) {
              handleRadiusChange(e.target.value)
            }
          }}
          className="rounded-md border bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="10">10 mi</option>
          <option value="25">25 mi</option>
          <option value="50">50 mi</option>
          <option value="100">100 mi</option>
        </select>

        {/* Search / Go button */}
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition"
        >
          Search
        </button>
      </form>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => updateFilter("tag", activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted-foreground hover:border-primary/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
