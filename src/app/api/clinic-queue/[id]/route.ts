import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/clinic-queue/[id]
 *
 * Update a queue item. Allowed fields: status, email, perplexity_status, perplexity_searched_at.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = ["status", "email", "perplexity_status", "perplexity_searched_at"]
    const updateData: Record<string, unknown> = {}

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("clinic_queue")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating queue item:", error)
      return NextResponse.json(
        { error: `Failed to update queue item: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/clinic-queue/[id]
 *
 * Delete a queue item by ID.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("clinic_queue")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting queue item:", error)
      return NextResponse.json(
        { error: `Failed to delete queue item: ${error.message}` },
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
