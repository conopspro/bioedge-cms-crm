import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/articles/[id]/create-contacts
 *
 * Creates contacts from the article's key_people field.
 * Checks for duplicates by name before creating.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get the article with key_people
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("id, title, company_id, key_people")
      .eq("id", id)
      .single()

    if (articleError || !article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    const keyPeople = article.key_people || []

    if (keyPeople.length === 0) {
      return NextResponse.json(
        { error: "No key people found in article. Run AI enhancement first." },
        { status: 400 }
      )
    }

    const results: Array<{
      name: string
      status: "created" | "exists" | "error"
      contactId?: string
      error?: string
    }> = []

    for (const personName of keyPeople) {
      try {
        // Parse the name into first and last name
        const nameParts = personName.trim().split(/\s+/)
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""

        // Check if a contact with this name already exists (case-insensitive)
        const { data: existingContact } = await supabase
          .from("contacts")
          .select("id, name")
          .ilike("name", personName)
          .single()

        if (existingContact) {
          results.push({
            name: personName,
            status: "exists",
            contactId: existingContact.id,
          })
          continue
        }

        // Also check by first_name + last_name combination
        if (firstName && lastName) {
          const { data: existingByParts } = await supabase
            .from("contacts")
            .select("id, name")
            .ilike("first_name", firstName)
            .ilike("last_name", lastName)
            .single()

          if (existingByParts) {
            results.push({
              name: personName,
              status: "exists",
              contactId: existingByParts.id,
            })
            continue
          }
        }

        // Create the new contact
        const { data: newContact, error: insertError } = await supabase
          .from("contacts")
          .insert({
            company_id: article.company_id,
            name: personName,
            first_name: firstName,
            last_name: lastName,
            email: "", // Will need to be filled in later
            source: "key_person",
            outreach_status: "not_contacted",
            show_on_articles: true, // Key people should be shown on articles
            notes: `Extracted as key person from article: ${article.title}`,
          })
          .select()
          .single()

        if (insertError) {
          results.push({
            name: personName,
            status: "error",
            error: insertError.message,
          })
        } else {
          results.push({
            name: personName,
            status: "created",
            contactId: newContact.id,
          })
        }
      } catch (e) {
        results.push({
          name: personName,
          status: "error",
          error: e instanceof Error ? e.message : "Unknown error",
        })
      }
    }

    const created = results.filter((r) => r.status === "created").length
    const exists = results.filter((r) => r.status === "exists").length
    const errors = results.filter((r) => r.status === "error").length

    return NextResponse.json({
      success: errors === 0,
      message: `${created} contacts created, ${exists} already exist, ${errors} errors`,
      results,
    })
  } catch (error) {
    console.error("Error creating contacts from key people:", error)
    return NextResponse.json(
      { error: "Failed to create contacts" },
      { status: 500 }
    )
  }
}
