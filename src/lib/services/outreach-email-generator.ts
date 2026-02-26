/**
 * AI General Outreach Email Generator Service
 *
 * Generates personalized outreach emails for the General Outreach module.
 * Adapted from clinic-email-generator.ts with key differences:
 *
 * 1. NEVER personalizes by name — persona/interest-first approach only
 * 2. Injects a curated persona briefing per business type group (from outreach-personas.ts)
 * 3. Uses promotion presets (book, tool, coaching, summit, youtube, custom) instead of events
 * 4. Engagement signals from historical open/click data
 * 5. Handles the majority case: unknown recipients with no practice type
 */

import Anthropic from "@anthropic-ai/sdk"
import type { OutreachCampaign, OutreachCampaignRecipient } from "@/types/outreach"
import type { SenderProfile } from "@/types/database"
import { getPersonaGroup, getPersonaBriefing } from "@/lib/outreach-personas"

export interface OutreachRecipientContext {
  recipient_email: string
  recipient_business_type: string | null
  recipient_practice_name: string | null
  recipient_city: string | null
  recipient_state: string | null
  recipient_total_opens: number
  recipient_total_clicks: number
}

interface GeneratedEmail {
  subject: string
  body: string
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"

class OutreachEmailGeneratorService {
  private client: Anthropic | null

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY || null
    this.client = apiKey ? new Anthropic({ apiKey }) : null
  }

  isConfigured(): boolean {
    return !!this.client
  }

  /**
   * Generate a personalized outreach email for one recipient.
   * The system prompt is built once per campaign batch (same for all recipients
   * in the same persona group); the user prompt is per-recipient.
   */
  async generateEmail(
    campaign: OutreachCampaign,
    senderProfile: SenderProfile,
    recipient: OutreachRecipientContext
  ): Promise<GeneratedEmail> {
    if (!this.client) {
      throw new Error(
        "Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable."
      )
    }

    const personaGroup = getPersonaGroup(recipient.recipient_business_type)
    const systemPrompt = this.buildSystemPrompt(campaign, senderProfile, personaGroup)
    const userPrompt = this.buildUserPrompt(recipient)

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.85,  // slightly higher than clinic emails for more variety across large lists
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    const text = textBlock && "text" in textBlock ? textBlock.text.trim() : ""

    return this.parseResponse(text)
  }

  private buildSystemPrompt(
    campaign: OutreachCampaign,
    senderProfile: SenderProfile,
    personaGroup: string
  ): string {
    const parts: string[] = []
    const persona = getPersonaBriefing(personaGroup)

    // ── 1. Role ──────────────────────────────────────────────────────────────
    parts.push(`## Your Role

You are writing outreach emails on behalf of Sandy Martin — author, biohacker, and creator of the bioEDGE framework for longevity. The recipients are a mix of health practitioners and health-interested individuals. Your job is to introduce something of genuine value in a way that feels like a personal note from someone in the same world — not a marketing campaign.

The goal is to be relevant and respectful, not to sell. The best outcome is a reply or a genuine click. The worst outcome is another mass email in their deleted folder.`)

    // ── 2. Voice Principles ───────────────────────────────────────────────────
    parts.push(`## Voice Principles

- Write like a peer in the health and longevity space. Not a brand. Not a vendor.
- Direct and honest. State why you're reaching out clearly, without padding.
- NO fake familiarity. You have not visited their practice, read their work, or followed them. Do not pretend otherwise.
- NO hype words. This means: revolutionary, groundbreaking, game-changing, transform, supercharge, turbocharge, miracle, unlock, unleash, empower, paradigm shift, cutting-edge, synergy, leverage.
- NO em dashes (—). NO emojis. NO exclamation marks.
- Short paragraphs: 2–3 sentences maximum.
- This should feel like a quick personal note, not a marketing blast or a nurture sequence.
- Treat the recipient as an intelligent adult who receives many emails and can immediately identify AI-generated slop.`)

    // ── 3. Personalization Rules (THE critical constraint) ───────────────────
    parts.push(`## Personalization Rules — READ CAREFULLY

**NEVER address the recipient by name.** Do not open with "Hi [Name]" or any name-based greeting. This is a hard rule with no exceptions.

Instead, personalize by demonstrating that you understand their world:

1. **Open with a line that proves you understand their daily reality or professional context.** This is the most important sentence in the email. Not a compliment, not a question — a statement that shows you actually get what their world is like.

2. **Reference their practice name once if provided.** Weave it in naturally — not in the opening line, and never as "I see you run [practice name]" or "I noticed your clinic." Example: "If the team at [Practice Name] is already thinking about longevity..." not "Dear [Practice Name]."

3. **Reference their city briefly if it adds warmth.** Only if known. Not forced. Skip it if it would feel awkward.

4. **Do not fabricate details.** Only reference information actually provided in the contact context. If no practice name or location is given, write a strong generic opener for their persona type.

5. **The best opening line is one they could not imagine receiving from anyone except someone who genuinely understands their practice.** That specificity is the personalization.`)

    // ── 4. Audience Context (persona briefing) ───────────────────────────────
    parts.push(`## Audience Context: ${persona.displayName}

${persona.context}`)

    // ── 5. Tone override ─────────────────────────────────────────────────────
    if (campaign.tone) {
      parts.push(`## Writing Tone\n\n${campaign.tone}`)
    }

    // ── 6. Sender identity ───────────────────────────────────────────────────
    const firstName = senderProfile.name.split(" ")[0]
    parts.push(`## You Are Writing As

Name: ${senderProfile.name}
Title: ${senderProfile.title || "bioEDGE Longevity"}

Write the email body only. Do NOT include a signature block (that is appended separately). You may use a casual first-name sign-off like "- ${firstName}" at the very end of the body.`)

    // ── 7. What's being promoted ─────────────────────────────────────────────
    if (campaign.promotion_title || campaign.promotion_url) {
      const promotionLines: string[] = []
      if (campaign.promotion_title) promotionLines.push(`Title: ${campaign.promotion_title}`)
      if (campaign.promotion_url) promotionLines.push(`Link: ${campaign.promotion_url}`)
      if (campaign.promotion_description) {
        promotionLines.push(`About it: ${campaign.promotion_description}`)
      }

      parts.push(`## What You're Promoting

${promotionLines.join("\n")}

Include the link naturally in the body — do NOT just paste a raw URL at the end. Weave it into the relevant sentence. Never bold the URL or make it feel like a button label.`)
    }

    // ── 8. Campaign purpose ──────────────────────────────────────────────────
    if (campaign.purpose) {
      parts.push(`## Campaign Purpose\n\n${campaign.purpose}`)
    }

    // ── 9. Call to action ────────────────────────────────────────────────────
    if (campaign.call_to_action) {
      parts.push(
        `## Call to Action\n\nEvery email must naturally include this ask: ${campaign.call_to_action}`
      )
    }

    // ── 10. Must include ─────────────────────────────────────────────────────
    if (campaign.must_include) {
      parts.push(
        `## MUST Include (verbatim)\n\nThe following must appear exactly as written somewhere in the email:\n${campaign.must_include}`
      )
    }

    // ── 11. Banned words ─────────────────────────────────────────────────────
    if (campaign.must_avoid) {
      parts.push(
        `## BANNED Words & Phrases (Hard Blacklist)\n\nThe following are ABSOLUTELY FORBIDDEN in the subject line and email body. Do not use them, not even paraphrased:\n\n${campaign.must_avoid}\n\nIf you catch yourself writing any of these, rewrite the sentence completely.`
      )
    }

    // ── 12. Reference email ──────────────────────────────────────────────────
    if (campaign.reference_email) {
      parts.push(
        `## Reference Email (Style Guide Only)\n\nStudy this sample for tone, sentence length, formality level, and how the opener/closer flow. Do NOT copy any phrases verbatim — use it as a feel reference only.\n\n---\n${campaign.reference_email}\n---`
      )
    }

    // ── 13. Background context ───────────────────────────────────────────────
    if (campaign.context) {
      parts.push(
        `## Background Context (DO NOT include any of this in the email)\n\nThis is context to help you understand the situation. None of this should appear in the email:\n${campaign.context}`
      )
    }

    // ── 14. Word limit ───────────────────────────────────────────────────────
    parts.push(
      `## Word Limit\n\nKeep the email body under ${campaign.max_words} words. Shorter is always better. This is a quick personal note, not a pitch deck.`
    )

    // ── 15. Subject line rules ───────────────────────────────────────────────
    const subjectRules = [
      `3–6 words ideal. Short subjects outperform long ones.`,
      `Lowercase style is fine for common words. Always capitalize proper nouns: practice names, brand names, city names.`,
      `Must feel like one human writing to another — not a campaign blast.`,
      `Reference their practice type, specialty, or city when natural and known.`,
      `NEVER use: "Quick question", "Partnership opportunity", "Exciting news", "Touching base", "I had to reach out", or anything that screams mass email.`,
      `NEVER use clickbait, ALL CAPS words, exclamation marks, or emojis.`,
      `Each recipient MUST get a unique subject line. No two should follow the same template pattern.`,
      `Good examples: "longevity tools for chiropractors", "re: what I wrote for practitioners in FL", "your practice and the bioEDGE framework"`,
      `Bad examples: "Exciting opportunity for you!", "Quick question from Sandy", "Unlock your longevity potential"`,
    ].join("\n- ")

    if (campaign.subject_prompt) {
      parts.push(
        `## Subject Line Style\n\nCore rules (always apply):\n- ${subjectRules}\n\nAdditional guidance:\n${campaign.subject_prompt}`
      )
    } else {
      parts.push(`## Subject Line Style\n\n- ${subjectRules}`)
    }

    // ── 16. Output format ────────────────────────────────────────────────────
    parts.push(
      `## Output Format\n\nReturn ONLY a JSON object with two fields:\n\`\`\`json\n{"subject": "the subject line", "body": "the email body as plain text"}\n\`\`\`\n\nDo not include any other text, explanation, or markdown outside the JSON.`
    )

    return parts.join("\n\n")
  }

  private buildUserPrompt(recipient: OutreachRecipientContext): string {
    const parts: string[] = []

    parts.push(`Write a personalized outreach email to this contact. Remember: no name greeting. Open with a line that reflects genuine understanding of their world.`)

    parts.push(`\n**Contact Details:**`)

    if (recipient.recipient_business_type && recipient.recipient_business_type !== 'Valid') {
      parts.push(`- Business Type: ${recipient.recipient_business_type}`)
    } else {
      parts.push(`- Business Type: (unknown — general longevity/health interest)`)
    }

    if (recipient.recipient_practice_name) {
      parts.push(`- Practice/Business Name: ${recipient.recipient_practice_name}`)
    }

    if (recipient.recipient_city && recipient.recipient_state) {
      parts.push(`- Location: ${recipient.recipient_city}, ${recipient.recipient_state}`)
    } else if (recipient.recipient_city || recipient.recipient_state) {
      parts.push(`- Location: ${recipient.recipient_city || recipient.recipient_state}`)
    }

    // Engagement signal — only if meaningful
    if (recipient.recipient_total_clicks > 0) {
      parts.push(
        `- Engagement History: Has clicked links in previous emails from Sandy — already showed active interest`
      )
    } else if (recipient.recipient_total_opens >= 5) {
      parts.push(
        `- Engagement History: Has opened ${recipient.recipient_total_opens} previous emails — familiar with Sandy, hasn't replied yet`
      )
    } else if (recipient.recipient_total_opens >= 1) {
      parts.push(
        `- Engagement History: Has opened previous emails from Sandy`
      )
    }
    // If opens === 0, omit the engagement line entirely (cold contact)

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
      // fall through to fallback
    }

    // Fallback: split on Subject: line if JSON parse fails
    const lines = response.trim().split("\n")
    const subjectLine = lines.find((l) => l.toLowerCase().startsWith("subject:"))
    const subject = subjectLine
      ? subjectLine.replace(/^subject:\s*/i, "").trim()
      : "Quick note"
    const body = lines
      .filter((l) => !l.toLowerCase().startsWith("subject:"))
      .join("\n")
      .trim()

    return { subject, body }
  }
}

export const outreachEmailGeneratorService = new OutreachEmailGeneratorService()
