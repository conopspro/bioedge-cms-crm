-- =============================================================================
-- General Outreach Module
-- Tables: outreach_contacts, promotion_presets, outreach_campaigns,
--         outreach_campaign_recipients
-- =============================================================================

-- ---------------------------------------------------------------------------
-- outreach_contacts
-- The contact list. Only email is required. Everything else is optional.
-- Designed to hold 200K+ rows — indexes are critical.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outreach_contacts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT        NOT NULL UNIQUE,
  first_name      TEXT,
  last_name       TEXT,
  practice_name   TEXT,                    -- company/business name from CSV
  title           TEXT,
  business_type   TEXT,                    -- Sandy's own tag: "Chiropractor", "Med spa", "Valid", NULL, etc.
  city            TEXT,
  state           TEXT,
  website         TEXT,
  phone           TEXT,
  notes           TEXT,
  total_opens     INTEGER     NOT NULL DEFAULT 0,   -- from historical import data
  total_clicks    INTEGER     NOT NULL DEFAULT 0,
  source_file     TEXT,                    -- CSV filename this contact came from
  imported_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes for large-table queries
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_business_type
  ON outreach_contacts(business_type);

CREATE INDEX IF NOT EXISTS idx_outreach_contacts_state
  ON outreach_contacts(state);

CREATE INDEX IF NOT EXISTS idx_outreach_contacts_total_opens
  ON outreach_contacts(total_opens);

CREATE INDEX IF NOT EXISTS idx_outreach_contacts_total_clicks
  ON outreach_contacts(total_clicks);

-- Partial index: untagged contacts are the majority case
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_no_type
  ON outreach_contacts(created_at)
  WHERE business_type IS NULL OR business_type = '' OR business_type = 'Valid';

-- ---------------------------------------------------------------------------
-- promotion_presets
-- DB-backed promotion cards. Seeded with 4 core Sandy Martin offerings.
-- Can be managed via UI (add YouTube videos, new announcements, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promotion_presets (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT        NOT NULL,
  type                 TEXT        NOT NULL
                         CHECK (type IN ('book', 'tool', 'coaching', 'summit', 'youtube', 'custom')),
  icon                 TEXT,                    -- lucide-react icon name, e.g. 'BookOpen'
  title                TEXT,                    -- full promotional title
  url                  TEXT,                    -- primary destination link
  description          TEXT,                    -- 1-3 sentences about what it is
  youtube_video_id     TEXT,                    -- for 'youtube' type only
  youtube_thumbnail_url TEXT,                   -- cached thumbnail URL
  default_purpose      TEXT,                    -- suggested campaign purpose (editable per campaign)
  default_cta          TEXT,                    -- suggested call to action (editable per campaign)
  is_active            BOOLEAN     NOT NULL DEFAULT true,
  sort_order           INTEGER     NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the 4 core presets
INSERT INTO promotion_presets
  (name, type, icon, title, url, description, default_purpose, default_cta, sort_order)
VALUES
(
  'Biological EDGE Book',
  'book',
  'BookOpen',
  'Biological EDGE: A Practical Guide to Longevity',
  'https://www.amazon.com/dp/B0GJQ5NDGF',
  'A practical guide to optimizing human biology using the bioEDGE framework — covering the four biological domains that determine how well and how long you live.',
  'Introduce my book Biological EDGE — a practical longevity roadmap grounded in functional biology, not supplements or shortcuts.',
  'Check it out on Amazon',
  1
),
(
  'bioEDGE Decoder',
  'tool',
  'Cpu',
  'bioEDGE Decoder',
  'https://bioedgedecoder.com/',
  'An AI-powered assessment that identifies your personal biological bottlenecks and generates a customized longevity action plan.',
  'Share the bioEDGE Decoder — a free tool that maps personal biological weaknesses and shows the most effective interventions.',
  'Try the free decoder',
  2
),
(
  'bioEDGE Coach Program',
  'coaching',
  'GraduationCap',
  'bioEDGE Coach',
  'https://bioedge.circle.so/',
  'A structured coaching program that trains practitioners to implement the bioEDGE longevity framework with their clients.',
  'Introduce the bioEDGE Coach program for health professionals who want a practical framework for advising clients on longevity.',
  'Learn more about the program',
  3
),
(
  'Longevity Summit',
  'summit',
  'CalendarDays',
  'bioEDGE Longevity Summit',
  'https://bioedgelongevity.com/',
  'The bioEDGE Longevity Summit brings together practitioners, researchers, and biohackers to share the most current science on extending healthspan.',
  'Invite to the bioEDGE Longevity Summit — a practitioner-focused event on longevity science and application.',
  'Register here',
  4
)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- outreach_campaigns
-- Campaign configuration. Recipients are snapshotted at creation time.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      TEXT        NOT NULL,
  status                    TEXT        NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'generating', 'ready', 'sending', 'paused', 'completed')),
  sender_profile_id         UUID        REFERENCES sender_profiles(id),
  reply_to                  TEXT,

  -- Promotion preset (FK for reference; fields snapshotted for historical integrity)
  promotion_preset_id       UUID        REFERENCES promotion_presets(id),
  promotion_type            TEXT,
  promotion_title           TEXT,
  promotion_url             TEXT,
  promotion_description     TEXT,

  -- Targeting filters stored for audit reference
  -- (actual recipients are snapshotted into outreach_campaign_recipients at creation)
  target_business_types     TEXT[]      NOT NULL DEFAULT '{}',   -- empty = all types
  target_states             TEXT[]      NOT NULL DEFAULT '{}',   -- empty = all states
  target_engagement         TEXT        NOT NULL DEFAULT 'any'
                              CHECK (target_engagement IN ('any', 'opened', 'clicked')),
  exclude_emailed_within_days INTEGER,

  -- AI generation settings
  purpose                   TEXT,
  tone                      TEXT,
  context                   TEXT,
  must_include              TEXT,
  must_avoid                TEXT,
  call_to_action            TEXT,
  reference_email           TEXT,
  max_words                 INTEGER     NOT NULL DEFAULT 100,
  subject_prompt            TEXT,

  -- Send pacing (EST timezone)
  send_window_start         INTEGER     NOT NULL DEFAULT 9,
  send_window_end           INTEGER     NOT NULL DEFAULT 17,
  min_delay_seconds         INTEGER     NOT NULL DEFAULT 120,
  max_delay_seconds         INTEGER     NOT NULL DEFAULT 300,
  daily_send_limit          INTEGER     NOT NULL DEFAULT 50,
  track_opens               BOOLEAN     NOT NULL DEFAULT true,
  track_clicks              BOOLEAN     NOT NULL DEFAULT true,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- outreach_campaign_recipients
-- Per-recipient generated emails. Contact data snapshotted at campaign creation
-- so that later contact edits don't affect in-flight campaigns.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outreach_campaign_recipients (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_campaign_id     UUID        NOT NULL REFERENCES outreach_campaigns(id) ON DELETE CASCADE,
  outreach_contact_id      UUID        NOT NULL REFERENCES outreach_contacts(id),

  -- Contact data snapshot
  recipient_email          TEXT        NOT NULL,
  recipient_business_type  TEXT,
  recipient_practice_name  TEXT,
  recipient_city           TEXT,
  recipient_state          TEXT,
  recipient_total_opens    INTEGER     NOT NULL DEFAULT 0,
  recipient_total_clicks   INTEGER     NOT NULL DEFAULT 0,

  -- Generated email content
  subject                  TEXT,
  body                     TEXT,
  body_html                TEXT,

  status                   TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN (
                               'pending', 'generated', 'approved',
                               'sent', 'delivered', 'opened', 'clicked',
                               'bounced', 'failed', 'suppressed'
                             )),
  approved                 BOOLEAN     NOT NULL DEFAULT false,

  -- Timestamps
  generated_at             TIMESTAMPTZ,
  sent_at                  TIMESTAMPTZ,
  delivered_at             TIMESTAMPTZ,
  opened_at                TIMESTAMPTZ,
  clicked_at               TIMESTAMPTZ,

  resend_id                TEXT,
  error                    TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(outreach_campaign_id, outreach_contact_id)
);

-- Composite index: approve/review/send queries filter on both columns simultaneously
CREATE INDEX IF NOT EXISTS idx_outreach_campaign_recipients_campaign_status
  ON outreach_campaign_recipients(outreach_campaign_id, status);

-- ---------------------------------------------------------------------------
-- updated_at triggers (reuse existing update_updated_at_column() function)
-- ---------------------------------------------------------------------------
CREATE TRIGGER update_outreach_contacts_updated_at
  BEFORE UPDATE ON outreach_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outreach_campaigns_updated_at
  BEFORE UPDATE ON outreach_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_presets_updated_at
  BEFORE UPDATE ON promotion_presets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE outreach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_outreach_contacts"
  ON outreach_contacts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_promotion_presets"
  ON promotion_presets FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_outreach_campaigns"
  ON outreach_campaigns FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_outreach_recipients"
  ON outreach_campaign_recipients FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
