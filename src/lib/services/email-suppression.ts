/**
 * Email Suppression Utility
 *
 * Shared logic for marking contacts as bounced or unsubscribed across all
 * contact tables. Called by:
 * - Resend webhook (real-time, on bounce/complaint/suppression events)
 * - POST /api/admin/sync-bounces (Resend suppressions API sync)
 * - POST /api/admin/process-bounces-csv (manual CSV upload)
 * - POST /api/unsubscribe (recipient-initiated opt-out)
 */

import type { SupabaseClient } from "@supabase/supabase-js"

export interface SuppressionResult {
  outreach_contacts: number
  contacts: number
  clinic_contacts: number
  clinics: number
}

/**
 * Mark a single email address as bounced across all contact tables.
 * - outreach_contacts / contacts: sets bounced_at (email is NOT NULL, cannot be cleared)
 * - clinic_contacts / clinics: sets bounced_at AND nulls the email field
 */
export async function applyBounceToEmail(
  email: string,
  supabase: SupabaseClient
): Promise<SuppressionResult> {
  const now = new Date().toISOString()
  const result: SuppressionResult = {
    outreach_contacts: 0,
    contacts: 0,
    clinic_contacts: 0,
    clinics: 0,
  }

  const [r1, r2, r3, r4] = await Promise.all([
    supabase
      .from("outreach_contacts")
      .update({ bounced_at: now })
      .eq("email", email)
      .is("bounced_at", null)
      .select("id"),
    supabase
      .from("contacts")
      .update({ bounced_at: now })
      .eq("email", email)
      .is("bounced_at", null)
      .select("id"),
    supabase
      .from("clinic_contacts")
      .update({ bounced_at: now, email: null })
      .eq("email", email)
      .is("bounced_at", null)
      .select("id"),
    supabase
      .from("clinics")
      .update({ bounced_at: now, email: null })
      .eq("email", email)
      .is("bounced_at", null)
      .select("id"),
  ])

  result.outreach_contacts = r1.data?.length ?? 0
  result.contacts = r2.data?.length ?? 0
  result.clinic_contacts = r3.data?.length ?? 0
  result.clinics = r4.data?.length ?? 0

  return result
}

/**
 * Mark a single email address as unsubscribed across all contact tables.
 * Does not null the email — we keep the address to prevent re-import from
 * re-adding them without the unsubscribed flag.
 */
export async function applyUnsubscribeToEmail(
  email: string,
  supabase: SupabaseClient
): Promise<SuppressionResult> {
  const now = new Date().toISOString()
  const result: SuppressionResult = {
    outreach_contacts: 0,
    contacts: 0,
    clinic_contacts: 0,
    clinics: 0,
  }

  const [r1, r2, r3, r4] = await Promise.all([
    supabase
      .from("outreach_contacts")
      .update({ unsubscribed_at: now })
      .eq("email", email)
      .is("unsubscribed_at", null)
      .select("id"),
    supabase
      .from("contacts")
      .update({ unsubscribed_at: now })
      .eq("email", email)
      .is("unsubscribed_at", null)
      .select("id"),
    supabase
      .from("clinic_contacts")
      .update({ unsubscribed_at: now })
      .eq("email", email)
      .is("unsubscribed_at", null)
      .select("id"),
    supabase
      .from("clinics")
      .update({ unsubscribed_at: now })
      .eq("email", email)
      .is("unsubscribed_at", null)
      .select("id"),
  ])

  result.outreach_contacts = r1.data?.length ?? 0
  result.contacts = r2.data?.length ?? 0
  result.clinic_contacts = r3.data?.length ?? 0
  result.clinics = r4.data?.length ?? 0

  return result
}

/**
 * Mark a contact as having replied (email.received webhook).
 * Looks up by email and sets last_replied_at. Does not suppress.
 */
export async function applyReplyToEmail(
  email: string,
  supabase: SupabaseClient
): Promise<void> {
  const now = new Date().toISOString()
  await Promise.all([
    supabase
      .from("outreach_contacts")
      .update({ last_replied_at: now })
      .eq("email", email),
    supabase
      .from("contacts")
      .update({ last_replied_at: now })
      .eq("email", email),
    supabase
      .from("clinic_contacts")
      .update({ last_replied_at: now })
      .eq("email", email),
  ])
}

/**
 * Build the HMAC-signed token for unsubscribe links.
 * Token payload: { recipientId, table }
 * Encoded as base64url, signed with UNSUBSCRIBE_SECRET.
 */
export function buildUnsubscribeToken(
  recipientId: string,
  table: "outreach_campaign_recipients" | "clinic_campaign_recipients" | "campaign_recipients"
): string {
  const payload = JSON.stringify({ recipientId, table })
  const encoded = Buffer.from(payload).toString("base64url")

  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) return encoded // unsigned fallback (dev only)

  const crypto = require("crypto")
  const sig = crypto
    .createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url")

  return `${encoded}.${sig}`
}

/**
 * Verify and decode an unsubscribe token.
 * Returns null if invalid or tampered.
 */
export function decodeUnsubscribeToken(
  token: string
): { recipientId: string; table: string } | null {
  try {
    const secret = process.env.UNSUBSCRIBE_SECRET
    const parts = token.split(".")

    if (secret) {
      if (parts.length !== 2) return null
      const [encoded, sig] = parts
      const crypto = require("crypto")
      const expected = crypto
        .createHmac("sha256", secret)
        .update(encoded)
        .digest("base64url")
      if (sig !== expected) return null
      return JSON.parse(Buffer.from(parts[0], "base64url").toString())
    }

    // Dev fallback: unsigned
    return JSON.parse(Buffer.from(parts[0], "base64url").toString())
  } catch {
    return null
  }
}
