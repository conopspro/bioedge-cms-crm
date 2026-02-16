import { createClient } from "@/lib/supabase/server"
import { ClinicCard } from "@/components/clinics/clinic-card"
import { ClinicFilters } from "@/components/clinics/clinic-filters"
import { GeoRedirect } from "@/components/clinics/geo-redirect"
import { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Longevity Clinics Directory | bioEDGE",
  description:
    "Find longevity, anti-aging, and functional medicine clinics near you. Browse our directory of 20,000+ clinics across the US.",
  openGraph: {
    title: "Longevity Clinics Directory",
    description:
      "Find longevity, anti-aging, and functional medicine clinics near you. 20,000+ US locations.",
  },
}

interface PageProps {
  searchParams: Promise<{
    state?: string
    city?: string
    tag?: string
    q?: string
    page?: string
    zip?: string
    radius?: string
    lat?: string
    lng?: string
    near?: string // "me" when auto-detected via geolocation
  }>
}

const PAGE_SIZE = 48

export default async function ClinicsDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const page = parseInt(params.page || "1", 10)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  type ClinicRow = {
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

  let clinics: ClinicRow[] = []
  let moreNearbyClinics: ClinicRow[] = [] // additional nearby clinics shown when text search narrows results
  let moreNearbyLabel = "" // heading for the "more nearby" section
  let totalCount = 0
  let isProximitySearch = false
  let proximityLabel = ""

  // Total directory count for the hero (unfiltered)
  const { count: directoryTotal } = await supabase
    .from("clinics")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("is_draft", false)
  const heroTotal = directoryTotal || 0

  // Determine if this is a proximity search
  let lat = params.lat ? parseFloat(params.lat) : null
  let lng = params.lng ? parseFloat(params.lng) : null
  const radius = params.radius ? parseFloat(params.radius) : 25

  // If zip provided but no lat/lng, resolve via RPC
  if (params.zip && (!lat || !lng)) {
    const { data: coords } = await supabase.rpc("get_zip_coordinates", {
      p_zip: params.zip,
    })
    if (coords && coords.length > 0 && coords[0].lat && coords[0].lng) {
      lat = coords[0].lat
      lng = coords[0].lng
      proximityLabel = params.zip
    }
  }

  // Default to New York City when no location or filters are set
  const hasAnyFilters = params.state || params.city || params.tag || params.q || params.zip || params.near || params.lat || params.lng
  const isDefaultNYC = !hasAnyFilters
  if (isDefaultNYC && !lat && !lng) {
    lat = 40.7128
    lng = -74.006
    proximityLabel = "New York City"
  }

  // Proximity search path — triggered by zip, geolocation, or default NYC
  if (lat && lng && (params.zip || params.near || isDefaultNYC)) {
    isProximitySearch = true
    if (!proximityLabel) {
      proximityLabel = params.near === "me" ? "your location" : `${lat.toFixed(2)}, ${lng.toFixed(2)}`
    }

    const { data: results } = await supabase.rpc("search_clinics_nearby", {
      p_lat: lat,
      p_lng: lng,
      p_radius_miles: radius,
      p_state: params.state || null,
      p_tag: params.tag || null,
      p_search: params.q || null,
      p_limit: PAGE_SIZE,
      p_offset: from,
    })

    if (results && results.length > 0) {
      clinics = results
      totalCount = Number(results[0].total_count) || 0
    }

    // When a text search narrows proximity results to few matches,
    // fetch more nearby clinics WITHOUT the text filter so the user
    // can discover other clinics in the area.
    if (params.q && clinics.length < 12 && page === 1) {
      const matchedIds = clinics.map((c) => c.id)
      const { data: nearby } = await supabase.rpc("search_clinics_nearby", {
        p_lat: lat,
        p_lng: lng,
        p_radius_miles: radius,
        p_state: params.state || null,
        p_tag: params.tag || null,
        p_search: null, // no text filter
        p_limit: PAGE_SIZE,
        p_offset: 0,
      })

      if (nearby && nearby.length > 0) {
        moreNearbyClinics = (nearby as ClinicRow[])
          .filter((c) => !matchedIds.includes(c.id))
        moreNearbyLabel = `More Clinics Near ${proximityLabel}`
      }
    }
  } else {
    // Standard query path
    let query = supabase
      .from("clinics")
      .select(
        "id, name, slug, city, state, country, phone, website, description, tags, photos",
        { count: "exact" }
      )
      .eq("is_active", true)
      .eq("is_draft", false)

    // Multi-field search: name, city, state, zip, description
    if (params.q) {
      const q = params.q.trim()
      query = query.or(
        `name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%,zip_code.ilike.%${q}%,description.ilike.%${q}%`
      )
    }

    if (params.state) {
      query = query.eq("state", params.state)
    }

    if (params.city) {
      query = query.ilike("city", `%${params.city}%`)
    }

    if (params.tag) {
      query = query.contains("tags", [params.tag])
    }

    // Sort alphabetically by name
    query = query
      .order("name", { ascending: true })
      .range(from, to)

    const { data, count } = await query
    clinics = data || []
    totalCount = count || 0

    // When a text search returns few results, find more clinics near the
    // matched results so the user can discover other clinics in the area.
    if (params.q && clinics.length > 0 && clinics.length < 12 && page === 1) {
      // Get lat/lng of the first matched clinic to use as the anchor point
      const firstMatch = clinics[0]
      const { data: anchor } = await supabase
        .from("clinics")
        .select("latitude, longitude, city, state")
        .eq("id", firstMatch.id)
        .single()

      if (anchor?.latitude && anchor?.longitude) {
        const matchedIds = clinics.map((c) => c.id)
        const { data: nearby } = await supabase.rpc("search_clinics_nearby", {
          p_lat: anchor.latitude,
          p_lng: anchor.longitude,
          p_radius_miles: 50,
          p_state: null,
          p_tag: params.tag || null,
          p_search: null, // no text filter — show all nearby
          p_limit: PAGE_SIZE,
          p_offset: 0,
        })

        if (nearby && nearby.length > 0) {
          moreNearbyClinics = (nearby as ClinicRow[])
            .filter((c) => !matchedIds.includes(c.id))
          const areaName = [anchor.city, anchor.state].filter(Boolean).join(", ")
          moreNearbyLabel = areaName
            ? `More Clinics Near ${areaName}`
            : "More Nearby Clinics"
        }
      }
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Fetch distinct states via RPC (efficient — returns only distinct values with counts)
  const { data: statesData } = await supabase.rpc("get_clinic_states")
  const states = ((statesData || []) as { state: string; clinic_count: number }[]).map((s) => s.state)

  // Fetch cities for currently selected state (if any)
  let cities: { city: string; clinic_count: number }[] = []
  if (params.state) {
    const { data: citiesData } = await supabase.rpc("get_clinic_cities", {
      p_state: params.state,
    })
    cities = (citiesData || []) as { city: string; clinic_count: number }[]
  }

  // Fetch all tags with counts via RPC
  const { data: tagsData } = await supabase.rpc("get_clinic_tags_count")
  const allTags = (tagsData || []) as { tag: string; count: number }[]

  const hasFilters = params.state || params.tag || params.q || params.city || params.zip || params.radius || params.near

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
                Longevity Clinics
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                Find longevity, anti-aging, and functional medicine clinics near you.
                Search {heroTotal.toLocaleString()} locations across the US.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {/* Geolocation auto-detect */}
        <Suspense>
          <GeoRedirect />
        </Suspense>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-16" />}>
            <ClinicFilters states={states} cities={cities} allTags={allTags} />
          </Suspense>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalCount.toLocaleString()} clinic{totalCount !== 1 ? "s" : ""} found
            {isProximitySearch && !isDefaultNYC && (
              <span> within {radius} miles of {proximityLabel}</span>
            )}
            {isDefaultNYC && (
              <span> near New York City</span>
            )}
          </p>
          {hasFilters && (
            <a href="/clinics" className="text-sm text-primary hover:underline">
              Clear filters
            </a>
          )}
        </div>

        {/* Grid */}
        {clinics && clinics.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                distance={clinic.distance_miles}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No clinics found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isProximitySearch
                ? `Try increasing the search radius or searching a different zip code.`
                : `Try adjusting your filters or search terms.`}
            </p>
          </div>
        )}

        {/* More clinics nearby — shown when text search returns few matches */}
        {moreNearbyClinics.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-lg font-semibold mb-1">
              {moreNearbyLabel}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Other clinics in the area
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreNearbyClinics.map((clinic) => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  distance={clinic.distance_miles}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <a
                href={`/clinics?${buildQueryString(params, page - 1)}`}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted transition"
              >
                Previous
              </a>
            )}

            <span className="px-4 py-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            {page < totalPages && (
              <a
                href={`/clinics?${buildQueryString(params, page + 1)}`}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted transition"
              >
                Next
              </a>
            )}
          </div>
        )}

        {/* State links for SEO */}
        {states.length > 0 && !params.state && !isProximitySearch && (
          <div className="mt-16 border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Browse by State</h2>
            <div className="flex flex-wrap gap-2">
              {states.map((state) => (
                <a
                  key={state}
                  href={`/clinics/state/${encodeURIComponent(state.toLowerCase())}`}
                  className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-muted transition"
                >
                  {state}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function buildQueryString(
  params: Record<string, string | undefined>,
  page: number
): string {
  const qs = new URLSearchParams()
  if (params.state) qs.set("state", params.state)
  if (params.city) qs.set("city", params.city)
  if (params.tag) qs.set("tag", params.tag)
  if (params.q) qs.set("q", params.q)
  if (params.zip) qs.set("zip", params.zip)
  if (params.radius) qs.set("radius", params.radius)
  if (params.lat) qs.set("lat", params.lat)
  if (params.lng) qs.set("lng", params.lng)
  if (params.near) qs.set("near", params.near)
  if (page > 1) qs.set("page", String(page))
  return qs.toString()
}
