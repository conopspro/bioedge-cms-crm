import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { applyBounceToEmail, type SuppressionResult } from "@/lib/services/email-suppression"

/**
 * POST /api/admin/process-bounces-csv
 *
 * Accepts a CSV file upload and marks matching contacts as bounced.
 * Auto-detects the email column (first column containing "@" values).
 *
 * Body: multipart/form-data with field "file" containing the CSV.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split(/\r?\n/).filter((l) => l.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV appears empty" }, { status: 400 })
    }

    // Detect email column index from header row
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""))
    let emailColIndex = headers.findIndex(
      (h) => h === "email" || h === "email address" || h === "email_address" || h === "to"
    )

    // Fallback: scan first data row for a bare email (skip display-name format like "Name <email@x.com>")
    if (emailColIndex === -1) {
      const firstDataCols = lines[1].split(",").map((c) => c.trim().replace(/['"]/g, ""))
      emailColIndex = firstDataCols.findIndex((c) => c.includes("@") && !c.includes("<"))
    }

    if (emailColIndex === -1) {
      return NextResponse.json({ error: "Could not detect email column in CSV" }, { status: 400 })
    }

    // Detect last_event column — used to filter to bounced rows only (Resend emails-sent export)
    const lastEventColIndex = headers.findIndex((h) => h === "last_event")
    const BOUNCE_EVENTS = new Set(["bounced", "suppressed", "spam_complaint"])

    // Extract emails from data rows
    const emails: string[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim().replace(/['"]/g, ""))

      // If the CSV has a last_event column, skip non-bounce rows
      if (lastEventColIndex !== -1) {
        const lastEvent = cols[lastEventColIndex]?.toLowerCase().trim()
        if (!BOUNCE_EVENTS.has(lastEvent)) continue
      }

      const email = cols[emailColIndex]?.toLowerCase()
      if (email && email.includes("@")) {
        emails.push(email)
      }
    }

    if (emails.length === 0) {
      return NextResponse.json({ error: "No valid email addresses found in CSV" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const totals: SuppressionResult = { outreach_contacts: 0, contacts: 0, clinic_contacts: 0, clinics: 0 }

    // Process in parallel batches of 10
    for (let i = 0; i < emails.length; i += 10) {
      const batch = emails.slice(i, i + 10)
      const results = await Promise.all(
        batch.map((email) => applyBounceToEmail(email, supabase))
      )
      for (const r of results) {
        totals.outreach_contacts += r.outreach_contacts
        totals.contacts += r.contacts
        totals.clinic_contacts += r.clinic_contacts
        totals.clinics += r.clinics
      }
    }

    return NextResponse.json({
      success: true,
      emails_in_csv: emails.length,
      marked: totals,
    })
  } catch (err) {
    console.error("process-bounces-csv error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
