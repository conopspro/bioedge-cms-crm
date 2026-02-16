import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/campaigns/[id]/available-contacts
 *
 * Search and filter contacts for adding to a campaign.
 * Returns contacts with company info and cooldown warnings.
 *
 * Query params:
 * - search: Search name, email, company name
 * - company_id: Filter by company
 * - category: Filter by company category slug
 * - edge_category: Filter by EDGE framework category
 * - status: Filter by outreach_status
 * - seniority: Filter by contact seniority
 * - title_search: Filter by title keyword
 * - has_email: Only contacts with email (default true)
 * - event_id: Filter by companies that attended an event
 * - outreach: Filter by outreach recency (never, 7d, 30d, 90d, 90d_plus)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const companyId = searchParams.get("company_id")
    const category = searchParams.get("category")
    const edgeCategory = searchParams.get("edge_category")
    const outreachStatus = searchParams.get("status")
    const seniority = searchParams.get("seniority")
    const titleSearch = searchParams.get("title_search")
    const hasEmail = searchParams.get("has_email") !== "false"
    const eventId = searchParams.get("event_id")
    const outreach = searchParams.get("outreach") // never, 7d, 30d, 90d, 90d_plus
    const notWithin = searchParams.get("not_within") // 7d, 30d, 90d — exclude contacts contacted within this window
    const converted = searchParams.get("converted") // only, exclude — filter by converted status

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
        const { data: contactedIds } = await supabase
          .from("outreach_log")
          .select("contact_id")
          .limit(50000)

        const uniqueIds = [...new Set((contactedIds || []).map((r) => r.contact_id))]
        outreachContactIds = uniqueIds
        outreachFilterMode = "exclude"
      } else if (outreach === "90d_plus") {
        // Stale: contacted but NOT within the last 90 days
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
          return NextResponse.json({ contacts: [], cooldown_warnings: [] })
        }
      } else {
        // Recent outreach within a date range (7d, 30d, 90d)
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
          return NextResponse.json({ contacts: [], cooldown_warnings: [] })
        }
      }
    }

    // If filtering by event, first get company IDs from event_companies
    let eventCompanyIds: string[] | null = null
    if (eventId && eventId !== "all") {
      const { data: eventCompanies } = await supabase
        .from("event_companies")
        .select("company_id")
        .eq("event_id", eventId)

      eventCompanyIds = (eventCompanies || []).map((ec) => ec.company_id)
      if (eventCompanyIds.length === 0) {
        return NextResponse.json({ contacts: [], cooldown_warnings: [] })
      }
    }

    // If filtering by category or edge_category, get company IDs
    let categoryCompanyIds: string[] | null = null
    if ((category && category !== "all") || (edgeCategory && edgeCategory !== "all")) {
      let companyQuery = supabase.from("companies").select("id")

      if (category && category !== "all") {
        companyQuery = companyQuery.eq("category", category)
      }

      if (edgeCategory && edgeCategory !== "all") {
        companyQuery = companyQuery.contains("edge_categories", [edgeCategory])
      }

      const { data: filteredCompanies } = await companyQuery
      categoryCompanyIds = (filteredCompanies || []).map((c) => c.id)
      if (categoryCompanyIds.length === 0) {
        return NextResponse.json({ contacts: [], cooldown_warnings: [] })
      }
    }

    // Intersect company ID filters
    let companyIdFilter: string[] | null = null
    if (companyId && companyId !== "all") {
      companyIdFilter = [companyId]
    }
    if (eventCompanyIds) {
      companyIdFilter = companyIdFilter
        ? companyIdFilter.filter((id) => eventCompanyIds!.includes(id))
        : eventCompanyIds
    }
    if (categoryCompanyIds) {
      companyIdFilter = companyIdFilter
        ? companyIdFilter.filter((id) => categoryCompanyIds!.includes(id))
        : categoryCompanyIds
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
        return NextResponse.json({ contacts: [], cooldown_warnings: [] })
      }
      query = query.in("company_id", companyIdFilter)
    }

    // Apply has_email filter
    if (hasEmail) {
      query = query.not("email", "is", null)
    }

    // Apply outreach recency filter — contact ID list
    if (outreachContactIds && outreachFilterMode === "include") {
      query = query.in("id", outreachContactIds)
    } else if (outreachContactIds && outreachFilterMode === "exclude") {
      if (outreachContactIds.length > 0) {
        query = query.not("id", "in", `(${outreachContactIds.join(",")})`)
      }
    }

    // Apply outreach status filter
    if (outreachStatus && outreachStatus !== "all") {
      query = query.eq("outreach_status", outreachStatus)
    }

    // Converted filter
    if (converted === "only") {
      query = query.eq("outreach_status", "converted")
    } else if (converted === "exclude") {
      query = query.neq("outreach_status", "converted")
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

    const { data: rawContacts, error } = await query

    if (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: 500 }
      )
    }

    // Post-filter: "Not Contacted Within" — exclude contacts with recent outreach
    let contacts = rawContacts || []
    if (notWithinExcludeSet && notWithinExcludeSet.size > 0) {
      contacts = contacts.filter((c) => !notWithinExcludeSet!.has(c.id))
    }

    // Get campaign's cooldown setting
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("company_cooldown_days")
      .eq("id", campaignId)
      .single()

    const cooldownDays = campaign?.company_cooldown_days || 30

    // Check for cooldown warnings: find recently emailed companies
    const contactCompanyIds = [
      ...new Set(
        contacts
          .map((c) => c.company_id)
          .filter(Boolean) as string[]
      ),
    ]

    let cooldownWarnings: {
      contact_id: string
      campaign_name: string
      days_ago: number
      contact_name: string
    }[] = []

    if (contactCompanyIds.length > 0) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - cooldownDays)

      const { data: recentlySent } = await supabase
        .from("campaign_recipients")
        .select(
          "company_id, sent_at, campaign_id, campaigns:campaigns!campaign_recipients_campaign_id_fkey(name)"
        )
        .in("company_id", contactCompanyIds)
        .gte("sent_at", cutoffDate.toISOString())
        .not("sent_at", "is", null)
        .limit(200)

      if (recentlySent && recentlySent.length > 0) {
        const recentCompanyMap = new Map<
          string,
          { campaign_name: string; days_ago: number }
        >()

        for (const sent of recentlySent) {
          if (sent.company_id && sent.sent_at) {
            const daysAgo = Math.round(
              (Date.now() - new Date(sent.sent_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )
            const campaignName =
              (sent.campaigns as unknown as { name: string } | null)?.name || "Unknown"
            recentCompanyMap.set(sent.company_id, {
              campaign_name: campaignName,
              days_ago: daysAgo,
            })
          }
        }

        cooldownWarnings = contacts
          .filter((c) => c.company_id && recentCompanyMap.has(c.company_id))
          .map((c) => {
            const info = recentCompanyMap.get(c.company_id!)!
            return {
              contact_id: c.id,
              campaign_name: info.campaign_name,
              days_ago: info.days_ago,
              contact_name: `${c.first_name} ${c.last_name}`,
            }
          })
      }
    }

    return NextResponse.json({
      contacts,
      cooldown_warnings: cooldownWarnings,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
