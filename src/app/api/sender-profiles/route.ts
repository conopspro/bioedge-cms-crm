import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/sender-profiles
 *
 * Fetch all sender profiles.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("sender_profiles")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching sender profiles:", error)
      return NextResponse.json(
        { error: "Failed to fetch sender profiles" },
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

/**
 * POST /api/sender-profiles
 *
 * Create a new sender profile.
 *
 * Body: { name, email, title?, phone?, signature?, auth_user_id? }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    const insertData = {
      name: body.name,
      email: body.email,
      title: body.title || null,
      phone: body.phone || null,
      signature: body.signature || null,
      auth_user_id: body.auth_user_id || null,
    }

    const { data, error } = await supabase
      .from("sender_profiles")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Error creating sender profile:", error)
      return NextResponse.json(
        { error: `Failed to create sender profile: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
