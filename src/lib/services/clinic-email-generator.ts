/**
 * AI Clinic Email Generator Service
 *
 * Generates personalized outreach emails to clinics using Claude.
 * Purpose: encourage local health practitioners to attend bioEDGE events.
 *
 * This is separate from the company/contact email generator because
 * the "Job To Be Done" is fundamentally different:
 * - Campaign emails → sell exhibition/sponsorship opportunities
 * - Clinic emails → encourage attendance as practitioners
 *
 * Each email is written fresh by Claude with clinic-specific context.
 */

import Anthropic from "@anthropic-ai/sdk"
import type { ClinicCampaign, SenderProfile } from "@/types/database"

export interface ClinicContext {
  name: string
  city: string | null
  state: string | null
  tags: string[]
  description: string | null
  website: string | null
  google_rating: number | null
  reviews_count: number
}

export interface ClinicCampaignEventContext {
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

class ClinicEmailGeneratorService {
  private client: Anthropic | null

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY || null
    this.client = apiKey ? new Anthropic({ apiKey }) : null
  }

  isConfigured(): boolean {
    return !!this.client
  }

  /**
   * Generate a personalized email for one clinic
   */
  async generateEmail(
    campaign: ClinicCampaign,
    senderProfile: SenderProfile,
    clinic: ClinicContext,
    campaignEvents?: ClinicCampaignEventContext[]
  ): Promise<GeneratedEmail> {
    if (!this.client) {
      throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.")
    }

    const systemPrompt = this.buildSystemPrompt(campaign, senderProfile, campaignEvents)
    const userPrompt = this.buildUserPrompt(campaign, clinic)

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    const text = textBlock && "text" in textBlock ? textBlock.text.trim() : ""

    return this.parseResponse(text)
  }

  private buildSystemPrompt(
    campaign: ClinicCampaign,
    senderProfile: SenderProfile,
    campaignEvents?: ClinicCampaignEventContext[]
  ): string {
    const parts: string[] = []

    // Core identity and voice
    parts.push(`## Your Role

You are writing outreach emails on behalf of bioEDGE Longevity Summit to health and wellness clinics. The goal is to encourage clinic practitioners and owners to ATTEND our longevity events as attendees, not as exhibitors or sponsors. This is a peer-to-peer invitation from one professional in the longevity space to another.

## Voice Principles

- Professional but warm. Write like a colleague in the longevity/wellness industry.
- Direct and honest. State why you are reaching out clearly.
- NO fake familiarity. You have NOT visited their clinic or followed their work. Do NOT pretend otherwise.
- NO hype words: revolutionary, groundbreaking, game-changing, transform, supercharge, miracle.
- NO em dashes, emojis, or exclamation marks.
- Short paragraphs (2-3 sentences max).
- This should feel like a quick personal note, not a marketing blast.

## Personalization Requirements

Every email MUST be tailored to the specific clinic. You will be given details about the clinic including their name, city, and specialties/services. Use them:

1. **Reference their city or region naturally.** Example: "practitioners in the Austin area" or "your Denver clinic". Do NOT just restate their full address.
2. **Reference their services or specialties.** Connect what they do to what the event covers. Example: if they do peptide therapy, mention relevant sessions or topics. Do NOT list all their services — pick the one or two most relevant to the event.
3. **Reference their business by name at least once**, ideally in the opening line or subject. Keep it natural — do NOT say "I see you run [clinic name]" or "I noticed your clinic". Instead weave the name in: "Would the team at [clinic name] be interested in..." or use it in the subject line.
4. **Do NOT fabricate details.** Only reference information actually provided in the clinic context. If no description or specialties are given, keep it general.`)

    // Tone override
    if (campaign.tone) {
      parts.push(`## Writing Tone\n\n${campaign.tone}`)
    }

    // Sender identity
    parts.push(`## You Are Writing As

Name: ${senderProfile.name}
Title: ${senderProfile.title || "bioEDGE Longevity team"}

Write the email body only. Do NOT include a signature block (that gets appended separately). You may use the sender's first name for a casual sign-off like "- ${senderProfile.name.split(" ")[0]}" at the end.`)

    // Campaign purpose
    if (campaign.purpose) {
      parts.push(`## Campaign Purpose\n\n${campaign.purpose}`)
    }

    // Events being promoted
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

      parts.push(`## Event(s) Being Promoted

This campaign is inviting clinics to attend the following event(s). Reference them naturally:
${eventLines}`)
    }

    // CTA
    if (campaign.call_to_action) {
      parts.push(`## Call to Action\n\nEvery email must end with or naturally include this ask: ${campaign.call_to_action}`)
    }

    // Must include
    if (campaign.must_include) {
      parts.push(`## MUST Include (verbatim)\n\nThe following must appear exactly as written somewhere in the email:\n${campaign.must_include}`)
    }

    // Banned words
    if (campaign.must_avoid) {
      parts.push(`## BANNED Words & Phrases (Hard Blacklist)\n\nThe following words and phrases are ABSOLUTELY FORBIDDEN. Do not use them in the subject line or email body under any circumstances, not even paraphrased:\n\n${campaign.must_avoid}\n\nIf you catch yourself writing any of these, rewrite the sentence completely.`)
    }

    // Reference email
    if (campaign.reference_email) {
      parts.push(`## Reference Email (Style Guide)\n\nStudy this sample email for tone, sentence structure, level of formality, and how the opener/closer flow. Do NOT copy any phrases verbatim, use it as a feel reference only.\n\n---\n${campaign.reference_email}\n---`)
    }

    // Background context
    if (campaign.context) {
      parts.push(`## Background Context (DO NOT say any of this in the email)\n\nThis is context for you to understand the situation, but none of this should appear in the email:\n${campaign.context}`)
    }

    // Word limit
    parts.push(`## Word Limit\n\nKeep the email body under ${campaign.max_words} words. Shorter is better. This should feel like a quick personal note, not a marketing email.`)

    // Subject line rules
    const subjectDefaults = [
      `3-6 words ideal. Shorter subjects get higher open rates.`,
      `Lowercase style is fine for common words. BUT always capitalize proper nouns: clinic names, brand names, event names, city names.`,
      `Reference their clinic name, specialty, or city when natural.`,
      `Must feel like one human writing to another, not a campaign.`,
      `NEVER use: "Quick question", "Partnership opportunity", "Exciting news", "Touching base", or any pattern that screams mass email.`,
      `NEVER use clickbait, ALL CAPS words, exclamation marks, or emojis.`,
      `Each clinic MUST get a unique subject line. No two should follow the same template.`,
      `Good examples: "longevity practitioners in Austin", "re: upcoming summit in NYC", "your cryotherapy practice + bioEDGE"`,
      `Bad examples: "Quick question for you", "Exciting opportunity", "Let's connect!"`,
    ].join("\n- ")

    if (campaign.subject_prompt) {
      parts.push(`## Subject Line Style\n\nCore rules (always apply):\n- ${subjectDefaults}\n\nAdditional style instructions:\n${campaign.subject_prompt}`)
    } else {
      parts.push(`## Subject Line Style\n\n- ${subjectDefaults}`)
    }

    // Output format
    parts.push(`## Output Format\n\nReturn ONLY a JSON object with two fields:\n\`\`\`json\n{"subject": "the subject line", "body": "the email body as plain text"}\n\`\`\`\n\nDo not include any other text, explanation, or markdown outside the JSON.`)

    return parts.join("\n\n")
  }

  private buildUserPrompt(
    campaign: ClinicCampaign,
    clinic: ClinicContext
  ): string {
    const parts: string[] = []

    parts.push(`Write a personalized email to this clinic inviting them to attend. Remember: reference their business name, city, and relevant services naturally in the email.`)

    parts.push(`\n**Clinic Details (use these to personalize):**`)
    parts.push(`- Business Name: ${clinic.name}`)
    if (clinic.city && clinic.state) {
      parts.push(`- City & State: ${clinic.city}, ${clinic.state}`)
    } else if (clinic.city || clinic.state) {
      parts.push(`- Location: ${clinic.city || clinic.state}`)
    }

    if (clinic.tags.length > 0) {
      parts.push(`- Their Services/Specialties: ${clinic.tags.join(", ")}`)
      parts.push(`  (Pick the 1-2 most relevant to the event when personalizing)`)
    }

    if (clinic.description) {
      parts.push(`- About Them: ${clinic.description}`)
    }

    if (clinic.website) {
      parts.push(`- Website: ${clinic.website}`)
    }

    if (clinic.google_rating) {
      parts.push(`- Google Rating: ${clinic.google_rating}/5 (${clinic.reviews_count} reviews)`)
    }

    return parts.join("\n")
  }

  private parseResponse(response: string): GeneratedEmail {
    try {
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

export const clinicEmailGeneratorService = new ClinicEmailGeneratorService()
