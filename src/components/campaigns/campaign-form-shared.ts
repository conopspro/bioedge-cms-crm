// Shared constants, types, and helpers for campaign form pages
// Used by both /campaigns/new and /campaigns/[id]/edit

import type { SenderProfile } from "@/types/database"

export interface CampaignFormData {
  name: string
  purpose: string
  call_to_action: string
  tone: string
  must_include: string
  must_avoid: string
  max_words: number
  sender_profile_id: string
  reply_to: string
  subject_prompt: string
  context: string
  reference_email: string
  send_window_start: number
  send_window_end: number
  min_delay_seconds: number
  max_delay_seconds: number
  daily_send_limit: number
}

export const DEFAULT_FORM_DATA: CampaignFormData = {
  name: "",
  purpose: "",
  call_to_action: "",
  tone: "",
  must_include: "",
  must_avoid: "",
  max_words: 100,
  sender_profile_id: "",
  reply_to: "",
  subject_prompt: "",
  context: "",
  reference_email: "",
  send_window_start: 9,
  send_window_end: 17,
  min_delay_seconds: 120,
  max_delay_seconds: 300,
  daily_send_limit: 50,
}

export interface EventOption {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  city: string | null
  state: string | null
  slug: string | null
  registration_url: string | null
}

export const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? "AM" : "PM"}`,
}))

export const TONE_PRESETS = [
  {
    id: "outreach",
    label: "First Outreach",
    description: "Opening a door, not closing a deal",
    prompt:
      "Write like you're introducing yourself to someone at an industry event. You're genuinely interested in whether there's a reason to talk further. Be direct about who you are and why you're writing. Ask a question that shows you understand their world without pretending to know them personally. Short, warm, zero pressure.",
  },
  {
    id: "follow-up",
    label: "Follow-Up",
    description: "They didn't reply. Gentle nudge.",
    prompt:
      "This is a follow-up to an earlier email they didn't respond to. Keep it shorter than the original. Don't guilt-trip or say 'just bumping this up' or 'circling back.' Add one new piece of value or context they didn't have before. Make it easy to say yes or no. If the answer is no, that's fine too.",
  },
  {
    id: "event-invite",
    label: "Event Invite",
    description: "Come to our event or exhibit",
    prompt:
      "You're inviting them to participate in an event. Lead with what's in it for them, not the event logistics. Be specific about the opportunity (exhibitor, speaker, attendee). Keep logistics to one line. The ask should be 'interested?' not 'sign up now.'",
  },
  {
    id: "confirm",
    label: "Confirming Details",
    description: "Nailing down logistics",
    prompt:
      "They've already said yes to something. Now you're confirming details. Be organized, specific, and brief. Use short paragraphs or a simple list for the facts. Warm but efficient. This is a working email, not a pitch.",
  },
  {
    id: "re-engage",
    label: "Re-engage",
    description: "We talked before, it's been a while",
    prompt:
      "You're reconnecting with someone you've had prior contact with. Acknowledge the gap naturally without over-explaining. Reference the previous interaction briefly. Bring something new to the table: a reason to reconnect NOW, not just 'checking in.' Don't say 'it's been a while' or 'hope you're doing well.'",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Write your own tone instructions",
    prompt: "",
  },
]

export const COMMON_SLOP = [
  "unlock", "groundbreaking", "unleash", "revolutionary",
  "cutting-edge", "game-changing", "synergy", "leverage",
  "disrupt", "innovate", "empower", "transform",
]

export function formatEventDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) return ""
  const start = new Date(startDate)
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }
  const shortOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: "UTC" }
  if (!endDate) return start.toLocaleDateString("en-US", opts)
  const end = new Date(endDate)
  if (start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${start.toLocaleDateString("en-US", shortOpts)} - ${end.toLocaleDateString("en-US", opts)}`
  }
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`
}
