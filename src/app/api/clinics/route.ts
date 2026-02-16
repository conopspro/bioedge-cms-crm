import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Generate a URL-friendly slug
 */
function generateSlug(name: string, city?: string | null, state?: string | null): string {
  const parts = [name]
  if (city) parts.push(city)
  if (state) parts.push(state)
  return parts
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200)
}

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
 * GET /api/clinics
 *
 * Fetch clinics with optional filtering, search, and pagination.
 *
 * Query params:
 *   - search: Search by clinic name
 *   - state: Filter by state
 *   - country: Filter by country
 *   - tags: Filter by tag (comma-separated)
 *   - min_rating: Minimum Google rating
 *   - active: Filter by active status (true/false)
 *   - featured: Filter by featured status (true/false)
 *   - page: Page number (default: 1)
 *   - limit: Results per page (default: 50, max: 200)
 *   - sort: Sort field (default: name)
 *   - order: Sort order (asc/desc, default: asc)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const state = searchParams.get("state")
    const country = searchParams.get("country")
    const tags = searchParams.get("tags")
    const minRating = searchParams.get("min_rating")
    const active = searchParams.get("active")
    const featured = searchParams.get("featured")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageLimit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200)
    const sort = searchParams.get("sort") || "name"
    const order = searchParams.get("order") || "asc"

    // Build query
    let query = supabase
      .from("clinics")
      .select("*", { count: "exact" })

    // Apply filters
    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (state) {
      query = query.eq("state", state)
    }

    if (country) {
      query = query.eq("country", country)
    }

    if (tags) {
      // Filter clinics that have any of the specified tags
      const tagArray = tags.split(",").map((t) => t.trim())
      query = query.overlaps("tags", tagArray)
    }

    if (minRating) {
      query = query.gte("google_rating", parseFloat(minRating))
    }

    if (active !== null && active !== undefined) {
      query = query.eq("is_active", active === "true")
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    // Pagination
    const from = (page - 1) * pageLimit
    const to = from + pageLimit - 1

    // Apply sorting and pagination
    query = query
      .order(sort, { ascending: order === "asc" })
      .range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching clinics:", error)
      return NextResponse.json(
        { error: "Failed to fetch clinics" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit: pageLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageLimit),
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/clinics
 *
 * Create a new clinic.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { error: "Clinic name is required" },
        { status: 400 }
      )
    }

    // Auto-generate slug
    const slug = generateSlug(body.name, body.city, body.state)

    // Auto-extract domain
    if (body.website && !body.domain) {
      body.domain = extractDomain(body.website)
    }

    const { data, error } = await supabase
      .from("clinics")
      .insert({ ...body, slug })
      .select()
      .single()

    if (error) {
      console.error("Error creating clinic:", error)
      return NextResponse.json(
        { error: `Failed to create clinic: ${error.message}` },
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
