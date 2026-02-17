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
  "Google Place ID",
  "Google Rating",
  "Reviews Count",
  "Tags",
  "Latitude",
  "Longitude",
  "Is Active",
  "Is Featured",
]

const CHUNK_SIZE = 1000

/**
 * GET /api/clinics/export
 *
 * Export clinics as a CSV file with optional filtering.
 *
 * Query params:
 *   - search: Search by clinic name
 *   - state: Filter by state
 *   - active: Filter by active status (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const state = searchParams.get("state")
    const active = searchParams.get("active")

    // Fetch all matching clinics in chunks using .range()
    const allRows: Record<string, unknown>[] = []
    let offset = 0
    let hasMore = true

    while (hasMore) {
      let query = supabase
        .from("clinics")
        .select("*")

      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      if (state) {
        query = query.eq("state", state)
      }

      if (active !== null && active !== undefined) {
        query = query.eq("is_active", active === "true")
      }

      query = query
        .order("name", { ascending: true })
        .range(offset, offset + CHUNK_SIZE - 1)

      const { data, error } = await query

      if (error) {
        console.error("Error fetching clinics for export:", error)
        return NextResponse.json(
          { error: "Failed to export clinics" },
          { status: 500 }
        )
      }

      if (!data || data.length === 0) {
        hasMore = false
      } else {
        allRows.push(...data)
        offset += CHUNK_SIZE
        if (data.length < CHUNK_SIZE) {
          hasMore = false
        }
      }
    }

    // Build CSV content
    const lines: string[] = [CSV_HEADERS.map(escapeCsv).join(",")]

    for (const row of allRows) {
      const tags = Array.isArray(row.tags) ? (row.tags as string[]).join("; ") : ""
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
        row.google_place_id,
        row.google_rating,
        row.reviews_count,
        tags,
        row.latitude,
        row.longitude,
        row.is_active,
        row.is_featured,
      ]
      lines.push(values.map(escapeCsv).join(","))
    }

    const csv = lines.join("\n")
    const today = new Date().toISOString().split("T")[0]

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clinics-export-${today}.csv"`,
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
