import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

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

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  city?: string | null,
  state?: string | null,
  zip?: string | null
): Promise<string> {
  const base = generateBaseSlug(name, city, state, zip)
  const { data: existing } = await supabase
    .from("clinics")
    .select("slug")
    .like("slug", `${base}%`)

  const existingSlugs = new Set((existing || []).map((c) => c.slug))
  if (!existingSlugs.has(base)) return base

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
 * POST /api/clinic-queue/bulk-all
 *
 * Perform a bulk action on ALL matching queue items (no IDs needed).
 * Processes in server-side batches. The frontend calls repeatedly until
 * remaining === 0.
 *
 * Body: { action: "approve" | "reject", batchSize?: number, filter?: { perplexity_status?: string } }
 *
 * - approve: imports pending queue items into clinics table
 * - reject: marks pending queue items as rejected
 *
 * Response: { processed, errors, remaining, total }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { action, filter } = body
    let batchSize = 50
    if (body.batchSize && typeof body.batchSize === "number" && body.batchSize > 0) {
      batchSize = Math.min(body.batchSize, 200)
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "action must be one of: approve, reject" },
        { status: 400 }
      )
    }

    // Build query for counting total eligible
    let countQuery = supabase
      .from("clinic_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")

    if (filter?.perplexity_status) {
      countQuery = countQuery.eq("perplexity_status", filter.perplexity_status)
    }

    const { count: totalEligible } = await countQuery
    const total = totalEligible || 0

    if (total === 0) {
      return NextResponse.json({
        processed: 0,
        errors: [],
        remaining: 0,
        total: 0,
      })
    }

    // Fetch this batch
    let fetchQuery = supabase
      .from("clinic_queue")
      .select("*")
      .eq("status", "pending")

    if (filter?.perplexity_status) {
      fetchQuery = fetchQuery.eq("perplexity_status", filter.perplexity_status)
    }

    fetchQuery = fetchQuery
      .order("created_at", { ascending: true })
      .limit(batchSize)

    const { data: items, error: fetchError } = await fetchQuery

    if (fetchError || !items || items.length === 0) {
      return NextResponse.json({
        processed: 0,
        errors: [],
        remaining: 0,
        total,
      })
    }

    // ── APPROVE ──────────────────────────────────────────────
    if (action === "approve") {
      let processed = 0
      const errors: string[] = []

      for (const item of items) {
        try {
          const slug = await generateUniqueSlug(supabase, item.name, item.city, item.state, item.zip_code)
          const domain = extractDomain(item.website)

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

          await supabase
            .from("clinic_queue")
            .update({
              status: "imported",
              imported_clinic_id: clinic.id,
              imported_at: new Date().toISOString(),
            })
            .eq("id", item.id)

          processed++
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error"
          errors.push(`${item.name}: ${message}`)
        }
      }

      // Count remaining
      let remainQuery = supabase
        .from("clinic_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")

      if (filter?.perplexity_status) {
        remainQuery = remainQuery.eq("perplexity_status", filter.perplexity_status)
      }

      const { count: remaining } = await remainQuery

      return NextResponse.json({
        processed,
        errors,
        remaining: remaining || 0,
        total,
      })
    }

    // ── REJECT ───────────────────────────────────────────────
    if (action === "reject") {
      const itemIds = items.map((i) => i.id)

      const { data, error } = await supabase
        .from("clinic_queue")
        .update({ status: "rejected" })
        .in("id", itemIds)
        .select("id")

      // Count remaining
      let remainQuery = supabase
        .from("clinic_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")

      if (filter?.perplexity_status) {
        remainQuery = remainQuery.eq("perplexity_status", filter.perplexity_status)
      }

      const { count: remaining } = await remainQuery

      return NextResponse.json({
        processed: data?.length || 0,
        errors: error ? [error.message] : [],
        remaining: remaining || 0,
        total,
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
