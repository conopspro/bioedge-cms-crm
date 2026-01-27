import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import type { ArticleUpdate } from "@/types/database"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/articles/[id]
 *
 * Fetch a single article with company and enhancements.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch article with company (article_enhancements table may not exist yet)
    const { data: article, error } = await supabase
      .from("articles")
      .select(`
        *,
        company:companies(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching article:", error)
      return NextResponse.json(
        { error: "Failed to fetch article" },
        { status: 500 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/articles/[id]
 *
 * Update an article.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const body = await request.json()

    // Build update object, cleaning up empty strings to null
    const updateData: Record<string, unknown> = {}

    // Copy over provided fields
    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.content !== undefined) updateData.content = body.content
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt || null
    if (body.status !== undefined) updateData.status = body.status
    if (body.ai_enhanced !== undefined) updateData.ai_enhanced = body.ai_enhanced
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured
    if (body.company_id !== undefined) {
      updateData.company_id = body.company_id === "" ? null : body.company_id
    }
    // Image/media fields
    if (body.featured_image_url !== undefined) updateData.featured_image_url = body.featured_image_url || null
    if (body.featured_image_alt !== undefined) updateData.featured_image_alt = body.featured_image_alt || null
    if (body.youtube_url !== undefined) updateData.youtube_url = body.youtube_url || null

    // If publishing, set published_at
    if (updateData.status === "published") {
      updateData.published_at = body.published_at || new Date().toISOString()
    }

    // If unpublishing, clear published_at
    if (updateData.status === "draft") {
      updateData.published_at = null
    }

    const { data, error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        company:companies(id, name)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        )
      }
      console.error("Error updating article:", error)
      return NextResponse.json(
        { error: `Failed to update article: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/articles/[id]
 *
 * Delete an article.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting article:", error)
      return NextResponse.json(
        { error: "Failed to delete article" },
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
