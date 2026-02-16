import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/contacts/search
 *
 * Search and filter contacts with full filter support.
 * Campaign-agnostic version of the available-contacts API —
 * no campaign ID required, no cooldown warnings.
 *
 * Query params:
 * - search: Search name, email
 * - company_ids: Comma-separated list of company IDs (preferred for 2-step flow)
 * - company_id: Filter by single company
 * - category: Filter by company category slug
 * - edge_category: Filter by EDGE framework category
 * - status: Filter by outreach_status
 * - seniority: Filter by contact seniority
 * - title_search: Filter by title keyword
 * - has_email: Only contacts with email (default true)
 * - event_id: Filter by companies that attended an event
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const companyIds = searchParams.get("company_ids")
    const companyId = searchParams.get("company_id")
    const category = searchParams.get("category")
    const edgeCategory = searchParams.get("edge_category")
    const outreachStatus = searchParams.get("status")
    const seniority = searchParams.get("seniority")
    const titleSearch = searchParams.get("title_search")
    const hasEmail = searchParams.get("has_email") !== "false"
    const eventId = searchParams.get("event_id")

    // Determine company ID filter
    let companyIdFilter: string[] | null = null

    // Option A: Explicit list of company IDs (2-step flow from frontend)
    if (companyIds) {
      companyIdFilter = companyIds.split(",").filter(Boolean)
      if (companyIdFilter.length === 0) {
        return NextResponse.json({ contacts: [] })
      }
    }

    // Option B: Single company ID
    if (companyId && companyId !== "all") {
      companyIdFilter = companyIdFilter
        ? companyIdFilter.filter((id) => id === companyId)
        : [companyId]
    }

    // Option C: Filter by event (get company IDs from event_companies)
    if (eventId && eventId !== "all") {
      const { data: eventCompanies } = await supabase
        .from("event_companies")
        .select("company_id")
        .eq("event_id", eventId)

      const eventIds = (eventCompanies || []).map((ec) => ec.company_id)
      if (eventIds.length === 0) {
        return NextResponse.json({ contacts: [] })
      }
      companyIdFilter = companyIdFilter
        ? companyIdFilter.filter((id) => eventIds.includes(id))
        : eventIds
    }

    // Option D: Filter by category or edge_category (get company IDs)
    if (
      (category && category !== "all") ||
      (edgeCategory && edgeCategory !== "all")
    ) {
      let companyQuery = supabase.from("companies").select("id")

      if (category && category !== "all") {
        companyQuery = companyQuery.eq("category", category)
      }

      if (edgeCategory && edgeCategory !== "all") {
        companyQuery = companyQuery.contains("edge_categories", [edgeCategory])
      }

      const { data: filteredCompanies, error: companyFilterError } =
        await companyQuery
      if (companyFilterError) {
        console.error(
          "Error filtering companies by category/edge:",
          companyFilterError.message,
          companyFilterError.details
        )
      }
      const categoryIds = (filteredCompanies || []).map((c) => c.id)
      if (categoryIds.length === 0) {
        return NextResponse.json({ contacts: [] })
      }
      companyIdFilter = companyIdFilter
        ? companyIdFilter.filter((id) => categoryIds.includes(id))
        : categoryIds
    }

    // Build contacts query
    let query = supabase
      .from("contacts")
      .select(
        "id, first_name, last_name, email, title, seniority, outreach_status, company_id, company:companies!contacts_company_id_fkey(id, name)"
      )
      .order("last_name", { ascending: true })
      .limit(500)

    // Apply company filter
    if (companyIdFilter) {
      if (companyIdFilter.length === 0) {
        return NextResponse.json({ contacts: [] })
      }
      query = query.in("company_id", companyIdFilter)
    }

    // Apply has_email filter
    if (hasEmail) {
      query = query.not("email", "is", null)
    }

    // Apply outreach status filter
    if (outreachStatus && outreachStatus !== "all") {
      query = query.eq("outreach_status", outreachStatus)
    }

    // Apply seniority filter
    if (seniority && seniority !== "all") {
      query = query.eq("seniority", seniority)
    }

    // Apply search
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      )
    }

    // Apply title search
    if (titleSearch) {
      query = query.ilike("title", `%${titleSearch}%`)
    }

    const { data: contacts, error } = await query

    if (error) {
      console.error(
        "Error searching contacts:",
        error.message,
        error.details,
        error.hint
      )
      return NextResponse.json(
        { error: `Failed to search contacts: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      contacts: contacts || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
