/**
 * TypeScript types for the General Outreach module.
 * Tables: outreach_contacts, promotion_presets, outreach_campaigns,
 *         outreach_campaign_recipients
 */

// ---------------------------------------------------------------------------
// Outreach Contact
// ---------------------------------------------------------------------------
export interface OutreachContact {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  practice_name: string | null
  title: string | null
  business_type: string | null   // Sandy's own tag; nullable = unknown
  city: string | null
  state: string | null
  website: string | null
  phone: string | null
  notes: string | null
  total_opens: number
  total_clicks: number
  source_file: string | null
  imported_at: string | null
  created_at: string
  updated_at: string
}

export type OutreachContactInsert = Omit<OutreachContact, 'id' | 'created_at' | 'updated_at'>

// ---------------------------------------------------------------------------
// Promotion Preset
// ---------------------------------------------------------------------------
export type PromotionPresetType = 'book' | 'tool' | 'coaching' | 'summit' | 'youtube' | 'custom'

export interface PromotionPreset {
  id: string
  name: string
  type: PromotionPresetType
  icon: string | null              // lucide-react icon name
  title: string | null
  url: string | null
  description: string | null
  youtube_video_id: string | null
  youtube_thumbnail_url: string | null
  default_purpose: string | null
  default_cta: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type PromotionPresetInsert = Omit<PromotionPreset, 'id' | 'created_at' | 'updated_at'>
export type PromotionPresetUpdate = Partial<PromotionPresetInsert>

// ---------------------------------------------------------------------------
// Outreach Campaign
// ---------------------------------------------------------------------------
export type OutreachCampaignStatus =
  | 'draft'
  | 'generating'
  | 'ready'
  | 'sending'
  | 'paused'
  | 'completed'

export type OutreachEngagementFilter = 'any' | 'opened' | 'clicked'

export interface OutreachCampaign {
  id: string
  name: string
  status: OutreachCampaignStatus
  sender_profile_id: string | null
  reply_to: string | null

  // Promotion snapshot
  promotion_preset_id: string | null
  promotion_type: string | null
  promotion_title: string | null
  promotion_url: string | null
  promotion_description: string | null

  // Targeting filters (stored for audit; recipients snapshotted at creation)
  target_business_types: string[]
  target_states: string[]
  target_engagement: OutreachEngagementFilter
  exclude_emailed_within_days: number | null

  // AI generation
  purpose: string | null
  tone: string | null
  context: string | null
  must_include: string | null
  must_avoid: string | null
  call_to_action: string | null
  reference_email: string | null
  max_words: number
  subject_prompt: string | null

  // Send pacing
  send_window_start: number
  send_window_end: number
  min_delay_seconds: number
  max_delay_seconds: number
  daily_send_limit: number
  track_opens: boolean
  track_clicks: boolean

  created_at: string
  updated_at: string
}

export type OutreachCampaignInsert = Omit<OutreachCampaign, 'id' | 'created_at' | 'updated_at'>
export type OutreachCampaignUpdate = Partial<OutreachCampaignInsert>

// Campaign with joined sender profile (used in list/detail views)
export interface OutreachCampaignWithProfile extends OutreachCampaign {
  sender_profiles?: {
    name: string
    email: string
    title: string | null
  } | null
  // Computed counts (not in DB — returned by API)
  recipient_count?: number
  pending_count?: number
  generated_count?: number
  approved_count?: number
  sent_count?: number
}

// ---------------------------------------------------------------------------
// Outreach Campaign Recipient
// ---------------------------------------------------------------------------
export type OutreachRecipientStatus =
  | 'pending'
  | 'generated'
  | 'approved'
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'failed'
  | 'suppressed'

export interface OutreachCampaignRecipient {
  id: string
  outreach_campaign_id: string
  outreach_contact_id: string

  // Contact data snapshot
  recipient_email: string
  recipient_business_type: string | null
  recipient_practice_name: string | null
  recipient_city: string | null
  recipient_state: string | null
  recipient_total_opens: number
  recipient_total_clicks: number

  // Generated content
  subject: string | null
  body: string | null
  body_html: string | null

  status: OutreachRecipientStatus
  approved: boolean

  generated_at: string | null
  sent_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
  resend_id: string | null
  error: string | null
  created_at: string
}

export type OutreachRecipientUpdate = Partial<Pick<
  OutreachCampaignRecipient,
  'subject' | 'body' | 'body_html' | 'status' | 'approved'
>>

// ---------------------------------------------------------------------------
// API response shapes
// ---------------------------------------------------------------------------

export interface OutreachContactsResponse {
  contacts: OutreachContact[]
  total: number
  page: number
  pageSize: number
}

export interface BusinessTypeCount {
  business_type: string | null
  count: number
}

export interface OutreachContactCountResponse {
  total: number
  by_persona_group: Array<{
    group: string          // persona group key
    display_name: string   // e.g. "Chiropractors"
    count: number
  }>
}

export interface OutreachImportResult {
  total: number
  imported: number
  updated: number
  skipped: number
  errors: string[]
}

export interface GenerateOutreachEmailsResult {
  generated: number
  remaining: number
  errors: string[]
}
