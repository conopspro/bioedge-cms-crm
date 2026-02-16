/**
 * Backfill email_type and clean up junk names on Hunter-sourced contacts.
 *
 * The original batch-hunter-contacts script set first_name to the email prefix
 * when Hunter didn't return a real name (e.g. admin@co.com → "Admin"). This
 * script fixes those names AND uses Hunter's email-verifier API to classify
 * each contact as "personal" or "catch_all".
 *
 * Steps:
 *   1. Fetch Hunter-sourced contacts that have no email_type yet
 *   2. Detect junk/generic first_names (email-prefix-derived names)
 *   3. Call Hunter email-verifier to get accept_all status
 *   4. Set email_type and clear junk names
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-email-type.ts [options]
 *
 * Options:
 *   --dry-run          Preview changes without writing to the database
 *   --names-only       Only clean up names, skip Hunter verification
 *   --delay <ms>       Delay between Hunter API calls (default: 1500)
 *   --limit <N>        Max contacts to process (default: all)
 */

import { createClient } from "@supabase/supabase-js"

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
const namesOnly = hasFlag("names-only")
const delayMs = parseInt(getArg("delay", "1500"), 10)
const maxLimit = getArg("limit", "0") // 0 = no limit

// ---------------------------------------------------------------------------
// Environment setup
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const hunterApiKey = process.env.HUNTER_API_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  )
  console.error(
    "Run with: npx tsx --env-file=.env.local scripts/backfill-email-type.ts"
  )
  process.exit(1)
}

if (!hunterApiKey && !namesOnly) {
  console.error(
    "ERROR: Missing HUNTER_API_KEY (required unless using --names-only)."
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// Generic / junk name patterns
// ---------------------------------------------------------------------------

/** Known generic email prefixes that aren't real person names */
const GENERIC_NAMES = new Set([
  "admin",
  "administrator",
  "info",
  "information",
  "contact",
  "contacts",
  "hello",
  "hi",
  "support",
  "sales",
  "team",
  "office",
  "help",
  "service",
  "services",
  "mail",
  "email",
  "general",
  "enquiries",
  "enquiry",
  "inquiry",
  "billing",
  "accounts",
  "account",
  "accountservices",
  "hr",
  "marketing",
  "media",
  "press",
  "news",
  "events",
  "reception",
  "feedback",
  "webmaster",
  "postmaster",
  "noreply",
  "no-reply",
  "donotreply",
  "subscribe",
  "unsubscribe",
  "newsletter",
  "notifications",
  "alerts",
  "orders",
  "careers",
  "jobs",
  "recruitment",
  "partnerships",
  "partner",
  "legal",
  "compliance",
  "privacy",
  "security",
  "abuse",
  "spam",
  "registrar",
  "operations",
  "finance",
  "purchasing",
  "procurement",
  "shipping",
  "returns",
  "customerservice",
  "customercare",
  "helpdesk",
  "techsupport",
  "it",
  "itsupport",
  "dev",
  "development",
  "engineering",
  "research",
  "lab",
  "labs",
  "data",
  "analytics",
  "social",
  "editorial",
  "editor",
  "editors",
  "communications",
  "pr",
  "community",
  "education",
  "training",
  "membership",
  "members",
  "volunteer",
  "volunteers",
  "donate",
  "donations",
  "giving",
  "grants",
  "programs",
  "outreach",
  "advocacy",
  "policy",
  "clinical",
  "pharmacy",
  "medical",
  "health",
  "wellness",
  "4health",
  "unknown",
])

/**
 * Check whether a first_name looks like it was derived from an email prefix
 * rather than being a real person name.
 *
 * The batch-hunter-contacts script falls back to the email prefix as first_name
 * when Hunter doesn't return a real name. These contacts always have a blank
 * last_name. Real people returned by Hunter always have both first AND last names.
 */
function isJunkName(
  firstName: string,
  lastName: string,
  email: string | null
): boolean {
  const name = firstName.toLowerCase().trim()
  if (!name) return false
  const hasLastName = !!(lastName && lastName.trim())

  // 1. Exact match against known generic names — always junk regardless of last name
  if (GENERIC_NAMES.has(name)) return true

  // If the contact has a real last name, the first name is probably real too
  // (e.g. andy@celler8.com → "Andy Smith" is fine)
  if (hasLastName) return false

  // --- Below this point: no last name, so more likely to be email-prefix junk ---

  // 2. Name matches the email prefix (the batch script's fallback behavior)
  if (email) {
    const emailPrefix = email.split("@")[0].toLowerCase()
    if (name === emailPrefix) return true
    // Handle cases like email "a.anderson" → firstName "A.anderson"
    if (name === emailPrefix.replace(/[._-]/g, "")) return true
  }

  // 3. Name is just 1 character (abbreviations)
  if (name.length === 1) return true

  // 4. Name starts with a digit
  if (/^\d/.test(name)) return true

  // 5. Name contains dots or underscores (typical of email prefixes, not real names)
  if (/[._]/.test(name)) return true

  return false
}

// ---------------------------------------------------------------------------
// Hunter email verification
// ---------------------------------------------------------------------------

interface HunterVerifyResult {
  status: "valid" | "invalid" | "accept_all" | "webmail" | "disposable" | "unknown"
  result: "deliverable" | "undeliverable" | "risky" | "unknown"
  score: number
  accept_all: boolean
}

async function verifyEmail(email: string): Promise<HunterVerifyResult | null> {
  if (!hunterApiKey) return null

  const url = new URL("https://api.hunter.io/v2/email-verifier")
  url.searchParams.set("api_key", hunterApiKey)
  url.searchParams.set("email", email)

  const response = await fetch(url.toString())

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      errors: [{ details: "Unknown error" }],
    }))
    throw new Error(
      error.errors?.[0]?.details || `Hunter API error: ${response.status}`
    )
  }

  const json = await response.json()
  return json.data as HunterVerifyResult
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Supabase pagination helper
// ---------------------------------------------------------------------------

interface ContactRow {
  id: string
  first_name: string
  last_name: string
  email: string | null
  email_type: string | null
  source: string | null
}

async function fetchAllContacts(): Promise<ContactRow[]> {
  const allContacts: ContactRow[] = []
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, email_type, source")
      .range(from, from + pageSize - 1)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("ERROR fetching contacts:", error.message)
      process.exit(1)
    }

    if (!data || data.length === 0) break

    allContacts.push(...(data as ContactRow[]))
    from += pageSize

    if (data.length < pageSize) break
  }

  return allContacts
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60))
  console.log("  BACKFILL EMAIL TYPE & CLEAN JUNK NAMES")
  console.log("=".repeat(60))
  console.log(`  Dry run:     ${dryRun}`)
  console.log(`  Names only:  ${namesOnly}`)
  if (!namesOnly) {
    console.log(`  API delay:   ${delayMs}ms`)
  }
  if (parseInt(maxLimit) > 0) {
    console.log(`  Limit:       ${maxLimit} contacts`)
  }
  console.log("=".repeat(60))
  console.log()

  // 1. Fetch all contacts
  console.log("Fetching contacts...")
  const allContacts = await fetchAllContacts()
  console.log(`Total contacts: ${allContacts.length}\n`)

  // 2. Filter to contacts that need processing
  let toProcess = allContacts.filter((c) => {
    // Must have an email to verify
    if (!c.email) return false
    // Skip if already has email_type set (unless name is still junk)
    if (c.email_type && !isJunkName(c.first_name, c.last_name, c.email)) return false
    return true
  })

  if (parseInt(maxLimit) > 0) {
    toProcess = toProcess.slice(0, parseInt(maxLimit))
  }

  console.log(`Contacts to process: ${toProcess.length}`)

  // Categorize what we'll do
  let junkNameCount = 0
  let needsVerification = 0

  for (const contact of toProcess) {
    if (isJunkName(contact.first_name, contact.last_name, contact.email)) {
      junkNameCount++
    }
    if (!contact.email_type) {
      needsVerification++
    }
  }

  console.log(`  Junk names to clean:       ${junkNameCount}`)
  console.log(`  Needing email verification: ${namesOnly ? "skipped (--names-only)" : needsVerification}`)
  console.log()

  if (toProcess.length === 0) {
    console.log("Nothing to do!")
    process.exit(0)
  }

  // 3. Check Hunter API credits if we'll be verifying
  if (!namesOnly && hunterApiKey) {
    try {
      const accountUrl = new URL("https://api.hunter.io/v2/account")
      accountUrl.searchParams.set("api_key", hunterApiKey)
      const accountResp = await fetch(accountUrl.toString())
      if (accountResp.ok) {
        const accountData = await accountResp.json()
        const verifications = accountData.data?.requests?.verifications
        if (verifications) {
          const remaining = verifications.available - verifications.used
          console.log(
            `Hunter API verifications: ${verifications.used}/${verifications.available} used (${remaining} remaining)`
          )
          if (remaining < needsVerification) {
            console.log(
              `⚠️  WARNING: Only ${remaining} verifications remaining but need ${needsVerification}.`
            )
            console.log(
              `   Will process as many as possible.\n`
            )
          } else {
            console.log()
          }
        }
      }
    } catch {
      // Non-fatal — just skip the credit check
    }
  }

  // 4. Process contacts
  let namesCleared = 0
  let emailTypesSet = 0
  let catchAllCount = 0
  let personalCount = 0
  let verifyErrors = 0
  let updateErrors = 0

  for (let i = 0; i < toProcess.length; i++) {
    const contact = toProcess[i]
    const updateData: Record<string, unknown> = {}
    const actions: string[] = []

    // --- Name cleanup ---
    const hasJunkName = isJunkName(contact.first_name, contact.last_name, contact.email)
    if (hasJunkName) {
      updateData.first_name = ""
      updateData.last_name = ""
      actions.push(`clear name "${contact.first_name} ${contact.last_name}".trim()`)
      namesCleared++
    }

    // --- Email verification ---
    if (!namesOnly && !contact.email_type && contact.email) {
      try {
        const result = await verifyEmail(contact.email)
        if (result) {
          if (result.status === "accept_all") {
            updateData.email_type = "catch_all"
            catchAllCount++
            actions.push("email_type → catch_all")
          } else if (result.status === "valid") {
            updateData.email_type = "personal"
            personalCount++
            actions.push("email_type → personal")
          } else {
            // Other status (invalid, unknown, etc.) — still record it
            actions.push(`verification status: ${result.status} (skipped)`)
          }
          emailTypesSet++
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        actions.push(`verify error: ${msg}`)
        verifyErrors++
      }

      // Delay between API calls
      if (i < toProcess.length - 1 && !namesOnly) {
        await sleep(delayMs)
      }
    }

    // --- Apply update ---
    if (Object.keys(updateData).length > 0) {
      if (dryRun) {
        console.log(
          `  [${i + 1}/${toProcess.length}] ${contact.email || contact.id}: ${actions.join(", ")}`
        )
      } else {
        const { error: updateError } = await supabase
          .from("contacts")
          .update(updateData)
          .eq("id", contact.id)

        if (updateError) {
          console.error(
            `  ERROR updating ${contact.email || contact.id}:`,
            updateError.message
          )
          updateErrors++
        } else {
          if (actions.length > 0) {
            console.log(
              `  [${i + 1}/${toProcess.length}] ${contact.email || contact.id}: ${actions.join(", ")}`
            )
          }
        }
      }
    }

    // Progress log every 100 contacts
    if ((i + 1) % 100 === 0) {
      console.log(`  --- Progress: ${i + 1} / ${toProcess.length} ---`)
    }
  }

  // 5. Summary
  console.log()
  console.log("=".repeat(60))
  console.log(dryRun ? "  DRY RUN SUMMARY" : "  BACKFILL COMPLETE")
  console.log("=".repeat(60))
  console.log(`  Contacts processed:     ${toProcess.length}`)
  console.log(`  Names cleared:          ${namesCleared}`)
  if (!namesOnly) {
    console.log(`  Email types set:        ${emailTypesSet}`)
    console.log(`    → catch_all:          ${catchAllCount}`)
    console.log(`    → personal:           ${personalCount}`)
    if (verifyErrors > 0) {
      console.log(`  Verification errors:    ${verifyErrors}`)
    }
  }
  if (updateErrors > 0) {
    console.log(`  Update errors:          ${updateErrors}`)
  }
  console.log("=".repeat(60))

  if (dryRun) {
    console.log("\nRun without --dry-run to apply changes.")
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
