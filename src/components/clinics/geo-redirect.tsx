"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin } from "lucide-react"

/**
 * On first visit to /clinics (no location params), attempts to detect the
 * user's location via the browser Geolocation API. If granted, redirects
 * to /clinics?lat=X&lng=Y&radius=25&near=me so the server renders
 * proximity-sorted results.
 *
 * Shows nothing if geolocation was already applied, denied, or unavailable.
 * Stores denial in sessionStorage so the prompt doesn't reappear.
 */
export function GeoRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [detecting, setDetecting] = useState(false)

  // Already has location params — nothing to do
  const hasLocationParams =
    searchParams.has("lat") ||
    searchParams.has("lng") ||
    searchParams.has("zip") ||
    searchParams.has("near")

  useEffect(() => {
    if (hasLocationParams) return
    if (typeof window === "undefined") return
    if (!navigator.geolocation) return

    // Don't re-prompt if user already dismissed this session
    if (sessionStorage.getItem("geo-dismissed")) return

    setDetecting(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Preserve any existing filters (state, tag, q, etc.)
        const params = new URLSearchParams(searchParams.toString())
        params.set("lat", latitude.toFixed(4))
        params.set("lng", longitude.toFixed(4))
        params.set("near", "me")
        if (!params.has("radius")) {
          params.set("radius", "25")
        }
        router.replace(`/clinics?${params.toString()}`)
        setDetecting(false)
      },
      () => {
        // Denied or error — remember so we don't ask again this session
        sessionStorage.setItem("geo-dismissed", "1")
        setDetecting(false)
      },
      { timeout: 8000, maximumAge: 300000 } // 8s timeout, cache for 5 min
    )
  }, [hasLocationParams, router, searchParams])

  if (detecting) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm text-muted-foreground animate-pulse">
        <MapPin className="h-4 w-4" />
        Detecting your location…
      </div>
    )
  }

  return null
}
