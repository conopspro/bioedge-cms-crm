/**
 * AI Email Generator Service
 *
 * Generates personalized outreach emails using Claude, combining:
 * - Campaign purpose, tone, constraints (must_include, must_avoid, call_to_action)
 * - bioEDGE voice guidelines and warm pitch guidelines
 * - Per-recipient context: contact name/title/seniority + company data
 *
 * Each email is written fresh by Claude — not fill-in-the-blanks templates.
 */

import Anthropic from "@anthropic-ai/sdk"
import { BIOEDGE_VOICE_GUIDELINES, WARM_PITCH_GUIDELINES } from "@/lib/research/prompts"
import type { Campaign, SenderProfile } from "@/types/database"

interface ContactContext {
  first_name: string
  last_name: string
  title: string | null
  seniority: string | null
  ai_expertise: string[] | null
  ai_outreach_suggestions: string | null
}

interface CompanyContext {
  name: string
  description: string | null
  differentiators: string | null
  bioedge_fit: string | null
  warm_pitch: string | null
  events: string[]
  systems_supported: string[]
  edge_categories: string[]
  access_levels: string[]
  category: string | null
}

interface CampaignEventContext {
  name: string
  start_date: string | null
  end_date: string | null
  city: string | null
  state: string | null
  slug: string | null
  registration_url: string | null
}

interface GeneratedEmail {
  subject: string
  body: string
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"

class EmailGeneratorService {
  private client: Anthropic | null

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY || null
    this.client = apiKey ? new Anthropic({ apiKey }) : null
  }

  isConfigured(): boolean {
    return !!this.client
  }

  /**
   * Generate a personalized email for one recipient
   */
  async generateEmail(
    campaign: Campaign,
    senderProfile: SenderProfile,
    contact: ContactContext,
    company: CompanyContext,
    campaignEvents?: CampaignEventContext[]
  ): Promise<GeneratedEmail> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const systemPrompt = this.buildSystemPrompt(campaign, senderProfile, campaignEvents)
    const userPrompt = this.buildUserPrompt(campaign, contact, company)

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.8, // Higher temp for natural variation between emails
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    const text = textBlock && "text" in textBlock ? textBlock.text.trim() : ""

    return this.parseResponse(text)
  }

  private buildSystemPrompt(campaign: Campaign, senderProfile: SenderProfile, campaignEvents?: CampaignEventContext[]): string {
    const parts: string[] = []

    // Voice guidelines (unless campaign overrides tone)
    if (campaign.tone) {
      parts.push(`## Writing Tone\n\n${campaign.tone}`)
      // Still include core guidelines but note the tone override
      parts.push(`\n## Background Voice Reference (adapt to the tone above)\n\n${BIOEDGE_VOICE_GUIDELINES}`)
    } else {
      parts.push(BIOEDGE_VOICE_GUIDELINES)
    }

    // Warm pitch guidelines for email writing style
    parts.push(WARM_PITCH_GUIDELINES)

    // Sender identity
    parts.push(`## You Are Writing As\n\nName: ${senderProfile.name}\nTitle: ${senderProfile.title || "bioEDGE Longevity team"}\n\nWrite the email body only. Do NOT include a signature block (that gets appended separately). You may use the sender's first name for a casual sign-off like "- ${senderProfile.name.split(" ")[0]}" at the end.`)

    // Campaign constraints
    parts.push(`## Campaign Purpose\n\n${campaign.purpose}`)

    // Campaign events (which events this campaign is promoting)
    if (campaignEvents && campaignEvents.length > 0) {
      const eventLines = campaignEvents.map((event) => {
        const info = [event.name]
        if (event.start_date) {
          const start = new Date(event.start_date)
          const end = event.end_date ? new Date(event.end_date) : null
          const utc: Intl.DateTimeFormatOptions = { timeZone: "UTC" }
          const dateStr = end
            ? `${start.toLocaleDateString("en-US", { month: "long", day: "numeric", ...utc })} - ${end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", ...utc })}`
            : start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", ...utc })
          info.push(dateStr)
        }
        if (event.city) {
          const location = event.state ? `${event.city}, ${event.state}` : event.city
          info.push(location)
        }
        const eventUrl = event.slug ? `https://bioedgelongevity.com/${event.slug}` : event.registration_url
        if (eventUrl) info.push(eventUrl)
        return `- ${info.join(" | ")}`
      }).join("\n")

      parts.push(`## Campaign Events\n\nThis campaign is promoting the following event(s). Reference them naturally in the email when relevant:\n${eventLines}`)
    }

    if (campaign.call_to_action) {
      parts.push(`## Call to Action\n\nEvery email must end with or naturally include this ask: ${campaign.call_to_action}`)
    }

    if (campaign.must_include) {
      parts.push(`## MUST Include (verbatim)\n\nThe following must appear exactly as written somewhere in the email:\n${campaign.must_include}`)
    }

    if (campaign.must_avoid) {
      parts.push(`## BANNED Words & Phrases (Hard Blacklist)\n\nThe following words and phrases are ABSOLUTELY FORBIDDEN. Do not use them in the subject line or email body under any circumstances — not even paraphrased or as part of a longer phrase:\n\n${campaign.must_avoid}\n\nIf you catch yourself writing any of these, rewrite the sentence completely.`)
    }

    if (campaign.reference_email) {
      parts.push(`## Reference Email (Style Guide)\n\nThe campaign creator provided a sample email to show the voice and cadence they want. Study this email for tone, sentence structure, level of formality, and how the opener/closer flow. Do NOT copy any phrases verbatim — use it as a feel reference only.\n\n---\n${campaign.reference_email}\n---`)
    }

    if (campaign.context) {
      parts.push(`## Background Context (DO NOT say any of this in the email)\n\nThis is context for you to understand the situation, but none of this should appear in the email:\n${campaign.context}`)
    }

    parts.push(`## Word Limit\n\nKeep the email body under ${campaign.max_words} words. Shorter is better. This should feel like a quick personal note, not a marketing email.`)

    // Subject line instructions — core principles always included
    const subjectDefaults = [
      `3-6 words ideal. Shorter subjects get higher open rates.`,
      `Lowercase style is fine for common words — it feels more personal and less like marketing. BUT always capitalize proper nouns: company names, brand names, event names, city names, and people's names. Example: "Calocurb at NYC Longevity Summit" not "calocurb at nyc longevity summit".`,
      `Reference their company name, role, or something specific to them when natural.`,
      `Must feel like one human writing to another — not a campaign.`,
      `NEVER use: "Quick question", "Partnership opportunity", "Exciting news", "Touching base", or any pattern that screams mass email.`,
      `NEVER use clickbait, ALL CAPS words, exclamation marks, or emojis in subject lines or body text. Zero emojis, ever.`,
      `Each recipient MUST get a unique subject line. No two should follow the same template.`,
      `Good examples: "your work on NAD+", "re: Longevity Summit", "TruDiagnostic + bioEDGE", "saw your talk on {topic}"`,
      `Bad examples: "Quick question for you", "Exciting opportunity", "Let's connect!", "Partnership inquiry"`,
    ].join("\n- ")

    if (campaign.subject_prompt) {
      parts.push(`## Subject Line Style\n\nCore rules (always apply):\n- ${subjectDefaults}\n\nAdditional style instructions from campaign creator:\n${campaign.subject_prompt}`)
    } else {
      parts.push(`## Subject Line Style\n\n- ${subjectDefaults}`)
    }

    // Output format
    parts.push(`## Output Format\n\nReturn ONLY a JSON object with two fields:\n\`\`\`json\n{"subject": "the subject line", "body": "the email body as plain text"}\n\`\`\`\n\nDo not include any other text, explanation, or markdown outside the JSON.`)

    return parts.join("\n\n")
  }

  private buildUserPrompt(
    campaign: Campaign,
    contact: ContactContext,
    company: CompanyContext
  ): string {
    const parts: string[] = []

    parts.push(`Write a personalized email to this person:`)
    parts.push(`\n**Contact:**`)
    const hasName = contact.first_name?.trim() || contact.last_name?.trim()
    if (hasName) {
      parts.push(`- Name: ${contact.first_name} ${contact.last_name}`)
    } else {
      parts.push(`- Name: [Unknown — this is a catch-all/generic email address. Do NOT use "Hi" with any name. Use a greeting like "Hi there," or "Hello," or jump straight into the email without a greeting. Do NOT guess or infer a name from the email address.]`)
    }
    if (contact.title) parts.push(`- Title: ${contact.title}`)
    if (contact.seniority) parts.push(`- Seniority: ${contact.seniority}`)
    if (contact.ai_expertise?.length) {
      parts.push(`- Known expertise: ${contact.ai_expertise.join(", ")}`)
    }
    if (contact.ai_outreach_suggestions) {
      parts.push(`- Outreach suggestions from research: ${contact.ai_outreach_suggestions}`)
    }

    parts.push(`\n**Their Company: ${company.name}**`)
    if (company.category) parts.push(`- Category: ${company.category}`)
    if (company.description) parts.push(`- What they do: ${company.description}`)
    if (company.differentiators) parts.push(`- Key differentiators: ${company.differentiators}`)
    if (company.bioedge_fit) parts.push(`- Why they fit bioEDGE: ${company.bioedge_fit}`)
    if (company.events.length > 0) {
      parts.push(`- Events they've attended: ${company.events.join(", ")}`)
    }
    if (company.systems_supported.length > 0) {
      parts.push(`- Biological systems they serve: ${company.systems_supported.join(", ")}`)
    }
    if (company.access_levels.length > 0) {
      parts.push(`- Access levels: ${company.access_levels.join(", ")}`)
    }

    // Reference the existing warm pitch for inspiration (but don't copy it)
    if (company.warm_pitch) {
      parts.push(`\n**Previous warm pitch draft (for reference, do NOT copy):**\n${company.warm_pitch}`)
    }

    return parts.join("\n")
  }

  private parseResponse(response: string): GeneratedEmail {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*"subject"[\s\S]*"body"[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          subject: String(parsed.subject || "").trim(),
          body: String(parsed.body || "").trim(),
        }
      }
    } catch {
      // Fall through to fallback
    }

    // Fallback: try to split on common patterns
    const lines = response.trim().split("\n")
    const subjectLine = lines.find((l) => l.toLowerCase().startsWith("subject:"))
    const subject = subjectLine ? subjectLine.replace(/^subject:\s*/i, "").trim() : "Quick note"
    const body = lines
      .filter((l) => !l.toLowerCase().startsWith("subject:"))
      .join("\n")
      .trim()

    return { subject, body }
  }
}

export const emailGeneratorService = new EmailGeneratorService()
