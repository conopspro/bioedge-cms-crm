import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Escape a value for CSV output.
 * Wraps the field in double quotes if it contains commas, double quotes, or newlines.
 * Any embedded double quotes are escaped by doubling them.
 */
function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const CSV_HEADERS = [
  "Name",
  "Address",
  "City",
  "State",
  "Zip Code",
  "Country",
  "Phone",
  "Email",
  "Website",
  "Google Rating",
  "Reviews Count",
  "Tags",
  "Is Featured",
  "Is Active",
  "Google Place ID",
  "Latitude",
  "Longitude",
]

const CHUNK_SIZE = 1000

/**
 * GET /api/clinics/export
 *
 * Export clinics as a CSV file with full filtering support matching
 * the clinic campaign recipient search filters.
 *
 * Query params:
 *   - search:      Search by clinic name (ILIKE)
 *   - state:       Filter by single state
 *   - states:      Filter by multiple states (comma-separated)
 *   - cities:      Filter by multiple cities (comma-separated)
 *   - tags:        Filter by tags overlap (comma-separated)
 *   - has_email:   "true" = only clinics with email
 *   - min_rating:  Minimum Google rating (e.g. "4.0")
 *   - featured:    "true" = only featured clinics
 *   - active:      "true"/"false" = filter by active status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search    = searchParams.get("search")
    const state     = searchParams.get("state")
    const states    = searchParams.get("states")
    const cities    = searchParams.get("cities")
    const tags      = searchParams.get("tags")
    const hasEmail  = searchParams.get("has_email")
    const minRating = searchParams.get("min_rating")
    const featured  = searchParams.get("featured")
    const active    = searchParams.get("active")

    // Build filter arrays
    const stateList  = states  ? states.split(",").map(s => s.trim()).filter(Boolean) : []
    const cityList   = cities  ? cities.split(",").map(c => c.trim()).filter(Boolean) : []
    const tagList    = tags    ? tags.split(",").map(t => t.trim()).filter(Boolean)   : []

    // Fetch all matching clinics in chunks
    const allRows: Record<string, unknown>[] = []
    let offset = 0
    let hasMore = true

    while (hasMore) {
      let query = supabase
        .from("clinics")
        .select("name, address, city, state, zip_code, country, phone, email, website, google_rating, reviews_count, tags, is_featured, is_active, google_place_id, latitude, longitude")

      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      // Single state (legacy) or multi-state
      if (stateList.length > 0) {
        query = query.in("state", stateList)
      } else if (state) {
        query = query.eq("state", state)
      }

      if (cityList.length > 0) {
        query = query.in("city", cityList)
      }

      if (tagList.length > 0) {
        query = query.overlaps("tags", tagList)
      }

      if (hasEmail === "true") {
        query = query.not("email", "is", null).neq("email", "")
      }

      if (minRating) {
        const rating = parseFloat(minRating)
        if (!isNaN(rating)) query = query.gte("google_rating", rating)
      }

      if (featured === "true") {
        query = query.eq("is_featured", true)
      }

      if (active !== null && active !== undefined && active !== "") {
        query = query.eq("is_active", active === "true")
      }

      query = query
        .order("state", { ascending: true })
        .order("name",  { ascending: true })
        .range(offset, offset + CHUNK_SIZE - 1)

      const { data, error } = await query

      if (error) {
        console.error("Error fetching clinics for export:", error)
        return NextResponse.json({ error: "Failed to export clinics" }, { status: 500 })
      }

      if (!data || data.length === 0) {
        hasMore = false
      } else {
        allRows.push(...data)
        offset += CHUNK_SIZE
        if (data.length < CHUNK_SIZE) hasMore = false
      }
    }

    // Build CSV
    const lines: string[] = [CSV_HEADERS.map(escapeCsv).join(",")]

    for (const row of allRows) {
      const tagStr = Array.isArray(row.tags) ? (row.tags as string[]).join("; ") : ""
      const values = [
        row.name,
        row.address,
        row.city,
        row.state,
        row.zip_code,
        row.country,
        row.phone,
        row.email,
        row.website,
        row.google_rating,
        row.reviews_count,
        tagStr,
        row.is_featured ? "Yes" : "No",
        row.is_active   ? "Yes" : "No",
        row.google_place_id,
        row.latitude,
        row.longitude,
      ]
      lines.push(values.map(escapeCsv).join(","))
    }

    const csv  = lines.join("\n")
    const today = new Date().toISOString().split("T")[0]
    const count = allRows.length

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clinics-export-${today}-${count}.csv"`,
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
