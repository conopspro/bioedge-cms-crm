import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { suppressCompanyRecipients } from "@/lib/campaigns/suppress"

/**
 * POST /api/campaigns/suppress
 *
 * Trigger company-level suppression when a response is logged.
 * Called from the outreach log editor when response_received = true.
 *
 * Body: { company_id: string, contact_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_id, contact_id } = body

    if (!company_id) {
      return NextResponse.json(
        { error: "company_id is required" },
        { status: 400 }
      )
    }

    // Fetch contact and company names for the suppression reason
    const supabase = await createClient()

    const { data: contact } = await supabase
      .from("contacts")
      .select("first_name, last_name")
      .eq("id", contact_id)
      .single()

    const { data: company } = await supabase
      .from("companies")
      .select("name")
      .eq("id", company_id)
      .single()

    const contactName = contact
      ? `${contact.first_name} ${contact.last_name}`
      : "A contact"
    const companyName = company?.name || "their company"
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    const reason = `${contactName} at ${companyName} responded on ${today}`

    const suppressed = await suppressCompanyRecipients(company_id, reason)

    return NextResponse.json({
      suppressed,
      reason,
    })
  } catch (error) {
    console.error("Suppression error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
