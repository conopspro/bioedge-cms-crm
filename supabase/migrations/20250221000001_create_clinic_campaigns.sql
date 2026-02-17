-- Clinic Email Campaigns: separate module for reaching out to clinics
-- to encourage event attendance (distinct from contact/company campaigns)

-- ── clinic_campaigns ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinic_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'generating', 'ready', 'sending', 'paused', 'completed')),

  -- Sender
  sender_profile_id UUID REFERENCES sender_profiles(id) ON DELETE SET NULL,
  reply_to TEXT,

  -- Targeting filters (stored for reference)
  target_states TEXT[] DEFAULT '{}',
  target_cities TEXT[] DEFAULT '{}',
  target_tags TEXT[] DEFAULT '{}',

  -- AI generation fields
  purpose TEXT,
  tone TEXT,
  context TEXT,           -- background info for AI, NOT mentioned in email
  must_include TEXT,      -- phrases that MUST appear verbatim
  must_avoid TEXT,        -- banned words (hard blacklist)
  call_to_action TEXT,
  reference_email TEXT,   -- sample email for tone/style
  max_words INTEGER DEFAULT 100,
  subject_prompt TEXT,    -- additional subject line guidance

  -- Send pacing
  send_window_start INTEGER DEFAULT 9,    -- EST hour (0-23)
  send_window_end INTEGER DEFAULT 17,     -- EST hour (0-23)
  min_delay_seconds INTEGER DEFAULT 120,
  max_delay_seconds INTEGER DEFAULT 300,
  daily_send_limit INTEGER DEFAULT 50,

  -- Tracking
  track_opens BOOLEAN DEFAULT true,
  track_clicks BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinic_campaigns_status ON clinic_campaigns(status);

-- Auto-update updated_at
CREATE TRIGGER update_clinic_campaigns_updated_at
  BEFORE UPDATE ON clinic_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE clinic_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage clinic_campaigns"
  ON clinic_campaigns FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── clinic_campaign_recipients ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinic_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_campaign_id UUID NOT NULL REFERENCES clinic_campaigns(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,

  -- Snapshot of recipient info at time of adding
  recipient_email TEXT,
  recipient_name TEXT,

  -- Generated email content
  subject TEXT,
  body TEXT,
  body_html TEXT,

  -- Status workflow
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending', 'generated', 'approved',
      'sent', 'delivered', 'opened', 'clicked',
      'bounced', 'failed', 'suppressed'
    )),
  approved BOOLEAN DEFAULT false,
  generated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Resend tracking
  resend_id TEXT,
  error TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One clinic per campaign
  UNIQUE(clinic_campaign_id, clinic_id)
);

CREATE INDEX IF NOT EXISTS idx_clinic_campaign_recipients_campaign ON clinic_campaign_recipients(clinic_campaign_id);
CREATE INDEX IF NOT EXISTS idx_clinic_campaign_recipients_status ON clinic_campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_clinic_campaign_recipients_resend ON clinic_campaign_recipients(resend_id);

-- RLS
ALTER TABLE clinic_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage clinic_campaign_recipients"
  ON clinic_campaign_recipients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── clinic_campaign_events (junction) ────────────────────────────────
CREATE TABLE IF NOT EXISTS clinic_campaign_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_campaign_id UUID NOT NULL REFERENCES clinic_campaigns(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(clinic_campaign_id, event_id)
);

-- RLS
ALTER TABLE clinic_campaign_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage clinic_campaign_events"
  ON clinic_campaign_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
