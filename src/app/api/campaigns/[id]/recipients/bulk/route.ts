import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * DELETE /api/campaigns/[id]/recipients/bulk
 *
 * Bulk delete multiple recipients from a campaign.
 *
 * Body: { recipientIds: string[] }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { recipientIds } = body

    if (
      !recipientIds ||
      !Array.isArray(recipientIds) ||
      recipientIds.length === 0
    ) {
      return NextResponse.json(
        { error: "recipientIds array is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("campaign_recipients")
      .delete()
      .eq("campaign_id", campaignId)
      .in("id", recipientIds)

    if (error) {
      console.error("Error bulk deleting recipients:", error)
      return NextResponse.json(
        { error: "Failed to delete recipients" },
        { status: 500 }
      )
    }

    return NextResponse.json({ deleted: recipientIds.length })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
