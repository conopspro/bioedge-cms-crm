import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * POST /api/contacts/cleanup-unknown
 *
 * One-time cleanup: fixes contacts that were inserted before the name-fallback
 * fix was deployed. Updates rows where first_name/last_name/name are "Unknown"
 * or "-" by deriving better values from the email address local-part.
 *
 * Also removes purely generic role-address contacts with no real name
 * (info@, admin@, support@, etc.) that slipped through the earlier import.
 */

const GENERIC_LOCALS = new Set([
  "info","contact","hello","hi","hey","support","help","admin","administrator",
  "office","team","staff","hr","sales","marketing","media","press","pr",
  "enquiries","enquiry","enquire","queries","query","general","mail","email",
  "webmaster","postmaster","noreply","no-reply","donotreply","do-not-reply",
  "billing","finance","accounting","accounts","legal","privacy","security",
  "careers","jobs","recruiting","recruitment","talent","partnerships",
  "partners","affiliate","affiliates","vendor","vendors","ops","operations",
])

export async function POST() {
  try {
    const supabase = await createClient()

    // Fetch all contacts where first_name OR last_name OR name contains "Unknown" or is "-"
    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, name, email")
      .or('first_name.eq.Unknown,last_name.eq.-,name.ilike.%Unknown%')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ fixed: 0, deleted: 0, message: "Nothing to clean up" })
    }

    let fixed = 0
    let deleted = 0
    const errors: string[] = []

    for (const contact of contacts) {
      if (!contact.email) continue

      const emailLocal = contact.email.split("@")[0].toLowerCase()
      const isGeneric = GENERIC_LOCALS.has(emailLocal)
      const hasNoRealName = (
        (!contact.first_name || contact.first_name === "Unknown") &&
        (!contact.last_name || contact.last_name === "-")
      )

      // Delete generic role contacts with no real name
      if (isGeneric && hasNoRealName) {
        const { error: delError } = await supabase
          .from("contacts")
          .delete()
          .eq("id", contact.id)
        if (delError) errors.push(`delete ${contact.email}: ${delError.message}`)
        else deleted++
        continue
      }

      // Fix contacts with "Unknown" first_name — derive from email local-part
      const needsFirstName = !contact.first_name || contact.first_name === "Unknown"
      const needsLastName = !contact.last_name || contact.last_name === "-"

      if (!needsFirstName && !needsLastName) continue

      const derivedFirst = needsFirstName
        ? emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1)
        : contact.first_name
      const derivedLast = needsLastName ? null : contact.last_name
      const derivedName = derivedLast
        ? `${derivedFirst} ${derivedLast}`.trim()
        : derivedFirst

      const { error: updateError } = await supabase
        .from("contacts")
        .update({
          first_name: derivedFirst,
          last_name: derivedLast || "-",
          name: derivedName,
        })
        .eq("id", contact.id)

      if (updateError) errors.push(`update ${contact.email}: ${updateError.message}`)
      else fixed++
    }

    return NextResponse.json({
      scanned: contacts.length,
      fixed,
      deleted,
      errors: errors.slice(0, 20),
    })
  } catch (err) {
    console.error("[contacts/cleanup-unknown]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
