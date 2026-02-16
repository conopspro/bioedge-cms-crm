import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * GET /api/sender-profiles/me
 *
 * Fetch the sender profile for the currently logged-in user.
 * Matches sender_profiles.auth_user_id to the authenticated user's ID.
 *
 * Returns the matching profile, or null if no profile is linked.
 * Also returns all profiles so the UI can show a fallback dropdown.
 */
export async function GET() {
  try {
    // Get the authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Try to find the profile linked to this user
    const { data: myProfile } = await supabase
      .from("sender_profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single()

    // Also fetch all profiles for the dropdown
    const { data: allProfiles } = await supabase
      .from("sender_profiles")
      .select("*")
      .order("name", { ascending: true })

    return NextResponse.json({
      my_profile: myProfile || null,
      all_profiles: allProfiles || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
