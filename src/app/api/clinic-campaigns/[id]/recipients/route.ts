import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/clinic-campaigns/[id]/recipients
 *
 * Fetch all recipients for a clinic campaign, enriched with clinic data.
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
      .from("clinic_campaign_recipients")
      .select("*")
      .eq("clinic_campaign_id", id)
      .order("created_at", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    const { data: recipients, error } = await query

    if (error) {
      console.error("Error fetching clinic campaign recipients:", error)
      return NextResponse.json(
        { error: "Failed to fetch recipients" },
        { status: 500 }
      )
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json([])
    }

    // Enrich with clinic data
    const clinicIds = recipients.map((r) => r.clinic_id)

    const { data: clinics } = await supabase
      .from("clinics")
      .select("id, name, city, state, tags, email, google_rating, reviews_count")
      .in("id", clinicIds)

    const clinicMap = new Map(
      (clinics || []).map((c) => [c.id, c])
    )

    const enriched = recipients.map((r) => ({
      ...r,
      clinic: clinicMap.get(r.clinic_id) || null,
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
 * POST /api/clinic-campaigns/[id]/recipients
 *
 * Add clinics as recipients to a clinic campaign.
 *
 * Body: { clinic_ids: string[] }
 *
 * Resolves email from clinics.email or first clinic_contacts.email.
 * Duplicates are silently skipped.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: campaignId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const clinicIds: string[] = body.clinic_ids
    const excludeDays: number | null = typeof body.exclude_recently_emailed_days === "number"
      ? body.exclude_recently_emailed_days
      : null

    if (!clinicIds || !Array.isArray(clinicIds) || clinicIds.length === 0) {
      return NextResponse.json(
        { error: "clinic_ids array is required" },
        { status: 400 }
      )
    }

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from("clinic_campaigns")
      .select("id")
      .eq("id", campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Clinic campaign not found" },
        { status: 404 }
      )
    }

    // Fetch clinics
    const { data: clinics, error: clinicsError } = await supabase
      .from("clinics")
      .select("id, name, email")
      .in("id", clinicIds)

    if (clinicsError) {
      console.error("Error fetching clinics:", clinicsError)
      return NextResponse.json(
        { error: "Failed to fetch clinic data" },
        { status: 500 }
      )
    }

    if (!clinics || clinics.length === 0) {
      return NextResponse.json(
        { error: "No clinics found for the given IDs" },
        { status: 400 }
      )
    }

    // For clinics without email, try to find one from clinic_contacts
    const clinicIdsWithoutEmail = clinics
      .filter((c) => !c.email)
      .map((c) => c.id)

    const contactEmailMap = new Map<string, string>()
    if (clinicIdsWithoutEmail.length > 0) {
      const { data: contacts } = await supabase
        .from("clinic_contacts")
        .select("clinic_id, email")
        .in("clinic_id", clinicIdsWithoutEmail)
        .not("email", "is", null)

      if (contacts) {
        for (const c of contacts) {
          if (c.email && !contactEmailMap.has(c.clinic_id)) {
            contactEmailMap.set(c.clinic_id, c.email)
          }
        }
      }
    }

    // Check for existing recipients to avoid duplicates
    const { data: existing } = await supabase
      .from("clinic_campaign_recipients")
      .select("clinic_id")
      .eq("clinic_campaign_id", campaignId)
      .in("clinic_id", clinics.map((c) => c.id))

    const existingIds = new Set(
      (existing || []).map((e) => e.clinic_id)
    )

    // Exclude clinics emailed recently (if requested)
    let recentlyEmailedIds = new Set<string>()
    let excludedCount = 0
    if (excludeDays && excludeDays > 0) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - excludeDays)

      const { data: recentRecipients } = await supabase
        .from("clinic_campaign_recipients")
        .select("clinic_id")
        .not("sent_at", "is", null)
        .gte("sent_at", cutoff.toISOString())
        .in("clinic_id", clinics.map((c) => c.id))

      recentlyEmailedIds = new Set(
        (recentRecipients || []).map((r) => r.clinic_id)
      )
    }

    // Build insert rows, skipping duplicates and recently emailed
    const newRecipients = clinics
      .filter((c) => !existingIds.has(c.id) && !recentlyEmailedIds.has(c.id))
      .map((c) => ({
        clinic_campaign_id: campaignId,
        clinic_id: c.id,
        recipient_email: c.email || contactEmailMap.get(c.id) || null,
        recipient_name: c.name,
        status: "pending" as const,
        approved: false,
      }))

    excludedCount = clinics.filter((c) => recentlyEmailedIds.has(c.id)).length

    if (newRecipients.length === 0) {
      return NextResponse.json({
        added: 0,
        skipped: clinics.length,
        excluded_recently_emailed: excludedCount,
        message: "All clinics are already in this campaign or were recently emailed",
      })
    }

    const { data: inserted, error: insertError } = await supabase
      .from("clinic_campaign_recipients")
      .insert(newRecipients)
      .select()

    if (insertError) {
      console.error("Error adding clinic recipients:", insertError)
      return NextResponse.json(
        { error: `Failed to add recipients: ${insertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        added: inserted?.length || 0,
        skipped: clinics.length - (inserted?.length || 0) - excludedCount,
        excluded_recently_emailed: excludedCount,
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
