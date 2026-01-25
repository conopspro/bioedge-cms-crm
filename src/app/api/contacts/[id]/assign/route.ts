import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/contacts/[id]/assign
 *
 * Assign or reassign a contact to a company.
 * Used from the review unassigned contacts page.
 *
 * Body:
 * - company_id: string | null - The company to assign (null to unassign)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { company_id } = body

    // Validate company exists if provided
    if (company_id) {
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", company_id)
        .single()

      if (companyError || !company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        )
      }
    }

    // Update the contact
    const { data, error } = await supabase
      .from("contacts")
      .update({ company_id: company_id || null })
      .eq("id", id)
      .select(`
        *,
        company:companies(id, name, domain)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        )
      }
      console.error("Error assigning contact:", error)
      return NextResponse.json(
        { error: "Failed to assign contact" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
