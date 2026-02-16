-- ============================================
-- Email Campaign System
-- ============================================
-- Adds sender profiles, campaigns, and campaign recipients
-- for personalized slow-drip email outreach via Resend.

-- ============================================
-- Sender Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS sender_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  title text,
  phone text,
  signature text,
  created_at timestamptz DEFAULT now()
);

-- Seed with initial sender profiles
INSERT INTO sender_profiles (name, email, title, phone, signature) VALUES
  ('Sandy Martin', 'sandy@bioedgelongevity.com', 'Founder, bioEDGE Longevity', '321-276-4752',
   E'Sandy Martin\nFounder, bioEDGE Longevity\n321-276-4752\nbioedgelongevity.com'),
  ('Peter Katz', 'peter@bioedgelongevity.com', 'President, bioEDGE Longevity', '914-960-4853',
   E'Peter Katz\nPresident, bioEDGE Longevity\n914-960-4853\nbioedgelongevity.com');

-- ============================================
-- Campaigns
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',

  -- Sender
  sender_profile_id uuid REFERENCES sender_profiles(id),
  reply_to text,

  -- Content guidance
  purpose text NOT NULL,
  tone text,
  context text,
  must_include text,
  must_avoid text,
  call_to_action text,
  max_words int DEFAULT 100,

  -- Subject line control
  subject_prompt text,

  -- Send pacing
  send_window_start int DEFAULT 9,
  send_window_end int DEFAULT 17,
  min_delay_seconds int DEFAULT 120,
  max_delay_seconds int DEFAULT 300,
  daily_send_limit int DEFAULT 50,

  -- Natural sending controls
  one_per_company boolean DEFAULT true,
  track_opens boolean DEFAULT false,
  track_clicks boolean DEFAULT false,
  company_cooldown_days int DEFAULT 30,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Campaign Recipients
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES contacts(id),
  company_id uuid REFERENCES companies(id),

  -- AI-generated personalized content
  subject text,
  body text,
  body_html text,

  -- Status tracking
  status text NOT NULL DEFAULT 'pending',
  approved boolean DEFAULT false,

  -- Timestamps
  generated_at timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,

  -- Tracking
  resend_id text,
  error text,
  suppression_reason text,

  created_at timestamptz DEFAULT now(),

  -- Prevent duplicate contact in same campaign
  UNIQUE(campaign_id, contact_id)
);

-- Index for efficient send batch queries
CREATE INDEX idx_campaign_recipients_status ON campaign_recipients(campaign_id, status);

-- Index for suppression lookups by company
CREATE INDEX idx_campaign_recipients_company ON campaign_recipients(company_id, status);

-- ============================================
-- RLS Policies
-- ============================================

-- Enable RLS
ALTER TABLE sender_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read/write all (internal tool, all users are admins)
CREATE POLICY "Authenticated users can manage sender_profiles"
  ON sender_profiles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage campaign_recipients"
  ON campaign_recipients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Service role bypass (for API routes and scripts)
CREATE POLICY "Service role full access to sender_profiles"
  ON sender_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to campaigns"
  ON campaigns FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to campaign_recipients"
  ON campaign_recipients FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
