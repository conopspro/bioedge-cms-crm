import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { BiologicalSystem } from "@/types/database"

/**
 * Normalize a string for fuzzy matching
 * Removes special characters, extra spaces, and converts to lowercase
 */
function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim()
}

/**
 * Calculate similarity between two strings (simple word overlap)
 * Returns a score from 0 to 1
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(normalizeForMatch(str1).split(' ').filter(w => w.length > 2))
  const words2 = new Set(normalizeForMatch(str2).split(' ').filter(w => w.length > 2))

  if (words1.size === 0 || words2.size === 0) return 0

  let matches = 0
  for (const word of words1) {
    if (words2.has(word)) matches++
  }

  // Return ratio of matches to smaller set size
  return matches / Math.min(words1.size, words2.size)
}

/**
 * Check if company name is contained within a larger string
 * Handles cases like "Acme Corp — bioEDGE Marketing Package" matching "Acme Corp"
 */
function containsCompanyName(searchString: string, companyName: string): boolean {
  const normalizedSearch = normalizeForMatch(searchString)
  const normalizedCompany = normalizeForMatch(companyName)

  // Check if company name is contained in search string
  if (normalizedSearch.includes(normalizedCompany)) return true

  // Check if all significant words of company name are in search string
  const companyWords = normalizedCompany.split(' ').filter(w => w.length > 2)
  const searchWords = new Set(normalizedSearch.split(' '))

  if (companyWords.length === 0) return false

  const matchedWords = companyWords.filter(w => searchWords.has(w))
  return matchedWords.length === companyWords.length
}

/**
 * Match a category string against available categories from database
 */
function matchCategory(
  categoryStr: string,
  categories: Array<{ name: string; slug: string }>
): string | null {
  if (!categoryStr || categories.length === 0) return null

  const normalized = normalizeForMatch(categoryStr)

  // First try exact slug match
  for (const cat of categories) {
    if (normalizeForMatch(cat.slug) === normalized) {
      return cat.slug
    }
  }

  // Then try exact name match
  for (const cat of categories) {
    if (normalizeForMatch(cat.name) === normalized) {
      return cat.slug
    }
  }

  // Then try partial/fuzzy match
  let bestMatch: { slug: string; score: number } | null = null

  for (const cat of categories) {
    // Check if category name words appear in the input
    const catWords = normalizeForMatch(cat.name).split(' ').filter(w => w.length > 2)
    const inputWords = normalized.split(' ')

    let matchCount = 0
    for (const word of catWords) {
      if (inputWords.some(iw => iw.includes(word) || word.includes(iw))) {
        matchCount++
      }
    }

    if (catWords.length > 0) {
      const score = matchCount / catWords.length
      if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { slug: cat.slug, score }
      }
    }
  }

  return bestMatch?.slug || null
}

/**
 * Parse bioEDGE research package format
 *
 * Expected sections:
 * # Company Name — bioEDGE Marketing Package
 * ## Warm Pitch
 * ## Company Overview
 * ## Native Article
 */
function parseBioEdgePackage(content: string): {
  companyName: string
  categoryRaw: string | null  // Raw category string from file, to be matched against DB
  description: string | null
  systemsSupported: BiologicalSystem[]
  differentiators: string | null
  evidence: string | null
  bioedgeFit: string | null
  warmPitch: string | null
  articleTitle: string | null
  articleContent: string | null
  contactName: string | null
  contactEmail: string | null
  contactTitle: string | null
} {
  const result = {
    companyName: "",
    categoryRaw: null as string | null,  // Raw category string to be matched against DB
    description: null as string | null,
    systemsSupported: [] as BiologicalSystem[],
    differentiators: null as string | null,
    evidence: null as string | null,
    bioedgeFit: null as string | null,
    warmPitch: null as string | null,
    articleTitle: null as string | null,
    articleContent: null as string | null,
    contactName: null as string | null,
    contactEmail: null as string | null,
    contactTitle: null as string | null,
  }

  // Extract company name from title (# Company Name — bioEDGE Marketing Package)
  const titleMatch = content.match(/^#\s+(.+?)(?:\s*[—–-]\s*bioEDGE|$)/m)
  if (titleMatch) {
    result.companyName = titleMatch[1].trim()
  }

  // Split content into sections
  const sections: Record<string, string> = {}
  const sectionRegex = /^##\s+(.+?)$/gm
  let lastIndex = 0
  let lastSection = ""
  let match

  const matches: { name: string; start: number }[] = []
  while ((match = sectionRegex.exec(content)) !== null) {
    matches.push({ name: match[1].trim(), start: match.index })
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : content.length
    const sectionContent = content.slice(current.start, nextStart)
    // Remove the section header from content
    const contentWithoutHeader = sectionContent.replace(/^##\s+.+?\n+/, "").trim()
    sections[current.name.toLowerCase()] = contentWithoutHeader
  }

  // Parse Warm Pitch section
  if (sections["warm pitch"]) {
    const warmPitchContent = sections["warm pitch"]

    // Extract contact info (format: "Name" or "Name, Title")
    const toMatch = warmPitchContent.match(/\*\*To:\*\*\s*(.+)/i)
    if (toMatch) {
      const fullContactLine = toMatch[1].trim()
      // Check for "Name, Title" format
      if (fullContactLine.includes(",")) {
        const parts = fullContactLine.split(",").map(p => p.trim())
        result.contactName = parts[0]
        result.contactTitle = parts.slice(1).join(", ") || null
      } else {
        result.contactName = fullContactLine
      }
    }

    const emailMatch = warmPitchContent.match(/\*\*Email:\*\*\s*(.+)/i)
    if (emailMatch) {
      result.contactEmail = emailMatch[1].trim()
    }

    // Get the actual pitch (everything after Subject line, excluding metadata)
    const subjectIndex = warmPitchContent.indexOf("**Subject:**")
    if (subjectIndex !== -1) {
      const afterSubject = warmPitchContent.slice(subjectIndex)
      const lines = afterSubject.split("\n")
      // Skip subject line and get the rest
      const pitchLines = lines.slice(1).filter(line =>
        !line.startsWith("**To:**") &&
        !line.startsWith("**Email:**") &&
        line.trim() !== "---"
      )
      result.warmPitch = pitchLines.join("\n").trim()
    } else {
      // Just use the whole section minus metadata
      result.warmPitch = warmPitchContent
        .replace(/\*\*To:\*\*.+\n?/gi, "")
        .replace(/\*\*Email:\*\*.+\n?/gi, "")
        .replace(/---/g, "")
        .trim()
    }
  }

  // Parse Company Overview section
  if (sections["company overview"]) {
    const overview = sections["company overview"]

    // Extract company name (backup)
    const companyMatch = overview.match(/\*\*Company:\*\*\s*(.+)/i)
    if (companyMatch && !result.companyName) {
      result.companyName = companyMatch[1].trim()
    }

    // Extract category (store raw string to be matched against DB later)
    const categoryMatch = overview.match(/\*\*Category:\*\*\s*(.+)/i)
    if (categoryMatch) {
      result.categoryRaw = categoryMatch[1].trim()
    }

    // Extract description (What they offer)
    const descMatch = overview.match(/\*\*What they offer:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i)
    if (descMatch) {
      result.description = descMatch[1].trim()
    }

    // Extract systems supported
    const systemsMatch = overview.match(/\*\*System\(s\) supported:\*\*\s*(.+)/i)
    if (systemsMatch) {
      const systemsStr = systemsMatch[1].trim()
      const allSystems: BiologicalSystem[] = [
        "Breath", "Circulation", "Consciousness", "Defense",
        "Detoxification", "Digestive", "Emotional", "Energy Production",
        "Hormonal", "Hydration", "Nervous System", "Regeneration",
        "Stress Response", "Structure & Movement", "Temperature"
      ]
      result.systemsSupported = allSystems.filter(system =>
        systemsStr.toLowerCase().includes(system.toLowerCase())
      )
    }

    // Extract differentiators
    const diffMatch = overview.match(/\*\*Key differentiators:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i)
    if (diffMatch) {
      result.differentiators = diffMatch[1].trim()
    }

    // Extract evidence
    const evidenceMatch = overview.match(/\*\*Evidence\/credibility:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i)
    if (evidenceMatch) {
      result.evidence = evidenceMatch[1].trim()
    }

    // Extract bioEDGE fit
    const fitMatch = overview.match(/\*\*bioEDGE fit:\*\*\s*([\s\S]*?)(?=\n\*\*|---|\n##|$)/i)
    if (fitMatch) {
      result.bioedgeFit = fitMatch[1].trim()
    }
  }

  // Parse Native Article section
  if (sections["native article"]) {
    const articleContent = sections["native article"]

    // Try multiple title formats:
    // 1. **Headline:** Title Here
    // 2. **Title Here** (first bold text as title)
    const headlineMatch = articleContent.match(/\*\*Headline:\*\*\s*(.+)/i)
    if (headlineMatch) {
      result.articleTitle = headlineMatch[1].trim()
      // Get article body (everything after headline)
      const headlineIndex = articleContent.indexOf("**Headline:**")
      const afterHeadline = articleContent.slice(headlineIndex)
      const lines = afterHeadline.split("\n")
      // Skip headline line
      const bodyLines = lines.slice(1)
      result.articleContent = bodyLines.join("\n").trim()
    } else {
      // Look for first bold text as title (format: **Title Here**)
      const boldTitleMatch = articleContent.match(/^\*\*([^*]+)\*\*\s*$/m)
      if (boldTitleMatch) {
        result.articleTitle = boldTitleMatch[1].trim()
        // Get everything after the title line
        const titleIndex = articleContent.indexOf(boldTitleMatch[0])
        result.articleContent = articleContent.slice(titleIndex + boldTitleMatch[0].length).trim()
      } else {
        // Fallback: use first line as title if it looks like a title
        const lines = articleContent.split("\n").filter(l => l.trim())
        if (lines.length > 0) {
          const firstLine = lines[0].replace(/^\*\*|\*\*$/g, "").trim()
          if (firstLine.length > 10 && firstLine.length < 200) {
            result.articleTitle = firstLine
            result.articleContent = lines.slice(1).join("\n").trim()
          } else {
            result.articleContent = articleContent
          }
        }
      }
    }
  }

  return result
}

/**
 * Parse standard frontmatter format (fallback)
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, string>
  body: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterStr = match[1]
  const body = match[2]

  const frontmatter: Record<string, string> = {}
  const lines = frontmatterStr.split("\n")

  for (const line of lines) {
    const colonIndex = line.indexOf(":")
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  }

  return { frontmatter, body }
}

/**
 * Generate a URL-safe slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Extract excerpt from content
 */
function extractExcerpt(content: string, maxLength: number = 160): string {
  const withoutHeaders = content.replace(/^#{1,6}\s+.*$/gm, "")
  const withoutBold = withoutHeaders.replace(/\*\*[^*]+\*\*/g, "")

  const paragraphs = withoutBold
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0 && !p.startsWith("![") && !p.startsWith("-"))

  if (paragraphs.length === 0) return ""

  const firstParagraph = paragraphs[0]
  if (firstParagraph.length <= maxLength) return firstParagraph

  const truncated = firstParagraph.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return truncated.slice(0, lastSpace) + "..."
}

/**
 * Detect if content is bioEDGE package format
 */
function isBioEdgePackage(content: string): boolean {
  return content.includes("bioEDGE Marketing Package") ||
    (content.includes("## Warm Pitch") && content.includes("## Company Overview") && content.includes("## Native Article"))
}

export interface ArticleImportResult {
  success: boolean
  title: string
  slug: string
  error?: string
  companyCreated?: string
  companyMatched?: string
  contactCreated?: string
}

/**
 * POST /api/import/articles
 *
 * Import articles from markdown files
 * Supports both:
 * 1. bioEDGE Marketing Package format (## Warm Pitch, ## Company Overview, ## Native Article)
 * 2. Standard frontmatter format
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      )
    }

    // Fetch all company categories from database for matching
    const { data: categoriesData } = await supabase
      .from("company_categories")
      .select("name, slug")
      .order("display_order")

    const categories = categoriesData || []

    // Fetch all existing companies for fuzzy matching
    const { data: existingCompanies } = await supabase
      .from("companies")
      .select("id, name")

    const allCompanies = existingCompanies || []

    const results: ArticleImportResult[] = []

    for (const file of files) {
      try {
        if (!file.name.endsWith(".md")) {
          results.push({
            success: false,
            title: file.name,
            slug: "",
            error: "Not a markdown file"
          })
          continue
        }

        const content = await file.text()

        // Check if it's a bioEDGE package format
        if (isBioEdgePackage(content)) {
          const parsed = parseBioEdgePackage(content)

          if (!parsed.companyName) {
            results.push({
              success: false,
              title: file.name,
              slug: "",
              error: "Could not extract company name from file"
            })
            continue
          }

          // Match category against database categories
          const matchedCategorySlug = parsed.categoryRaw
            ? matchCategory(parsed.categoryRaw, categories)
            : null

          // Fuzzy match company name against existing companies
          let matchedCompany: { id: string; name: string } | null = null

          // First try exact match (case-insensitive)
          const exactMatch = allCompanies.find(
            c => normalizeForMatch(c.name) === normalizeForMatch(parsed.companyName)
          )

          if (exactMatch) {
            matchedCompany = exactMatch
          } else {
            // Try fuzzy matching - check if any existing company name is contained in the parsed name
            // or if the parsed name is contained in any existing company name
            for (const company of allCompanies) {
              if (containsCompanyName(parsed.companyName, company.name) ||
                  containsCompanyName(company.name, parsed.companyName)) {
                matchedCompany = company
                break
              }
            }

            // If still no match, try similarity scoring
            if (!matchedCompany) {
              let bestMatch: { company: typeof allCompanies[0]; score: number } | null = null

              for (const company of allCompanies) {
                const score = calculateSimilarity(parsed.companyName, company.name)
                if (score >= 0.7 && (!bestMatch || score > bestMatch.score)) {
                  bestMatch = { company, score }
                }
              }

              if (bestMatch) {
                matchedCompany = bestMatch.company
              }
            }
          }

          let companyId: string
          let companyCreated: string | undefined
          let companyMatched: string | undefined

          if (matchedCompany) {
            companyId = matchedCompany.id
            companyMatched = matchedCompany.name

            // Update company with new research data
            await supabase
              .from("companies")
              .update({
                category: matchedCategorySlug,
                description: parsed.description,
                systems_supported: parsed.systemsSupported,
                differentiators: parsed.differentiators,
                evidence: parsed.evidence,
                bioedge_fit: parsed.bioedgeFit,
                warm_pitch: parsed.warmPitch,
                researched_at: new Date().toISOString(),
              })
              .eq("id", companyId)
          } else {
            // Create new company
            const { data: newCompany, error: companyError } = await supabase
              .from("companies")
              .insert({
                name: parsed.companyName,
                category: matchedCategorySlug,
                description: parsed.description,
                systems_supported: parsed.systemsSupported,
                differentiators: parsed.differentiators,
                evidence: parsed.evidence,
                bioedge_fit: parsed.bioedgeFit,
                warm_pitch: parsed.warmPitch,
                status: "researching",
                events: [],
                researched_at: new Date().toISOString(),
              })
              .select("id")
              .single()

            if (companyError || !newCompany) {
              results.push({
                success: false,
                title: file.name,
                slug: "",
                error: `Failed to create company: ${companyError?.message}`
              })
              continue
            }

            companyId = newCompany.id
            companyCreated = parsed.companyName

            // Add to allCompanies so subsequent files can match against it
            allCompanies.push({ id: newCompany.id, name: parsed.companyName })
          }

          // Create contact if we have contact info
          let contactCreated: string | undefined
          if (parsed.contactName && parsed.contactEmail) {
            // Parse contact name into first/last name (format: "First Last")
            const nameParts = parsed.contactName.trim().split(/\s+/)
            const firstName = nameParts[0] || ""
            const lastName = nameParts.slice(1).join(" ") || ""

            // Check if contact exists
            const { data: existingContact } = await supabase
              .from("contacts")
              .select("id")
              .eq("email", parsed.contactEmail)
              .single()

            if (!existingContact) {
              const { data: newContact, error: contactError } = await supabase
                .from("contacts")
                .insert({
                  first_name: firstName,
                  last_name: lastName,
                  email: parsed.contactEmail,
                  title: parsed.contactTitle,
                  company_id: companyId,
                  source: "import",
                  outreach_status: "new",
                })
                .select("id")
                .single()

              if (newContact) {
                contactCreated = parsed.contactName
              } else if (contactError) {
                console.error("Failed to create contact:", contactError.message)
              }
            }
          }

          // Create article if we have article content
          if (parsed.articleTitle && parsed.articleContent) {
            const slug = generateSlug(parsed.articleTitle)

            // Check if article exists
            const { data: existingArticle } = await supabase
              .from("articles")
              .select("id")
              .eq("slug", slug)
              .single()

            if (existingArticle) {
              results.push({
                success: true,
                title: parsed.articleTitle,
                slug,
                companyCreated,
                companyMatched,
                contactCreated,
                error: `Article already exists (company/contact still processed)`
              })
              continue
            }

            const excerpt = extractExcerpt(parsed.articleContent)

            const { error: articleError } = await supabase
              .from("articles")
              .insert({
                title: parsed.articleTitle,
                slug,
                excerpt,
                content: parsed.articleContent,
                status: "draft",
                company_id: companyId,
              })

            if (articleError) {
              results.push({
                success: false,
                title: parsed.articleTitle,
                slug,
                error: `Failed to create article: ${articleError.message}`,
                companyCreated,
                companyMatched,
                contactCreated,
              })
              continue
            }

            results.push({
              success: true,
              title: parsed.articleTitle,
              slug,
              companyCreated,
              companyMatched,
              contactCreated,
            })
          } else {
            // No article but company was processed
            results.push({
              success: true,
              title: `${parsed.companyName} (no article)`,
              slug: "",
              companyCreated,
              companyMatched,
              contactCreated,
            })
          }
        } else {
          // Standard frontmatter format
          const { frontmatter, body } = parseFrontmatter(content)

          const title = frontmatter.title ||
            file.name.replace(/\.md$/, "").replace(/-/g, " ")
          const slug = frontmatter.slug || generateSlug(title)

          const { data: existing } = await supabase
            .from("articles")
            .select("id")
            .eq("slug", slug)
            .single()

          if (existing) {
            results.push({
              success: false,
              title,
              slug,
              error: `Article with slug "${slug}" already exists`
            })
            continue
          }

          let companyId: string | null = null
          let companyMatched: string | undefined

          if (frontmatter.company) {
            const { data: companyData } = await supabase
              .from("companies")
              .select("id")
              .ilike("name", frontmatter.company)
              .limit(1)
              .single()

            if (companyData) {
              companyId = companyData.id
              companyMatched = frontmatter.company
            }
          }

          const excerpt = frontmatter.excerpt || extractExcerpt(body)
          const status = ["draft", "review", "published"].includes(frontmatter.status)
            ? frontmatter.status
            : "draft"

          let publishedAt: string | null = null
          if (frontmatter.published_at) {
            const date = new Date(frontmatter.published_at)
            if (!isNaN(date.getTime())) {
              publishedAt = date.toISOString()
            }
          }

          const { error: insertError } = await supabase
            .from("articles")
            .insert({
              title,
              slug,
              excerpt,
              content: body.trim(),
              status,
              published_at: publishedAt,
              company_id: companyId,
            })

          if (insertError) {
            results.push({
              success: false,
              title,
              slug,
              error: insertError.message
            })
            continue
          }

          results.push({
            success: true,
            title,
            slug,
            companyMatched
          })
        }
      } catch (err) {
        results.push({
          success: false,
          title: file.name,
          slug: "",
          error: err instanceof Error ? err.message : "Unknown error"
        })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      message: `Imported ${successful} package(s), ${failed} failed`,
      results
    })
  } catch (error) {
    console.error("Error importing articles:", error)
    return NextResponse.json(
      { error: "Failed to import articles" },
      { status: 500 }
    )
  }
}
