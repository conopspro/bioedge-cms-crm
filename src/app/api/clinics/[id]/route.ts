import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/clinics/[id]
 *
 * Fetch a single clinic by ID with its contacts.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: clinic, error } = await supabase
      .from("clinics")
      .select(`
        *,
        clinic_contacts (id, clinic_id, name, email, phone, created_at)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Clinic not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching clinic:", error)
      return NextResponse.json(
        { error: "Failed to fetch clinic" },
        { status: 500 }
      )
    }

    return NextResponse.json(clinic)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/clinics/[id]
 *
 * Update a clinic by ID.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Allowed fields for update
    const allowedFields = [
      "name", "slug", "address", "city", "state", "zip_code", "country",
      "latitude", "longitude", "metro_area", "google_maps_url", "google_place_id",
      "phone", "phone_formatted", "email", "website", "domain",
      "description", "tags", "search_term",
      "google_rating", "reviews_count",
      "photos", "videos", "custom_urls",
      "facebook", "instagram", "linkedin", "youtube", "twitter", "tiktok", "threads",
      "is_featured", "is_active", "is_draft",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("clinics")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Clinic not found" },
          { status: 404 }
        )
      }
      console.error("Error updating clinic:", error)
      return NextResponse.json(
        { error: `Failed to update clinic: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clinics/[id]
 *
 * Delete a clinic by ID. Cascades to clinic_contacts.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("clinics")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting clinic:", error)
      return NextResponse.json(
        { error: "Failed to delete clinic" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
