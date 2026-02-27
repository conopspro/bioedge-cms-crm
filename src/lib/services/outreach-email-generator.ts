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

- Direct, grounded, and quietly confident. Short sentences.
- No hype, no enthusiasm performance. Write like someone who has been in the room, seen the industry, and isn't impressed by their own cleverness.
- Acknowledge the reader's sophistication without flattering them. Earn attention through specificity rather than energy.
- Speak to insiders without being exclusive. The call to action feels like an invitation, not a push.
- Write like a peer. Not a brand. Not a vendor.
- NO hype words: revolutionary, groundbreaking, game-changing, transform, supercharge, turbocharge, miracle, unlock, unleash, empower, paradigm shift, cutting-edge, synergy, leverage.
- NO em dashes (—). NO emojis. NO exclamation marks. Never oversells. Never assumes.
- Short paragraphs: 2–3 sentences maximum.
- The credibility is in what's left out as much as what's included.
- Treat the recipient as an intelligent adult who receives many emails and can immediately identify AI-generated slop.`)

    // ── 3. Personalization Rules (THE critical constraint) ───────────────────
    parts.push(`## Personalization Rules — READ CAREFULLY

**NEVER address the recipient by name.** No name in the greeting or anywhere in the email. Hard rule, no exceptions.

**NEVER reference anything you know about the recipient.** Do not mention their location, city, state, employer, company name, practice name, industry, or specialty — even if that information is provided below. The recipient must never feel profiled, researched, or geo-targeted. This includes:
- NO city or state references ("Another winter in Montana...", "You live in the Central Valley...")
- NO industry call-outs ("As a chiropractor...", "In your line of work...")
- NO practice/company name mentions ("At [Practice Name]...")
- NO engagement history references ("Five emails and you're still reading...", "You clicked last time...")
- NO assumptions about their situation, schedule, or life

**The RIGHT approach: Open with a universal observation about the longevity space** — a truth, a tension, a gap, or an irony that any sophisticated reader will recognize from their own experience. The insight IS the personalization. It works because it is true, not because it references the reader.

Strong opener examples (use these as inspiration, never copy verbatim):
- "The longevity space has never had more answers. What it's missing is a way to know which questions to ask first."
- "Everyone's optimizing. Few are doing it in the right order."
- "Another supplement protocol, another $400 a month, another conversation about bioavailability. Who's asking what's blocking absorption in the first place?"
- "You can stack the best supplements in the world on top of a system that isn't ready to use them. Most people do."
- "Most people are fluent in symptoms and clueless about systems. That's not a discipline problem. That's a missing framework."
- "The gap between knowing and doing has never been wider. The longevity space keeps widening it."
- "Another year of optimizing sleep while the thing disrupting it goes unaddressed. Addition is easy. Subtraction is the work."
- "Another biohacking conference, another stack of supplements nobody will actually take consistently."
- "Your body has been sending signals the whole time. The problem was never the signal. It was not knowing how to read it."

These work because they respect the reader's intelligence. They are never cute. They are never impressed with themselves.`)

    // ── 4. Audience Context (persona briefing) ───────────────────────────────
    parts.push(`## Audience Context: ${persona.displayName}

${persona.context}`)

    // ── 4b. Universal longevity lens (overrides professional framing) ─────────
    parts.push(`## Universal Lens — Apply To All Recipients

All recipients are here because of their personal interest in longevity — not their professional role. Write to them as fellow longevity enthusiasts. Their profession may inform which aspects of the longevity conversation resonate, but never frame the email around their practice, patients, or business.`)

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
    const subjectBaseRules = [
      `2–5 words ideal. Shorter outperforms longer every time.`,
      `Lowercase preferred. Capitalize proper nouns only (brand names, event names).`,
      `Must feel like one human writing to another.`,
      `NEVER reference the recipient's location, city, company, practice name, or industry.`,
      `NEVER use: "Quick question", "Partnership opportunity", "Exciting news", "Touching base", "I had to reach out", or anything that signals mass email.`,
      `NEVER use clickbait, ALL CAPS words, exclamation marks, or emojis.`,
      `Each recipient MUST get a unique subject line. Do not repeat the same subject line twice.`,
    ].join("\n- ")

    if (campaign.subject_prompt) {
      parts.push(
        `## Subject Line — YOUR PRIMARY DIRECTIVE\n\nThe following instruction overrides all defaults. Follow it precisely for every subject line:\n\n${campaign.subject_prompt}\n\n**Supporting rules (always apply in addition):**\n- ${subjectBaseRules}`
      )
    } else {
      parts.push(`## Subject Line Style\n\n- ${subjectBaseRules}`)
    }

    // ── 16. Output format ────────────────────────────────────────────────────
    parts.push(
      `## Output Format\n\nReturn ONLY a JSON object with two fields:\n\`\`\`json\n{"subject": "the subject line", "body": "the email body as plain text"}\n\`\`\`\n\nDo not include any other text, explanation, or markdown outside the JSON.`
    )

    return parts.join("\n\n")
  }

  private buildUserPrompt(recipient: OutreachRecipientContext): string {
    const parts: string[] = []

    parts.push(`Write an outreach email. No name greeting. Open with a universal observation — a truth about the longevity space that a sophisticated reader will recognize from their own experience. Do NOT reference anything about the recipient personally.`)

    // Only pass audience type to inform content angle — never to reference explicitly
    if (recipient.recipient_business_type && recipient.recipient_business_type !== 'Valid') {
      parts.push(`\nAudience context (use to inform your angle — do NOT mention this in the email): ${recipient.recipient_business_type}`)
    }

    // Engagement signals — inform warmth/directness but never reference in the email
    if (recipient.recipient_total_clicks > 0) {
      parts.push(
        `\nEngagement note (do NOT reference this in the email): This person has clicked links before. You may write with slightly more directness and assume some existing familiarity with the space.`
      )
    } else if (recipient.recipient_total_opens >= 5) {
      parts.push(
        `\nEngagement note (do NOT reference this in the email): This person has opened several previous emails. Write with conviction — they are interested but have not yet acted.`
      )
    }
    // Cold contacts: no engagement note — write fresh

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
