/**
 * Resend Email Service
 *
 * Sends transactional and campaign emails via the Resend API.
 * Used for slow-drip personalized outreach campaigns.
 *
 * API Docs: https://resend.com/docs
 */

import { Resend } from "resend"

interface SendEmailOptions {
  from: string // "Sandy Martin <sandy@bioedgelongevity.com>"
  to: string
  subject: string
  html: string
  replyTo?: string
  /**
   * NOTE: trackOpens and trackClicks are accepted for intent-recording
   * but NOT forwarded to the Resend API. The Resend SDK does not support
   * per-email tracking toggles — open/click tracking is configured at
   * the domain level in the Resend dashboard (Settings → Domains → Tracking).
   */
  trackOpens?: boolean
  trackClicks?: boolean
}

interface SendEmailResult {
  id: string | null
  error: string | null
}

class ResendService {
  private client: Resend | null
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || null
    this.client = this.apiKey ? new Resend(this.apiKey) : null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Send a single email via Resend
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    if (!this.client) {
      return { id: null, error: "Resend API key not configured. Set RESEND_API_KEY environment variable." }
    }

    try {
      const { data, error } = await this.client.emails.send({
        from: options.from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
        headers: {
          // Help with deliverability
          "X-Entity-Ref-ID": crypto.randomUUID(),
        },
      })

      if (error) {
        return { id: null, error: error.message }
      }

      return { id: data?.id || null, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Resend error"
      return { id: null, error: message }
    }
  }
}

export const resendService = new ResendService()
