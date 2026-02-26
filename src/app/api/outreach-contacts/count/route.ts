import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getPersonaGroup, getPersonaBriefing } from "@/lib/outreach-personas"

/**
 * GET /api/outreach-contacts/count
 *
 * Returns the count of contacts matching a filter set, broken down by
 * persona group. Used in the campaign creation form (Card 2: Contact Preview)
 * to show "14,823 contacts match" + breakdown without loading all records.
 *
 * Query params:
 *   businessTypes   comma-separated list of business_type values (empty = all)
 *   states          comma-separated list of states (empty = all)
 *   engagement      'any' | 'opened' | 'clicked' (default: 'any')
 *   excludeDays     number — exclude contacts emailed within N calendar days
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const businessTypesParam = searchParams.get("businessTypes") ?? ""
    const statesParam = searchParams.get("states") ?? ""
    const engagement = searchParams.get("engagement") ?? "any"
    const excludeDaysParam = searchParams.get("excludeDays")
    const excludeDays = excludeDaysParam ? parseInt(excludeDaysParam, 10) : 0

    const businessTypes = businessTypesParam
      ? businessTypesParam.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    const states = statesParam
      ? statesParam.split(",").map((s) => s.trim()).filter(Boolean)
      : []

    // Resolve recently-emailed contact IDs to exclude from count.
    // Use start-of-UTC-day so the window is always whole calendar days.
    let recentlyEmailedContactIds: string[] = []
    if (excludeDays > 0) {
      const cutoff = new Date()
      cutoff.setUTCDate(cutoff.getUTCDate() - excludeDays)
      cutoff.setUTCHours(0, 0, 0, 0)

      const { data: recentRecipients } = await supabase
        .from("outreach_campaign_recipients")
        .select("outreach_contact_id")
        .not("sent_at", "is", null)
        .gte("sent_at", cutoff.toISOString())

      recentlyEmailedContactIds = (recentRecipients ?? [])
        .map((r) => r.outreach_contact_id)
        .filter(Boolean)
    }

    let query = supabase
      .from("outreach_contacts")
      .select("business_type", { count: "exact" })

    if (businessTypes.length > 0) {
      query = query.in("business_type", businessTypes)
    }

    if (states.length > 0) {
      query = query.in("state", states)
    }

    if (engagement === "clicked") {
      query = query.gt("total_clicks", 0)
    } else if (engagement === "opened") {
      query = query.gt("total_opens", 0)
    }

    if (recentlyEmailedContactIds.length > 0) {
      query = query.not(
        "id",
        "in",
        `(${recentlyEmailedContactIds.join(",")})`
      )
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error counting outreach contacts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Break down by persona group
    const groupCounts = new Map<string, number>()
    for (const row of data ?? []) {
      const group = getPersonaGroup(row.business_type)
      groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1)
    }

    const byPersonaGroup = Array.from(groupCounts.entries())
      .map(([group, groupCount]) => ({
        group,
        display_name: getPersonaBriefing(group).displayName,
        count: groupCount,
      }))
      .sort((a, b) => {
        // Default group last
        if (a.group === "default") return 1
        if (b.group === "default") return -1
        return b.count - a.count
      })

    return NextResponse.json({
      total: count ?? 0,
      by_persona_group: byPersonaGroup,
    })
  } catch (err) {
    console.error("Unexpected error counting outreach contacts:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
