/**
 * Batch Hunter.io Contact Finder
 *
 * Searches Hunter.io for contacts across ALL companies that have a domain,
 * filtering to only contacts with >= 80% confidence. Creates contacts in
 * Supabase linked to their respective companies.
 *
 * Supports chunked parallel execution so 3 agents can work simultaneously.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/batch-hunter-contacts.ts [options]
 *
 * Options:
 *   --chunk <N>          0-indexed chunk number (default: 0)
 *   --total-chunks <N>   Total number of parallel agents (default: 1)
 *   --delay <ms>         Delay between companies in ms (default: 2000)
 *   --dry-run            List companies without processing
 *   --min-confidence <N> Minimum confidence threshold (default: 80)
 *   --limit <N>          Max emails per domain from Hunter (default: 50)
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
const minConfidence = parseInt(getArg("min-confidence", "80"), 10)
const hunterLimit = parseInt(getArg("limit", "50"), 10)

// ---------------------------------------------------------------------------
// Environment setup
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const hunterApiKey = process.env.HUNTER_API_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.")
  console.error("Run with: npx tsx --env-file=.env.local scripts/batch-hunter-contacts.ts")
  process.exit(1)
}

if (!hunterApiKey) {
  console.error("ERROR: Missing HUNTER_API_KEY environment variable.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// Hunter.io API
// ---------------------------------------------------------------------------

interface HunterEmail {
  value: string
  type: string | null
  confidence: number
  first_name: string | null
  last_name: string | null
  position: string | null
  seniority: string | null
  department: string | null
  linkedin: string | null
  twitter: string | null
  phone_number: string | null
  verification: { date: string | null; status: string } | null
}

interface HunterResponse {
  data: {
    emails: HunterEmail[]
  }
  meta: {
    results: number
  }
}

async function hunterDomainSearch(domain: string): Promise<HunterEmail[]> {
  const url = new URL("https://api.hunter.io/v2/domain-search")
  url.searchParams.set("api_key", hunterApiKey!)
  url.searchParams.set("domain", domain)
  url.searchParams.set("limit", hunterLimit.toString())

  const response = await fetch(url.toString())

  if (!response.ok) {
    const error = await response.json().catch(() => ({ errors: [{ details: "Unknown error" }] }))
    throw new Error(error.errors?.[0]?.details || `Hunter API error: ${response.status}`)
  }

  const json: HunterResponse = await response.json()
  return json.data.emails || []
}

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

function extractDomain(website: string | null): string | null {
  if (!website) return null
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`)
    return url.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface CompanyRow {
  id: string
  name: string
  website: string | null
  domain: string | null
}

async function main() {
  console.log("=".repeat(60))
  console.log("  BATCH HUNTER.IO CONTACT FINDER")
  console.log("=".repeat(60))
  console.log(`  Chunk: ${chunkIndex} of ${totalChunks}`)
  console.log(`  Delay: ${delayMs}ms`)
  console.log(`  Min confidence: ${minConfidence}%`)
  console.log(`  Hunter limit: ${hunterLimit} emails/domain`)
  console.log(`  Dry run: ${dryRun}`)
  console.log("=".repeat(60))
  console.log()

  // Fetch all companies that have a domain or website
  const { data: allCompanies, error: fetchError } = await supabase
    .from("companies")
    .select("id, name, website, domain")
    .order("name", { ascending: true })

  if (fetchError) {
    console.error("ERROR: Failed to fetch companies:", fetchError.message)
    process.exit(1)
  }

  if (!allCompanies || allCompanies.length === 0) {
    console.log("No companies found.")
    process.exit(0)
  }

  // Filter to only companies with a usable domain
  const companiesWithDomains = (allCompanies as CompanyRow[]).filter((c) => {
    const domain = extractDomain(c.domain) || extractDomain(c.website)
    return !!domain
  })

  console.log(`Total companies: ${allCompanies.length}`)
  console.log(`Companies with domains: ${companiesWithDomains.length}`)
  console.log(`Companies without domains (skipped): ${allCompanies.length - companiesWithDomains.length}`)

  // Apply chunking via interleaving
  const myCompanies = companiesWithDomains.filter(
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
      const domain = extractDomain(c.domain) || extractDomain(c.website)
      console.log(`  ${i + 1}. ${c.name} (${domain})`)
    }
    console.log("-".repeat(60))
    console.log(`Total: ${myCompanies.length} companies would be processed`)
    process.exit(0)
  }

  // Process companies
  const startTime = Date.now()
  let totalCreated = 0
  let totalLinked = 0
  let totalSkipped = 0
  let totalBelowConfidence = 0
  let companiesProcessed = 0
  let companiesWithNewContacts = 0
  let companiesFailed = 0
  const failures: { name: string; domain: string; error: string }[] = []

  for (let i = 0; i < myCompanies.length; i++) {
    const company = myCompanies[i]
    const domain = extractDomain(company.domain) || extractDomain(company.website)!
    const prefix = `[${i + 1}/${myCompanies.length}]`

    process.stdout.write(`${prefix} ${company.name} (${domain})... `)

    try {
      // Call Hunter.io API
      const hunterEmails = await hunterDomainSearch(domain)

      if (hunterEmails.length === 0) {
        console.log(`0 emails found`)
        companiesProcessed++
        if (i < myCompanies.length - 1) await sleep(delayMs)
        continue
      }

      // Filter by confidence threshold
      const highConfidence = hunterEmails.filter((e) => e.confidence >= minConfidence)
      const belowThreshold = hunterEmails.length - highConfidence.length
      totalBelowConfidence += belowThreshold

      if (highConfidence.length === 0) {
        console.log(`${hunterEmails.length} found, 0 above ${minConfidence}% confidence`)
        companiesProcessed++
        if (i < myCompanies.length - 1) await sleep(delayMs)
        continue
      }

      let created = 0
      let linked = 0
      let skipped = 0

      for (const hunterEmail of highConfidence) {
        const emailAddr = hunterEmail.value
        if (!emailAddr) {
          skipped++
          continue
        }

        // Check if contact with this email already exists
        const { data: existingContacts, error: lookupError } = await supabase
          .from("contacts")
          .select("id, company_id")
          .eq("email", emailAddr)

        if (lookupError) {
          skipped++
          continue
        }

        const existing = existingContacts && existingContacts.length > 0 ? existingContacts[0] : null

        if (existing) {
          if (!existing.company_id) {
            // Contact exists but unlinked — link to this company
            const { error: linkError } = await supabase
              .from("contacts")
              .update({ company_id: company.id })
              .eq("id", existing.id)

            if (!linkError) {
              linked++
            } else {
              skipped++
            }
          } else {
            // Already linked to some company
            skipped++
          }
          continue
        }

        // Check for name duplicates within this company
        const firstName = hunterEmail.first_name || ""
        const lastName = hunterEmail.last_name || ""

        if (firstName && lastName) {
          const { data: nameMatches } = await supabase
            .from("contacts")
            .select("id")
            .eq("company_id", company.id)
            .ilike("first_name", firstName)
            .ilike("last_name", lastName)

          if (nameMatches && nameMatches.length > 0) {
            skipped++
            continue
          }
        }

        // Create new contact
        const { error: insertError } = await supabase
          .from("contacts")
          .insert({
            company_id: company.id,
            name: `${firstName} ${lastName}`.trim(),
            email: emailAddr,
            first_name: firstName,
            last_name: lastName,
            title: hunterEmail.position || null,
            linkedin_url: hunterEmail.linkedin || null,
            phone: hunterEmail.phone_number || null,
            source: "hunter",
            outreach_status: "not_contacted",
            show_on_articles: false,
            hunter_confidence: hunterEmail.confidence,
            seniority: hunterEmail.seniority || null,
          })

        if (!insertError) {
          created++
        } else {
          skipped++
        }
      }

      totalCreated += created
      totalLinked += linked
      totalSkipped += skipped
      companiesProcessed++

      if (created > 0 || linked > 0) {
        companiesWithNewContacts++
      }

      const parts: string[] = []
      parts.push(`${hunterEmails.length} found`)
      parts.push(`${highConfidence.length} above ${minConfidence}%`)
      if (created > 0) parts.push(`${created} created`)
      if (linked > 0) parts.push(`${linked} linked`)
      if (skipped > 0) parts.push(`${skipped} skipped`)
      console.log(parts.join(", "))

    } catch (err) {
      companiesFailed++
      const errorMsg = err instanceof Error ? err.message : String(err)
      failures.push({ name: company.name, domain, error: errorMsg })
      console.log(`FAILED: ${errorMsg}`)
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
  console.log(`  Companies processed: ${companiesProcessed}`)
  console.log(`  Companies with new contacts: ${companiesWithNewContacts}`)
  console.log(`  Companies failed: ${companiesFailed}`)
  console.log(`  ─────────────────────────────`)
  console.log(`  Contacts created: ${totalCreated}`)
  console.log(`  Contacts linked: ${totalLinked}`)
  console.log(`  Contacts skipped (duplicates): ${totalSkipped}`)
  console.log(`  Emails below ${minConfidence}% confidence: ${totalBelowConfidence}`)
  console.log(`  Duration: ${formatDuration(totalDuration)}`)

  if (failures.length > 0) {
    console.log()
    console.log("  Failed companies:")
    for (const f of failures) {
      console.log(`    - ${f.name} (${f.domain}): ${f.error}`)
    }
  }

  console.log("=".repeat(60))
}

main().catch((err) => {
  console.error("Unhandled error:", err)
  process.exit(1)
})
