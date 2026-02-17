import { createClient } from "@/lib/supabase/server"
import { googlePlacesService } from "@/lib/services/google-places"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/clinics/search-places
 *
 * Search Google Places for clinics and insert new results into clinic_queue.
 *
 * Body:
 *   - tag: string — search category tag (e.g. "longevity clinic")
 *   - location: string — geographic scope (e.g. "Austin, TX")
 *   - pageToken?: string — continuation token for paginated results
 *
 * Deduplicates against both the `clinics` table and `clinic_queue` table
 * using the google_place_id field.
 *
 * Returns: { inserted: number, skipped: number, nextPageToken: string | null }
 */
export async function POST(request: NextRequest) {
  try {
    if (!googlePlacesService.isConfigured()) {
      return NextResponse.json(
        { error: "Google Places API is not configured" },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { tag, location, pageToken } = body

    if (!tag || !location) {
      return NextResponse.json(
        { error: "Both 'tag' and 'location' are required" },
        { status: 400 }
      )
    }

    const query = `"${tag}" near ${location}`

    // Search Google Places
    const { places, nextPageToken } = await googlePlacesService.textSearch(query, pageToken)

    if (places.length === 0) {
      return NextResponse.json({
        inserted: 0,
        skipped: 0,
        nextPageToken: null,
      })
    }

    const supabase = await createClient()

    // Collect all google_place_ids from results for dedup lookup
    const placeIds = places.map((p) => p.id)

    // Check existing clinics
    const { data: existingClinics } = await supabase
      .from("clinics")
      .select("google_place_id")
      .in("google_place_id", placeIds)

    const existingClinicIds = new Set(
      (existingClinics || []).map((c) => c.google_place_id)
    )

    // Check existing queue entries
    const { data: existingQueue } = await supabase
      .from("clinic_queue")
      .select("google_place_id")
      .in("google_place_id", placeIds)

    const existingQueueIds = new Set(
      (existingQueue || []).map((q) => q.google_place_id)
    )

    // Filter to only new places
    const newPlaces = places.filter(
      (p) => !existingClinicIds.has(p.id) && !existingQueueIds.has(p.id)
    )

    const skipped = places.length - newPlaces.length

    if (newPlaces.length === 0) {
      return NextResponse.json({
        inserted: 0,
        skipped,
        nextPageToken: nextPageToken || null,
      })
    }

    // Map to queue data and insert
    const queueRows = newPlaces.map((place) =>
      googlePlacesService.mapToQueueData(place, tag, location, query)
    )

    const { data: inserted, error } = await supabase
      .from("clinic_queue")
      .insert(queueRows)
      .select("id")

    if (error) {
      console.error("Error inserting into clinic_queue:", error)
      return NextResponse.json(
        { error: `Failed to insert into queue: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      inserted: inserted?.length || 0,
      skipped,
      nextPageToken: nextPageToken || null,
    })
  } catch (error) {
    console.error("Unexpected error in search-places:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
