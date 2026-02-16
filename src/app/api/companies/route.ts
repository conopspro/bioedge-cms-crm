import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { CompanyInsert } from "@/types/database"

/**
 * Extract domain from a URL
 */
function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

/**
 * Generate a URL-friendly slug from company name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Trim hyphens from start/end
}

/**
 * GET /api/companies
 *
 * Fetch all companies with optional filtering and sorting.
 *
 * Query params:
 * - status: Filter by company status
 * - search: Search by company name
 * - sort: Sort field (default: created_at)
 * - order: Sort order (asc/desc, default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"

    // Build query
    let query = supabase
      .from("companies")
      .select("*")

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === "asc" })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching companies:", error)
      return NextResponse.json(
        { error: "Failed to fetch companies" },
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
 * POST /api/companies
 *
 * Create a new company.
 *
 * Body: CompanyInsert (name, website, description, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: CompanyInsert = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      )
    }

    // Auto-extract domain from website if not provided
    if (body.website && !body.domain) {
      const extractedDomain = extractDomain(body.website)
      if (extractedDomain) {
        (body as Record<string, unknown>).domain = extractedDomain
      }
    }

    // Auto-generate slug from company name
    const slug = generateSlug(body.name)

    // Build insert data with explicit fields matching the database schema
    const insertData: Record<string, unknown> = {
      name: body.name,
      slug,
      website: body.website || null,
      domain: (body as Record<string, unknown>).domain || null,
      description: body.description || null,
      status: body.status || "researching",
      category: body.category || null,
      is_draft: true,
    }

    const { data, error } = await supabase
      .from("companies")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Error creating company:", error)
      return NextResponse.json(
        { error: `Failed to create company: ${error.message}` },
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
