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
      console.error("Error fetching contacts:", error)
      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: 500 }
      )
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
        (contacts || [])
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

        cooldownWarnings = (contacts || [])
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
      contacts: contacts || [],
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
