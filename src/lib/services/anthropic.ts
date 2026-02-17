/**
 * Anthropic Claude API Integration
 *
 * Provides AI capabilities for content generation and enhancement.
 *
 * API Docs: https://docs.anthropic.com/claude/reference
 *
 * Available Models (Feb 2026):
 * - claude-sonnet-4-5-20250929: Best balance of quality and cost
 * - claude-opus-4-6: Most capable, best for complex tasks
 * - claude-haiku-4-5-20251001: Fastest and cheapest
 */

import Anthropic from "@anthropic-ai/sdk"

// Model configuration - can be overridden via environment variable
const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"

// Model options for different use cases
const MODELS = {
  default: DEFAULT_MODEL,
  fast: "claude-haiku-4-5-20251001",     // Quick, cheap tasks
  quality: "claude-sonnet-4-5-20250929", // Good balance (great writer)
  best: "claude-opus-4-6",              // Highest quality (research)
} as const

// Timeout for API calls (5 minutes - AI prompts can take a while)
const API_TIMEOUT_MS = 5 * 60 * 1000

class AnthropicService {
  private client: Anthropic | null = null
  private model: string

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        timeout: API_TIMEOUT_MS,
      })
    }
    this.model = DEFAULT_MODEL
  }

  isConfigured(): boolean {
    return !!this.client
  }

  /**
   * Get the current model being used
   */
  getModel(): string {
    return this.model
  }

  /**
   * Set the model to use for subsequent requests
   */
  setModel(model: keyof typeof MODELS | string): void {
    if (model in MODELS) {
      this.model = MODELS[model as keyof typeof MODELS]
    } else {
      this.model = model
    }
  }

  /**
   * Generate an article excerpt/summary
   * @param articleTitle - The title of the article
   * @param articleContent - The content of the article
   * @param contextOrMaxLength - Either a context string for enrichment or max length number
   */
  async generateExcerpt(
    articleTitle: string,
    articleContent: string,
    contextOrMaxLength: string | number = 200
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const maxLength = typeof contextOrMaxLength === "number" ? contextOrMaxLength : 200
    const context = typeof contextOrMaxLength === "string" ? contextOrMaxLength : ""

    let prompt = `Generate a compelling excerpt (${maxLength} characters max) for this article. The excerpt should hook readers and convey the main value proposition. Do not use quotes or say "this article" - write it as a direct hook.`

    if (context) {
      prompt += `

Context about the company and key people:
${context}`
    }

    prompt += `

Title: ${articleTitle}

Content:
${articleContent.slice(0, 2000)}

Respond with only the excerpt, no explanation.`

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    return textBlock ? textBlock.text.trim() : ""
  }

  /**
   * Generate search queries for finding related content
   *
   * This prompt is designed to:
   * 1. Extract key people (founders, authors, doctors, experts) mentioned in the article
   * 2. Identify the main topics and themes
   * 3. Generate targeted search queries that include specific names when relevant
   */
  async generateSearchQueries(
    articleTitle: string,
    articleContent: string,
    queryType: "youtube" | "scholar" | "books"
  ): Promise<string[]> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const typeInstructions = {
      youtube: `YouTube videos - Look for:
        - Talks, interviews, or presentations by any founders/doctors/experts mentioned
        - Educational content about the main topics
        - Documentaries or explainer videos on the subject`,
      scholar: `academic research papers - Look for:
        - Research authored by any scientists/doctors mentioned in the article
        - Clinical studies on the products, methods, or approaches discussed
        - Review papers on the main health/science topics`,
      books: `books - Look for:
        - Books written by any founders, doctors, or experts mentioned (especially if described as "bestselling author")
        - Foundational texts on the main topics
        - Popular science books on the subject matter`,
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Analyze this article and generate 2-3 highly targeted search queries to find ${typeInstructions[queryType]}.

IMPORTANT: First, identify any key people mentioned in the article:
- Founders, CEOs, or company leaders
- Doctors (Dr., MD, PhD)
- Authors (especially if mentioned as "bestselling author" or having written books)
- Scientists or researchers
- Health/wellness experts

If the article mentions specific people (especially founders or authors), at least ONE of your search queries MUST include their full name.

Title: ${articleTitle}

Content:
${articleContent.slice(0, 2000)}

Respond with just the search queries, one per line. No numbering, bullets, or explanations.
Make queries specific and likely to return high-quality results.`,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock) return []

    return textBlock.text
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && q.length < 100) // Filter out any explanatory text
      .slice(0, 3)
  }

  /**
   * Select the best search results based on relevance
   *
   * Prioritizes:
   * 1. Content by/about key people mentioned in the article (founders, authors, doctors)
   * 2. Credibility and authority of the source
   * 3. Direct relevance to the article's main topics
   */
  async selectBestResults<T extends { title: string; url: string }>(
    articleTitle: string,
    articleContent: string,
    results: T[],
    maxResults: number = 3,
    resultType: string = "results"
  ): Promise<T[]> {
    if (!this.client || results.length === 0) {
      return results.slice(0, maxResults)
    }

    // If we have fewer results than max, return all
    if (results.length <= maxResults) {
      return results
    }

    const resultsList = results
      .map((r, i) => `${i + 1}. ${r.title} - ${r.url}`)
      .join("\n")

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `Given this article about "${articleTitle}", select the ${maxResults} most relevant ${resultType} from the list below.

Article excerpt (for context on key people and topics):
${articleContent.slice(0, 800)}

Available ${resultType}:
${resultsList}

Selection criteria (in priority order):
1. STRONGLY PREFER content by or featuring people mentioned in the article (founders, authors, doctors, experts)
2. Credibility and authority of the source
3. Direct relevance to the article's main health/wellness topics
4. Value to readers interested in longevity and health optimization

Respond with just the numbers of your top ${maxResults} picks, comma-separated (e.g., "1, 3, 5").`,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock) return results.slice(0, maxResults)

    const selectedIndices = textBlock.text
      .match(/\d+/g)
      ?.map((n) => parseInt(n, 10) - 1)
      .filter((i) => i >= 0 && i < results.length)
      .slice(0, maxResults)

    if (!selectedIndices || selectedIndices.length === 0) {
      return results.slice(0, maxResults)
    }

    return selectedIndices.map((i) => results[i])
  }

  /**
   * Extract key people mentioned in an article
   *
   * Returns names of founders, authors, doctors, experts, and other notable people
   * who might have written books or research papers.
   */
  async extractKeyPeople(
    articleTitle: string,
    articleContent: string
  ): Promise<string[]> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Extract all notable people mentioned in this article who might have written books or research papers.

Look for:
- Founders and CEOs (especially of health/wellness companies)
- Doctors (MD, PhD, DO)
- Authors (especially "bestselling author" or anyone mentioned as writing books)
- Scientists and researchers
- Health/wellness experts

Title: ${articleTitle}

Content:
${articleContent.slice(0, 3000)}

Return ONLY the full names of people found, one per line. No titles (Dr., MD, etc.), just names like "Mark Hyman" or "Casey Means".
If no relevant people are found, return "NONE".`,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.text.trim() === "NONE") return []

    return textBlock.text
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => {
        // Filter out non-names (must be 2+ words, no special chars except spaces/hyphens)
        return name.length > 3 &&
               name.split(/\s+/).length >= 2 &&
               /^[A-Za-z\s\-']+$/.test(name)
      })
      .slice(0, 5) // Limit to 5 people max
  }

  /**
   * Analyze a news article for the Longevity Newswire
   *
   * Evaluates as a "scientific analyst specializing in longevity research"
   * and returns structured analysis with EDGE Framework mapping.
   *
   * @param title - Article title
   * @param url - Original article URL
   * @param content - First 4000 chars of article content
   * @param model - Override model (defaults to current model)
   */
  async analyzeNewsArticle(
    title: string,
    url: string,
    content: string,
    model?: string
  ): Promise<{
    summary: string
    keyPoints: string[]
    edgeSignificance: string
    edgeCategories: string[]
    biologicalSystems: string[]
  }> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const systemPrompt = `You are a sharp, evidence-informed science writer for bioEDGE Longevity. You think through the lens of the EDGE Framework and understand how the body's systems interconnect — but you never lecture about it. You write like a smart friend who reads the research and tells you what actually matters.

Your internal framework (DO NOT name these directly in your writing — let them shape your thinking, not your vocabulary):

EDGE Framework — four layers of health optimization:
- Eliminate what interferes. Chemical, digital, behavioral. Before you add anything, identify what's getting in the way and stop it. This is where everything starts.
- Decode your body's signals. Listen to how your fifteen systems communicate. Understand why signals get mislabeled. Improve your ability to interpret what's going on.
- Gain advantage through strategic optimization. Once interference is eliminated and signals are decoded correctly, specific tools can support your systems. Devices, supplements, foods, hormetic stressors, biohacking practices.
- Execute with intention and consistency. The best protocol in the world does nothing if you don't implement it. This is the discipline of daily practice, tracked over time, sustained long enough for your body to respond.

The fifteen body systems you think through (never call them "biological systems" or "bioEDGE systems" — just weave them naturally into your analysis when relevant):
Breath, Circulation, Consciousness, Defense, Detoxification, Digestive, Emotional, Energy Production, Hormonal, Hydration, Nervous System, Regeneration, Stress Response, Structure & Movement, Temperature

You must respond ONLY with valid JSON. No markdown, no backticks, no explanation.`

    const userPrompt = `Analyze this longevity/health article and return a JSON object with these exact fields:

{
  "summary": "2-3 sentences. What's the finding and why should someone who cares about living longer and better pay attention? Be direct, evidence-informed, and conversational — not academic, not hype.",
  "keyPoints": ["Finding 1", "Finding 2", "Finding 3"],
  "longevitySignificance": "2-3 sentences connecting this research to the bigger picture of health optimization. If it relates to removing interference, reading the body's signals, gaining an edge through specific tools, or the discipline of consistent practice — let that thinking show naturally. If the research touches on how the body breathes, circulates, defends, detoxifies, regenerates, or any other core function — mention it conversationally, not as a category label. Write like you're explaining to a smart, motivated person why this matters for their healthspan.",
  "edgeCategories": ["eliminate", "decode", "gain", "execute"],
  "biologicalSystems": ["System1", "System2"]
}

Rules:
- summary: Direct and conversational. No jargon-heavy academic tone. No hype. Evidence-informed.
- keyPoints: Exactly 3 concise findings, each MAX 12 words. Start with the most important.
- longevitySignificance: Write naturally. Don't say "this relates to the Eliminate pillar" or "this connects to the Decode framework." Instead, let the ideas breathe — e.g., "This is the kind of interference worth removing before stacking any new protocol" or "Understanding how your circulation responds to cold exposure gives you a sharper read on what's working."
- edgeCategories: Tag with ONLY the relevant ones from: eliminate, decode, gain, execute (lowercase). These are metadata tags, not for display in the text.
- biologicalSystems: Tag with ONLY the relevant ones from: Breath, Circulation, Consciousness, Defense, Detoxification, Digestive, Emotional, Energy Production, Hormonal, Hydration, Nervous System, Regeneration, Stress Response, Structure & Movement, Temperature (exact casing). These are metadata tags, not for display in the text.
- If the article doesn't clearly relate to any EDGE category or system, use empty arrays.

Article Title: ${title}
Article URL: ${url}

Content (first 4000 chars):
${content.slice(0, 4000)}`

    const response = await this.client.messages.create({
      model: model || this.model,
      max_tokens: 800,
      messages: [
        { role: "user", content: userPrompt },
      ],
      system: systemPrompt,
    })

    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock) {
      return {
        summary: "",
        keyPoints: [],
        edgeSignificance: "",
        edgeCategories: [],
        biologicalSystems: [],
      }
    }

    try {
      // Clean any markdown code block wrapping
      const cleaned = textBlock.text
        .replace(/^```json\s*/i, "")
        .replace(/```\s*$/, "")
        .trim()
      const parsed = JSON.parse(cleaned)

      // Validate and sanitize
      const validEdge = ["eliminate", "decode", "gain", "execute"]
      const validSystems = [
        "Breath", "Circulation", "Consciousness", "Defense", "Detoxification",
        "Digestive", "Emotional", "Energy Production", "Hormonal", "Hydration",
        "Nervous System", "Regeneration", "Stress Response", "Structure & Movement",
        "Temperature",
      ]

      return {
        summary: String(parsed.summary || "").slice(0, 1000),
        keyPoints: (parsed.keyPoints || [])
          .slice(0, 3)
          .map((p: unknown) => String(p).slice(0, 100)),
        edgeSignificance: String(parsed.longevitySignificance || parsed.edgeSignificance || "").slice(0, 1000),
        edgeCategories: (parsed.edgeCategories || []).filter(
          (c: unknown) => validEdge.includes(String(c).toLowerCase())
        ).map((c: unknown) => String(c).toLowerCase()),
        biologicalSystems: (parsed.biologicalSystems || []).filter(
          (s: unknown) => validSystems.includes(String(s))
        ),
      }
    } catch {
      console.error("[Anthropic] Failed to parse news analysis JSON:", textBlock.text.slice(0, 200))
      return {
        summary: "",
        keyPoints: [],
        edgeSignificance: "",
        edgeCategories: [],
        biologicalSystems: [],
      }
    }
  }

  /**
   * Generate a warm outreach pitch for a company
   */
  async generateWarmPitch(
    companyName: string,
    companyDescription: string,
    contactName: string,
    contactTitle: string | null
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Write a warm outreach email for bioEDGE Longevity Magazine to send to ${contactName}${contactTitle ? ` (${contactTitle})` : ""} at ${companyName}.

Company Description:
${companyDescription}

The email should:
1. Reference something specific about their company
2. Explain bioEDGE's value (longevity/health optimization audience)
3. Propose a collaboration (feature article, interview, etc.)
4. Be professional but warm, not salesy
5. Be 150-200 words

Write just the email body, no subject line.`,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    return textBlock ? textBlock.text.trim() : ""
  }
}

// Export singleton instance
export const anthropicService = new AnthropicService()
