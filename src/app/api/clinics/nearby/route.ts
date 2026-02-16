import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/clinics/nearby
 *
 * Two modes:
 *
 * 1. City mode (default):
 *    ?city=Louisville&state=KY&exclude=uuid&offset=0&limit=24
 *    Returns clinics in the same city, sorted alphabetically.
 *
 * 2. Proximity mode (when lat/lng/radius provided):
 *    ?lat=38.25&lng=-85.76&radius=50&exclude=uuid&offset=0&limit=24
 *    Returns clinics within radius miles, sorted by distance.
 *    Uses the search_clinics_nearby RPC (Haversine with bounding box).
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const lat = params.get("lat")
  const lng = params.get("lng")
  const radius = params.get("radius")
  const city = params.get("city")
  const state = params.get("state")
  const exclude = params.get("exclude") // single clinic ID to skip
  const offset = parseInt(params.get("offset") || "0", 10)
  const limit = parseInt(params.get("limit") || "24", 10)

  const supabase = await createClient()

  // --- Proximity mode ---
  if (lat && lng && radius) {
    const p_lat = parseFloat(lat)
    const p_lng = parseFloat(lng)
    const p_radius = parseFloat(radius)

    if (isNaN(p_lat) || isNaN(p_lng) || isNaN(p_radius)) {
      return NextResponse.json({ data: [], total: 0 })
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "search_clinics_nearby",
      {
        p_lat,
        p_lng,
        p_radius_miles: p_radius,
        p_state: null,
        p_tag: null,
        p_search: null,
        p_limit: limit,
        p_offset: offset,
      }
    )

    if (rpcError) {
      console.error("Error fetching proximity clinics:", rpcError)
      return NextResponse.json(
        { error: "Failed to fetch clinics" },
        { status: 500 }
      )
    }

    // The RPC returns total_count on each row
    const total = rpcData?.[0]?.total_count || 0

    // Filter out the excluded clinic
    let results = rpcData || []
    if (exclude) {
      results = results.filter(
        (c: { id: string }) => c.id !== exclude
      )
    }

    return NextResponse.json({
      data: results,
      total: exclude ? Math.max(0, Number(total) - 1) : Number(total),
    })
  }

  // --- City mode ---
  if (!city) {
    return NextResponse.json({ data: [], total: 0 })
  }

  let query = supabase
    .from("clinics")
    .select(
      "id, name, slug, city, state, country, phone, website, description, tags, photos",
      { count: "exact" }
    )
    .eq("city", city)
    .eq("is_active", true)
    .eq("is_draft", false)

  if (state) {
    query = query.eq("state", state)
  }

  // Exclude the current clinic
  if (exclude) {
    query = query.neq("id", exclude)
  }

  query = query
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    console.error("Error fetching nearby clinics:", error)
    return NextResponse.json(
      { error: "Failed to fetch clinics" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
  })
}
