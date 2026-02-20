import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/company-queue/reject
 *
 * Reject selected queue items.
 *
 * Body: { ids: string[] }
 * Response: { processed }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("company_queue")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .in("id", ids)
      .select("id")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ processed: data?.length || 0 })
  } catch (error) {
    console.error("[company-queue/reject]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
