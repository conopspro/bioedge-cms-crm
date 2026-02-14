import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import type { MergedEdgeCompany } from "@/lib/import/parse-edge-guide"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

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
 * POST /api/import/edge-resources
 *
 * Bulk import companies from parsed EDGE resource guide data.
 * Creates new companies and updates existing ones with EDGE fields.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { companies }: { companies: MergedEdgeCompany[] } = await request.json()

    if (!companies || !Array.isArray(companies)) {
      return NextResponse.json(
        { error: "Missing or invalid companies array" },
        { status: 400 }
      )
    }

    // Build lookup maps for existing companies
    const { data: existingCompanies, error: fetchError } = await supabase
      .from("companies")
      .select("id, name, slug, domain, description, systems_supported, research_notes, category, edge_categories, access_levels, has_affiliate")

    if (fetchError) {
      console.error("Error fetching existing companies:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch existing companies" },
        { status: 500 }
      )
    }

    // Build lookup maps
    const byDomain = new Map<string, (typeof existingCompanies)[number]>()
    const byName = new Map<string, (typeof existingCompanies)[number]>()

    for (const co of existingCompanies || []) {
      if (co.domain) byDomain.set(co.domain.toLowerCase(), co)
      byName.set(co.name.toLowerCase(), co)
    }

    let created = 0
    let updated = 0
    let skipped = 0
    const errors: string[] = []

    // Track created slugs to avoid conflicts within batch
    const usedSlugs = new Set<string>(
      (existingCompanies || []).map(c => c.slug).filter(Boolean)
    )

    for (const company of companies) {
      try {
        const domain = company.domain ? extractDomain(company.domain) || company.domain.toLowerCase() : null

        // Try to match existing company
        let existing = domain ? byDomain.get(domain) : undefined
        if (!existing) {
          existing = byName.get(company.name.toLowerCase())
        }

        if (existing) {
          // Update existing company with new EDGE fields
          const updateData: Record<string, unknown> = {
            edge_categories: company.edgeCategories,
            access_levels: company.accessLevels,
            has_affiliate: company.hasAffiliate,
          }

          // Merge systems_supported (union of existing + new)
          const existingSystems = existing.systems_supported || []
          const mergedSystems = [...new Set([...existingSystems, ...company.systems])]
          if (mergedSystems.length > existingSystems.length) {
            updateData.systems_supported = mergedSystems
          }

          // Set category if not already set
          if (!existing.category && company.category) {
            updateData.category = company.category
          }

          // Append research notes if new
          if (company.notes) {
            const existingNotes = existing.research_notes || ""
            if (!existingNotes.includes(company.notes)) {
              updateData.research_notes = existingNotes
                ? `${existingNotes}\n\n[EDGE Guide] ${company.notes}`
                : `[EDGE Guide] ${company.notes}`
            }
          }

          const { error: updateError } = await supabase
            .from("companies")
            .update(updateData)
            .eq("id", existing.id)

          if (updateError) {
            errors.push(`Update failed for "${company.name}": ${updateError.message}`)
          } else {
            updated++
          }
        } else {
          // Create new company
          let slug = generateSlug(company.name)
          if (usedSlugs.has(slug)) {
            slug = `${slug}-${Date.now()}`
          }
          usedSlugs.add(slug)

          const website = domain ? `https://${domain}` : null

          const insertData = {
            name: company.name,
            slug,
            website,
            domain: domain || null,
            description: company.description || null,
            category: company.category || null,
            systems_supported: company.systems,
            edge_categories: company.edgeCategories,
            access_levels: company.accessLevels,
            has_affiliate: company.hasAffiliate,
            research_notes: company.notes ? `[EDGE Guide] ${company.notes}` : null,
            status: "researching" as const,
            is_draft: true,
            events: [] as string[],
            technologies: [] as string[],
            ai_talking_points: [] as string[],
          }

          const { error: insertError } = await supabase
            .from("companies")
            .insert(insertData)

          if (insertError) {
            errors.push(`Insert failed for "${company.name}": ${insertError.message}`)
          } else {
            created++
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error"
        errors.push(`Error processing "${company.name}": ${msg}`)
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      total: companies.length,
      created,
      updated,
      skipped,
      errors: errors.slice(0, 50), // Limit error output
    })
  } catch (error) {
    console.error("Unexpected error in edge-resources import:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
