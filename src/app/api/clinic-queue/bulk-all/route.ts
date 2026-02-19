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
      const errors: string[] = []

      // Step 1: Generate all base slugs and collect unique prefixes for a
      // single bulk DB lookup instead of one query per clinic.
      const baseSlugs = items.map((item) =>
        generateBaseSlug(item.name, item.city, item.state, item.zip_code)
      )

      // Fetch all existing slugs that share any of our base prefixes in one query
      const { data: existingRows } = await supabase
        .from("clinics")
        .select("slug")
        .or(baseSlugs.map((b) => `slug.like.${b}%`).join(","))

      const existingSlugs = new Set((existingRows || []).map((c) => c.slug))
      // Track slugs assigned within this batch to avoid intra-batch collisions
      const assignedThisBatch = new Set<string>()

      const slugs = baseSlugs.map((base) => {
        if (!existingSlugs.has(base) && !assignedThisBatch.has(base)) {
          assignedThisBatch.add(base)
          return base
        }
        let suffix = 2
        while (existingSlugs.has(`${base}-${suffix}`) || assignedThisBatch.has(`${base}-${suffix}`)) {
          suffix++
        }
        const slug = `${base}-${suffix}`
        assignedThisBatch.add(slug)
        return slug
      })

      // Step 2: Build all clinic rows
      const clinicRows = items.map((item, i) => ({
        name: item.name,
        slug: slugs[i],
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
        domain: extractDomain(item.website),
        description: item.description,
        google_rating: item.google_rating,
        reviews_count: item.reviews_count,
        photos: item.photos,
        tags: (item.search_tag || "").split(", ").map((t: string) => t.trim()).filter(Boolean),
        email: item.email,
        is_active: true,
        is_draft: false,
      }))

      // Step 3: Bulk insert all clinics in one statement
      const { data: insertedClinics, error: insertError } = await supabase
        .from("clinics")
        .insert(clinicRows)
        .select("id, slug")

      if (insertError) {
        errors.push(`Bulk insert failed: ${insertError.message}`)
        return NextResponse.json({
          processed: 0,
          errors,
          remaining: total,
          total,
        })
      }

      const processed = insertedClinics?.length || 0

      // Step 4: Map slug → inserted clinic id for queue status updates
      const slugToId = new Map((insertedClinics || []).map((c) => [c.slug, c.id]))

      // Step 5: Update queue items in parallel (all fire at once, no sequential waiting)
      const now = new Date().toISOString()
      await Promise.all(
        items.map((item, i) => {
          const clinicId = slugToId.get(slugs[i])
          if (!clinicId) return Promise.resolve()
          return supabase
            .from("clinic_queue")
            .update({
              status: "imported",
              imported_clinic_id: clinicId,
              imported_at: now,
            })
            .eq("id", item.id)
        })
      )

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
