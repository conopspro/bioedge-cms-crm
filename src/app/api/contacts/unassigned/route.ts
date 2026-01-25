import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/contacts/unassigned
 *
 * Fetch all contacts without a company assignment.
 * These need manual review to link to the correct company.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .is("company_id", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching unassigned contacts:", error)
      return NextResponse.json(
        { error: "Failed to fetch unassigned contacts" },
        { status: 500 }
      )
    }

    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
