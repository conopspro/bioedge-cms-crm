import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import type { ContactInsert } from "@/types/database"

/**
 * GET /api/contacts
 *
 * Fetch all contacts with optional filtering.
 *
 * Query params:
 * - company_id: Filter by company
 * - status: Filter by outreach status
 * - search: Search by name or email
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)

    const companyId = searchParams.get("company_id")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const showOnArticles = searchParams.get("show_on_articles")

    // Build query with company join
    // Note: Must specify foreign key due to multiple relationships between contacts and companies
    let query = supabase
      .from("contacts")
      .select(`
        *,
        company:companies!contacts_company_id_fkey(id, name)
      `)

    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    if (status) {
      query = query.eq("outreach_status", status)
    }

    // Filter for published/visible contacts (leaders)
    if (showOnArticles === "true") {
      query = query.eq("show_on_articles", true)
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
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
 * POST /api/contacts
 *
 * Create a new contact.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body: ContactInsert = await request.json()

    // Debug logging - omit sensitive fields in production
    if (process.env.NODE_ENV === "development") {
      const { email, phone, ...safeBody } = body
      console.log("Creating contact with data:", JSON.stringify({ ...safeBody, email: email ? "[REDACTED]" : undefined, phone: phone ? "[REDACTED]" : undefined }, null, 2))
    }

    // Validate required fields
    if (!body.company_id) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 }
      )
    }
    if (!body.first_name || !body.last_name) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 }
      )
    }
    // Build insert data with explicit fields matching the database schema
    const contactData: Record<string, unknown> = {
      company_id: body.company_id,
      name: `${body.first_name} ${body.last_name}`.trim(),
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email || null,
      phone: body.phone || null,
      title: body.title || null,
      linkedin_url: body.linkedin_url || null,
      youtube_channel_url: body.youtube_channel_url || null,
      notes: body.notes || null,
      source: body.source || "manual",
      outreach_status: body.outreach_status || "not_contacted",
      show_on_articles: body.show_on_articles || false,
      bio: body.bio || null,
      avatar_url: body.avatar_url || null,
    }

    const { data, error } = await supabase
      .from("contacts")
      .insert(contactData)
      .select(`
        *,
        company:companies!contacts_company_id_fkey(id, name)
      `)
      .single()

    if (error) {
      console.error("Error creating contact:", error)
      // Check for duplicate email constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A contact with this email already exists" },
          { status: 409 }
        )
      }
      // Return generic error to avoid leaking database schema details
      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
