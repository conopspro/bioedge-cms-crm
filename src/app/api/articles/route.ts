import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { ArticleInsert } from "@/types/database"

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * GET /api/articles
 *
 * Fetch all articles with optional filtering.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const companyId = searchParams.get("company_id")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("articles")
      .select(`
        *,
        company:companies(id, name)
      `)

    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching articles:", error)
      return NextResponse.json(
        { error: "Failed to fetch articles" },
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
 * POST /api/articles
 *
 * Create a new article.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: ArticleInsert = await request.json()

    // Validate required fields
    if (!body.company_id) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 }
      )
    }
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(body.title)
    }

    // Check for duplicate slug - use maybeSingle() since no match is expected/valid
    const { data: existing, error: slugCheckError } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", body.slug)
      .maybeSingle()

    if (slugCheckError) {
      console.error("Error checking slug:", slugCheckError)
      return NextResponse.json(
        { error: "Failed to validate article slug" },
        { status: 500 }
      )
    }

    if (existing) {
      // Append timestamp to make unique
      body.slug = `${body.slug}-${Date.now()}`
    }

    const { data, error } = await supabase
      .from("articles")
      .insert(body)
      .select(`
        *,
        company:companies(id, name)
      `)
      .single()

    if (error) {
      console.error("Error creating article:", error)
      return NextResponse.json(
        { error: "Failed to create article" },
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
