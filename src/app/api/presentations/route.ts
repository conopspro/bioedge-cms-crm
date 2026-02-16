import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * GET /api/presentations
 * List all presentation items with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const contactId = searchParams.get("contact_id")
    const companyId = searchParams.get("company_id")

    let query = supabase
      .from("presentations")
      .select(`
        *,
        contact:contacts(id, first_name, last_name, title, avatar_url),
        company:companies(id, name, logo_url, domain),
        article:articles(id, title, slug),
        panelists:presentation_panelists(
          id,
          contact_id,
          role,
          company_id,
          article_id,
          display_order,
          contact:contacts(id, first_name, last_name, title, avatar_url)
        )
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    // If filtering by contact, we need to get presentations where they're the primary speaker
    // OR where they're a panelist. We'll handle panelists separately.
    if (contactId) {
      // First, get presentation IDs where this contact is a panelist
      const { data: panelistPresentations } = await supabase
        .from("presentation_panelists")
        .select("presentation_id")
        .eq("contact_id", contactId)

      const panelistPresentationIds = panelistPresentations?.map(p => p.presentation_id) || []

      // Now filter: either primary contact OR in the panelist list
      if (panelistPresentationIds.length > 0) {
        query = query.or(`contact_id.eq.${contactId},id.in.(${panelistPresentationIds.join(",")})`)
      } else {
        query = query.eq("contact_id", contactId)
      }
    }

    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Failed to fetch presentation items:", error)
      return NextResponse.json(
        { error: "Failed to fetch presentation items" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Presentations list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/presentations
 * Create a new presentation item with panelists
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { title, panelists, ...rest } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    // Generate slug from title
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    // Check for existing slug and make unique if needed
    while (true) {
      const { data: existing } = await supabase
        .from("presentations")
        .select("id")
        .eq("slug", slug)
        .single()

      if (!existing) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    const presentationData = {
      title: title.trim(),
      slug,
      short_description: rest.short_description?.trim() || null,
      long_description: rest.long_description?.trim() || null,
      contact_id: rest.contact_id || null,
      company_id: rest.company_id || null,
      article_id: rest.article_id || null,
      recording_url: rest.recording_url?.trim() || null,
      recording_embed: rest.recording_embed?.trim() || null,
      recording_metadata: rest.recording_metadata || null,
      youtube_url: rest.youtube_url?.trim() || null,
      status: rest.status || "draft",
    }

    // Insert the presentation
    const { data: presentation, error: presentationError } = await supabase
      .from("presentations")
      .insert(presentationData)
      .select()
      .single()

    if (presentationError) {
      console.error("Failed to create presentation item:", presentationError)
      return NextResponse.json(
        { error: "Failed to create presentation item" },
        { status: 500 }
      )
    }

    // Insert panelists if provided
    if (panelists && Array.isArray(panelists) && panelists.length > 0) {
      const panelistsData = panelists
        .filter((p: any) => p.contact_id) // Only include panelists with a contact
        .map((p: any, index: number) => ({
          presentation_id: presentation.id,
          contact_id: p.contact_id,
          role: p.role || "panelist",
          company_id: p.company_id || null,
          article_id: p.article_id || null,
          display_order: p.display_order ?? index,
        }))

      if (panelistsData.length > 0) {
        const { error: panelistsError } = await supabase
          .from("presentation_panelists")
          .insert(panelistsData)

        if (panelistsError) {
          console.error("Failed to create panelists:", panelistsError)
          // Don't fail the whole request, just log the error
        }
      }
    }

    // Fetch the complete presentation with panelists
    const { data: completePresentation } = await supabase
      .from("presentations")
      .select(`
        *,
        contact:contacts(id, first_name, last_name, title, avatar_url),
        company:companies(id, name, logo_url, domain),
        article:articles(id, title, slug),
        panelists:presentation_panelists(
          id,
          contact_id,
          role,
          company_id,
          article_id,
          display_order,
          contact:contacts(id, first_name, last_name, title, avatar_url)
        )
      `)
      .eq("id", presentation.id)
      .single()

    return NextResponse.json(completePresentation || presentation, { status: 201 })
  } catch (error) {
    console.error("Presentation create error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
