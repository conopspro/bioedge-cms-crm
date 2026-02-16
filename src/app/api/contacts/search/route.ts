import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Shared filter parameters for contact search.
 */
interface ContactSearchParams {
  search?: string | null
  company_ids?: string[] | null // Array of company UUIDs
  company_id?: string | null
  category?: string | null
  edge_category?: string | null
  status?: string | null
  seniority?: string | null
  title_search?: string | null
  has_email?: boolean
  event_id?: string | null
  outreach?: string | null // never, 7d, 30d, 90d, 90d_plus
  not_within?: string | null // 7d, 30d, 90d — exclude contacts contacted within this window
  converted?: string | null // only, exclude — filter by converted status
  catch_all?: string | null // only, exclude — filter by catch-all email type
}

/**
 * Core contact search logic shared by GET and POST handlers.
 */
async function handleContactSearch(params: ContactSearchParams) {
  const supabase = await createClient()

  const {
    search,
    company_ids: companyIds,
    company_id: companyId,
    category,
    edge_category: edgeCategory,
    status: outreachStatus,
    seniority,
    title_search: titleSearch,
    has_email: hasEmail = true,
    event_id: eventId,
    outreach,
    not_within: notWithin,
    converted,
    catch_all: catchAll,
  } = params

  // "Not Contacted Within" filter — exclude contacts with outreach_log entries within X days
  // Uses post-filtering (not inline query) to avoid HTTP 431 with large ID lists
  let notWithinExcludeSet: Set<string> | null = null
  if (notWithin && notWithin !== "all") {
    const now = new Date()
    let cutoffDate: Date
    if (notWithin === "7d") {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (notWithin === "30d") {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (notWithin === "90d") {
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    } else {
      cutoffDate = now
    }

    const cutoffStr = cutoffDate.toISOString().split("T")[0]
    const { data: recentLogs } = await supabase
      .from("outreach_log")
      .select("contact_id")
      .gte("date", cutoffStr)
      .limit(50000)

    notWithinExcludeSet = new Set((recentLogs || []).map((r) => r.contact_id))
  }

  // Outreach recency filter — find contact IDs from outreach_log
  let outreachContactIds: string[] | null = null
  let outreachFilterMode: "include" | "exclude" | null = null
  if (outreach && outreach !== "all") {
    if (outreach === "never") {
      const { data: contactedIds } = await supabase
        .from("outreach_log")
        .select("contact_id")
        .limit(50000)

      const uniqueIds = [...new Set((contactedIds || []).map((r) => r.contact_id))]
      outreachContactIds = uniqueIds
      outreachFilterMode = "exclude"
    } else if (outreach === "90d_plus") {
      const now = new Date()
      const cutoff90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      const cutoffStr = cutoff90.toISOString().split("T")[0]

      const { data: allContacted } = await supabase
        .from("outreach_log")
        .select("contact_id")
        .limit(50000)
      const allContactedIds = [...new Set((allContacted || []).map((r) => r.contact_id))]

      const { data: recentlyContacted } = await supabase
        .from("outreach_log")
        .select("contact_id")
        .gte("date", cutoffStr)
        .limit(50000)
      const recentIds = new Set((recentlyContacted || []).map((r) => r.contact_id))

      outreachContactIds = allContactedIds.filter((id) => !recentIds.has(id))
      outreachFilterMode = "include"
      if (outreachContactIds.length === 0) {
        return NextResponse.json({ contacts: [] })
      }
    } else {
      const now = new Date()
      let cutoffDate: Date
      if (outreach === "7d") {
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      } else if (outreach === "30d") {
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      } else if (outreach === "90d") {
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      } else {
        cutoffDate = now
      }

      const cutoffStr = cutoffDate.toISOString().split("T")[0]
      const { data: recentLogs } = await supabase
        .from("outreach_log")
        .select("contact_id")
        .gte("date", cutoffStr)
        .limit(50000)

      const uniqueIds = [...new Set((recentLogs || []).map((r) => r.contact_id))]
      outreachContactIds = uniqueIds
      outreachFilterMode = "include"
      if (uniqueIds.length === 0) {
        return NextResponse.json({ contacts: [] })
      }
    }
  }

  // Determine company ID filter
  let companyIdFilter: string[] | null = null

  // Option A: Explicit list of company IDs (2-step flow from frontend)
  if (companyIds && companyIds.length > 0) {
    companyIdFilter = companyIds.filter(Boolean)
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

  // Helper: build a query with all non-company filters applied
  const CONTACT_SELECT =
    "id, first_name, last_name, email, email_type, title, seniority, outreach_status, company_id, company:companies!contacts_company_id_fkey(id, name)"

  function applyFilters(q: ReturnType<typeof supabase.from>) {
    let filtered = q
      .select(CONTACT_SELECT)
      .order("last_name", { ascending: true })

    if (hasEmail) {
      filtered = filtered.not("email", "is", null)
    }
    if (outreachContactIds && outreachFilterMode === "include") {
      filtered = filtered.in("id", outreachContactIds)
    } else if (outreachContactIds && outreachFilterMode === "exclude") {
      if (outreachContactIds.length > 0) {
        filtered = filtered.not("id", "in", `(${outreachContactIds.join(",")})`)
      }
    }
    if (outreachStatus && outreachStatus !== "all") {
      filtered = filtered.eq("outreach_status", outreachStatus)
    }
    if (converted === "only") {
      filtered = filtered.eq("outreach_status", "converted")
    } else if (converted === "exclude") {
      filtered = filtered.neq("outreach_status", "converted")
    }
    if (catchAll === "only") {
      filtered = filtered.eq("email_type", "catch_all")
    } else if (catchAll === "exclude") {
      filtered = filtered.neq("email_type", "catch_all")
    }
    if (seniority && seniority !== "all") {
      filtered = filtered.eq("seniority", seniority)
    }
    if (search) {
      filtered = filtered.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      )
    }
    if (titleSearch) {
      filtered = filtered.ilike("title", `%${titleSearch}%`)
    }
    return filtered
  }

  // Execute query — batch company IDs into chunks to avoid URL size limits
  // Supabase/PostgREST embeds .in() values in the URL; ~40 UUIDs per chunk stays safe
  const CHUNK_SIZE = 40
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allContacts: any[] = []

  if (companyIdFilter && companyIdFilter.length > CHUNK_SIZE) {
    // Batch: split company IDs into chunks and query in parallel
    const chunks: string[][] = []
    for (let i = 0; i < companyIdFilter.length; i += CHUNK_SIZE) {
      chunks.push(companyIdFilter.slice(i, i + CHUNK_SIZE))
    }

    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const q = applyFilters(supabase.from("contacts"))
          .in("company_id", chunk)
          .limit(1000)
        const { data, error: chunkError } = await q
        if (chunkError) {
          console.error("Error in batch query:", chunkError.message)
          return []
        }
        return data || []
      })
    )

    // Merge all chunk results
    allContacts = results.flat() as typeof allContacts
  } else {
    // Single query (small or no company filter)
    let query = applyFilters(supabase.from("contacts"))
    if (companyIdFilter) {
      query = query.in("company_id", companyIdFilter)
    }
    query = query.limit(500)

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
    allContacts = contacts || []
  }

  // Post-filter: "Not Contacted Within" — exclude contacts with recent outreach
  let filteredContacts = allContacts || []
  if (notWithinExcludeSet && notWithinExcludeSet.size > 0) {
    filteredContacts = filteredContacts.filter((c) => !notWithinExcludeSet!.has(c.id))
  }

  // Sort merged results (batched queries each sort independently, need final sort)
  filteredContacts.sort((a, b) =>
    (a.last_name || "").localeCompare(b.last_name || "")
  )

  return NextResponse.json({
    contacts: filteredContacts,
  })
}

/**
 * GET /api/contacts/search
 *
 * Search and filter contacts with full filter support.
 * Campaign-agnostic version of the available-contacts API —
 * no campaign ID required, no cooldown warnings.
 *
 * For small requests, use GET with query params.
 * For large company_ids lists, use POST with JSON body.
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
 * - outreach: Filter by outreach recency (never, 7d, 30d, 90d, 90d_plus)
 * - not_within: Exclude contacts contacted within window (7d, 30d, 90d)
 * - converted: Filter by converted status (only, exclude)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const companyIdsParam = searchParams.get("company_ids")

    return handleContactSearch({
      search: searchParams.get("search"),
      company_ids: companyIdsParam ? companyIdsParam.split(",").filter(Boolean) : null,
      company_id: searchParams.get("company_id"),
      category: searchParams.get("category"),
      edge_category: searchParams.get("edge_category"),
      status: searchParams.get("status"),
      seniority: searchParams.get("seniority"),
      title_search: searchParams.get("title_search"),
      has_email: searchParams.get("has_email") !== "false",
      event_id: searchParams.get("event_id"),
      outreach: searchParams.get("outreach"),
      not_within: searchParams.get("not_within"),
      converted: searchParams.get("converted"),
      catch_all: searchParams.get("catch_all"),
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/contacts/search
 *
 * Same as GET but accepts filter params in JSON body.
 * Use this when company_ids list is large (many UUIDs would exceed URL length limits).
 *
 * Body (JSON):
 * - search: Search name, email
 * - company_ids: Array of company UUID strings
 * - company_id: Filter by single company
 * - category: Filter by company category slug
 * - edge_category: Filter by EDGE framework category
 * - status: Filter by outreach_status
 * - seniority: Filter by contact seniority
 * - title_search: Filter by title keyword
 * - has_email: Only contacts with email (default true)
 * - event_id: Filter by companies that attended an event
 * - outreach: Filter by outreach recency (never, 7d, 30d, 90d, 90d_plus)
 * - not_within: Exclude contacts contacted within window (7d, 30d, 90d)
 * - converted: Filter by converted status (only, exclude)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return handleContactSearch({
      search: body.search || null,
      company_ids: Array.isArray(body.company_ids) ? body.company_ids : null,
      company_id: body.company_id || null,
      category: body.category || null,
      edge_category: body.edge_category || null,
      status: body.status || null,
      seniority: body.seniority || null,
      title_search: body.title_search || null,
      has_email: body.has_email !== false,
      event_id: body.event_id || null,
      outreach: body.outreach || null,
      not_within: body.not_within || null,
      converted: body.converted || null,
      catch_all: body.catch_all || null,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
