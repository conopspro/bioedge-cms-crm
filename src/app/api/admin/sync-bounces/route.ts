import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { applyBounceToEmail, type SuppressionResult } from "@/lib/services/email-suppression"

/**
 * POST /api/admin/sync-bounces
 *
 * Fetches Resend's full suppression list and marks matching contacts as bounced.
 * Paginates through all results (100 per page).
 *
 * Returns a summary of how many contacts were marked per table.
 */
export async function POST() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 })
  }

  const supabase = createAdminClient()
  const totals: SuppressionResult = { outreach_contacts: 0, contacts: 0, clinic_contacts: 0, clinics: 0 }
  let processed = 0
  let offset = 0
  const limit = 100

  try {
    while (true) {
      const res = await fetch(
        `https://api.resend.com/suppressions?limit=${limit}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )

      if (!res.ok) {
        const err = await res.text()
        return NextResponse.json(
          { error: `Resend API error: ${res.status} — ${err}` },
          { status: 502 }
        )
      }

      const json = await res.json()
      const records: { email: string; reason: string }[] = json.data ?? []

      if (records.length === 0) break

      // Process in parallel batches of 10
      for (let i = 0; i < records.length; i += 10) {
        const batch = records.slice(i, i + 10)
        const results = await Promise.all(
          batch.map((r) => applyBounceToEmail(r.email, supabase))
        )
        for (const r of results) {
          totals.outreach_contacts += r.outreach_contacts
          totals.contacts += r.contacts
          totals.clinic_contacts += r.clinic_contacts
          totals.clinics += r.clinics
        }
        processed += batch.length
      }

      if (records.length < limit) break
      offset += limit
    }

    return NextResponse.json({
      success: true,
      processed,
      marked: totals,
    })
  } catch (err) {
    console.error("sync-bounces error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
