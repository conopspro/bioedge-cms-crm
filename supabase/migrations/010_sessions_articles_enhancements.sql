-- ============================================
-- BioEdge CMS/CRM - Sessions & Articles Enhancements
-- ============================================
-- Run this AFTER 009_events_system.sql
--
-- Changes:
-- 1. Restructure sessions to be reusable templates
-- 2. Add event_sessions for scheduling session instances at events
-- 3. Add article_companies for multi-company article ownership
-- 4. Add event_articles for manual article curation per event
-- ============================================

-- ============================================
-- STEP 1: RESTRUCTURE SESSIONS
-- ============================================

-- First, rename existing sessions table to event_sessions (these are already event-specific)
ALTER TABLE sessions RENAME TO event_sessions;

-- Update the foreign key constraint name for clarity
ALTER TABLE event_sessions RENAME CONSTRAINT sessions_event_id_fkey TO event_sessions_event_id_fkey;
ALTER TABLE event_sessions RENAME CONSTRAINT sessions_venue_room_id_fkey TO event_sessions_venue_room_id_fkey;

-- Rename indexes
ALTER INDEX idx_sessions_event RENAME TO idx_event_sessions_event;
ALTER INDEX idx_sessions_room RENAME TO idx_event_sessions_room;
ALTER INDEX idx_sessions_start_time RENAME TO idx_event_sessions_start_time;
ALTER INDEX idx_sessions_day RENAME TO idx_event_sessions_day;
ALTER INDEX idx_sessions_track RENAME TO idx_event_sessions_track;

-- Rename trigger
DROP TRIGGER IF EXISTS update_sessions_updated_at ON event_sessions;
CREATE TRIGGER update_event_sessions_updated_at
  BEFORE UPDATE ON event_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Now create the new sessions table (reusable templates)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  session_type session_type NOT NULL DEFAULT 'presentation',

  -- Duration (for scheduling purposes)
  duration_minutes INTEGER DEFAULT 60,

  -- Topics/tags for categorization and matching
  topics TEXT[], -- e.g., ['longevity', 'biohacking', 'nutrition']

  -- Default speaker (usually gives this session)
  default_speaker_id UUID REFERENCES contacts(id) ON DELETE SET NULL,

  -- Is this a reusable template or one-off?
  is_template BOOLEAN DEFAULT TRUE,

  -- Internal notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add session_id to event_sessions to link to template (nullable for ad-hoc sessions)
ALTER TABLE event_sessions ADD COLUMN session_id UUID REFERENCES sessions(id) ON DELETE SET NULL;

-- Index for session templates
CREATE INDEX idx_sessions_default_speaker ON sessions(default_speaker_id) WHERE default_speaker_id IS NOT NULL;
CREATE INDEX idx_sessions_type ON sessions(session_type);
CREATE INDEX idx_sessions_topics ON sessions USING GIN(topics);

-- Trigger for sessions updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON sessions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read sessions" ON sessions
  FOR SELECT TO anon USING (true);

-- ============================================
-- STEP 2: UPDATE SESSION_SPEAKERS
-- ============================================

-- session_speakers currently references event_speaker_id
-- We need it to work with both session templates AND event_sessions
-- Let's add a direct contact reference for flexibility

ALTER TABLE session_speakers ADD COLUMN contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE;

-- Make event_speaker_id nullable (can use either contact_id or event_speaker_id)
ALTER TABLE session_speakers ALTER COLUMN event_speaker_id DROP NOT NULL;

-- Add constraint to ensure at least one is set
ALTER TABLE session_speakers ADD CONSTRAINT session_speakers_speaker_check
  CHECK (contact_id IS NOT NULL OR event_speaker_id IS NOT NULL);

-- Index for contact lookups
CREATE INDEX idx_session_speakers_contact ON session_speakers(contact_id) WHERE contact_id IS NOT NULL;

-- ============================================
-- STEP 3: ARTICLE COMPANIES (MULTI-COMPANY)
-- ============================================

CREATE TABLE article_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Role of this company in the article
  role TEXT CHECK (role IN ('primary', 'featured', 'mentioned', 'sponsor')),

  -- Display order
  position INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicates
  UNIQUE(article_id, company_id)
);

-- Indexes
CREATE INDEX idx_article_companies_article ON article_companies(article_id);
CREATE INDEX idx_article_companies_company ON article_companies(company_id);

-- RLS
ALTER TABLE article_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON article_companies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read article companies" ON article_companies
  FOR SELECT TO anon USING (
    article_id IN (SELECT id FROM articles WHERE status = 'published')
  );

-- ============================================
-- STEP 4: EVENT ARTICLES (MANUAL CURATION)
-- ============================================

CREATE TABLE event_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,

  -- Curation type
  curation_type TEXT CHECK (curation_type IN (
    'featured',      -- Manually featured for this event
    'recap',         -- Event recap/coverage article
    'preview',       -- Pre-event promotional article
    'related',       -- Related content
    'sponsor'        -- Sponsored content for this event
  )) DEFAULT 'related',

  -- Display order within event
  position INTEGER DEFAULT 0,

  -- Is this automatically derived (from company participation) or manually added?
  is_manual BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicates
  UNIQUE(event_id, article_id)
);

-- Indexes
CREATE INDEX idx_event_articles_event ON event_articles(event_id);
CREATE INDEX idx_event_articles_article ON event_articles(article_id);
CREATE INDEX idx_event_articles_type ON event_articles(curation_type);

-- RLS
ALTER TABLE event_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON event_articles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read event articles for non-draft events" ON event_articles
  FOR SELECT TO anon USING (
    event_id IN (SELECT id FROM events WHERE status != 'draft')
  );

-- ============================================
-- STEP 5: HELPER VIEW FOR EVENT ARTICLES
-- ============================================

-- This view combines manually curated articles with auto-derived ones (via company participation)
CREATE OR REPLACE VIEW event_articles_combined AS
-- Manual curations
SELECT
  ea.event_id,
  ea.article_id,
  ea.curation_type,
  ea.position,
  TRUE as is_manual,
  NULL::UUID as derived_from_company_id
FROM event_articles ea

UNION

-- Auto-derived from participating companies
SELECT DISTINCT
  ee.event_id,
  ac.article_id,
  'related'::TEXT as curation_type,
  1000 as position, -- Lower priority than manual
  FALSE as is_manual,
  ee.company_id as derived_from_company_id
FROM event_exhibitors ee
JOIN article_companies ac ON ac.company_id = ee.company_id
WHERE NOT EXISTS (
  -- Don't duplicate if already manually curated
  SELECT 1 FROM event_articles ea
  WHERE ea.event_id = ee.event_id AND ea.article_id = ac.article_id
);

-- ============================================
-- STEP 6: UPDATE EXISTING RLS POLICIES
-- ============================================

-- Update RLS for renamed event_sessions table
DROP POLICY IF EXISTS "Allow all for authenticated users" ON event_sessions;
DROP POLICY IF EXISTS "Public read sessions for non-draft events" ON event_sessions;

CREATE POLICY "Allow all for authenticated users" ON event_sessions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read event_sessions for non-draft events" ON event_sessions
  FOR SELECT TO anon USING (
    event_id IN (SELECT id FROM events WHERE status != 'draft')
  );

-- ============================================
-- DONE!
-- ============================================
-- New structure:
--
-- SESSIONS (reusable templates):
-- - sessions: Content templates with topics and default speaker
-- - event_sessions: Scheduled instances at specific events
-- - session_speakers: Speakers assigned to sessions (with roles)
--
-- ARTICLES:
-- - articles: Main article repository (canonical at /articles/[slug])
-- - article_companies: Many-to-many for multi-company articles
-- - event_articles: Manual curation of articles per event
-- - event_articles_combined: View combining manual + auto-derived
--
-- Article flow for event pages:
-- 1. Query event_articles_combined WHERE event_id = X
-- 2. This returns manually curated + auto-derived (from exhibitor companies)
-- 3. Canonical URL always points to /articles/[slug]
-- ============================================
