/**
 * Database Types for BioEdge CMS/CRM
 *
 * These TypeScript types mirror our Supabase database schema.
 * Update these when you modify the database structure.
 */

// ============================================
// ENUMS - Match the database enum types
// ============================================

/** Function Health package tier for company analysis */
export type FunctionHealthTier = "essentials" | "comprehensive" | "total"

/** Company status in our pipeline */
export type CompanyStatus =
  | "researching"
  | "article_draft"
  | "published"
  | "outreach"
  | "engaged"

/** Contact outreach status */
export type OutreachStatus =
  | "not_contacted"
  | "contacted"
  | "responded"
  | "converted"

/** Article publication status */
export type ArticleStatus = "draft" | "review" | "published"

/** Types of article enhancements */
export type EnhancementType = "youtube" | "scholar" | "book" | "image" | "link"

/** Types of outreach methods */
export type OutreachType = "email" | "phone" | "linkedin" | "call" | "text" | "meeting" | "other"

/** Presentation status */
export type PresentationStatus = "draft" | "published" | "archived"

/** @deprecated Use PresentationStatus instead */
export type AgendaItemStatus = PresentationStatus

/** Event company role (exhibitor/sponsor level) */
export type EventCompanyRole =
  | "platinum_sponsor"
  | "gold_sponsor"
  | "silver_sponsor"
  | "bronze_sponsor"
  | "exhibitor"
  | "media_partner"
  | "supporting_organization"

/** Event participant status */
export type EventParticipantStatus =
  | "confirmed"
  | "pending"
  | "tentative"
  | "cancelled"
  | "waitlist"

/** Event contact role (speaker role) */
export type EventContactRole =
  | "keynote_speaker"
  | "speaker"
  | "panelist"
  | "moderator"
  | "workshop_leader"
  | "mc"
  | "host"
  | "judge"
  | "mentor"
  | "organizer"

/** Event presentation status */
export type EventPresentationStatus =
  | "scheduled"
  | "confirmed"
  | "tentative"
  | "cancelled"
  | "completed"

/** Panelist role in a presentation */
export type PanelistRole =
  | "moderator"
  | "panelist"
  | "presenter"
  | "host"
  | "guest"

/** Event status */
export type EventStatus =
  | "draft"
  | "published"
  | "completed"
  | "archived"

/** Session types (replaces AgendaItemType) */
export type SessionType =
  | "keynote"
  | "panel"
  | "workshop"
  | "fireside_chat"
  | "presentation"
  | "demo"
  | "networking"
  | "break"
  | "meal"
  | "registration"
  | "other"

/** Session status */
export type SessionStatus = "draft" | "confirmed" | "cancelled"

/** Exhibitor tier levels */
export type ExhibitorTier =
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "exhibitor"
  | "contributor"

/** Speaker role within a session */
export type SpeakerRole =
  | "keynote"
  | "presenter"
  | "panelist"
  | "moderator"
  | "host"
  | "mc"

/** Venue types */
export type VenueType =
  | "conference_center"
  | "hotel"
  | "convention_center"
  | "restaurant"
  | "outdoor"
  | "virtual"
  | "hybrid"
  | "other"

/** Room types within venues */
export type RoomType =
  | "main_hall"
  | "breakout_room"
  | "workshop_room"
  | "expo_hall"
  | "registration"
  | "vip_lounge"
  | "green_room"
  | "dining"
  | "outdoor"
  | "other"

/** Room setup configurations */
export type RoomSetup =
  | "theater"
  | "classroom"
  | "u_shape"
  | "boardroom"
  | "banquet_rounds"
  | "cocktail"
  | "expo_booths"
  | "other"

/** Exhibitor lead pipeline stages */
export type LeadPipelineStage =
  | "prospect"
  | "contacted"
  | "interested"
  | "qualified"
  | "negotiating"
  | "won"
  | "lost"

/** Payment status for speakers and exhibitors */
export type PaymentStatus = "unpaid" | "paid" | "complimentary"

// ============================================
// DATABASE TABLES
// ============================================

/** Company category types - now dynamic, stored as string slugs in database */
export type CompanyCategory = string

/** EDGE Framework classification */
export type EdgeCategory = "eliminate" | "decode" | "gain" | "execute"

/** Access level for company products/services */
export type AccessLevel = "consumer" | "practitioner_facilitated" | "practitioner_only"

/** The 15 biological systems framework */
export type BiologicalSystem =
  | "Breath"
  | "Circulation"
  | "Consciousness"
  | "Defense"
  | "Detoxification"
  | "Digestive"
  | "Emotional"
  | "Energy Production"
  | "Hormonal"
  | "Hydration"
  | "Nervous System"
  | "Regeneration"
  | "Stress Response"
  | "Structure & Movement"
  | "Temperature"

/** Company profile - core entity for CRM */
export interface Company {
  id: string
  name: string
  slug: string | null // URL-friendly slug generated from company name
  website: string | null
  domain: string | null // Auto-extracted from website
  description: string | null
  analysis: string | null
  function_health_tier: FunctionHealthTier | null
  status: CompanyStatus
  // Research & content fields
  events: string[] // Events where we noticed this company
  category: CompanyCategory | null
  systems_supported: BiologicalSystem[] // Which of the 15 biological systems
  edge_categories: EdgeCategory[] // EDGE Framework: Eliminate, Decode, Gain, Execute
  access_levels: AccessLevel[] // Consumer, Practitioner-Facilitated, Practitioner Only
  has_affiliate: boolean // Whether they offer affiliate/referral programs
  differentiators: string | null // Key differentiators
  evidence: string | null // Evidence/credibility
  bioedge_fit: string | null // Why this fits bioEDGE
  warm_pitch: string | null // Draft pitch email
  research_notes: string | null // Raw research findings
  researched_at: string | null // When research was performed
  // Image fields
  logo_url: string | null // Company logo (400x400 square)
  logo_storage_path: string | null // Supabase storage path for self-hosted logos
  // Hunter.io enrichment fields
  employee_count: number | null
  industry: string | null
  company_type: string | null
  founded_year: number | null
  technologies: string[]
  linkedin_url: string | null
  twitter_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  hunter_enriched_at: string | null
  // AI enhancement fields
  ai_summary: string | null
  ai_talking_points: string[]
  ai_enhanced_at: string | null
  // Featured flag for homepage display (defaults to false in database)
  is_featured?: boolean
  // Draft mode - if true, company won't appear on public pages (defaults to true in database)
  is_draft?: boolean
  created_at: string
  updated_at: string
}

/** Contact associated with a company */
export interface Contact {
  id: string
  company_id: string | null
  // Required fields (NOT NULL in database)
  first_name: string
  last_name: string
  email: string | null
  // Optional fields
  phone: string | null
  title: string | null
  linkedin_url: string | null
  notes: string | null
  source: string | null
  outreach_status: OutreachStatus | null
  show_on_articles: boolean | null
  slug: string | null // URL-friendly slug generated from name
  // Timestamps
  created_at: string
  updated_at: string
  // Extended fields from migrations
  domain: string | null
  status: string | null
  hunter_confidence: number | null
  hunter_verified_at: string | null
  full_name: string | null
  seniority: string | null
  ai_summary: string | null
  ai_outreach_suggestions: string | null
  ai_enhanced_at: string | null
  ai_highlights: string[] | null // AI-generated highlights for public profile
  ai_expertise: string[] | null // AI-generated areas of expertise
  email_domain: string | null
  bio: string | null // Contact biography
  // Image fields
  avatar_url: string | null // Contact profile picture
  linkedin_avatar_url: string | null // LinkedIn profile image (auto-fetched)
  // Featured flag for homepage display (defaults to false in database)
  is_featured?: boolean
  // Address fields
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  // YouTube channel
  youtube_channel_url: string | null
}

/** Article/content piece linked to a company */
export interface Article {
  id: string
  company_id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  status: ArticleStatus
  ai_enhanced: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  key_people: string[] // Legacy: Names of founders, authors, doctors, experts extracted by AI
  key_people_contact_ids: string[] // Contact IDs for key people associated with this article
  // Image fields
  featured_image_url: string | null // Featured image (1200x630 for social sharing)
  featured_image_alt: string | null // Alt text for accessibility/SEO
  // YouTube video - thumbnail used as fallback image
  youtube_url: string | null
  // Featured flag for homepage display (defaults to false in database)
  is_featured?: boolean
}

/** Company leader profile (up to 3 per company) */
export interface CompanyLeader {
  id: string
  company_id: string
  name: string
  title: string | null
  bio: string | null
  linkedin_url: string | null
  image_url: string | null
  source: string | null
  created_at: string
}

/** Presentation - content for sessions/panels/talks that can be scheduled at events */
export interface Presentation {
  id: string
  title: string
  slug: string
  short_description: string | null // ~100 words
  long_description: string | null  // ~400 words
  // Session type (keynote, panel, workshop, etc.)
  session_type: SessionType
  // Related entities (optional, legacy - use panelists instead)
  contact_id: string | null
  company_id: string | null
  article_id: string | null
  // Recording (YouTube)
  recording_url: string | null
  recording_embed: string | null
  recording_metadata: YouTubeEnhancementMetadata | null
  // YouTube video for thumbnail (separate from recording)
  youtube_url: string | null
  // Status
  status: PresentationStatus
  // Featured flag for homepage display (defaults to false in database)
  is_featured?: boolean
  // Timestamps
  created_at: string
  updated_at: string
}

/** Presentation with related entities for display */
export interface PresentationWithRelations extends Presentation {
  contact?: Contact | null
  company?: Company | null
  article?: Article | null
  panelists?: PresentationPanelist[]
}

/** @deprecated Use Presentation instead */
export type AgendaItem = Presentation

/** @deprecated Use PresentationWithRelations instead */
export type AgendaItemWithRelations = PresentationWithRelations

// ============================================
// SPOTLIGHT (CURATED VIDEO LIBRARY)
// ============================================

/** Spotlight - curated YouTube video content from external creators */
export interface Spotlight {
  id: string
  title: string
  slug: string
  short_description: string | null // ~100 words
  long_description: string | null  // ~400 words
  // Session type (keynote, panel, workshop, etc.)
  session_type: SessionType
  // Related entities (optional)
  contact_id: string | null
  company_id: string | null
  article_id: string | null
  // Recording (YouTube)
  recording_url: string | null
  recording_embed: string | null
  recording_metadata: YouTubeEnhancementMetadata | null
  // YouTube video for thumbnail (separate from recording)
  youtube_url: string | null
  // Status
  status: PresentationStatus
  // Featured flag for homepage display (defaults to false in database)
  is_featured?: boolean
  // Timestamps
  created_at: string
  updated_at: string
}

/** Spotlight with related entities for display */
export interface SpotlightWithRelations extends Spotlight {
  contact?: Contact | null
  company?: Company | null
  article?: Article | null
  panelists?: SpotlightPanelist[]
}

/** Spotlight panelist / featured creator */
export interface SpotlightPanelist {
  id: string
  spotlight_id: string
  contact_id: string
  role: PanelistRole
  company_id: string | null // Override company
  article_id: string | null // Related article
  display_order: number
  notes: string | null
  created_at: string
  updated_at: string
}

/** Spotlight panelist with full details (from view) */
export interface SpotlightPanelistWithDetails {
  id: string
  spotlight_id: string
  contact_id: string
  role: PanelistRole
  display_order: number
  notes: string | null
  created_at: string
  // Contact details
  first_name: string
  last_name: string
  title: string | null
  avatar_url: string | null
  linkedin_url: string | null
  bio: string | null
  contact_slug: string | null
  // Company (resolved from override or contact)
  company_id: string | null
  company_name: string | null
  company_logo: string | null
  company_slug: string | null
  // Article
  article_id: string | null
  article_title: string | null
  article_slug: string | null
  // Spotlight context
  spotlight_title: string
  spotlight_slug: string
}

// ============================================
// EVENT JUNCTION TABLES
// ============================================

/** Company linked to an event as exhibitor/sponsor */
export interface EventCompany {
  id: string
  event_id: string
  company_id: string
  role: EventCompanyRole
  booth_number: string | null
  display_order: number
  status: EventParticipantStatus
  is_featured: boolean
  is_debut: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

/** Contact linked to an event as speaker/participant */
export interface EventContact {
  id: string
  event_id: string
  contact_id: string
  role: EventContactRole
  display_order: number
  status: EventParticipantStatus
  title_override: string | null
  bio_override: string | null
  headshot_override: string | null
  is_featured: boolean
  is_debut: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

/** Presentation linked to an event with scheduling */
export interface EventPresentation {
  id: string
  event_id: string
  presentation_id: string
  scheduled_date: string | null
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  room: string | null
  location: string | null
  track: string | null
  display_order: number
  status: EventPresentationStatus
  is_featured: boolean
  is_livestreamed: boolean
  requires_registration: boolean
  max_attendees: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

/** Event company with company details (from view) */
export interface EventCompanyWithDetails extends EventCompany {
  name: string
  slug: string | null
  logo_url: string | null
  website: string | null
  description: string | null
  domain: string | null
  event_name: string
}

/** Event contact with contact and company details (from view) */
export interface EventContactWithDetails extends Omit<EventContact, "title_override" | "bio_override" | "headshot_override"> {
  title: string | null
  bio: string | null
  headshot_url: string | null
  first_name: string
  last_name: string
  email: string
  linkedin_url: string | null
  contact_slug: string | null
  company_id: string | null
  company_name: string | null
  company_logo: string | null
  company_slug: string | null
  event_name: string
}

/** Event presentation with full details (from view) */
export interface EventPresentationWithDetails extends EventPresentation {
  title: string
  short_description: string | null
  long_description: string | null
  recording_url: string | null
  recording_embed: string | null
  presentation_status: PresentationStatus
  contact_id: string | null
  speaker_first_name: string | null
  speaker_last_name: string | null
  speaker_title: string | null
  speaker_avatar: string | null
  company_id: string | null
  company_name: string | null
  company_logo: string | null
  event_name: string
  event_start_date: string | null
}

// ============================================
// PRESENTATION PANELISTS
// ============================================

/** Panelist linked to a presentation */
export interface PresentationPanelist {
  id: string
  presentation_id: string
  contact_id: string
  role: PanelistRole
  company_id: string | null // Override company
  article_id: string | null // Related article
  display_order: number
  notes: string | null
  created_at: string
  updated_at: string
}

/** Panelist with full details (from view) */
export interface PresentationPanelistWithDetails {
  id: string
  presentation_id: string
  contact_id: string
  role: PanelistRole
  display_order: number
  notes: string | null
  created_at: string
  // Contact details
  first_name: string
  last_name: string
  title: string | null
  avatar_url: string | null
  linkedin_url: string | null
  bio: string | null
  contact_slug: string | null
  // Company (resolved from override or contact)
  company_id: string | null
  company_name: string | null
  company_logo: string | null
  company_slug: string | null
  // Article
  article_id: string | null
  article_title: string | null
  article_slug: string | null
  // Presentation context
  presentation_title: string
  presentation_slug: string
}

// ============================================
// ENHANCEMENT METADATA TYPES
// ============================================
// Typed metadata for each enhancement type (stored in JSONB)

/** YouTube video metadata for lightweight display */
export interface YouTubeEnhancementMetadata {
  videoId: string
  channel: string
  duration: string // Formatted (e.g., "4:13")
  thumbnail: string // URL to thumbnail image
  viewCount?: number
  definition?: "hd" | "sd"
}

/** Academic paper metadata (via Perplexity) */
export interface ScholarEnhancementMetadata {
  // Legacy Serper fields (kept for backwards compatibility)
  snippet?: string
  // Modern fields
  authors?: string[]
  abstract?: string
  publication?: string | null
  citedBy?: number | null
  year?: string | null
  doi?: string | null
  source?: "perplexity"
}

/** Book metadata (via Perplexity with Amazon links) */
export interface BookEnhancementMetadata {
  // Legacy fields (kept for backwards compatibility)
  snippet?: string
  author?: string | null
  // Modern fields
  authors?: string[]
  description?: string
  thumbnail?: string | null
  publishedDate?: string | null
  rating?: number | null
}

/** Enhancement added to an article (YouTube, Scholar refs, etc.) */
export interface ArticleEnhancement {
  id: string
  article_id: string
  type: EnhancementType
  title: string | null
  url: string | null
  embed_code: string | null
  metadata: Record<string, unknown> | null
  position: number
  created_at: string
}

/** Type-safe enhancement with YouTube metadata */
export interface YouTubeEnhancement extends Omit<ArticleEnhancement, "type" | "metadata"> {
  type: "youtube"
  metadata: YouTubeEnhancementMetadata | null
}

/** Type-safe enhancement with Scholar metadata */
export interface ScholarEnhancement extends Omit<ArticleEnhancement, "type" | "metadata"> {
  type: "scholar"
  metadata: ScholarEnhancementMetadata | null
}

/** Type-safe enhancement with Book metadata */
export interface BookEnhancement extends Omit<ArticleEnhancement, "type" | "metadata"> {
  type: "book"
  metadata: BookEnhancementMetadata | null
}

/** Log of outreach attempts to contacts */
export interface OutreachLog {
  id: string
  contact_id: string
  date: string
  type: OutreachType
  notes: string | null
  response_received: boolean
  created_at: string
}

// ============================================
// VENUES & ROOMS
// ============================================

/** Venue (reusable location for events) */
export interface Venue {
  id: string
  name: string
  venue_type: VenueType | null
  website: string | null
  // Address
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  // Primary contact
  contact_name: string | null
  contact_title: string | null
  contact_email: string | null
  contact_phone: string | null
  // Secondary contact
  secondary_contact_name: string | null
  secondary_contact_email: string | null
  secondary_contact_phone: string | null
  // Details
  capacity: number | null
  description: string | null
  notes: string | null
  // Images
  photo_url: string | null
  floor_plan_url: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** Venue room (space within a venue) */
export interface VenueRoom {
  id: string
  venue_id: string
  name: string
  room_type: RoomType | null
  floor: string | null
  capacity: number | null
  default_setup: RoomSetup | null
  av_equipment: string | null
  notes: string | null
  position: number
  created_at: string
  updated_at: string
}

// ============================================
// EVENTS & SESSIONS
// ============================================

/** Event (summit, conference, etc.) */
export interface Event {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  extended_info: string | null
  // Venue reference or inline
  venue_id: string | null
  venue_name: string | null
  venue_address: string | null
  city: string | null
  state: string | null
  country: string | null
  // Dates and timing
  start_date: string | null
  end_date: string | null
  timezone: string | null
  // Status and registration
  status: EventStatus
  registration_url: string | null
  is_virtual: boolean
  virtual_url: string | null
  // Capacity and pricing
  capacity: number | null
  is_free: boolean
  // Images
  featured_image_url: string | null
  og_image_url: string | null
  logo_url: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** Session template (reusable content that can be scheduled at multiple events) */
export interface Session {
  id: string
  // Content
  title: string
  description: string | null
  session_type: SessionType
  // Duration for scheduling
  duration_minutes: number | null
  // Topics/tags for categorization
  topics: string[] | null
  // Default speaker (usually gives this session)
  default_speaker_id: string | null
  // Is this reusable?
  is_template: boolean
  // Notes
  notes: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** Event session (scheduled instance of a session at a specific event) */
export interface EventSession {
  id: string
  event_id: string
  session_id: string | null // Link to template (null for ad-hoc sessions)
  venue_room_id: string | null
  // Content (can override template or be standalone)
  title: string
  description: string | null
  session_type: SessionType
  status: SessionStatus
  // Timing
  start_time: string | null
  end_time: string | null
  day_number: number
  // Location (override)
  location: string | null
  // Organization
  track: string | null
  // Display
  position: number
  is_featured: boolean
  // Notes
  notes: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

// ============================================
// SPEAKERS
// ============================================

/** Event contact (leader/speaker at an event) */
export interface EventContact {
  id: string
  event_id: string
  contact_id: string
  role: EventContactRole
  display_order: number
  status: EventParticipantStatus
  // Override fields
  title_override: string | null
  bio_override: string | null
  headshot_url: string | null
  // Social media
  linkedin_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  website_url: string | null
  // Fee and payment
  speaker_fee: number | null
  payment_status: PaymentStatus
  // Display
  is_featured: boolean
  is_debut: boolean
  // Notes
  notes: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** Event company (exhibitor/sponsor at an event) */
export interface EventCompany {
  id: string
  event_id: string
  company_id: string
  role: EventCompanyRole
  tier: ExhibitorTier
  booth_number: string | null
  booth_size: string | null
  // Pricing
  booth_price: number | null
  sponsorship_price: number | null
  total_amount: number | null
  // Payment
  payment_status: PaymentStatus
  // Contact override
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  // Display
  display_order: number
  status: EventParticipantStatus
  is_featured: boolean
  is_debut: boolean
  // Notes
  notes: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** @deprecated Use EventContact instead */
export type EventSpeaker = EventContact

/** @deprecated Use EventCompany instead */
export type EventExhibitor = EventCompany

// ============================================
// EXHIBITOR LEAD PIPELINE
// ============================================

/** Exhibitor lead (prospective exhibitor company) */
export interface ExhibitorLead {
  id: string
  event_id: string | null
  // Company info
  company_name: string
  website: string | null
  domain: string | null
  // Address
  city: string | null
  state: string | null
  country: string | null
  // Categorization
  category: string | null
  description: string | null
  // Pipeline tracking
  pipeline_stage: LeadPipelineStage
  source: string | null
  // Outreach tracking
  last_contacted_at: string | null
  next_follow_up_date: string | null
  // Notes
  notes: string | null
  // Conversion
  converted_company_id: string | null
  converted_at: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** Exhibitor lead contact (contact at prospective company) */
export interface ExhibitorLeadContact {
  id: string
  lead_id: string
  // Contact info
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  title: string | null
  linkedin_url: string | null
  // Verification
  email_confidence: number | null
  verified_at: string | null
  // Status
  is_primary: boolean
  // Notes
  notes: string | null
  // Timestamps
  created_at: string
}

// ============================================
// ARTICLE-COMPANY RELATIONSHIPS
// ============================================

/** Role of a company in an article */
export type ArticleCompanyRole = "primary" | "featured" | "mentioned" | "sponsor"

/** Article company (many-to-many for multi-company articles) */
export interface ArticleCompany {
  id: string
  article_id: string
  company_id: string
  role: ArticleCompanyRole | null
  position: number
  created_at: string
}

/** Event article curation type */
export type EventArticleCurationType = "featured" | "recap" | "preview" | "related" | "sponsor"

/** Event article (manual curation of articles per event) */
export interface EventArticle {
  id: string
  event_id: string
  article_id: string
  curation_type: EventArticleCurationType
  position: number
  is_manual: boolean
  created_at: string
}

/** Combined event article (from view - includes auto-derived) */
export interface EventArticleCombined {
  event_id: string
  article_id: string
  curation_type: string
  position: number
  is_manual: boolean
  derived_from_company_id: string | null
}

/** Types of enhancement sources */
export type EnhancementSource = "hunter" | "anthropic" | "openai" | "manual"

/** Types of enhancements that can be performed */
export type EnhancementLogType =
  | "company_enrichment"
  | "contact_enrichment"
  | "email_verification"
  | "email_finder"
  | "article_enhancement"
  | "article_content"
  | "article_media"

/** Status of an enhancement operation */
export type EnhancementStatus = "pending" | "processing" | "completed" | "failed"

/** Log of enhancement operations */
export interface EnhancementLog {
  id: string
  entity_type: "article" | "contact" | "company"
  entity_id: string
  enhancement_source: EnhancementSource
  enhancement_type: EnhancementLogType
  request_data: Record<string, unknown>
  response_data: Record<string, unknown>
  fields_updated: string[]
  status: EnhancementStatus
  error_message: string | null
  credits_used: number
  duration_ms: number | null
  created_at: string
  completed_at: string | null
}

// ============================================
// JOINED/EXTENDED TYPES
// ============================================

/** Company with related data for detail views */
export interface CompanyWithRelations extends Company {
  contacts?: Contact[]
  articles?: Article[]
  leaders?: CompanyLeader[]
}

/** Contact with company info for list views */
export interface ContactWithCompany extends Contact {
  company?: Company | null
}

/** Article with company info and enhancements */
export interface ArticleWithRelations extends Article {
  company?: Company
  enhancements?: ArticleEnhancement[]
}

// ============================================
// FORM INPUT TYPES
// ============================================

/** Data for creating a new company (slug is auto-generated from name) */
export type CompanyInsert = Omit<Company, "id" | "slug" | "created_at" | "updated_at">

/** Data for updating a company (includes domain for manual override) */
export type CompanyUpdate = Partial<CompanyInsert>

/** Data for creating a new contact */
export type ContactInsert = Omit<Contact, "id" | "created_at" | "updated_at">

/** Data for updating a contact */
export type ContactUpdate = Partial<ContactInsert>

/** Data for creating a new article */
export type ArticleInsert = Omit<Article, "id" | "created_at" | "updated_at">

/** Data for updating an article */
export type ArticleUpdate = Partial<ArticleInsert>

/** Data for creating a company leader */
export type CompanyLeaderInsert = Omit<CompanyLeader, "id" | "created_at">

/** Data for creating a presentation */
export type PresentationInsert = Omit<Presentation, "id" | "created_at" | "updated_at">

/** Data for updating a presentation */
export type PresentationUpdate = Partial<PresentationInsert>

/** @deprecated Use PresentationInsert instead */
export type AgendaItemInsert = PresentationInsert

/** @deprecated Use PresentationUpdate instead */
export type AgendaItemUpdate = PresentationUpdate

/** Data for creating an article enhancement */
export type ArticleEnhancementInsert = Omit<ArticleEnhancement, "id" | "created_at">

/** Data for logging an outreach attempt */
export type OutreachLogInsert = Omit<OutreachLog, "id" | "created_at">

/** Data for creating a venue */
export type VenueInsert = Omit<Venue, "id" | "created_at" | "updated_at">

/** Data for updating a venue */
export type VenueUpdate = Partial<VenueInsert>

/** Data for creating a venue room */
export type VenueRoomInsert = Omit<VenueRoom, "id" | "created_at" | "updated_at">

/** Data for updating a venue room */
export type VenueRoomUpdate = Partial<VenueRoomInsert>

/** Data for creating an event */
export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at">

/** Data for updating an event */
export type EventUpdate = Partial<EventInsert>

/** Data for creating a session template */
export type SessionInsert = Omit<Session, "id" | "created_at" | "updated_at">

/** Data for updating a session template */
export type SessionUpdate = Partial<SessionInsert>

/** Data for creating an event session */
export type EventSessionInsert = Omit<EventSession, "id" | "created_at" | "updated_at">

/** Data for updating an event session */
export type EventSessionUpdate = Partial<EventSessionInsert>

/** Data for creating an event contact (leader) */
export type EventContactInsert = Omit<EventContact, "id" | "created_at" | "updated_at">

/** Data for updating an event contact */
export type EventContactUpdate = Partial<EventContactInsert>

/** @deprecated Use EventContactInsert instead */
export type EventSpeakerInsert = EventContactInsert

/** @deprecated Use EventContactUpdate instead */
export type EventSpeakerUpdate = EventContactUpdate

/** @deprecated Use EventCompanyInsert instead */
export type EventExhibitorInsert = Omit<EventCompany, "id" | "created_at" | "updated_at">

/** @deprecated Use EventCompanyUpdate instead */
export type EventExhibitorUpdate = Partial<EventExhibitorInsert>

/** Data for creating an exhibitor lead */
export type ExhibitorLeadInsert = Omit<ExhibitorLead, "id" | "created_at" | "updated_at">

/** Data for updating an exhibitor lead */
export type ExhibitorLeadUpdate = Partial<ExhibitorLeadInsert>

/** Data for creating an exhibitor lead contact */
export type ExhibitorLeadContactInsert = Omit<ExhibitorLeadContact, "id" | "created_at">

/** Data for creating an article company link */
export type ArticleCompanyInsert = Omit<ArticleCompany, "id" | "created_at">

/** Data for creating an event article curation */
export type EventArticleInsert = Omit<EventArticle, "id" | "created_at">

/** Data for creating an event presentation (session) */
export type EventPresentationInsert = Omit<EventPresentation, "id" | "created_at" | "updated_at">

/** Data for updating an event presentation */
export type EventPresentationUpdate = Partial<EventPresentationInsert>

/** Data for creating a presentation panelist */
export type PresentationPanelistInsert = Omit<PresentationPanelist, "id" | "created_at" | "updated_at">

/** Data for updating a presentation panelist */
export type PresentationPanelistUpdate = Partial<PresentationPanelistInsert>

/** Data for creating a spotlight panelist */
export type SpotlightPanelistInsert = Omit<SpotlightPanelist, "id" | "created_at" | "updated_at">

/** Data for updating a spotlight panelist */
export type SpotlightPanelistUpdate = Partial<SpotlightPanelistInsert>

// ============================================
// EVENT LANDING PAGE TYPES
// ============================================

/** FAQ category for event pages */
export type EventFAQCategory = "tickets" | "logistics" | "experience" | "opportunities" | "general"

/** Ticket tier for an event */
export interface EventTicketTier {
  id: string
  event_id: string
  // Tier info
  name: string
  description: string | null
  // Pricing
  price: number
  original_price: number | null
  currency: string
  // Availability
  max_quantity: number | null
  sold_count: number
  is_sold_out: boolean
  waitlist_url: string | null
  // Registration
  registration_url: string
  // Display
  display_order: number
  is_highlighted: boolean
  is_visible: boolean
  highlight_text: string | null
  // Dates
  available_from: string | null
  available_until: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

/** Feature/inclusion for a ticket tier */
export interface EventTicketFeature {
  id: string
  tier_id: string
  feature_text: string
  dollar_value: number | null
  display_order: number
  is_highlighted: boolean
  created_at: string
}

/** Ticket tier with features included */
export interface EventTicketTierWithFeatures extends EventTicketTier {
  features: EventTicketFeature[]
}

/** Testimonial for an event */
export interface EventTestimonial {
  id: string
  event_id: string
  contact_id: string | null
  // Content
  quote: string
  video_url: string | null
  // Attribution (used if no contact_id)
  author_name: string | null
  author_title: string | null
  author_company: string | null
  author_image_url: string | null
  // Display
  display_order: number
  is_featured: boolean
  is_visible: boolean
  // Timestamps
  created_at: string
  updated_at: string
}

/** FAQ item for an event */
export interface EventFAQ {
  id: string
  event_id: string
  question: string
  answer: string
  category: string | null
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

/** Value proposition item (stored in events.value_props JSON) */
export interface EventValueProp {
  icon?: string
  text: string
  highlight?: boolean
}

/** Attendee composition item (stored in events.attendee_composition JSON) */
export interface EventAttendeeComposition {
  label: string
  percentage: number
  color?: string
}

/** Extended Event type with landing page fields */
export interface EventWithLandingPageFields {
  // Hero section
  hero_image_url: string | null
  hero_video_url: string | null
  hero_overlay_opacity: number | null
  // Value proposition
  value_props: EventValueProp[] | null
  // Attendee composition
  attendee_composition: EventAttendeeComposition[] | null
  // Additional content
  experience_description: string | null
  venue_description: string | null
  transportation_info: string | null
  hotel_booking_url: string | null
  hotel_group_rate: string | null
  // SEO
  meta_title: string | null
  meta_description: string | null
  // Urgency elements
  show_countdown: boolean
  early_bird_deadline: string | null
  early_bird_text: string | null
}

/** Data for creating a ticket tier */
export type EventTicketTierInsert = Omit<EventTicketTier, "id" | "created_at" | "updated_at">

/** Data for updating a ticket tier */
export type EventTicketTierUpdate = Partial<EventTicketTierInsert>

/** Data for creating a ticket feature */
export type EventTicketFeatureInsert = Omit<EventTicketFeature, "id" | "created_at">

/** Data for creating a testimonial */
export type EventTestimonialInsert = Omit<EventTestimonial, "id" | "created_at" | "updated_at">

/** Data for updating a testimonial */
export type EventTestimonialUpdate = Partial<EventTestimonialInsert>

/** Data for creating an FAQ */
export type EventFAQInsert = Omit<EventFAQ, "id" | "created_at" | "updated_at">

/** Data for updating an FAQ */
export type EventFAQUpdate = Partial<EventFAQInsert>

// ============================================
// IMPORT TYPES
// ============================================

/** Contact data from CSV import (before processing) */
export interface ContactImportRow {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  title?: string
  department?: string
  company_name?: string
  linkedin_url?: string
  instagram_url?: string
  twitter_url?: string
  tiktok_url?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  notes?: string
}

/** Result of import operation */
export interface ImportResult {
  success: boolean
  total: number
  imported: number
  skipped: number
  matched: number // Contacts matched to existing companies
  unmatched: number // Contacts that need manual company assignment
  duplicates: number // Skipped due to existing email
  errors: string[]
}

// ============================================
// COMPANY RESEARCH TYPES
// ============================================

/** Input for company research workflow */
export interface CompanyResearchInput {
  company_name: string
  website: string
  contact_first_name?: string
  contact_last_name?: string
  contact_title?: string
  contact_email?: string
  contact_phone?: string
  contact_linkedin_url?: string
  contact_youtube_channel_url?: string
  event: string // Event where we noticed them
}

/** Contact discovered during research */
export interface DiscoveredContact {
  name: string
  title?: string | null
  email?: string | null
  linkedin_url?: string | null
}

/** AI-generated research output */
export interface CompanyResearchOutput {
  // Company brief
  company_name: string
  category: CompanyCategory
  description: string // 2-3 sentence description
  systems_supported: BiologicalSystem[]
  edge_categories: EdgeCategory[] // EDGE Framework classification
  access_levels: AccessLevel[] // How clients access products/services
  has_affiliate: boolean // Affiliate/referral program available
  differentiators: string
  evidence: string
  bioedge_fit: string
  // Native article
  article_title: string
  article_content: string // Full 500-600 word article
  article_excerpt: string // Brief summary
  // Warm pitch
  warm_pitch: string
  // Raw research
  research_notes: string
  // Discovered contacts from research
  discovered_contacts?: DiscoveredContact[]
}

// ============================================
// SUPABASE DATABASE TYPE
// ============================================

/**
 * Full database schema type for Supabase client
 * This provides type safety when querying the database
 */
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company
        Insert: CompanyInsert
        Update: CompanyUpdate
      }
      contacts: {
        Row: Contact
        Insert: ContactInsert
        Update: ContactUpdate
      }
      articles: {
        Row: Article
        Insert: ArticleInsert
        Update: ArticleUpdate
      }
      company_leaders: {
        Row: CompanyLeader
        Insert: CompanyLeaderInsert
        Update: Partial<CompanyLeaderInsert>
      }
      article_enhancements: {
        Row: ArticleEnhancement
        Insert: ArticleEnhancementInsert
        Update: Partial<ArticleEnhancementInsert>
      }
      outreach_log: {
        Row: OutreachLog
        Insert: OutreachLogInsert
        Update: Partial<OutreachLogInsert>
      }
    }
    Enums: {
      function_health_tier: FunctionHealthTier
      company_status: CompanyStatus
      outreach_status: OutreachStatus
      article_status: ArticleStatus
      enhancement_type: EnhancementType
      outreach_type: OutreachType
    }
  }
}
