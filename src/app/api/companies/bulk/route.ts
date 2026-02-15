import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * PATCH /api/companies/bulk
 *
 * Bulk update companies. Currently supports toggling is_draft (visibility).
 *
 * Body: { ids: string[], updates: { is_draft?: boolean } }
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { ids, updates } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "updates must be an object" },
        { status: 400 }
      )
    }

    // Only allow safe fields for bulk update
    const allowedFields = ["is_draft"]
    const safeUpdates: Record<string, unknown> = {}
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        safeUpdates[key] = updates[key]
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("companies")
      .update(safeUpdates)
      .in("id", ids)
      .select("id")

    if (error) {
      console.error("Error bulk updating companies:", error)
      return NextResponse.json(
        { error: `Failed to update companies: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updatedCount: data?.length || 0,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
