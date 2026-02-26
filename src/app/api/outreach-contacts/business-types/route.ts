import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/outreach-contacts/business-types
 *
 * Returns distinct business_type values with contact counts.
 * Used to populate the Business Type filter in the campaign creation form
 * and the contacts management page.
 *
 * Includes null/empty as a separate entry ("Untagged") so the UI can
 * show how many contacts have no business type.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Count contacts by business_type (including null)
    const { data, error } = await supabase.rpc("get_outreach_business_type_counts")

    if (error) {
      // Fallback if the RPC doesn't exist yet — use a raw query approach
      const { data: contacts, error: err2 } = await supabase
        .from("outreach_contacts")
        .select("business_type")

      if (err2) {
        return NextResponse.json({ error: err2.message }, { status: 500 })
      }

      // Count in JS (fine for up to ~100K rows; for 200K we use the RPC)
      const counts = new Map<string, number>()
      for (const row of contacts ?? []) {
        const key = row.business_type?.trim() || ""
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }

      const result = Array.from(counts.entries())
        .map(([business_type, count]) => ({ business_type: business_type || null, count }))
        .sort((a, b) => {
          // Null/empty last
          if (!a.business_type) return 1
          if (!b.business_type) return -1
          return b.count - a.count
        })

      return NextResponse.json({ business_types: result })
    }

    return NextResponse.json({ business_types: data ?? [] })
  } catch (err) {
    console.error("Error fetching business types:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
