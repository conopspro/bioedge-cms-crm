import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { ContactInsert } from "@/types/database"

/**
 * GET /api/contacts
 *
 * Fetch contacts with server-side search, filtering, and pagination.
 *
 * Query params:
 * - page: Page number (default 1)
 * - pageSize: Results per page (default 50, max 200)
 * - search: Search by name, email, or company name
 * - status: Filter by outreach status (not_contacted, contacted, responded, converted)
 * - visibility: Filter by visibility (published, warning, hidden)
 * - company_id: Filter by company
 * - show_on_articles: Legacy filter for published contacts
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") || "50")))
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status")
    const visibility = searchParams.get("visibility")
    const companyId = searchParams.get("company_id")
    const showOnArticles = searchParams.get("show_on_articles")
    const outreach = searchParams.get("outreach") // never, 7d, 30d, 90d, 90d_plus
    const notWithin = searchParams.get("not_within") // 7d, 30d, 90d — exclude contacts contacted within this window
    const converted = searchParams.get("converted") // only, exclude — filter by converted status
    const catchAll = searchParams.get("catch_all") // only, exclude — filter by catch-all email type

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
        // Contacts with NO outreach_log entries at all
        // Get all contact IDs that HAVE outreach logs, then exclude them
        const { data: contactedIds } = await supabase
          .from("outreach_log")
          .select("contact_id")
          .limit(50000)

        const uniqueIds = [...new Set((contactedIds || []).map((r) => r.contact_id))]
        outreachContactIds = uniqueIds
        outreachFilterMode = "exclude"
      } else {
        // Recent outreach within a date range
        const now = new Date()
        let cutoffDate: Date

        if (outreach === "7d") {
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        } else if (outreach === "30d") {
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        } else if (outreach === "90d") {
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        } else if (outreach === "90d_plus") {
          // Contacted, but NOT within the last 90 days
          // Get contacts with ANY outreach, then exclude those with recent outreach
          const cutoff90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          const cutoffStr = cutoff90.toISOString().split("T")[0]

          // Get all contacted contact IDs
          const { data: allContacted } = await supabase
            .from("outreach_log")
            .select("contact_id")
            .limit(50000)
          const allContactedIds = [...new Set((allContacted || []).map((r) => r.contact_id))]

          // Get recently contacted contact IDs
          const { data: recentlyContacted } = await supabase
            .from("outreach_log")
            .select("contact_id")
            .gte("date", cutoffStr)
            .limit(50000)
          const recentIds = new Set((recentlyContacted || []).map((r) => r.contact_id))

          // Stale = contacted but not recently
          outreachContactIds = allContactedIds.filter((id) => !recentIds.has(id))
          outreachFilterMode = "include"
          // If no stale contacts found, return empty result
          if (outreachContactIds.length === 0) {
            return NextResponse.json({ contacts: [], total: 0, page, pageSize })
          }
          // Skip the standard date filter below
          cutoffDate = now // unused, but satisfies TypeScript
        } else {
          cutoffDate = now
        }

        if (outreach !== "90d_plus") {
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
            return NextResponse.json({ contacts: [], total: 0, page, pageSize })
          }
        }
      }
    }

    // If searching by company name, find matching company IDs first
    let companySearchIds: string[] | null = null
    if (search) {
      const { data: matchingCompanies } = await supabase
        .from("companies")
        .select("id")
        .ilike("name", `%${search}%`)
        .limit(500)

      if (matchingCompanies && matchingCompanies.length > 0) {
        companySearchIds = matchingCompanies.map((c) => c.id)
      }
    }

    // Build the main query with company join and exact count
    let query = supabase
      .from("contacts")
      .select(`
        *,
        company:companies!contacts_company_id_fkey(id, name, is_draft)
      `, { count: "exact" })

    // Company filter
    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    // Status filter
    if (status && status !== "all") {
      query = query.eq("outreach_status", status)
    }

    // Converted filter
    if (converted === "only") {
      query = query.eq("outreach_status", "converted")
    } else if (converted === "exclude") {
      query = query.neq("outreach_status", "converted")
    }

    // Catch-all filter
    if (catchAll === "only") {
      query = query.eq("email_type", "catch_all")
    } else if (catchAll === "exclude") {
      query = query.neq("email_type", "catch_all")
    }

    // Outreach recency filter — apply contact ID list
    if (outreachContactIds && outreachFilterMode === "include") {
      query = query.in("id", outreachContactIds)
    } else if (outreachContactIds && outreachFilterMode === "exclude") {
      // "never contacted" — exclude contacts that have outreach logs
      // Supabase doesn't have a .notIn(), so use .not() with .in()
      if (outreachContactIds.length > 0) {
        query = query.not("id", "in", `(${outreachContactIds.join(",")})`)
      }
    }

    // Legacy show_on_articles filter
    if (showOnArticles === "true") {
      query = query.eq("show_on_articles", true)
    }

    // Text search: name, email, or company name
    if (search) {
      if (companySearchIds && companySearchIds.length > 0) {
        // Search across contact fields OR matching company IDs
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_id.in.(${companySearchIds.join(",")})`
        )
      } else {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
        )
      }
    }

    // Visibility filter (requires show_on_articles + company is_draft)
    // "published" = show_on_articles true (post-filter for company.is_draft = false)
    // "warning" = show_on_articles true (post-filter for company.is_draft != false or no company)
    // "hidden" = show_on_articles false or null
    if (visibility === "published" || visibility === "warning") {
      query = query.eq("show_on_articles", true)
    } else if (visibility === "hidden") {
      query = query.or("show_on_articles.is.null,show_on_articles.eq.false")
    }

    // Order
    query = query.order("last_name", { ascending: true })
      .order("first_name", { ascending: true })

    // When we need post-filtering (visibility or not_within), over-fetch and paginate in JS
    const needsPostFilter = visibility === "published" || visibility === "warning" || notWithinExcludeSet
    if (needsPostFilter) {
      const { data: allMatching, error } = await query.limit(10000)

      if (error) {
        console.error("Error fetching contacts:", error)
        return NextResponse.json(
          { error: "Failed to fetch contacts" },
          { status: 500 }
        )
      }

      let filtered = allMatching || []

      // Post-filter by visibility
      if (visibility === "published" || visibility === "warning") {
        filtered = filtered.filter((c) => {
          const companyPublished = c.company?.is_draft === false
          const hasCompany = !!c.company
          if (visibility === "published") return companyPublished
          if (visibility === "warning") return !companyPublished || !hasCompany
          return true
        })
      }

      // Post-filter: "Not Contacted Within" — exclude contacts with recent outreach
      if (notWithinExcludeSet && notWithinExcludeSet.size > 0) {
        filtered = filtered.filter((c) => !notWithinExcludeSet!.has(c.id))
      }

      const total = filtered.length
      const offset = (page - 1) * pageSize
      const paged = filtered.slice(offset, offset + pageSize)

      return NextResponse.json({
        contacts: paged,
        total,
        page,
        pageSize,
      })
    }

    // Standard pagination with Supabase range
    const offset = (page - 1) * pageSize
    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      contacts: data || [],
      total: count || 0,
      page,
      pageSize,
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
 * POST /api/contacts
 *
 * Create a new contact.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
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
