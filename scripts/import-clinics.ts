/**
 * Import Longevity Clinics from CSV
 *
 * Imports clinic data from the "Local Longevity Clinics US & Europe" spreadsheet
 * into the clinics + clinic_contacts tables.
 *
 * Features:
 *   - Generates unique slugs from name + city + state
 *   - Extracts domain from website URL
 *   - Splits tags into text[]
 *   - Maps up to 5 Hunter contacts per clinic
 *   - Collects photos, videos, and custom URLs
 *   - Batch inserts in chunks of 100 for performance
 *   - Skips duplicates based on external_id
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/import-clinics.ts [options]
 *
 * Options:
 *   --file <path>    Path to CSV file (default: ~/Downloads/Local Longevity Clinics US & Europe - Sheet1.csv)
 *   --dry-run        Preview what would be imported without writing to database
 *   --limit <N>      Only import first N rows
 */

import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import Papa from "papaparse"

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

function getArg(name: string, defaultValue: string): string {
  const idx = process.argv.indexOf(`--${name}`)
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1]
  }
  return defaultValue
}

const dryRun = hasFlag("dry-run")
const limitStr = getArg("limit", "0")
const limit = parseInt(limitStr, 10) || 0
const csvPath = getArg(
  "file",
  `${process.env.HOME}/Downloads/Local Longevity Clinics US & Europe - Sheet1.csv`
)

// ---------------------------------------------------------------------------
// Environment setup
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  console.error("Run with: npx tsx --env-file=.env.local scripts/import-clinics.ts")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to dashes
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Trim leading/trailing dashes
    .slice(0, 200) // Limit length
}

function generateSlug(name: string, city: string | null, state: string | null): string {
  const parts = [name]
  if (city) parts.push(city)
  if (state) parts.push(state)
  return slugify(parts.join(" "))
}

// ---------------------------------------------------------------------------
// Domain extraction
// ---------------------------------------------------------------------------

function extractDomain(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// CSV Row type
// ---------------------------------------------------------------------------

interface CsvRow {
  ID: string
  "Company Name": string
  Address: string
  City: string
  State: string
  "Zip Code": string
  Phone: string
  "Phone Formatted": string
  Email: string
  Website: string
  "Google Maps URL": string
  About: string
  Tags: string
  "Google Place ID": string
  "Google Rating": string
  "Reviews Count": string
  Featured: string
  Active: string
  "Metro Area": string
  "Search Term": string
  "Created At": string
  "Updated At": string
  "Hunter Contact Name 1": string
  "Hunter Email 1": string
  "Hunter Phone 1": string
  "Hunter Contact Name 2": string
  "Hunter Email 2": string
  "Hunter Phone 2": string
  "Hunter Contact Name 3": string
  "Hunter Email 3": string
  "Hunter Phone 3": string
  "Hunter Contact Name 4": string
  "Hunter Email 4": string
  "Hunter Phone 4": string
  "Hunter Contact Name 5": string
  "Hunter Email 5": string
  "Hunter Phone 5": string
  "Photo 1": string
  "Photo 2": string
  "Photo 3": string
  "Photo 4": string
  "Video Embed 1": string
  "Video Embed 2": string
  "Video Embed 3": string
  "Video Embed 4": string
  "URL Title 1": string
  "URL 1": string
  "URL Title 2": string
  "URL 2": string
  "URL Title 3": string
  "URL 3": string
  "URL Title 4": string
  "URL 4": string
  Facebook: string
  Instagram: string
  LinkedIn: string
  YouTube: string
  "Twitter/X": string
  TikTok: string
  Threads: string
  Latitude: string
  Longitude: string
}

// ---------------------------------------------------------------------------
// Row processing
// ---------------------------------------------------------------------------

function parseRow(row: CsvRow) {
  const name = (row["Company Name"] || "").trim()
  if (!name) return null

  const city = row.City?.trim() || null
  const state = row.State?.trim() || null
  const website = row.Website?.trim() || null

  // Tags: comma-separated string → array
  const tags = row.Tags
    ? row.Tags.split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  // Photos: collect non-empty
  const photos = [row["Photo 1"], row["Photo 2"], row["Photo 3"], row["Photo 4"]]
    .map((p) => p?.trim())
    .filter(Boolean) as string[]

  // Videos: collect non-empty
  const videos = [
    row["Video Embed 1"],
    row["Video Embed 2"],
    row["Video Embed 3"],
    row["Video Embed 4"],
  ]
    .map((v) => v?.trim())
    .filter(Boolean) as string[]

  // Custom URLs: collect non-empty pairs
  const customUrls: { title: string; url: string }[] = []
  for (let i = 1; i <= 4; i++) {
    const title = row[`URL Title ${i}` as keyof CsvRow]?.trim()
    const url = row[`URL ${i}` as keyof CsvRow]?.trim()
    if (url) {
      customUrls.push({ title: title || `Link ${i}`, url })
    }
  }

  // Hunter contacts: collect non-empty sets
  const contacts: { name: string | null; email: string | null; phone: string | null }[] = []
  for (let i = 1; i <= 5; i++) {
    const cName = row[`Hunter Contact Name ${i}` as keyof CsvRow]?.trim() || null
    const cEmail = row[`Hunter Email ${i}` as keyof CsvRow]?.trim() || null
    const cPhone = row[`Hunter Phone ${i}` as keyof CsvRow]?.trim() || null
    if (cName || cEmail || cPhone) {
      contacts.push({ name: cName, email: cEmail, phone: cPhone })
    }
  }

  // Determine country from data patterns
  // European cities won't have US state codes
  let country = "US"
  if (state && state.length > 2) {
    // European entries often have full country or region names
    country = state
  }

  const rating = row["Google Rating"] ? parseFloat(row["Google Rating"]) : null
  const reviewsCount = row["Reviews Count"] ? parseInt(row["Reviews Count"], 10) : 0

  return {
    clinic: {
      name,
      slug: "", // Will be generated with dedup
      external_id: row.ID?.trim() || null,
      address: row.Address?.trim() || null,
      city,
      state,
      zip_code: row["Zip Code"]?.trim() || null,
      country,
      latitude: row.Latitude ? parseFloat(row.Latitude) : null,
      longitude: row.Longitude ? parseFloat(row.Longitude) : null,
      metro_area: row["Metro Area"]?.trim() || null,
      google_maps_url: row["Google Maps URL"]?.trim() || null,
      google_place_id: row["Google Place ID"]?.trim() || null,
      phone: row.Phone?.trim() || null,
      phone_formatted: row["Phone Formatted"]?.trim() || null,
      email: row.Email?.trim() || null,
      website,
      domain: extractDomain(website),
      description: row.About?.trim() || null,
      tags,
      search_term: row["Search Term"]?.trim() || null,
      google_rating: rating,
      reviews_count: isNaN(reviewsCount) ? 0 : reviewsCount,
      photos,
      videos,
      custom_urls: customUrls,
      facebook: row.Facebook?.trim() || null,
      instagram: row.Instagram?.trim() || null,
      linkedin: row.LinkedIn?.trim() || null,
      youtube: row.YouTube?.trim() || null,
      twitter: row["Twitter/X"]?.trim() || null,
      tiktok: row.TikTok?.trim() || null,
      threads: row.Threads?.trim() || null,
      is_featured: row.Featured?.toUpperCase() === "TRUE",
      is_active: row.Active?.toUpperCase() !== "FALSE", // Default true
      is_draft: false,
    },
    contacts,
  }
}

// ---------------------------------------------------------------------------
// Main import
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Clinic Import ===")
  console.log(`CSV: ${csvPath}`)
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`)
  if (limit > 0) console.log(`Limit: ${limit} rows`)
  console.log("")

  // Check file exists
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    process.exit(1)
  }

  // Read and parse CSV
  const csvContent = fs.readFileSync(csvPath, "utf-8")
  const parsed = Papa.parse<CsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (parsed.errors.length > 0) {
    console.warn(`CSV parse warnings: ${parsed.errors.length}`)
    parsed.errors.slice(0, 5).forEach((e) => console.warn(`  - Row ${e.row}: ${e.message}`))
  }

  let rows = parsed.data
  console.log(`Parsed ${rows.length} rows from CSV`)

  if (limit > 0) {
    rows = rows.slice(0, limit)
    console.log(`Processing first ${rows.length} rows (limit applied)`)
  }

  // Fetch existing external_ids to skip duplicates
  const { data: existingClinics } = await supabase
    .from("clinics")
    .select("external_id")
    .not("external_id", "is", null)

  const existingIds = new Set(
    (existingClinics || []).map((c) => c.external_id).filter(Boolean)
  )
  console.log(`Found ${existingIds.size} existing clinics in database`)

  // Process rows
  const parsedRows = rows
    .map((row) => parseRow(row))
    .filter(Boolean) as { clinic: Record<string, unknown>; contacts: { name: string | null; email: string | null; phone: string | null }[] }[]

  // Filter out duplicates
  const newRows = parsedRows.filter(
    (r) => !r.clinic.external_id || !existingIds.has(r.clinic.external_id as string)
  )
  const skipped = parsedRows.length - newRows.length

  console.log(`New clinics to import: ${newRows.length}`)
  console.log(`Skipped (already exist): ${skipped}`)
  console.log("")

  if (dryRun) {
    console.log("DRY RUN — showing first 10 clinics:")
    for (const row of newRows.slice(0, 10)) {
      const c = row.clinic
      console.log(
        `  ${c.name} | ${c.city}, ${c.state} | ${c.country} | ${row.contacts.length} contacts | tags: ${(c.tags as string[]).join(", ")}`
      )
    }

    // Show stats
    const withContacts = newRows.filter((r) => r.contacts.length > 0).length
    const withRating = newRows.filter((r) => (r.clinic.google_rating as number | null) !== null).length
    const withDesc = newRows.filter((r) => r.clinic.description).length
    const totalContacts = newRows.reduce((sum, r) => sum + r.contacts.length, 0)

    console.log("")
    console.log("Stats:")
    console.log(`  With contacts: ${withContacts}`)
    console.log(`  With rating: ${withRating}`)
    console.log(`  With description: ${withDesc}`)
    console.log(`  Total contacts: ${totalContacts}`)
    return
  }

  // Generate unique slugs
  const slugCounts = new Map<string, number>()
  for (const row of newRows) {
    const c = row.clinic
    let baseSlug = generateSlug(c.name as string, c.city as string | null, c.state as string | null)
    if (!baseSlug) baseSlug = `clinic-${c.external_id || Math.random().toString(36).slice(2, 8)}`

    const count = slugCounts.get(baseSlug) || 0
    slugCounts.set(baseSlug, count + 1)

    c.slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`
  }

  // Batch insert clinics
  const BATCH_SIZE = 100
  let imported = 0
  let contactsImported = 0
  let errors = 0
  const startTime = Date.now()

  for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
    const batch = newRows.slice(i, i + BATCH_SIZE)
    const clinicData = batch.map((r) => r.clinic)

    const { data: insertedClinics, error } = await supabase
      .from("clinics")
      .insert(clinicData)
      .select("id, external_id")

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message)
      // Try one-by-one for this batch
      for (const row of batch) {
        const { data: single, error: singleError } = await supabase
          .from("clinics")
          .insert(row.clinic)
          .select("id, external_id")
          .single()

        if (singleError) {
          console.error(`  Error inserting "${row.clinic.name}": ${singleError.message}`)
          errors++
        } else if (single) {
          imported++
          // Insert contacts for this clinic
          if (row.contacts.length > 0) {
            const contactData = row.contacts.map((c) => ({
              clinic_id: single.id,
              name: c.name,
              email: c.email,
              phone: c.phone,
            }))
            const { error: contactError } = await supabase
              .from("clinic_contacts")
              .insert(contactData)
            if (!contactError) {
              contactsImported += row.contacts.length
            }
          }
        }
      }
      continue
    }

    if (insertedClinics) {
      imported += insertedClinics.length

      // Build a map of external_id → clinic.id for contact insertion
      const idMap = new Map(
        insertedClinics.map((c) => [c.external_id, c.id])
      )

      // Collect all contacts for this batch
      const allContacts: { clinic_id: string; name: string | null; email: string | null; phone: string | null }[] = []

      for (const row of batch) {
        const clinicId = idMap.get(row.clinic.external_id as string)
        if (!clinicId || row.contacts.length === 0) continue

        for (const contact of row.contacts) {
          allContacts.push({
            clinic_id: clinicId,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
          })
        }
      }

      if (allContacts.length > 0) {
        const { error: contactError } = await supabase
          .from("clinic_contacts")
          .insert(allContacts)

        if (contactError) {
          console.error(`  Contact batch error:`, contactError.message)
        } else {
          contactsImported += allContacts.length
        }
      }
    }

    // Progress update
    const progress = Math.min(i + BATCH_SIZE, newRows.length)
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    process.stdout.write(`\r  Imported ${imported}/${newRows.length} clinics, ${contactsImported} contacts (${elapsed}s)`)
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n\n=== Import Complete ===`)
  console.log(`  Clinics imported: ${imported}`)
  console.log(`  Contacts imported: ${contactsImported}`)
  console.log(`  Skipped (duplicates): ${skipped}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Total time: ${totalTime}s`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
