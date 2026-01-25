import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/contacts
 * Get all leaders (contacts) for an event
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("event_contacts")
      .select(`
        *,
        contact:contacts!event_contacts_contact_id_fkey(
          id,
          first_name,
          last_name,
          title,
          avatar_url,
          linkedin_url,
          company_id
        )
      `)
      .eq("event_id", id)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching event contacts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch companies separately to avoid relationship ambiguity
    const contactsWithCompanies = await Promise.all(
      (data || []).map(async (item) => {
        let company = null
        if (item.contact?.company_id) {
          const { data: companyData } = await supabase
            .from("companies")
            .select("id, name")
            .eq("id", item.contact.company_id)
            .single()
          company = companyData
        }
        return {
          ...item,
          contact: item.contact ? { ...item.contact, company } : null
        }
      })
    )

    return NextResponse.json(contactsWithCompanies)
  } catch (error) {
    console.error("Error in GET /api/events/[id]/contacts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events/[id]/contacts
 * Add a leader (contact) to the event
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.contact_id) {
      return NextResponse.json(
        { error: "Contact is required" },
        { status: 400 }
      )
    }

    // Check if contact is already added to this event
    const { data: existing } = await supabase
      .from("event_contacts")
      .select("id")
      .eq("event_id", id)
      .eq("contact_id", body.contact_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "This leader is already added to this event" },
        { status: 400 }
      )
    }

    // Insert the event_contact record
    const { data: insertedContact, error: insertError } = await supabase
      .from("event_contacts")
      .insert({
        event_id: id,
        contact_id: body.contact_id,
        role: body.role || "speaker",
        display_order: body.display_order || body.position || 0,
        status: "confirmed",
        title_override: body.title_override || null,
        bio_override: body.bio_override || null,
        headshot_url: body.headshot_url || null,
        is_featured: body.is_featured || false,
        speaker_fee: body.speaker_fee || null,
        payment_status: body.payment_status || "unpaid",
        linkedin_url: body.linkedin_url || null,
        twitter_url: body.twitter_url || null,
        instagram_url: body.instagram_url || null,
        website_url: body.website_url || null,
        notes: body.notes || null,
      })
      .select("*")
      .single()

    if (insertError) {
      console.error("Error creating event contact:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Fetch the contact details separately
    const { data: contact } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, title, avatar_url, linkedin_url, company_id")
      .eq("id", body.contact_id)
      .single()

    // Fetch company if contact has one
    let company = null
    if (contact?.company_id) {
      const { data: companyData } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", contact.company_id)
        .single()
      company = companyData
    }

    // Combine the data
    const responseData = {
      ...insertedContact,
      contact: contact ? { ...contact, company } : null
    }

    return NextResponse.json(responseData, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/contacts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
