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

interface ClinicRow {
  name: string
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  country?: string | null
  phone?: string | null
  phone_formatted?: string | null
  email?: string | null
  website?: string | null
  google_maps_url?: string | null
  description?: string | null
  tags?: string[]
  google_place_id?: string | null
  google_rating?: number | null
  reviews_count?: number
  is_featured?: boolean
  is_active?: boolean
  metro_area?: string | null
  search_term?: string | null
  external_id?: string | null
  latitude?: number | null
  longitude?: number | null
  photos?: string[]
  videos?: string[]
  custom_urls?: { title: string; url: string }[]
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  youtube?: string | null
  twitter?: string | null
  tiktok?: string | null
  threads?: string | null
  // Hunter contacts embedded in row
  contacts?: { name: string | null; email: string | null; phone: string | null }[]
}

/**
 * POST /api/import/clinics
 *
 * Import clinics from parsed CSV data.
 *
 * Body: { clinics: ClinicRow[] }
 *
 * Response: { success, imported, skipped, errors, total }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const rows: ClinicRow[] = body.clinics
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "No clinic data provided" },
        { status: 400 }
      )
    }

    // Fetch existing external IDs to skip duplicates
    const externalIds = rows
      .map((r) => r.external_id)
      .filter(Boolean) as string[]

    let existingIds = new Set<string>()
    if (externalIds.length > 0) {
      // Batch query in chunks of 500
      for (let i = 0; i < externalIds.length; i += 500) {
        const chunk = externalIds.slice(i, i + 500)
        const { data } = await supabase
          .from("clinics")
          .select("external_id")
          .in("external_id", chunk)
        if (data) {
          data.forEach((c) => {
            if (c.external_id) existingIds.add(c.external_id)
          })
        }
      }
    }

    let imported = 0
    let skipped = 0
    let contactsImported = 0
    const errors: string[] = []

    // Track slugs to avoid duplicates within this batch
    const slugCounts = new Map<string, number>()

    // Process in batches of 100
    const BATCH_SIZE = 100

    // Filter out existing
    const newRows = rows.filter((r) => {
      if (r.external_id && existingIds.has(r.external_id)) {
        skipped++
        return false
      }
      return true
    })

    for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
      const batch = newRows.slice(i, i + BATCH_SIZE)

      // Prepare clinic data
      const clinicData = batch.map((row) => {
        let baseSlug = generateSlug(row.name, row.city, row.state)
        if (!baseSlug) baseSlug = `clinic-${row.external_id || Math.random().toString(36).slice(2, 8)}`

        const count = slugCounts.get(baseSlug) || 0
        slugCounts.set(baseSlug, count + 1)
        const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`

        return {
          name: row.name,
          slug,
          external_id: row.external_id || null,
          address: row.address || null,
          city: row.city || null,
          state: row.state || null,
          zip_code: row.zip_code || null,
          country: row.country || "US",
          latitude: row.latitude || null,
          longitude: row.longitude || null,
          metro_area: row.metro_area || null,
          google_maps_url: row.google_maps_url || null,
          google_place_id: row.google_place_id || null,
          phone: row.phone || null,
          phone_formatted: row.phone_formatted || null,
          email: row.email || null,
          website: row.website || null,
          domain: extractDomain(row.website),
          description: row.description || null,
          tags: row.tags || [],
          search_term: row.search_term || null,
          google_rating: row.google_rating || null,
          reviews_count: row.reviews_count || 0,
          photos: row.photos || [],
          videos: row.videos || [],
          custom_urls: row.custom_urls || [],
          facebook: row.facebook || null,
          instagram: row.instagram || null,
          linkedin: row.linkedin || null,
          youtube: row.youtube || null,
          twitter: row.twitter || null,
          tiktok: row.tiktok || null,
          threads: row.threads || null,
          is_featured: row.is_featured || false,
          is_active: row.is_active !== false,
          is_draft: false,
        }
      })

      // Insert batch
      const { data: insertedClinics, error: insertError } = await supabase
        .from("clinics")
        .insert(clinicData)
        .select("id, external_id")

      if (insertError) {
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${insertError.message}`)
        continue
      }

      if (insertedClinics) {
        imported += insertedClinics.length

        // Build external_id → id map for contact insertion
        const idMap = new Map(
          insertedClinics.map((c) => [c.external_id, c.id])
        )

        // Collect contacts for all clinics in batch
        const allContacts: { clinic_id: string; name: string | null; email: string | null; phone: string | null }[] = []

        for (const row of batch) {
          const clinicId = idMap.get(row.external_id || "")
          if (!clinicId || !row.contacts || row.contacts.length === 0) continue

          for (const contact of row.contacts) {
            if (contact.name || contact.email || contact.phone) {
              allContacts.push({
                clinic_id: clinicId,
                name: contact.name || null,
                email: contact.email || null,
                phone: contact.phone || null,
              })
            }
          }
        }

        if (allContacts.length > 0) {
          const { error: contactError } = await supabase
            .from("clinic_contacts")
            .insert(allContacts)

          if (contactError) {
            errors.push(`Contacts batch: ${contactError.message}`)
          } else {
            contactsImported += allContacts.length
          }
        }
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      total: rows.length,
      imported,
      skipped,
      contactsImported,
      errors,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    )
  }
}
