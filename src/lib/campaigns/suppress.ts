/**
 * Company-Level Response Suppression
 *
 * When someone at a company responds, all unsent emails to other contacts
 * at that same company are automatically suppressed across ALL active campaigns.
 *
 * This prevents the awkward situation where multiple people at the same company
 * get outreach after one of them has already replied.
 */

import { createClient } from "@/lib/supabase/server"

/**
 * Suppress all unsent campaign recipients at a given company.
 *
 * Called when:
 * 1. A contact's outreach_status is changed to "responded"
 * 2. A response is logged in outreach_log with response_received = true
 *
 * @param companyId - The company ID to suppress
 * @param reason - Human-readable reason (e.g. "John Smith at Thorne responded on Feb 15")
 * @returns Number of recipients suppressed
 */
export async function suppressCompanyRecipients(
  companyId: string,
  reason: string
): Promise<number> {
  const supabase = await createClient()

  // Find all unsent recipients at this company across all campaigns
  // Only suppress "approved" or "queued" status (not already sent/delivered/etc.)
  const { data: recipientsToSuppress, error: fetchError } = await supabase
    .from("campaign_recipients")
    .select("id, campaign_id")
    .eq("company_id", companyId)
    .in("status", ["approved", "queued", "generated"])

  if (fetchError) {
    console.error(
      `Suppression check failed for company ${companyId}:`,
      fetchError
    )
    return 0
  }

  if (!recipientsToSuppress || recipientsToSuppress.length === 0) {
    return 0
  }

  const recipientIds = recipientsToSuppress.map((r) => r.id)

  // Update all matching recipients to suppressed
  const { error: updateError } = await supabase
    .from("campaign_recipients")
    .update({
      status: "suppressed",
      suppression_reason: reason,
    })
    .in("id", recipientIds)

  if (updateError) {
    console.error(
      `Failed to suppress ${recipientIds.length} recipients for company ${companyId}:`,
      updateError
    )
    return 0
  }

  console.log(
    `Suppressed ${recipientIds.length} recipients at company ${companyId}: ${reason}`
  )

  return recipientIds.length
}
