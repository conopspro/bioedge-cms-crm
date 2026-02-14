import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildResearchPrompt, CategoryOption } from "@/lib/research/prompts"
import { createClient } from "@/lib/supabase/server"
import type { CompanyResearchInput, CompanyResearchOutput, BiologicalSystem } from "@/types/database"

/**
 * POST /api/research/company
 *
 * Research a company using Claude AI and generate:
 * - Company brief
 * - Native article (500-600 words)
 * - Warm pitch email
 *
 * Uses Claude Opus 4.6 for the research and content generation.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CompanyResearchInput = await request.json()

    // Validate required fields
    if (!body.company_name || !body.website || !body.event) {
      return NextResponse.json(
        { error: "Company name, website, and event are required" },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey })

    // Fetch dynamic categories from database
    let categories: CategoryOption[] = []
    try {
      const supabase = await createClient()
      const { data: categoryData } = await supabase
        .from("company_categories")
        .select("slug, name")
        .order("display_order", { ascending: true })

      if (categoryData && categoryData.length > 0) {
        categories = categoryData
      }
    } catch (err) {
      console.log("Could not fetch categories, using defaults")
    }

    // Build the research prompt with dynamic categories
    const prompt = buildResearchPrompt({ ...body, categories })

    // First, fetch the website content to provide context
    let websiteContent = ""
    try {
      const websiteResponse = await fetch(body.website, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BioEdgeCMS/1.0)"
        }
      })
      if (websiteResponse.ok) {
        const html = await websiteResponse.text()
        // Extract text content (basic HTML stripping)
        websiteContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 15000) // Limit content size
      }
    } catch (fetchError) {
      console.log("Could not fetch website, proceeding with web search only")
    }

    // Call Claude with the research prompt
    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: websiteContent
            ? `Here is content from the company website (${body.website}):\n\n${websiteContent}\n\n---\n\n${prompt}`
            : prompt
        }
      ]
    })

    // Extract the text response
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")

    // Parse the JSON response
    let researchOutput: CompanyResearchOutput
    try {
      // Find JSON in the response (it might have markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      const parsed = JSON.parse(jsonMatch[0])

      // Get valid category slugs
      const validCategorySlugs = categories.length > 0
        ? categories.map(c => c.slug)
        : ["supplement", "device", "service", "clinic", "lab_testing", "platform", "other"]

      // Validate EDGE categories
      const validEdgeCategories = ["eliminate", "decode", "gain", "execute"]
      const edgeCategories = Array.isArray(parsed.edge_categories)
        ? parsed.edge_categories.filter((c: string) => validEdgeCategories.includes(c?.toLowerCase())).map((c: string) => c.toLowerCase())
        : []

      // Validate access levels
      const validAccessLevels = ["consumer", "practitioner_facilitated", "practitioner_only"]
      const accessLevels = Array.isArray(parsed.access_levels)
        ? parsed.access_levels.filter((l: string) => validAccessLevels.includes(l?.toLowerCase())).map((l: string) => l.toLowerCase())
        : []

      // Validate and transform the response
      researchOutput = {
        company_name: parsed.company_name || body.company_name,
        category: validateCategory(parsed.category, validCategorySlugs),
        description: parsed.description || "",
        systems_supported: validateSystems(parsed.systems_supported),
        edge_categories: edgeCategories,
        access_levels: accessLevels,
        has_affiliate: parsed.has_affiliate === true,
        differentiators: parsed.differentiators || "",
        evidence: parsed.evidence || "",
        bioedge_fit: parsed.bioedge_fit || "",
        article_title: parsed.article_title || "",
        article_content: parsed.article_content || "",
        article_excerpt: parsed.article_excerpt || "",
        warm_pitch: parsed.warm_pitch || "",
        research_notes: parsed.research_notes || "",
        discovered_contacts: Array.isArray(parsed.discovered_contacts)
          ? parsed.discovered_contacts.filter((c: any) => c && c.name)
          : []
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      console.error("Raw response:", responseText)
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: researchOutput,
      input: body
    })
  } catch (error) {
    console.error("Research error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Research failed" },
      { status: 500 }
    )
  }
}

/**
 * Validate and normalize the category against dynamic category list
 */
function validateCategory(category: string, validCategorySlugs: string[]): string {
  if (!category) return validCategorySlugs[0] || "other"

  // First try exact match
  if (validCategorySlugs.includes(category)) {
    return category
  }

  // Try normalized match (lowercase, replace special chars with underscores)
  const normalized = category.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_")
  if (validCategorySlugs.includes(normalized)) {
    return normalized
  }

  // Try matching by converting slug format (e.g., "diagnostics-testing" to "diagnostics_testing")
  const hyphenToUnderscore = category.toLowerCase().replace(/-/g, "_")
  if (validCategorySlugs.includes(hyphenToUnderscore)) {
    return hyphenToUnderscore
  }

  // Return first valid category as default
  return validCategorySlugs[0] || "other"
}

/**
 * Validate and filter the systems array
 */
function validateSystems(systems: string[]): BiologicalSystem[] {
  const validSystems: BiologicalSystem[] = [
    "Breath", "Circulation", "Consciousness", "Defense",
    "Detoxification", "Digestive", "Emotional", "Energy Production",
    "Hormonal", "Hydration", "Nervous System", "Regeneration",
    "Stress Response", "Structure & Movement", "Temperature"
  ]

  if (!Array.isArray(systems)) return []

  return systems.filter((s): s is BiologicalSystem =>
    validSystems.includes(s as BiologicalSystem)
  )
}
