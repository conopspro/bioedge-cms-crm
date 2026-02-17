import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

function generateBaseSlug(name: string, city?: string | null, state?: string | null, zip?: string | null): string {
  const parts = [name]
  if (city) parts.push(city)
  if (state) parts.push(state)
  if (zip) parts.push(zip)
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
 * Generate a unique slug by checking the clinics table.
 * If "restore-hyper-wellness-austin-tx" exists, tries "-2", "-3", etc.
 */
async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  city?: string | null,
  state?: string | null,
  zip?: string | null
): Promise<string> {
  const base = generateBaseSlug(name, city, state, zip)

  // Check if the base slug is available
  const { data: existing } = await supabase
    .from("clinics")
    .select("slug")
    .like("slug", `${base}%`)

  const existingSlugs = new Set((existing || []).map((c) => c.slug))

  if (!existingSlugs.has(base)) return base

  // Find next available suffix
  let suffix = 2
  while (existingSlugs.has(`${base}-${suffix}`)) {
    suffix++
  }
  return `${base}-${suffix}`
}

function extractDomain(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

/**
 * POST /api/clinic-queue/bulk
 *
 * Bulk actions on queue items.
 *
 * Body: { action: "approve" | "reject" | "delete", ids: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { action, ids } = body

    if (!action || !["approve", "reject", "delete"].includes(action)) {
      return NextResponse.json(
        { error: "action must be one of: approve, reject, delete" },
        { status: 400 }
      )
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      )
    }

    // ── APPROVE ──────────────────────────────────────────────
    if (action === "approve") {
      // Fetch pending queue items for the given IDs
      const { data: items, error: fetchError } = await supabase
        .from("clinic_queue")
        .select("*")
        .in("id", ids)
        .eq("status", "pending")

      if (fetchError) {
        console.error("Error fetching queue items:", fetchError)
        return NextResponse.json(
          { error: `Failed to fetch queue items: ${fetchError.message}` },
          { status: 500 }
        )
      }

      let processed = 0
      const errors: string[] = []

      for (const item of items || []) {
        try {
          const slug = await generateUniqueSlug(supabase, item.name, item.city, item.state, item.zip_code)
          const domain = extractDomain(item.website)

          // Insert into clinics table
          const { data: clinic, error: insertError } = await supabase
            .from("clinics")
            .insert({
              name: item.name,
              slug,
              address: item.address,
              city: item.city,
              state: item.state,
              zip_code: item.zip_code,
              country: item.country,
              latitude: item.latitude,
              longitude: item.longitude,
              google_place_id: item.google_place_id,
              google_maps_url: item.google_maps_url,
              phone: item.phone,
              phone_formatted: item.phone_formatted,
              website: item.website,
              domain,
              description: item.description,
              google_rating: item.google_rating,
              reviews_count: item.reviews_count,
              photos: item.photos,
              tags: item.search_tag.split(", ").map((t: string) => t.trim()).filter(Boolean),
              email: item.email,
              is_active: true,
              is_draft: false,
            })
            .select()
            .single()

          if (insertError) {
            errors.push(`${item.name}: ${insertError.message}`)
            continue
          }

          // Mark queue item as imported
          const { error: updateError } = await supabase
            .from("clinic_queue")
            .update({
              status: "imported",
              imported_clinic_id: clinic.id,
              imported_at: new Date().toISOString(),
            })
            .eq("id", item.id)

          if (updateError) {
            errors.push(`${item.name}: imported but failed to update queue status - ${updateError.message}`)
          }

          processed++
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error"
          errors.push(`${item.name}: ${message}`)
        }
      }

      return NextResponse.json({ success: true, processed, errors })
    }

    // ── REJECT ───────────────────────────────────────────────
    if (action === "reject") {
      const { data, error } = await supabase
        .from("clinic_queue")
        .update({ status: "rejected" })
        .in("id", ids)
        .select("id")

      if (error) {
        console.error("Error rejecting queue items:", error)
        return NextResponse.json(
          { error: `Failed to reject queue items: ${error.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        processed: data?.length || 0,
        errors: [],
      })
    }

    // ── DELETE ────────────────────────────────────────────────
    if (action === "delete") {
      const { data, error } = await supabase
        .from("clinic_queue")
        .delete()
        .in("id", ids)
        .select("id")

      if (error) {
        console.error("Error deleting queue items:", error)
        return NextResponse.json(
          { error: `Failed to delete queue items: ${error.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        processed: data?.length || 0,
        errors: [],
      })
    }

    return NextResponse.json(
      { error: "Unhandled action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
