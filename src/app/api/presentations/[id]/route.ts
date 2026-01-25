import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/presentations/[id]
 * Get a single presentation item with related entities and panelists
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("presentations")
      .select(`
        *,
        contact:contacts(id, first_name, last_name, title, avatar_url, linkedin_url, bio, slug),
        company:companies(id, name, logo_url, domain, description, slug),
        article:articles(id, title, slug, excerpt),
        panelists:presentation_panelists(
          id,
          contact_id,
          role,
          company_id,
          article_id,
          display_order,
          notes,
          contact:contacts(id, first_name, last_name, title, avatar_url, linkedin_url, bio, slug, company_id),
          company:companies(id, name, logo_url, slug),
          article:articles(id, title, slug)
        )
      `)
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Presentation item not found" },
        { status: 404 }
      )
    }

    // Sort panelists by display_order
    if (data.panelists) {
      data.panelists.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Presentation get error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/presentations/[id]
 * Update a presentation item and its panelists
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { panelists, ...rest } = body

    // Build update object for the presentation
    const updateData: Record<string, unknown> = {}

    if (rest.title !== undefined) {
      updateData.title = rest.title?.trim() || null
    }
    if (rest.short_description !== undefined) {
      updateData.short_description = rest.short_description?.trim() || null
    }
    if (rest.long_description !== undefined) {
      updateData.long_description = rest.long_description?.trim() || null
    }
    if (rest.contact_id !== undefined) {
      updateData.contact_id = rest.contact_id || null
    }
    if (rest.company_id !== undefined) {
      updateData.company_id = rest.company_id || null
    }
    if (rest.article_id !== undefined) {
      updateData.article_id = rest.article_id || null
    }
    if (rest.recording_url !== undefined) {
      updateData.recording_url = rest.recording_url?.trim() || null
    }
    if (rest.recording_embed !== undefined) {
      updateData.recording_embed = rest.recording_embed?.trim() || null
    }
    if (rest.recording_metadata !== undefined) {
      updateData.recording_metadata = rest.recording_metadata || null
    }
    if (rest.status !== undefined) {
      updateData.status = rest.status
    }
    if (rest.is_featured !== undefined) {
      updateData.is_featured = rest.is_featured
    }
    if (rest.youtube_url !== undefined) {
      updateData.youtube_url = rest.youtube_url?.trim() || null
    }

    // Update the presentation
    const { error: updateError } = await supabase
      .from("presentations")
      .update(updateData)
      .eq("id", id)

    if (updateError) {
      console.error("Failed to update presentation item:", updateError)
      return NextResponse.json(
        { error: "Failed to update presentation item" },
        { status: 500 }
      )
    }

    // Handle panelists update if provided
    if (panelists !== undefined && Array.isArray(panelists)) {
      // Get existing panelists
      const { data: existingPanelists } = await supabase
        .from("presentation_panelists")
        .select("id")
        .eq("presentation_id", id)

      const existingIds = new Set((existingPanelists || []).map((p) => p.id))
      const incomingIds = new Set(panelists.filter((p: any) => p.id).map((p: any) => p.id))

      // Delete panelists that are no longer in the list
      const toDelete = [...existingIds].filter((existingId) => !incomingIds.has(existingId))
      if (toDelete.length > 0) {
        await supabase
          .from("presentation_panelists")
          .delete()
          .in("id", toDelete)
      }

      // Upsert panelists (update existing, insert new)
      for (const panelist of panelists) {
        if (!panelist.contact_id) continue // Skip invalid panelists

        const panelistData = {
          presentation_id: id,
          contact_id: panelist.contact_id,
          role: panelist.role || "panelist",
          company_id: panelist.company_id || null,
          article_id: panelist.article_id || null,
          display_order: panelist.display_order ?? 0,
        }

        if (panelist.id && existingIds.has(panelist.id)) {
          // Update existing panelist
          await supabase
            .from("presentation_panelists")
            .update(panelistData)
            .eq("id", panelist.id)
        } else {
          // Insert new panelist
          await supabase
            .from("presentation_panelists")
            .insert(panelistData)
        }
      }
    }

    // Fetch the updated presentation with all relations
    const { data, error: fetchError } = await supabase
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
      .eq("id", id)
      .single()

    if (fetchError || !data) {
      return NextResponse.json(
        { error: "Presentation item not found" },
        { status: 404 }
      )
    }

    // Sort panelists by display_order
    if (data.panelists) {
      data.panelists.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Presentation update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/presentations/[id]
 * Delete a presentation item (panelists are cascade deleted)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("presentations")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Failed to delete presentation item:", error)
      return NextResponse.json(
        { error: "Failed to delete presentation item" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Presentation delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
