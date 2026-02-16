import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/clinics/cities?state=California
 * Returns distinct cities with clinic counts for a given state.
 * Used by the filter component to dynamically populate the city dropdown.
 */
export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")

  if (!state) {
    return NextResponse.json({ data: [] })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_clinic_cities", {
    p_state: state,
  })

  if (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: data || [] })
}
