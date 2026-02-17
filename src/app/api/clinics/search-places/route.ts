import { createClient } from "@/lib/supabase/server"
import { googlePlacesService } from "@/lib/services/google-places"
import { NextRequest, NextResponse } from "next/server"

// Allow up to 5 minutes for deep searches
export const maxDuration = 300

/**
 * POST /api/clinics/search-places
 *
 * Search Google Places for clinics and insert new results into clinic_queue.
 * Auto-paginates through all available pages (up to 3 pages / ~60 results per query).
 *
 * When a place already exists in the queue, its search_tag is updated to include
 * the new tag (comma-separated) so all matching tags accumulate.
 *
 * Body:
 *   - tag: string — search category tag (e.g. "longevity clinic")
 *   - location: string — geographic scope (e.g. "Austin, TX")
 *
 * Deduplicates against both the `clinics` table and `clinic_queue` table
 * using the google_place_id field.
 *
 * Returns: { inserted: number, skipped: number, tagsMerged: number, pagesSearched: number }
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
    const { tag, location } = body

    if (!tag || !location) {
      return NextResponse.json(
        { error: "Both 'tag' and 'location' are required" },
        { status: 400 }
      )
    }

    const query = `"${tag}" near ${location}`
    const supabase = await createClient()

    let totalInserted = 0
    let totalSkipped = 0
    let totalTagsMerged = 0
    let pagesSearched = 0
    let currentPageToken: string | undefined = undefined
    const maxPages = 3 // Google Places returns up to 3 pages

    // Auto-paginate through all available pages
    for (let page = 0; page < maxPages; page++) {
      const { places, nextPageToken } = await googlePlacesService.textSearch(
        query,
        currentPageToken
      )

      pagesSearched++

      if (places.length === 0) break

      // Collect all google_place_ids from results for dedup lookup
      const placeIds = places.map((p) => p.id)

      // Check existing clinics (these are fully skipped — already imported)
      const { data: existingClinics } = await supabase
        .from("clinics")
        .select("google_place_id")
        .in("google_place_id", placeIds)

      const existingClinicIds = new Set(
        (existingClinics || []).map((c) => c.google_place_id)
      )

      // Check existing queue entries — fetch their current tags so we can merge
      const { data: existingQueue } = await supabase
        .from("clinic_queue")
        .select("id, google_place_id, search_tag")
        .in("google_place_id", placeIds)

      const existingQueueMap = new Map(
        (existingQueue || []).map((q) => [q.google_place_id, { id: q.id, search_tag: q.search_tag }])
      )

      // Separate into: new places, places already in queue (merge tags), already imported (skip)
      const newPlaces = []
      const toMerge = []

      for (const place of places) {
        if (existingClinicIds.has(place.id)) {
          totalSkipped++
          continue
        }

        const queueEntry = existingQueueMap.get(place.id)
        if (queueEntry) {
          // Already in queue — check if this tag is new
          const existingTags = queueEntry.search_tag.split(", ").map((t: string) => t.trim())
          if (!existingTags.includes(tag)) {
            toMerge.push({
              id: queueEntry.id,
              newTag: [...existingTags, tag].join(", "),
            })
          } else {
            totalSkipped++
          }
          continue
        }

        newPlaces.push(place)
      }

      // Merge tags for existing queue entries
      for (const item of toMerge) {
        const { error } = await supabase
          .from("clinic_queue")
          .update({ search_tag: item.newTag })
          .eq("id", item.id)

        if (!error) {
          totalTagsMerged++
        }
      }

      if (newPlaces.length > 0) {
        // Map to queue data and insert
        const queueRows = newPlaces.map((place) =>
          googlePlacesService.mapToQueueData(place, tag, location, query)
        )

        const { data: inserted, error } = await supabase
          .from("clinic_queue")
          .insert(queueRows)
          .select("id")

        if (error) {
          console.error(`Error inserting page ${page + 1} into clinic_queue:`, error)
          // Continue to next page even if insert fails
        } else {
          totalInserted += inserted?.length || 0
        }
      }

      // Stop if no more pages
      if (!nextPageToken) break

      currentPageToken = nextPageToken

      // Small delay between pages to be nice to the API
      await new Promise((r) => setTimeout(r, 300))
    }

    return NextResponse.json({
      inserted: totalInserted,
      skipped: totalSkipped,
      tagsMerged: totalTagsMerged,
      pagesSearched,
    })
  } catch (error) {
    console.error("Unexpected error in search-places:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
