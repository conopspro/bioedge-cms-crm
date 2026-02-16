import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const GENERIC_NAMES = [
  "admin", "info", "contact", "hello", "support", "sales",
  "team", "office", "help", "service", "mail", "general",
  "enquiries", "enquiry", "billing", "accounts", "hr",
  "marketing", "media", "press", "news", "events",
]

/**
 * POST /api/contacts/backfill-email-type
 *
 * One-time backfill: reads enhancement_logs for email_verification results
 * and sets email_type on contacts based on Hunter's accept_all status.
 * Also clears generic first_name/last_name on catch-all contacts.
 */
export async function POST() {
  try {
    const supabase = await createClient()

    // Fetch all email verification logs
    const { data: logs, error: logsError } = await supabase
      .from("enhancement_logs")
      .select("entity_id, response_data")
      .eq("entity_type", "contact")
      .eq("enhancement_type", "email_verification")
      .eq("status", "completed")
      .order("created_at", { ascending: false })

    if (logsError) {
      console.error("Error fetching enhancement logs:", logsError)
      return NextResponse.json(
        { error: "Failed to fetch enhancement logs" },
        { status: 500 }
      )
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json({ message: "No enhancement logs found", updated: 0, cleared: 0 })
    }

    // Deduplicate: keep latest log per contact (they're ordered by created_at desc)
    const contactMap = new Map<string, string>() // contact_id -> email_type
    for (const log of logs) {
      if (contactMap.has(log.entity_id)) continue // already have latest

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = log.response_data as any
      if (responseData?.status === "accept_all") {
        contactMap.set(log.entity_id, "catch_all")
      } else if (responseData?.status === "valid") {
        contactMap.set(log.entity_id, "personal")
      }
    }

    let updated = 0
    let cleared = 0

    // Batch update contacts
    for (const [contactId, emailType] of contactMap) {
      const updateData: Record<string, unknown> = { email_type: emailType }

      // For catch-all contacts, check if first_name is generic
      if (emailType === "catch_all") {
        const { data: contact } = await supabase
          .from("contacts")
          .select("first_name")
          .eq("id", contactId)
          .single()

        if (contact) {
          const firstName = (contact.first_name || "").toLowerCase().trim()
          if (GENERIC_NAMES.includes(firstName)) {
            updateData.first_name = ""
            updateData.last_name = ""
            cleared++
          }
        }
      }

      const { error: updateError } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("id", contactId)

      if (updateError) {
        console.error(`Error updating contact ${contactId}:`, updateError)
      } else {
        updated++
      }
    }

    return NextResponse.json({
      message: `Backfill complete. ${updated} contacts updated, ${cleared} generic names cleared.`,
      updated,
      cleared,
      total_logs: logs.length,
      unique_contacts: contactMap.size,
      catch_all: [...contactMap.values()].filter((v) => v === "catch_all").length,
      personal: [...contactMap.values()].filter((v) => v === "personal").length,
    })
  } catch (error) {
    console.error("Backfill error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
