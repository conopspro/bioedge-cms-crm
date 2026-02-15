/**
 * Batch Enhance Companies Script
 *
 * Processes all companies with "researching" status through the
 * /api/enhance-company endpoint (Perplexity AI + Hunter.io).
 *
 * Supports chunked parallel execution so multiple agents can
 * work on different slices of the company list simultaneously.
 *
 * Usage:
 *   npx tsx scripts/batch-enhance-companies.ts [options]
 *
 * Options:
 *   --chunk <N>          0-indexed chunk number (default: 0)
 *   --total-chunks <N>   Total number of parallel agents (default: 1)
 *   --delay <ms>         Delay between companies in ms (default: 2000)
 *   --dry-run            List companies without processing
 *   --all                Process ALL companies, not just "researching" status
 *   --skip-enhanced      Skip companies that already have a description
 *   --skip-complete      Skip companies that already have both category AND bioedge_fit
 *   --base-url <URL>     API base URL (default: http://localhost:3000)
 */

import { createClient } from "@supabase/supabase-js"

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function getArg(name: string, defaultValue: string): string {
  const idx = process.argv.indexOf(`--${name}`)
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1]
  }
  return defaultValue
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

const chunkIndex = parseInt(getArg("chunk", "0"), 10)
const totalChunks = parseInt(getArg("total-chunks", "1"), 10)
const delayMs = parseInt(getArg("delay", "2000"), 10)
const dryRun = hasFlag("dry-run")
const skipEnhanced = hasFlag("skip-enhanced")
const skipComplete = hasFlag("skip-complete")
const allCompaniesFlag = hasFlag("all")
const baseUrl = getArg("base-url", "http://localhost:3000")

// ---------------------------------------------------------------------------
// Supabase client (uses service role key for direct DB access)
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
  console.error("Make sure .env.local is loaded. Run with: npx tsx --env-file=.env.local scripts/batch-enhance-companies.ts")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface CompanyRow {
  id: string
  name: string
  website: string | null
  domain: string | null
  description: string | null
  category: string | null
  bioedge_fit: string | null
}

async function main() {
  console.log("=".repeat(60))
  console.log("  BATCH ENHANCE COMPANIES")
  console.log("=".repeat(60))
  console.log(`  Chunk: ${chunkIndex} of ${totalChunks}`)
  console.log(`  Delay: ${delayMs}ms`)
  console.log(`  Base URL: ${baseUrl}`)
  console.log(`  Dry run: ${dryRun}`)
  console.log(`  All companies: ${allCompaniesFlag}`)
  console.log(`  Skip enhanced: ${skipEnhanced}`)
  console.log(`  Skip complete: ${skipComplete}`)
  console.log("=".repeat(60))
  console.log()

  // Fetch companies
  let query = supabase
    .from("companies")
    .select("id, name, website, domain, description, category, bioedge_fit")
    .order("created_at", { ascending: true })

  // Unless --all flag is set, only process "researching" companies
  if (!allCompaniesFlag) {
    query = query.eq("status", "researching")
  }

  if (skipEnhanced) {
    query = query.is("description", null)
  }

  const { data: allCompanies, error: fetchError } = await query

  if (fetchError) {
    console.error("ERROR: Failed to fetch companies:", fetchError.message)
    process.exit(1)
  }

  if (!allCompanies || allCompanies.length === 0) {
    console.log(allCompaniesFlag ? "No companies found." : "No companies with 'researching' status found.")
    process.exit(0)
  }

  console.log(`Total companies to process: ${allCompanies.length}`)

  // Filter out companies that already have both category and bioedge_fit
  let companies = allCompanies as CompanyRow[]
  if (skipComplete) {
    const before = companies.length
    companies = companies.filter((c) => !c.category || !c.bioedge_fit)
    const skipped = before - companies.length
    console.log(`Skipping ${skipped} companies that already have category + bioedge_fit`)
    console.log(`Remaining to process: ${companies.length}`)
  }

  // Apply chunking via interleaving
  const myCompanies: CompanyRow[] = companies.filter(
    (_: CompanyRow, i: number) => i % totalChunks === chunkIndex
  )

  console.log(`This chunk (${chunkIndex}): ${myCompanies.length} companies`)
  console.log()

  // Dry run: just list companies
  if (dryRun) {
    console.log("DRY RUN - Companies in this chunk:")
    console.log("-".repeat(60))
    for (let i = 0; i < myCompanies.length; i++) {
      const c = myCompanies[i]
      const hasDesc = c.description ? " [has description]" : ""
      console.log(`  ${i + 1}. ${c.name} (${c.domain || c.website || "no website"})${hasDesc}`)
    }
    console.log("-".repeat(60))
    console.log(`Total: ${myCompanies.length} companies would be processed`)
    process.exit(0)
  }

  // Process companies
  const startTime = Date.now()
  let successCount = 0
  let failCount = 0
  let totalFieldsUpdated = 0
  let totalContactsCreated = 0
  const failures: { name: string; id: string; error: string }[] = []

  for (let i = 0; i < myCompanies.length; i++) {
    const company = myCompanies[i]
    const prefix = `[${i + 1}/${myCompanies.length}]`

    process.stdout.write(`${prefix} ${company.name} (${company.domain || "no domain"})... `)

    const callStart = Date.now()

    try {
      const response = await fetch(`${baseUrl}/api/enhance-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: company.id }),
        signal: AbortSignal.timeout(6 * 60 * 1000), // 6 minute timeout
      })

      const data = await response.json()
      const elapsed = ((Date.now() - callStart) / 1000).toFixed(1)

      if (!response.ok || !data.success) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      const fieldsCount = data.fieldsUpdated?.length || 0
      const contactsCount = data.contactsCreated || 0
      totalFieldsUpdated += fieldsCount
      totalContactsCreated += contactsCount
      successCount++

      console.log(`SUCCESS: ${fieldsCount} fields, ${contactsCount} contacts (${elapsed}s)`)
    } catch (err) {
      const elapsed = ((Date.now() - callStart) / 1000).toFixed(1)
      const errorMsg = err instanceof Error ? err.message : String(err)
      failCount++
      failures.push({ name: company.name, id: company.id, error: errorMsg })

      console.log(`FAILED: ${errorMsg} (${elapsed}s)`)
    }

    // Delay between companies (skip after last one)
    if (i < myCompanies.length - 1) {
      await sleep(delayMs)
    }
  }

  // Summary
  const totalDuration = Date.now() - startTime
  console.log()
  console.log("=".repeat(60))
  console.log("  BATCH COMPLETE")
  console.log("=".repeat(60))
  console.log(`  Chunk: ${chunkIndex} of ${totalChunks}`)
  console.log(`  Total: ${myCompanies.length} | Success: ${successCount} | Failed: ${failCount}`)
  console.log(`  Fields updated: ${totalFieldsUpdated} | Contacts created: ${totalContactsCreated}`)
  console.log(`  Duration: ${formatDuration(totalDuration)}`)

  if (failures.length > 0) {
    console.log()
    console.log("  Failed companies:")
    for (const f of failures) {
      console.log(`    - ${f.name} (${f.id}): ${f.error}`)
    }
  }

  console.log("=".repeat(60))
}

main().catch((err) => {
  console.error("Unhandled error:", err)
  process.exit(1)
})
