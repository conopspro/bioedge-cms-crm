import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/articles/[id]/key-people
 *
 * Update the key_people_contact_ids array for an article.
 * Used to associate existing contacts with an article.
 *
 * Side effect: Automatically sets show_on_articles=true for any
 * contacts added as key people, making them publicly visible leaders.
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    const body = await request.json()

    const { keyPeopleContactIds } = body

    if (!Array.isArray(keyPeopleContactIds)) {
      return NextResponse.json(
        { error: "keyPeopleContactIds must be an array" },
        { status: 400 }
      )
    }

    // Update the article's key_people_contact_ids field
    const { data, error } = await supabase
      .from("articles")
      .update({ key_people_contact_ids: keyPeopleContactIds })
      .eq("id", id)
      .select("id, key_people_contact_ids")
      .single()

    if (error) {
      console.error("Error updating key people:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Auto-set show_on_articles=true for all contacts in the list
    // This ensures they become publicly visible as leaders
    let contactVisibilityWarning: string | null = null
    if (keyPeopleContactIds.length > 0) {
      const { error: contactError } = await supabase
        .from("contacts")
        .update({ show_on_articles: true })
        .in("id", keyPeopleContactIds)

      if (contactError) {
        console.error("Error updating contacts show_on_articles:", contactError)
        // Include warning in response so caller knows the side effect failed
        contactVisibilityWarning = "Key people saved, but failed to mark contacts as public leaders"
      }
    }

    return NextResponse.json({
      success: true,
      keyPeopleContactIds: data.key_people_contact_ids,
      warning: contactVisibilityWarning,
    })
  } catch (error) {
    console.error("Key people update error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    )
  }
}
