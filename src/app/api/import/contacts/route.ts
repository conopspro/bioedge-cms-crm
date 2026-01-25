import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

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
 * Extract domain from a URL or email
 */
function extractDomain(input: string | null | undefined): string | null {
  if (!input) return null

  // If it's an email, extract domain from after @
  if (input.includes("@")) {
    return input.split("@")[1]?.toLowerCase() || null
  }

  // If it's a URL, parse it
  try {
    const url = input.startsWith("http") ? input : `https://${input}`
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    // If it's just a domain like "hapbee.com"
    return input.replace(/^www\./, "").toLowerCase()
  }
}

/**
 * Map CSV column names to our field names (case-insensitive, flexible)
 */
function mapCsvRow(row: Record<string, any>): Record<string, string | undefined> {
  const get = (keys: string[]): string | undefined => {
    for (const key of keys) {
      // Try exact match first
      if (row[key] !== undefined && row[key] !== "") return String(row[key])
      // Try case-insensitive match
      const lowerKey = key.toLowerCase()
      for (const rowKey of Object.keys(row)) {
        if (rowKey.toLowerCase() === lowerKey && row[rowKey] !== undefined && row[rowKey] !== "") {
          return String(row[rowKey])
        }
      }
    }
    return undefined
  }

  return {
    first_name: get(["first_name", "firstName", "First Name", "first", "First"]),
    last_name: get(["last_name", "lastName", "Last Name", "last", "Last"]),
    email: get(["email", "Email", "e-mail", "E-Mail", "EMAIL"]),
    phone: get(["phone", "Phone", "phone_number", "Phone Number", "telephone", "Telephone", "mobile", "Mobile"]),
    title: get(["title", "Title", "position", "Position", "job_title", "Job Title", "Job_Title"]),
    linkedin_url: get(["linkedin", "LinkedIn", "linkedin_url", "LinkedIn URL", "LinkedIn_URL"]),
    company_name: get(["company", "Company", "company_name", "Company Name", "Company_Name", "organization", "Organization"]),
    website: get(["website", "Website", "company_website", "Company Website", "url", "URL", "company_url"]),
    address1: get(["address", "Address", "address1", "Address1", "Address 1", "street", "Street"]),
    address2: get(["address2", "Address2", "Address 2", "apt", "Apt", "suite", "Suite"]),
    city: get(["city", "City"]),
    state: get(["state", "State", "province", "Province", "region", "Region"]),
    zip: get(["zip", "Zip", "ZIP", "postal_code", "Postal Code", "Postal_Code", "zipcode", "Zipcode"]),
    country: get(["country", "Country"]),
    notes: get(["notes", "Notes", "comments", "Comments"]),
  }
}

interface ImportResult {
  success: boolean
  total: number
  contactsImported: number
  contactsSkipped: number
  contactsDuplicate: number
  companiesCreated: number
  companiesMatched: number
  errors: string[]
  newCompanies: Array<{ id: string; name: string }>
}

/**
 * POST /api/import/contacts
 *
 * Smart contact import with automatic company creation.
 *
 * Features:
 * - Creates companies on-the-fly if they don't exist
 * - Matches existing companies by name or domain
 * - Skips duplicate contacts (by email)
 * - Groups contacts by company
 *
 * Body:
 * - contacts: Array of contact objects from CSV
 * - source: Source label (e.g., "Biohacking Conference 2024")
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { contacts, source } = body

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json(
        { error: "Contacts array is required" },
        { status: 400 }
      )
    }

    // Initialize result tracking
    const result: ImportResult = {
      success: true,
      total: contacts.length,
      contactsImported: 0,
      contactsSkipped: 0,
      contactsDuplicate: 0,
      companiesCreated: 0,
      companiesMatched: 0,
      errors: [],
      newCompanies: [],
    }

    // Get all existing companies for matching
    const { data: existingCompanies } = await supabase
      .from("companies")
      .select("id, name, domain, website")

    // Build lookup maps for companies
    const companyByName = new Map<string, string>() // lowercase name → id
    const companyByDomain = new Map<string, string>() // domain → id

    if (existingCompanies) {
      for (const company of existingCompanies) {
        companyByName.set(company.name.toLowerCase(), company.id)
        if (company.domain) {
          companyByDomain.set(company.domain.toLowerCase(), company.id)
        }
      }
    }

    // Get all existing contact emails to check for duplicates
    const allEmails = contacts
      .map((c: any) => mapCsvRow(c).email?.toLowerCase())
      .filter(Boolean) as string[]

    const { data: existingContacts } = await supabase
      .from("contacts")
      .select("email")
      .in("email", allEmails)

    const existingEmails = new Set(
      (existingContacts || []).map((c: any) => c.email.toLowerCase())
    )

    // Track companies we create during this import (to avoid duplicates within batch)
    const createdCompanies = new Map<string, string>() // key (name or domain) → id

    // Process each contact
    const contactsToInsert: any[] = []

    for (const rawContact of contacts) {
      const mapped = mapCsvRow(rawContact)

      // Skip if no email
      if (!mapped.email) {
        result.contactsSkipped++
        continue
      }

      const email = mapped.email.toLowerCase()

      // Skip duplicates (already in database)
      if (existingEmails.has(email)) {
        result.contactsDuplicate++
        result.contactsSkipped++
        continue
      }

      // Skip duplicates within this import batch
      if (contactsToInsert.some(c => c.email === email)) {
        result.contactsDuplicate++
        result.contactsSkipped++
        continue
      }

      // Find or create company
      let companyId: string | null = null
      const companyName = mapped.company_name?.trim()
      const website = mapped.website?.trim()
      const emailDomain = extractDomain(email)
      const websiteDomain = extractDomain(website)

      // Try to match existing company
      if (companyName) {
        // First try by name
        companyId = companyByName.get(companyName.toLowerCase()) || null

        // Then try by website domain
        if (!companyId && websiteDomain) {
          companyId = companyByDomain.get(websiteDomain) || null
        }

        // Then try by email domain
        if (!companyId && emailDomain) {
          companyId = companyByDomain.get(emailDomain) || null
        }

        // Check if we already created this company in this batch
        if (!companyId) {
          const batchKey = websiteDomain || companyName.toLowerCase()
          companyId = createdCompanies.get(batchKey) || null
        }

        // Create new company if not found
        if (!companyId) {
          const slug = generateSlug(companyName)
          const domain = websiteDomain || emailDomain

          const { data: newCompany, error: companyError } = await supabase
            .from("companies")
            .insert({
              name: companyName,
              website: website || null,
              domain: domain,
              slug: slug,
              status: "researching",
              events: source ? [source] : [],
            })
            .select()
            .single()

          if (companyError) {
            // If slug conflict, try with a suffix
            if (companyError.code === "23505") {
              const { data: retryCompany, error: retryError } = await supabase
                .from("companies")
                .insert({
                  name: companyName,
                  website: website || null,
                  domain: domain,
                  slug: `${slug}-${Date.now()}`,
                  status: "researching",
                  events: source ? [source] : [],
                })
                .select()
                .single()

              if (retryError) {
                result.errors.push(`Failed to create company ${companyName}: ${retryError.message}`)
              } else if (retryCompany) {
                companyId = retryCompany.id
                result.companiesCreated++
                result.newCompanies.push({ id: retryCompany.id, name: companyName })

                // Add to lookup maps
                companyByName.set(companyName.toLowerCase(), retryCompany.id)
                if (domain) companyByDomain.set(domain, retryCompany.id)
                createdCompanies.set(websiteDomain || companyName.toLowerCase(), retryCompany.id)
              }
            } else {
              result.errors.push(`Failed to create company ${companyName}: ${companyError.message}`)
            }
          } else if (newCompany) {
            companyId = newCompany.id
            result.companiesCreated++
            result.newCompanies.push({ id: newCompany.id, name: companyName })

            // Add to lookup maps
            companyByName.set(companyName.toLowerCase(), newCompany.id)
            if (domain) companyByDomain.set(domain, newCompany.id)
            createdCompanies.set(websiteDomain || companyName.toLowerCase(), newCompany.id)
          }
        } else {
          result.companiesMatched++
        }
      } else {
        // No company name - try to match by email domain only
        if (emailDomain) {
          companyId = companyByDomain.get(emailDomain) || null
          if (companyId) {
            result.companiesMatched++
          }
        }
      }

      // Build full name from first + last
      const firstName = mapped.first_name || ""
      const lastName = mapped.last_name || ""
      const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown"

      // Prepare contact for insertion
      contactsToInsert.push({
        company_id: companyId,
        name: fullName, // Combined name field (if database requires it)
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: mapped.phone || null,
        title: mapped.title || null,
        linkedin_url: mapped.linkedin_url || null,
        address1: mapped.address1 || null,
        address2: mapped.address2 || null,
        city: mapped.city || null,
        state: mapped.state || null,
        zip: mapped.zip || null,
        country: mapped.country || null,
        source: source || "CSV Import",
        outreach_status: "not_contacted",
        show_on_articles: false,
        notes: mapped.notes || null,
      })

      // Mark email as seen
      existingEmails.add(email)
    }

    // Insert all contacts
    if (contactsToInsert.length > 0) {
      const { data: inserted, error: insertError } = await supabase
        .from("contacts")
        .insert(contactsToInsert)
        .select()

      if (insertError) {
        console.error("Error inserting contacts:", insertError)
        return NextResponse.json(
          { error: "Failed to import contacts: " + insertError.message },
          { status: 500 }
        )
      }

      result.contactsImported = inserted?.length || 0
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
