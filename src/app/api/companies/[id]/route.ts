import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { CompanyUpdate } from "@/types/database"

type RouteParams = {
  params: Promise<{ id: string }>
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
 * GET /api/companies/[id]
 *
 * Fetch a single company by ID.
 * Includes related contacts, articles, and leaders.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch company with related data
    const { data: company, error } = await supabase
      .from("companies")
      .select(`
        *,
        contacts (*),
        articles (*),
        company_leaders (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching company:", error)
      return NextResponse.json(
        { error: "Failed to fetch company" },
        { status: 500 }
      )
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/companies/[id]
 *
 * Update a company by ID.
 *
 * Body: Partial<CompanyInsert>
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body: CompanyUpdate = await request.json()

    // Auto-extract domain from website
    if (body.website) {
      const extractedDomain = extractDomain(body.website)
      if (extractedDomain) {
        (body as Record<string, unknown>).domain = extractedDomain
      }
    }

    // Auto-regenerate slug if name changes
    if (body.name) {
      const slug = generateSlug(body.name)
      ;(body as Record<string, unknown>).slug = slug
    }

    const { data, error } = await supabase
      .from("companies")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        )
      }
      console.error("Error updating company:", error)
      return NextResponse.json(
        { error: `Failed to update company: ${error.message}` },
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
 * DELETE /api/companies/[id]
 *
 * Delete a company by ID.
 * This will cascade delete related contacts, articles, and leaders.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting company:", error)
      return NextResponse.json(
        { error: "Failed to delete company" },
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
