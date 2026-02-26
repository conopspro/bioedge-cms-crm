import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/outreach-contacts
// Paginated list with optional filters.
// Server-side pagination required for 200K+ row scale.
//
// Query params:
//   page         number (default 1)
//   pageSize     number (default 50, max 200)
//   search       string (email or practice_name partial match)
//   businessType string (exact match on business_type column)
//   state        string (exact match on state column)
//   engagement   'any' | 'opened' | 'clicked'
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10)))
    const search = searchParams.get("search")?.trim() ?? ""
    const businessType = searchParams.get("businessType")?.trim() ?? ""
    const state = searchParams.get("state")?.trim() ?? ""
    const engagement = searchParams.get("engagement") ?? "any"

    let query = supabase
      .from("outreach_contacts")
      .select("*", { count: "exact" })

    // Filters
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,practice_name.ilike.%${search}%`
      )
    }

    if (businessType) {
      query = query.eq("business_type", businessType)
    }

    if (state) {
      query = query.eq("state", state)
    }

    if (engagement === "clicked") {
      query = query.gt("total_clicks", 0)
    } else if (engagement === "opened") {
      query = query.gt("total_opens", 0)
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("Error fetching outreach contacts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      contacts: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    })
  } catch (err) {
    console.error("Unexpected error fetching outreach contacts:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/outreach-contacts
// Bulk-delete contacts by ID.
// Body: { ids: string[] }
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const ids: string[] = Array.isArray(body.ids) ? body.ids : []

    if (ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("outreach_contacts")
      .delete()
      .in("id", ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ deleted: ids.length })
  } catch (err) {
    console.error("Unexpected error deleting outreach contacts:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/outreach-contacts
// Bulk-update business_type on multiple contacts.
// Body: { ids: string[], business_type: string | null }
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const ids: string[] = Array.isArray(body.ids) ? body.ids : []
    const business_type: string | null =
      typeof body.business_type === "string" && body.business_type.trim()
        ? body.business_type.trim()
        : null

    if (ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("outreach_contacts")
      .update({ business_type })
      .in("id", ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ updated: ids.length })
  } catch (err) {
    console.error("Unexpected error updating outreach contacts:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/outreach-contacts
// Create a single contact
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { email, ...rest } = body

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 })
    }

    const emailNormalized = email.trim().toLowerCase()

    const { data, error } = await supabase
      .from("outreach_contacts")
      .insert({
        email: emailNormalized,
        first_name: rest.first_name || null,
        last_name: rest.last_name || null,
        practice_name: rest.practice_name || null,
        title: rest.title || null,
        business_type: rest.business_type || null,
        city: rest.city || null,
        state: rest.state || null,
        website: rest.website || null,
        phone: rest.phone || null,
        notes: rest.notes || null,
        total_opens: rest.total_opens ?? 0,
        total_clicks: rest.total_clicks ?? 0,
        source_file: rest.source_file || null,
        imported_at: rest.imported_at || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A contact with this email already exists" },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contact: data }, { status: 201 })
  } catch (err) {
    console.error("Unexpected error creating outreach contact:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
