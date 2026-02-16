import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/campaigns/[id]/recipients
 *
 * Fetch all recipients for a campaign, enriched with contact and company data.
 *
 * Query params:
 * - status: Filter by recipient status
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase
      .from("campaign_recipients")
      .select("*")
      .eq("campaign_id", id)
      .order("created_at", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    const { data: recipients, error } = await query

    if (error) {
      console.error("Error fetching recipients:", error)
      return NextResponse.json(
        { error: "Failed to fetch recipients" },
        { status: 500 }
      )
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json([])
    }

    // Fetch related contacts and companies
    const contactIds = recipients.map((r) => r.contact_id)
    const companyIds = recipients
      .map((r) => r.company_id)
      .filter(Boolean) as string[]

    const { data: contacts } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, title, seniority")
      .in("id", contactIds)

    const { data: companies } = companyIds.length > 0
      ? await supabase
          .from("companies")
          .select("id, name")
          .in("id", companyIds)
      : { data: [] }

    const contactMap = new Map(
      (contacts || []).map((c) => [c.id, c])
    )
    const companyMap = new Map(
      (companies || []).map((c) => [c.id, c])
    )

    const enriched = recipients.map((r) => ({
      ...r,
      contact: contactMap.get(r.contact_id) || null,
      company: companyMap.get(r.company_id || "") || null,
    }))

    return NextResponse.json(enriched)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/campaigns/[id]/recipients
 *
 * Add recipients to a campaign.
 *
 * Body: { contact_ids: string[] }
 *
 * Each contact's company_id is automatically resolved.
 * Duplicates are silently skipped.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const contactIds: string[] = body.contact_ids
    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: "contact_ids array is required" },
        { status: 400 }
      )
    }

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("id", campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    // Fetch contacts to get their company_ids
    const { data: contacts, error: contactsError } = await supabase
      .from("contacts")
      .select("id, company_id, email")
      .in("id", contactIds)

    if (contactsError) {
      console.error("Error fetching contacts:", contactsError)
      return NextResponse.json(
        { error: "Failed to fetch contact data" },
        { status: 500 }
      )
    }

    // Filter out contacts without email
    const validContacts = (contacts || []).filter((c) => c.email)

    if (validContacts.length === 0) {
      return NextResponse.json(
        { error: "No contacts with email addresses found" },
        { status: 400 }
      )
    }

    // Check for existing recipients to avoid duplicates
    const { data: existing } = await supabase
      .from("campaign_recipients")
      .select("contact_id")
      .eq("campaign_id", campaignId)
      .in(
        "contact_id",
        validContacts.map((c) => c.id)
      )

    const existingIds = new Set(
      (existing || []).map((e) => e.contact_id)
    )

    // Build insert rows, skipping duplicates
    const newRecipients = validContacts
      .filter((c) => !existingIds.has(c.id))
      .map((c) => ({
        campaign_id: campaignId,
        contact_id: c.id,
        company_id: c.company_id || null,
        status: "pending" as const,
      }))

    if (newRecipients.length === 0) {
      return NextResponse.json({
        added: 0,
        skipped: validContacts.length,
        message: "All contacts are already in this campaign",
      })
    }

    const { data: inserted, error: insertError } = await supabase
      .from("campaign_recipients")
      .insert(newRecipients)
      .select()

    if (insertError) {
      console.error("Error adding recipients:", insertError)
      return NextResponse.json(
        { error: `Failed to add recipients: ${insertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        added: inserted?.length || 0,
        skipped: validContacts.length - (inserted?.length || 0),
        recipients: inserted,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
