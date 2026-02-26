import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/outreach-campaigns/[id]/recipients
// Paginated list of recipients with optional status filter
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10)))
    const status = searchParams.get("status")
    const search = searchParams.get("search")?.trim() ?? ""

    let query = supabase
      .from("outreach_campaign_recipients")
      .select("*", { count: "exact" })
      .eq("outreach_campaign_id", id)

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(
        `recipient_email.ilike.%${search}%,recipient_practice_name.ilike.%${search}%`
      )
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order("created_at", { ascending: true })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      recipients: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    })
  } catch (err) {
    console.error("Error fetching outreach campaign recipients:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/outreach-campaigns/[id]/recipients
// Bulk approve all generated recipients
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { action } = body

    if (action === "approve_all") {
      const { error } = await supabase
        .from("outreach_campaign_recipients")
        .update({ status: "approved", approved: true })
        .eq("outreach_campaign_id", id)
        .eq("status", "generated")

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("Error bulk-updating outreach recipients:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
