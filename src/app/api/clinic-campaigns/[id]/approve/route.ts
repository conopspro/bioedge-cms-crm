import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/clinic-campaigns/[id]/approve
 *
 * Bulk approve or reject generated clinic emails.
 *
 * Body: { recipientIds: string[], approved: boolean }
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { recipientIds, approved } = body

    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json(
        { error: "recipientIds array is required" },
        { status: 400 }
      )
    }

    const newStatus = approved ? "approved" : "generated"

    const { data, error } = await supabase
      .from("clinic_campaign_recipients")
      .update({
        approved,
        status: newStatus,
      })
      .eq("clinic_campaign_id", campaignId)
      .in("id", recipientIds)
      .in("status", ["generated", "approved"]) // Only update generated or approved
      .select()

    if (error) {
      console.error("Error updating approval:", error)
      return NextResponse.json(
        { error: "Failed to update approval status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      updated: data?.length || 0,
      approved,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
