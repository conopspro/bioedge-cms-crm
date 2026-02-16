"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ClinicCard } from "./clinic-card"
import { Loader2 } from "lucide-react"

interface ClinicRow {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  country: string | null
  phone: string | null
  website: string | null
  description: string | null
  tags: string[]
  photos: string[]
  distance_miles?: number
}

interface NearbyClinicsSectionProps {
  /** First batch of clinics rendered server-side */
  initialClinics: ClinicRow[]
  /** Total number of clinics available in this city (excluding self) */
  totalCount: number
  /** City to fetch more clinics from */
  city: string
  /** State for the query */
  state: string | null
  /** Clinic ID to exclude (the current clinic) */
  excludeId: string
  /** Label for the section heading */
  heading: string
  /** Latitude of the current clinic (for proximity search) */
  latitude?: number | null
  /** Longitude of the current clinic (for proximity search) */
  longitude?: number | null
}

const PAGE_SIZE = 24
const RADIUS_OPTIONS = [
  { value: "", label: "This city only" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
  { value: "100", label: "100 miles" },
]

export function NearbyClinicSection({
  initialClinics,
  totalCount,
  city,
  state,
  excludeId,
  heading,
  latitude,
  longitude,
}: NearbyClinicsSectionProps) {
  const [clinics, setClinics] = useState<ClinicRow[]>(initialClinics)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialClinics.length < totalCount)
  const [total, setTotal] = useState(totalCount)
  const [radius, setRadius] = useState("") // empty = city mode
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Track offset based on how many we've loaded
  const offsetRef = useRef(initialClinics.length)

  const hasCoords = latitude != null && longitude != null

  // When radius changes, reset and fetch fresh from the API
  const handleRadiusChange = useCallback(
    async (newRadius: string) => {
      setRadius(newRadius)

      if (!newRadius) {
        // Switch back to city mode — restore initial data
        setClinics(initialClinics)
        setTotal(totalCount)
        setHasMore(initialClinics.length < totalCount)
        offsetRef.current = initialClinics.length
        return
      }

      // Proximity mode — need lat/lng
      if (!hasCoords) return

      setLoading(true)
      setClinics([])
      offsetRef.current = 0

      try {
        const params = new URLSearchParams({
          lat: String(latitude),
          lng: String(longitude),
          radius: newRadius,
          exclude: excludeId,
          offset: "0",
          limit: String(PAGE_SIZE),
        })

        const res = await fetch(`/api/clinics/nearby?${params.toString()}`)
        const json = await res.json()
        const newClinics: ClinicRow[] = json.data || []
        const newTotal = json.total || 0

        setClinics(newClinics)
        setTotal(newTotal)
        offsetRef.current = newClinics.length
        setHasMore(newClinics.length < newTotal)
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    },
    [initialClinics, totalCount, hasCoords, latitude, longitude, excludeId]
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const params = new URLSearchParams({
        offset: String(offsetRef.current),
        limit: String(PAGE_SIZE),
        exclude: excludeId,
      })

      if (radius && hasCoords) {
        // Proximity mode
        params.set("lat", String(latitude))
        params.set("lng", String(longitude))
        params.set("radius", radius)
      } else {
        // City mode
        params.set("city", city)
        if (state) params.set("state", state)
      }

      const res = await fetch(`/api/clinics/nearby?${params.toString()}`)
      const json = await res.json()
      const newClinics: ClinicRow[] = json.data || []

      if (newClinics.length > 0) {
        setClinics((prev) => {
          // Deduplicate by id
          const existingIds = new Set(prev.map((c) => c.id))
          const unique = newClinics.filter((c) => !existingIds.has(c.id))
          return [...prev, ...unique]
        })
        offsetRef.current += newClinics.length
      }

      if (newClinics.length < PAGE_SIZE) {
        setHasMore(false)
      }
    } catch {
      // Silently fail — user can scroll again to retry
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, city, state, excludeId, radius, hasCoords, latitude, longitude])

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "400px" } // Start loading before user reaches the bottom
    )

    const sentinel = sentinelRef.current
    if (sentinel) observer.observe(sentinel)

    return () => {
      if (sentinel) observer.unobserve(sentinel)
    }
  }, [hasMore, loadMore])

  if (clinics.length === 0 && !loading) return null

  const isProximity = radius !== ""

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12">
      <div className="border-t pt-8">
        {/* Heading row with radius dropdown */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-1">
          <h2 className="text-xl font-semibold">
            {isProximity ? "Nearby Clinics" : heading}
          </h2>

          {hasCoords && (
            <div className="flex items-center gap-2">
              <label htmlFor="expand-radius" className="text-sm text-muted-foreground whitespace-nowrap">
                Expand search
              </label>
              <select
                id="expand-radius"
                value={radius}
                onChange={(e) => handleRadiusChange(e.target.value)}
                className="rounded-md border bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {RADIUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {total} clinic{total !== 1 ? "s" : ""}{" "}
          {isProximity ? `within ${radius} miles` : `in ${city}`}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((nearby) => (
            <ClinicCard
              key={nearby.id}
              clinic={nearby}
              distance={nearby.distance_miles}
            />
          ))}
        </div>

        {/* Sentinel for infinite scroll */}
        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more clinics...
              </div>
            )}
          </div>
        )}

        {/* Loading indicator when switching radius */}
        {loading && clinics.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching nearby clinics...
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
