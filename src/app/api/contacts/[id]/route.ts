import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { ContactUpdate } from "@/types/database"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/contacts/[id]
 *
 * Fetch a single contact by ID with company and outreach history.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: contact, error } = await supabase
      .from("contacts")
      .select(`
        *,
        company:companies!contacts_company_id_fkey(*),
        outreach_log(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching contact:", error)
      return NextResponse.json(
        { error: "Failed to fetch contact" },
        { status: 500 }
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/contacts/[id]
 *
 * Update a contact by ID.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body: ContactUpdate = await request.json()

    // Debug logging
    console.log("=== CONTACT UPDATE DEBUG ===")
    console.log("Contact ID:", id)
    console.log("Update body:", JSON.stringify(body, null, 2))

    // Filter out fields that shouldn't be sent to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanBody: Record<string, any> = {}
    const allowedFields = [
      "company_id", "first_name", "last_name", "email", "phone", "title",
      "linkedin_url", "source", "outreach_status", "show_on_articles", "notes",
      "avatar_url", "is_featured", "slug", "bio",
      "address1", "address2", "city", "state", "zip", "country"
    ]

    for (const field of allowedFields) {
      if (field in body) {
        cleanBody[field] = (body as Record<string, unknown>)[field]
      }
    }

    console.log("Clean body:", JSON.stringify(cleanBody, null, 2))
    console.log("============================")

    const { data, error } = await supabase
      .from("contacts")
      .update(cleanBody)
      .eq("id", id)
      .select(`
        *,
        company:companies!contacts_company_id_fkey(id, name)
      `)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      console.error("Error details:", error.details)
      console.error("Error hint:", error.hint)

      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        )
      }
      // Return the actual error message from Supabase
      return NextResponse.json(
        {
          error: error.message || "Failed to update contact",
          code: error.code,
          details: error.details,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "No data returned from update" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/contacts/[id]
 *
 * Delete a contact by ID.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting contact:", error)
      return NextResponse.json(
        { error: "Failed to delete contact" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
