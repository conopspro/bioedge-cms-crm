/**
 * Perplexity API Integration
 *
 * Uses Perplexity's AI-powered search for finding:
 * - Academic papers and research
 * - Books (with Amazon links)
 *
 * Perplexity excels at searching and synthesizing information
 * from across the web with accurate citations.
 *
 * API Docs: https://docs.perplexity.ai/
 */

const PERPLEXITY_API = "https://api.perplexity.ai/chat/completions"

// Timeout for API calls (5 minutes - AI prompts can take a while)
const API_TIMEOUT_MS = 5 * 60 * 1000

export interface PerplexityPaper {
  title: string
  authors: string[]
  year: number | null
  abstract: string | null
  url: string
  citationCount: number | null
  journal: string | null
  doi: string | null
}

export interface PerplexityBook {
  title: string
  authors: string[]
  year: number | null
  description: string | null
  url: string // Amazon link preferred
  thumbnail: string | null
  rating: number | null
  publisher: string | null
}

interface PerplexityMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  citations?: string[]
}

class PerplexityService {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Search for academic papers using Perplexity
   *
   * Perplexity will search the web, find relevant papers,
   * and return structured data with citations.
   */
  async searchPapers(
    query: string,
    options: {
      authorName?: string
      topic?: string
      limit?: number
    } = {}
  ): Promise<PerplexityPaper[]> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured. Set PERPLEXITY_API_KEY environment variable.")
    }

    const { authorName, topic, limit = 5 } = options

    // Build a specific prompt for finding academic papers
    let searchPrompt = `Find ${limit} highly relevant academic research papers`

    if (authorName) {
      searchPrompt += ` authored by or about ${authorName}`
    }

    if (topic) {
      searchPrompt += ` on the topic of: ${topic}`
    } else {
      searchPrompt += ` related to: ${query}`
    }

    searchPrompt += `

For each paper, provide:
1. Full title
2. Authors (list all)
3. Publication year
4. Journal/publication name
5. Brief abstract or summary (2-3 sentences)
6. DOI if available
7. Direct URL to the paper (prefer PubMed, DOI.org, or official journal links)

Focus on:
- Peer-reviewed research from reputable journals
- Papers with high citation counts when possible
- Recent papers (last 10 years) unless classics are highly relevant
- Papers from PubMed, Nature, Science, Cell, JAMA, Lancet, etc.

Format your response as JSON array:
[
  {
    "title": "Paper Title",
    "authors": ["Author 1", "Author 2"],
    "year": 2023,
    "journal": "Journal Name",
    "abstract": "Brief summary...",
    "doi": "10.1234/example",
    "url": "https://..."
  }
]

Only return the JSON array, no other text.`

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a research assistant specializing in finding academic papers. Always provide accurate citations and prefer primary sources. Return results as valid JSON."
      },
      {
        role: "user",
        content: searchPrompt
      }
    ]

    try {
      const response = await fetch(PERPLEXITY_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar", // Perplexity's search-enabled model
          messages,
          temperature: 0.1, // Low temperature for factual responses
          max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error("Perplexity API error:", response.status, error)
        return []
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices?.[0]?.message?.content || ""

      // Parse the JSON response
      const papers = this.parseJsonResponse(content)

      return papers.slice(0, limit)
    } catch (error) {
      console.error("Perplexity search failed:", error)
      return []
    }
  }

  /**
   * Search for papers by a specific author
   *
   * @param authorName - The author's full name
   * @param context - Additional context like title, company, or topic to disambiguate common names
   * @param limit - Maximum number of papers to return
   */
  async searchByAuthor(authorName: string, context?: string, limit: number = 5): Promise<PerplexityPaper[]> {
    return this.searchPapers(context || authorName, {
      authorName,
      topic: context,
      limit,
    })
  }

  /**
   * Search for papers by a leader with full context
   *
   * Uses company, title, and other context to ensure we find papers
   * by the right person (important for common names)
   */
  async searchPapersByLeader(
    authorName: string,
    options: {
      company?: string
      title?: string
      industry?: string
      limit?: number
    } = {}
  ): Promise<PerplexityPaper[]> {
    const { company, title, industry, limit = 5 } = options

    // Build context for identity verification
    let contextParts: string[] = []
    if (company) contextParts.push(company)
    if (title) contextParts.push(title)
    if (industry) contextParts.push(industry)

    const context = contextParts.join(", ")

    return this.searchPapersWithVerification(authorName, company, context, limit)
  }

  /**
   * Search for papers by author with context verification
   */
  private async searchPapersWithVerification(
    authorName: string,
    company: string | undefined,
    context: string,
    limit: number
  ): Promise<PerplexityPaper[]> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured.")
    }

    // Build context-aware prompt
    let identityContext = ""
    if (company) {
      identityContext = `${authorName} is associated with ${company}.`
    }
    if (context) {
      identityContext += ` Additional context: ${context}`
    }

    const searchPrompt = `Find academic papers, research publications, or peer-reviewed articles authored by ${authorName}.
${identityContext ? `\nCONTEXT: ${identityContext}` : ""}

Search for papers that ${authorName} has authored or co-authored. This person may be:
- A doctor or medical professional who has published research
- A scientist or researcher with academic publications
- A health/wellness expert with peer-reviewed work

For each paper by ${authorName}, provide:
1. Full title
2. Authors (list all - ${authorName} should be among them)
3. Publication year
4. Journal/publication name
5. Brief abstract or summary
6. DOI if available
7. Direct URL to the paper (PubMed, journal website, etc.)

Format as JSON array with fields: title, authors (array), year, journal, abstract, doi, url
Return [] if ${authorName} has not published any papers.
Only return the JSON array, no other text.`

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a research assistant. Find academic papers and publications by the specific person requested. For common names, use the provided context to identify the correct person."
      },
      {
        role: "user",
        content: searchPrompt
      }
    ]

    try {
      const response = await fetch(PERPLEXITY_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages,
          temperature: 0.1,
          max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      if (!response.ok) {
        return []
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices?.[0]?.message?.content || ""

      return this.parseJsonResponse(content).slice(0, limit)
    } catch (error) {
      console.error("Paper search with verification failed:", error)
      return []
    }
  }

  /**
   * Search for books using Perplexity
   *
   * Returns books with Amazon links when available
   */
  async searchBooks(
    query: string,
    options: {
      authorName?: string
      topic?: string
      limit?: number
    } = {}
  ): Promise<PerplexityBook[]> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured. Set PERPLEXITY_API_KEY environment variable.")
    }

    const { authorName, topic, limit = 5 } = options

    // Build a specific prompt for finding books
    let searchPrompt = ""

    if (authorName) {
      // When we have an author name, make finding their books the TOP priority
      searchPrompt = `Find ${limit} books by ${authorName}.

PRIORITY ORDER:
1. FIRST, find books written/authored by ${authorName} (this is the primary goal)
2. If ${authorName} has fewer than ${limit} books, also include highly relevant books on the topic: ${topic || query}

${authorName} may be a doctor, health expert, or founder who has written books on health, wellness, or longevity.`
    } else if (topic) {
      searchPrompt = `Find ${limit} highly relevant books about: ${topic}`
    } else {
      searchPrompt = `Find ${limit} highly relevant books related to: ${query}`
    }

    searchPrompt += `

For each book, provide:
1. Full title (include subtitle if any)
2. Author(s)
3. Publication year
4. Publisher
5. Brief description (2-3 sentences about what the book covers)
6. Amazon URL (REQUIRED - must be a valid amazon.com link to buy/view the book)
7. Average rating (if known, out of 5)

Focus on:
- Well-reviewed, popular books on the topic
- Books by recognized experts in the field
- Recent books (last 10 years) unless classics are essential
- Prefer books available on Amazon

IMPORTANT: The URL MUST be an Amazon.com link (https://www.amazon.com/...). Do not use other bookstore links.

Format your response as JSON array:
[
  {
    "title": "Book Title: Subtitle",
    "authors": ["Author Name"],
    "year": 2023,
    "publisher": "Publisher Name",
    "description": "Brief description of the book...",
    "url": "https://www.amazon.com/dp/ASIN",
    "rating": 4.5
  }
]

Only return the JSON array, no other text.`

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a book recommendation assistant. Find relevant books and always provide Amazon.com links. Return results as valid JSON."
      },
      {
        role: "user",
        content: searchPrompt
      }
    ]

    try {
      const response = await fetch(PERPLEXITY_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages,
          temperature: 0.1,
          max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error("Perplexity API error:", response.status, error)
        return []
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices?.[0]?.message?.content || ""

      // Parse the JSON response
      const books = this.parseBookJsonResponse(content)

      return books.slice(0, limit)
    } catch (error) {
      console.error("Perplexity book search failed:", error)
      return []
    }
  }

  /**
   * Search for books by a specific author
   */
  async searchBooksByAuthor(authorName: string, topic?: string, limit: number = 5): Promise<PerplexityBook[]> {
    return this.searchBooks(topic || authorName, {
      authorName,
      topic,
      limit,
    })
  }

  /**
   * Search for books by a leader with full context
   *
   * Uses company, title, and other context to ensure we find books
   * by the right person (important for common names)
   */
  async searchBooksByLeader(
    authorName: string,
    options: {
      company?: string
      title?: string
      industry?: string
      limit?: number
    } = {}
  ): Promise<PerplexityBook[]> {
    const { company, title, industry, limit = 5 } = options

    return this.searchBooksWithVerification(authorName, company, title, industry, limit)
  }

  /**
   * Search for books by author with context verification
   */
  private async searchBooksWithVerification(
    authorName: string,
    company?: string,
    title?: string,
    industry?: string,
    limit: number = 5
  ): Promise<PerplexityBook[]> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured.")
    }

    // Build context if available
    let contextInfo = ""
    if (company || title) {
      contextInfo = `${authorName}`
      if (title) contextInfo += `, ${title}`
      if (company) contextInfo += ` at ${company}`
      if (industry) contextInfo += ` in the ${industry} industry`
    }

    const searchPrompt = `Find books written by ${authorName}.
${contextInfo ? `\nCONTEXT: ${contextInfo}` : ""}

Search for books that ${authorName} has authored or co-authored. This person may be:
- A well-known author with multiple bestselling books
- A doctor, researcher, or health expert who has written books
- A founder or executive who has published books in their field

For each book by ${authorName}, provide:
1. Full title (with subtitle)
2. Author(s) - ${authorName} should be the author or co-author
3. Publication year
4. Publisher
5. Brief description
6. Amazon URL (must be valid amazon.com link)
7. Rating if known

Format as JSON array with fields: title, authors (array), year, publisher, description, url, rating
Return [] if ${authorName} has not written any books.
Only return the JSON array, no other text.`

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a book search assistant. Find books authored by the specific person requested. For common names, use the provided context to identify the correct person."
      },
      {
        role: "user",
        content: searchPrompt
      }
    ]

    try {
      const response = await fetch(PERPLEXITY_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages,
          temperature: 0.1,
          max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      if (!response.ok) {
        return []
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices?.[0]?.message?.content || ""

      return this.parseBookJsonResponse(content).slice(0, limit)
    } catch (error) {
      console.error("Book search with verification failed:", error)
      return []
    }
  }

  /**
   * Research a person's professional profile
   *
   * Uses Perplexity to search the web for information about a person
   * and generate a professional bio/summary with source citations.
   */
  async researchProfile(options: {
    name: string
    linkedinUrl?: string | null
    title?: string | null
    company?: string | null
  }): Promise<{
    bio: string
    highlights: string[]
    expertise: string[]
    education?: string[]
    achievements?: string[]
    sources?: { title: string; url: string }[]
  } | null> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured. Set PERPLEXITY_API_KEY environment variable.")
    }

    const { name, linkedinUrl, title, company } = options

    // Build a research prompt
    let searchContext = `Research the professional background of ${name}`
    if (title) searchContext += `, who is ${title}`
    if (company) searchContext += ` at ${company}`
    if (linkedinUrl) searchContext += `. Their LinkedIn profile is: ${linkedinUrl}`

    const searchPrompt = `${searchContext}

Please research this person and provide:

1. A professional bio (2-3 paragraphs) summarizing their career, expertise, and contributions to their field. DO NOT include citation numbers like [1] or [2] in the bio text.
2. Key career highlights (exactly 4 bullet points)
3. Areas of expertise (exactly 4 specializations/skills)
4. Education background (if available)
5. Notable achievements or awards (if available)
6. Sources - list the URLs you used to gather this information

Focus on:
- Their professional journey and career progression
- Key roles and responsibilities
- Industry expertise and thought leadership
- Published works, speaking engagements, or media appearances
- Any notable contributions to their field

IMPORTANT: Write the bio as clean prose WITHOUT any citation markers like [1], [2], etc. Instead, list your sources separately.

Format your response as JSON:
{
  "bio": "Professional bio text WITHOUT any citation numbers...",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "expertise": ["Area 1", "Area 2", "Area 3", "Area 4"],
  "education": ["Degree from University"],
  "achievements": ["Achievement 1", "Achievement 2"],
  "sources": [
    {"title": "Source Title or Domain", "url": "https://..."},
    {"title": "Another Source", "url": "https://..."}
  ]
}

Only return the JSON object, no other text. If you cannot find information about this person, return null.`

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a professional research assistant specializing in finding and synthesizing information about business professionals. Provide accurate information and list your sources. Write bios as clean prose without inline citation markers. Return results as valid JSON."
      },
      {
        role: "user",
        content: searchPrompt
      }
    ]

    try {
      const response = await fetch(PERPLEXITY_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages,
          temperature: 0.2,
          max_tokens: 2500,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error("Perplexity API error:", response.status, error)
        return null
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices?.[0]?.message?.content || ""

      // Also check for citations in the response metadata
      const citations = data.citations || []

      // Parse the JSON response
      const result = this.parseProfileResponse(content)

      // If we have citations from the API but not in the parsed response, add them
      if (result && (!result.sources || result.sources.length === 0) && citations.length > 0) {
        result.sources = citations.map((url: string, idx: number) => ({
          title: this.extractDomainFromUrl(url),
          url
        }))
      }

      return result
    } catch (error) {
      console.error("Perplexity profile research failed:", error)
      return null
    }
  }

  /**
   * Extract a readable domain name from URL
   */
  private extractDomainFromUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, "")
      // Capitalize first letter of each part
      return hostname.split(".")[0].charAt(0).toUpperCase() + hostname.split(".")[0].slice(1)
    } catch {
      return url
    }
  }

  /**
   * Parse JSON response for profile research
   */
  private parseProfileResponse(content: string): {
    bio: string
    highlights: string[]
    expertise: string[]
    education?: string[]
    achievements?: string[]
    sources?: { title: string; url: string }[]
  } | null {
    try {
      let jsonStr = content.trim()

      // Check for null response
      if (jsonStr.toLowerCase() === "null") {
        return null
      }

      // If response is wrapped in markdown code block, extract it
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }

      // Try to find JSON object in the response
      const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (objectMatch) {
        jsonStr = objectMatch[0]
      }

      const parsed = JSON.parse(jsonStr)

      if (!parsed || !parsed.bio) {
        return null
      }

      // Helper to clean citation markers from text
      const cleanCitations = (text: string) => {
        return text.replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim()
      }

      // Clean any remaining citation markers from all text fields
      const cleanBio = cleanCitations(String(parsed.bio || ""))
      const cleanHighlights = Array.isArray(parsed.highlights)
        ? parsed.highlights.map((h: unknown) => cleanCitations(String(h)))
        : []
      const cleanExpertise = Array.isArray(parsed.expertise)
        ? parsed.expertise.map((e: unknown) => cleanCitations(String(e)))
        : []

      // Parse sources array
      let sources: { title: string; url: string }[] | undefined
      if (Array.isArray(parsed.sources)) {
        sources = parsed.sources
          .filter((s: unknown) => s && typeof s === "object" && (s as Record<string, unknown>).url)
          .map((s: Record<string, unknown>) => ({
            title: String(s.title || this.extractDomainFromUrl(String(s.url))),
            url: String(s.url)
          }))
      }

      return {
        bio: cleanBio,
        highlights: cleanHighlights,
        expertise: cleanExpertise,
        education: Array.isArray(parsed.education) ? parsed.education.map(String) : undefined,
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements.map(String) : undefined,
        sources,
      }
    } catch (error) {
      console.error("Failed to parse Perplexity profile response:", error)
      console.error("Raw content:", content.slice(0, 500))
      return null
    }
  }

  /**
   * Parse JSON response for papers
   */
  private parseJsonResponse(content: string): PerplexityPaper[] {
    try {
      // Try to extract JSON from the response
      let jsonStr = content.trim()

      // If response is wrapped in markdown code block, extract it
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }

      // Try to find JSON array in the response
      const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
      if (arrayMatch) {
        jsonStr = arrayMatch[0]
      }

      const parsed = JSON.parse(jsonStr)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed.map((paper: Record<string, unknown>) => ({
        title: String(paper.title || ""),
        authors: Array.isArray(paper.authors)
          ? paper.authors.map(String)
          : typeof paper.authors === "string"
            ? [paper.authors]
            : [],
        year: typeof paper.year === "number" ? paper.year : null,
        abstract: paper.abstract ? String(paper.abstract) : null,
        url: String(paper.url || ""),
        citationCount: typeof paper.citationCount === "number" ? paper.citationCount : null,
        journal: paper.journal ? String(paper.journal) : null,
        doi: paper.doi ? String(paper.doi) : null,
      })).filter((p: PerplexityPaper) => p.title && p.url)
    } catch (error) {
      console.error("Failed to parse Perplexity paper response:", error)
      console.error("Raw content:", content.slice(0, 500))
      return []
    }
  }

  /**
   * Parse JSON response for books
   */
  private parseBookJsonResponse(content: string): PerplexityBook[] {
    try {
      let jsonStr = content.trim()

      // If response is wrapped in markdown code block, extract it
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }

      // Try to find JSON array in the response
      const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
      if (arrayMatch) {
        jsonStr = arrayMatch[0]
      }

      const parsed = JSON.parse(jsonStr)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed.map((book: Record<string, unknown>) => ({
        title: String(book.title || ""),
        authors: Array.isArray(book.authors)
          ? book.authors.map(String)
          : typeof book.authors === "string"
            ? [book.authors]
            : [],
        year: typeof book.year === "number" ? book.year : null,
        description: book.description ? String(book.description) : null,
        url: String(book.url || ""),
        thumbnail: book.thumbnail ? String(book.thumbnail) : null,
        rating: typeof book.rating === "number" ? book.rating : null,
        publisher: book.publisher ? String(book.publisher) : null,
      })).filter((b: PerplexityBook) => b.title && b.url)
    } catch (error) {
      console.error("Failed to parse Perplexity book response:", error)
      console.error("Raw content:", content.slice(0, 500))
      return []
    }
  }
  /**
   * Research a company using Perplexity
   *
   * Returns structured company information with sources/citations
   */
  async researchCompany(options: {
    companyName: string
    website?: string | null
    category?: string | null
  }): Promise<{
    category: string
    description: string
    differentiators: string
    evidence: string
    systems_supported: string[]
    edge_categories: string[]
    access_levels: string[]
    has_affiliate: boolean
    bioedge_fit: string
    discovered_contacts: Array<{
      name: string
      title?: string
      email?: string
      linkedin_url?: string
    }>
    sources: { title: string; url: string }[]
  } | null> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured.")
    }

    const { companyName, website, category } = options

    let searchContext = `Research the company "${companyName}"`
    if (website) {
      searchContext += ` using ONLY information found on their website: ${website}`
      searchContext += `\n\nIMPORTANT: Base your research ENTIRELY on the company's own website content. DO NOT use third-party reviews, news articles, or external commentary. Only reference the company's website as a source.`
    }
    if (category) searchContext += `\nThey are in the ${category} category.`

    const searchPrompt = `${searchContext}

Please research this health/longevity company and provide:

1. **Description**: 2-3 paragraphs describing what the company does, their products/services, and their approach to health optimization or longevity. Write this as clean prose WITHOUT citation markers.

**Description voice guidelines:**
- Grounded, not breathless: Be skeptical of hype. Present what the company actually does.
- Direct, not clinical: Write for smart people who don't need jargon to feel respected.
- Aspirational, not fear-based: Focus on possibility, not problems.
- Evidence-informed, not evidence-dependent: Respect research AND lived experience.
- NO em dashes. Use colons, periods, or commas instead.
- Paragraphs 3-4 sentences max.
- AVOID these words: Revolutionary, Breakthrough, Game-changing, Transform/Transformative, Supercharge, Miracle, Secret, Hack, Anti-aging (prefer "longevity" or "health optimization")
- PREFER these words: Evidence-based, Personalized, Sustainable, Measured, Strategic, Optimized, Precise, Integrated

2. **Category**: Assign exactly ONE of these category slugs that best describes this company:
   - "diagnostics_testing" (Diagnostics & Testing: lab tests, biomarker panels, imaging, screening)
   - "energy_light_therapy" (Energy & Light Therapy: red light, infrared, PEMF, laser therapy)
   - "environment" (Environment: air quality, water filtration, EMF, toxin testing)
   - "fitness" (Fitness: exercise equipment, training systems, movement)
   - "mind_neurotech" (Mind & Neurotech: neurofeedback, brain training, cognitive devices)
   - "recovery" (Recovery: cryotherapy, sauna, compression, regeneration devices)
   - "sleep_technology" (Sleep Technology: sleep tracking, sleep optimization devices)
   - "supplements_compounds" (Supplements & Compounds: vitamins, peptides, nootropics, functional foods)
   - "wearables_monitoring" (Wearables & Monitoring: wearable devices, continuous monitoring)
   - "longevity_services" (Longevity Services: clinics, medical practices, health optimization centers)

3. **Key Differentiators**: What sets this company apart from competitors? List exactly 4 specific, concrete differentiators. Format as a bullet list with each item on a new line starting with "- ".

4. **Evidence & Credibility**: Clinical studies, expert endorsements, certifications, patents, funding rounds, partnerships, notable investors, or other credibility markers. List exactly 4 specific items. Format as a bullet list with each item on a new line starting with "- ".

5. **Biological Systems**: Which of these 15 biological systems do the company's products/services DIRECTLY support? Be conservative: only select systems where there is a clear, direct connection between the product/service and the system's function. Most companies support 1-4 systems, rarely more. Use the descriptions below to understand what each system covers:

   - **Breath**: Oxygen delivery, CO2 removal, blood pH regulation, breathing patterns, respiratory function. Relevant products: breathwork devices, nasal breathing aids, respiratory training, pulse oximeters, CO2 tolerance training, CPAP alternatives, air quality monitors that specifically address breathing.

   - **Circulation**: Blood flow, heart function, vascular health, blood pressure, oxygen delivery to tissues. Relevant products: blood flow monitoring, cardiovascular fitness devices, compression therapy, nitric oxide supplements, blood pressure monitors, cold/heat therapy for circulation, infrared therapy targeting blood flow.

   - **Consciousness**: Mental clarity, attention quality, cognitive function, focus, thought quality, awareness. Relevant products: neurofeedback devices, brain training apps, nootropics, meditation technology, cognitive assessment tools, focus-enhancing devices, brain-computer interfaces.

   - **Defense**: Immune function, inflammation management, pathogen protection, allergic response, autoimmune patterns. Relevant products: immune support supplements, inflammation testing, allergy testing, microbiome testing for immunity, immune monitoring, antimicrobial technologies.

   - **Detoxification**: Liver function, kidney filtration, lymphatic drainage, toxin clearance, toxic load management. Relevant products: liver support supplements, water filtration, air purifiers, sauna/sweat therapy, heavy metal testing, mycotoxin testing, binders, glutathione, detox protocols.

   - **Digestive**: Nutrient absorption, gut motility, microbiome health, gut-brain axis, food processing. Relevant products: probiotics, digestive enzymes, microbiome testing, gut barrier support, food sensitivity testing, GI mapping, fiber supplements, fermented foods.

   - **Emotional**: Emotional processing, mood regulation, emotional resilience, felt experience. Relevant products: mood tracking, emotional wellness apps, adaptogens for mood, counseling platforms, heart rate variability for emotional regulation, journaling tools.

   - **Energy Production**: Cellular energy (ATP), mitochondrial function, metabolic efficiency, blood sugar regulation. Relevant products: mitochondrial support supplements (CoQ10, NAD+, PQQ), red light therapy, metabolic testing, continuous glucose monitors, B vitamins, creatine, metabolic health platforms.

   - **Hormonal**: Hormone balance, thyroid function, adrenal health, sex hormones, insulin regulation, circadian rhythm. Relevant products: hormone testing panels, thyroid support, testosterone/estrogen optimization, cortisol testing, HRT support, seed cycling, hormone monitoring devices.

   - **Hydration**: Fluid balance, electrolyte distribution, cellular hydration, mineral transport. Relevant products: electrolyte supplements, mineral drops, hydration monitoring, water quality testing, structured water, intracellular hydration support.

   - **Nervous System**: Nerve signal transmission, sensory processing, pain modulation, nerve health, autonomic function. Relevant products: TENS/neurostimulation devices, nerve support supplements (B12, alpha lipoic acid), vagus nerve stimulators, peripheral neuropathy support, neurological testing.

   - **Regeneration**: Tissue repair, cellular renewal, sleep-based recovery, wound healing, growth and repair processes. Relevant products: sleep optimization devices, collagen supplements, peptides (BPC-157, TB-500), stem cell therapies, hyperbaric oxygen, growth hormone support, recovery monitoring.

   - **Stress Response**: Autonomic nervous system regulation, fight-flight-freeze balance, stress recovery, HRV, resilience. Relevant products: HRV monitors, biofeedback devices, adaptogens (ashwagandha, rhodiola), vagus nerve stimulators, stress tracking, breathwork for stress, cold exposure for resilience.

   - **Structure & Movement**: Musculoskeletal health, posture, joint function, fascia, lymphatic pumping through movement. Relevant products: fitness equipment, movement tracking, posture correctors, joint supplements (glucosamine, collagen), foam rollers, physical therapy tools, bone density support.

   - **Temperature**: Thermoregulation, cold tolerance, heat adaptation, metabolic heat production, fever response. Relevant products: cold plunge/ice baths, sauna, infrared therapy, thermogenesis supplements, temperature tracking, cryotherapy chambers, heat acclimation protocols.

   IMPORTANT: A supplement company that sells general vitamins might support Energy Production, Defense, and perhaps one or two others — but NOT all 15 systems. A red light therapy device primarily supports Energy Production and Regeneration, possibly Circulation. Be specific and conservative. Only list systems where the company's core products have a DIRECT, primary effect.

6. **Key People**: Founders, executives, or leadership team members. Include name, title, and LinkedIn URL if available.

7. **EDGE Classification**: Based on the EDGE Framework for longevity optimization, classify this company's primary role(s). A company can fit multiple categories:
   - Eliminate: Identifies and removes interference (toxin testing, EMF shielding, digital wellness, food quality analysis, environmental testing)
   - Decode: Reads biological signals (lab testing, wearables, imaging, diagnostics, monitoring, assessments, biomarker tracking)
   - Gain: Provides solutions and interventions (supplements, devices, therapies, treatments, health services, equipment, light therapy)
   - Execute: Helps sustain protocols (habit tracking, coaching platforms, accountability tools, scheduling, practice management)

8. **Access Levels**: How can clients access this company's products/services? A company can have multiple levels. Return as an array:
   - "consumer" — Client can order/use directly
   - "practitioner_facilitated" — Requires a practitioner account to order
   - "practitioner_only" — Requires a licensed provider

9. **Affiliate Program**: Does this company offer an affiliate or referral program? (true/false)

10. **bioEDGE Fit**: In 2-3 sentences, explain why this company aligns with the bioEDGE audience of health optimizers, longevity practitioners, and biohackers. What makes them relevant to people pursuing evidence-based longevity?

11. **Sources**: List the URLs you used to gather this information. These should be pages from the company's own website.

IMPORTANT: Write description as clean prose WITHOUT citation numbers like [1], [2]. For differentiators and evidence, use bullet format with "- " prefix. List your sources separately.

Format your response as JSON:
{
  "category": "string (one of the category slugs listed above)",
  "description": "Detailed company description as paragraphs...",
  "differentiators": "- First differentiator\n- Second differentiator\n- Third differentiator",
  "evidence": "- First evidence item\n- Second evidence item\n- Third evidence item",
  "systems_supported": ["System 1", "System 2"],
  "edge_categories": ["decode", "gain"],
  "access_levels": ["consumer"],
  "has_affiliate": false,
  "bioedge_fit": "string (2-3 sentences on alignment with bioEDGE audience)",
  "discovered_contacts": [
    {"name": "Full Name", "title": "CEO", "linkedin_url": "https://linkedin.com/in/..."}
  ],
  "sources": [
    {"title": "Source Name", "url": "https://..."}
  ]
}

Only return the JSON object, no other text.`

    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a research assistant for bioEDGE Longevity Magazine specializing in health, wellness, and longevity companies. Research companies using ONLY their own website content. Write descriptions in a grounded, direct, aspirational tone. Never use hype words. Provide accurate source attribution from the company's website."
      },
      {
        role: "user",
        content: searchPrompt
      }
    ]

    try {
      console.log(`[perplexity] Researching company: ${companyName}`)
      console.log(`[perplexity] Website: ${website || 'none'}, Category: ${category || 'none'}`)

      const response = await fetch(PERPLEXITY_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages,
          temperature: 0.1,
          max_tokens: 3000,
        }),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      })

      console.log(`[perplexity] API response status: ${response.status}`)

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error("[perplexity] API error:", response.status, error)
        return null
      }

      const data: PerplexityResponse = await response.json()
      const content = data.choices?.[0]?.message?.content || ""
      const apiCitations = data.citations || []

      console.log(`[perplexity] Response content length: ${content.length}`)
      console.log(`[perplexity] API citations count: ${apiCitations.length}`)

      // Parse the JSON response
      const result = this.parseCompanyResponse(content)

      if (!result) {
        console.error("[perplexity] Failed to parse response. Raw content preview:", content.slice(0, 500))
        return null
      }

      console.log(`[perplexity] Parsed result:`, {
        descriptionLength: result.description?.length || 0,
        differentiatorsLength: result.differentiators?.length || 0,
        evidenceLength: result.evidence?.length || 0,
        systemsCount: result.systems_supported?.length || 0,
        contactsCount: result.discovered_contacts?.length || 0,
        sourcesCount: result.sources?.length || 0,
      })

      // If we have citations from the API but not in the parsed response, add them
      if (result && (!result.sources || result.sources.length === 0) && apiCitations.length > 0) {
        result.sources = apiCitations.map((url: string) => ({
          title: this.extractDomainFromUrl(url),
          url
        }))
      }

      return result
    } catch (error) {
      console.error("[perplexity] Company research failed:", error)
      return null
    }
  }

  /**
   * Parse JSON response for company research
   */
  private parseCompanyResponse(content: string): {
    category: string
    description: string
    differentiators: string
    evidence: string
    systems_supported: string[]
    edge_categories: string[]
    access_levels: string[]
    has_affiliate: boolean
    bioedge_fit: string
    discovered_contacts: Array<{
      name: string
      title?: string
      email?: string
      linkedin_url?: string
    }>
    sources: { title: string; url: string }[]
  } | null {
    try {
      let jsonStr = content.trim()

      // Check for null response
      if (jsonStr.toLowerCase() === "null") {
        return null
      }

      // If response is wrapped in markdown code block, extract it
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }

      // Try to find JSON object in the response
      const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (objectMatch) {
        jsonStr = objectMatch[0]
      }

      const parsed = JSON.parse(jsonStr)

      if (!parsed) {
        return null
      }

      // Helper to clean citation markers from text (preserves newlines)
      const cleanCitations = (text: string) => {
        return text
          .replace(/\[\d+\]/g, "") // Remove [1], [2], etc.
          .replace(/[ \t]+/g, " ") // Collapse spaces/tabs but NOT newlines
          .trim()
      }

      // Helper to ensure bullet items are on separate lines
      const formatBulletList = (text: string): string => {
        // First clean citations
        let cleaned = cleanCitations(text)

        // If already has newlines with bullets, just clean it up
        if (cleaned.includes("\n")) {
          return cleaned
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.startsWith("-") ? line : `- ${line}`)
            .join("\n")
        }

        // If inline format like "- Item 1 - Item 2 - Item 3", split and reformat
        // Match " - " that separates items (not the leading "- ")
        const items = cleaned
          .split(/\s+-\s+/)
          .map(item => item.replace(/^-\s*/, "").trim())
          .filter(item => item.length > 0)

        if (items.length > 1) {
          return items.map(item => `- ${item}`).join("\n")
        }

        // Single item or no clear separation
        return cleaned.startsWith("-") ? cleaned : `- ${cleaned}`
      }

      // Validate systems against the allowed list
      const validSystems = [
        "Breath", "Circulation", "Consciousness", "Defense", "Detoxification",
        "Digestive", "Emotional", "Energy Production", "Hormonal", "Hydration",
        "Nervous System", "Regeneration", "Stress Response", "Structure & Movement", "Temperature"
      ]

      const systems = Array.isArray(parsed.systems_supported)
        ? parsed.systems_supported.filter((s: string) => validSystems.includes(s))
        : []

      // Parse contacts
      const contacts = Array.isArray(parsed.discovered_contacts)
        ? parsed.discovered_contacts
            .filter((c: unknown) => c && typeof c === "object" && (c as Record<string, unknown>).name)
            .map((c: Record<string, unknown>) => ({
              name: String(c.name),
              title: c.title ? String(c.title) : undefined,
              email: c.email ? String(c.email) : undefined,
              linkedin_url: c.linkedin_url ? String(c.linkedin_url) : undefined,
            }))
        : []

      // Parse sources
      const sources = Array.isArray(parsed.sources)
        ? parsed.sources
            .filter((s: unknown) => s && typeof s === "object" && (s as Record<string, unknown>).url)
            .map((s: Record<string, unknown>) => ({
              title: String(s.title || this.extractDomainFromUrl(String(s.url))),
              url: String(s.url)
            }))
        : []

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

      // Validate category
      const validCategories = [
        "diagnostics_testing", "energy_light_therapy", "environment", "fitness",
        "mind_neurotech", "recovery", "sleep_technology", "supplements_compounds",
        "wearables_monitoring", "longevity_services"
      ]
      const rawCategory = String(parsed.category || "").toLowerCase().trim()
      const category = validCategories.includes(rawCategory) ? rawCategory : ""

      // Parse affiliate flag
      const hasAffiliate = parsed.has_affiliate === true

      return {
        category,
        description: cleanCitations(String(parsed.description || "")),
        differentiators: formatBulletList(String(parsed.differentiators || "")),
        evidence: formatBulletList(String(parsed.evidence || "")),
        systems_supported: systems,
        edge_categories: edgeCategories,
        access_levels: accessLevels,
        has_affiliate: hasAffiliate,
        bioedge_fit: cleanCitations(String(parsed.bioedge_fit || "")),
        discovered_contacts: contacts,
        sources,
      }
    } catch (error) {
      console.error("Failed to parse Perplexity company response:", error)
      console.error("Raw content:", content.slice(0, 500))
      return null
    }
  }
}

// Export singleton instance
export const perplexityService = new PerplexityService()
