-- ============================================
-- Consolidate Event Tables Migration
-- ============================================
-- This migration:
-- 1. Adds missing columns to event_contacts and event_companies
-- 2. Migrates data from event_speakers → event_contacts
-- 3. Migrates data from event_exhibitors → event_companies
-- 4. Drops redundant tables
-- 5. Removes circular reference (companies.primary_contact_id)
-- 6. Adds explicit foreign key names
-- ============================================

-- ============================================
-- STEP 1: Add missing columns to event_contacts
-- ============================================
-- event_speakers has: speaker_fee, payment_status, linkedin_url, twitter_url, instagram_url, website_url
-- event_contacts uses: role (enum), but we want flexibility for speaker-specific fields

ALTER TABLE event_contacts
  ADD COLUMN IF NOT EXISTS speaker_fee DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Rename headshot_override to headshot_url for consistency
ALTER TABLE event_contacts
  RENAME COLUMN headshot_override TO headshot_url;

-- ============================================
-- STEP 2: Add missing columns to event_companies
-- ============================================
-- event_exhibitors has: tier, booth_size, booth_price, sponsorship_price, total_amount, payment_status, contact_*
-- event_companies has: role (enum), but we want the tier system

ALTER TABLE event_companies
  ADD COLUMN IF NOT EXISTS tier exhibitor_tier DEFAULT 'exhibitor',
  ADD COLUMN IF NOT EXISTS booth_size TEXT,
  ADD COLUMN IF NOT EXISTS booth_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS sponsorship_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS contact_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- ============================================
-- STEP 3: Migrate data from event_speakers to event_contacts
-- ============================================
INSERT INTO event_contacts (
  event_id,
  contact_id,
  role,
  display_order,
  status,
  title_override,
  bio_override,
  headshot_url,
  is_featured,
  notes,
  speaker_fee,
  payment_status,
  linkedin_url,
  twitter_url,
  instagram_url,
  website_url,
  created_at,
  updated_at
)
SELECT
  es.event_id,
  es.contact_id,
  'speaker'::event_contact_role,
  es.position,
  'confirmed'::event_participant_status,
  es.title_override,
  es.bio_override,
  es.headshot_url,
  es.is_featured,
  es.notes,
  es.speaker_fee,
  es.payment_status,
  es.linkedin_url,
  es.twitter_url,
  es.instagram_url,
  es.website_url,
  es.created_at,
  es.updated_at
FROM event_speakers es
WHERE NOT EXISTS (
  SELECT 1 FROM event_contacts ec
  WHERE ec.event_id = es.event_id AND ec.contact_id = es.contact_id
);

-- ============================================
-- STEP 4: Migrate data from event_exhibitors to event_companies
-- ============================================
INSERT INTO event_companies (
  event_id,
  company_id,
  role,
  booth_number,
  display_order,
  status,
  is_featured,
  notes,
  tier,
  booth_size,
  booth_price,
  sponsorship_price,
  total_amount,
  payment_status,
  contact_name,
  contact_email,
  contact_phone,
  created_at,
  updated_at
)
SELECT
  ee.event_id,
  ee.company_id,
  'exhibitor'::event_company_role,
  ee.booth_number,
  ee.position,
  'confirmed'::event_participant_status,
  ee.is_featured,
  ee.notes,
  ee.tier,
  ee.booth_size,
  ee.booth_price,
  ee.sponsorship_price,
  ee.total_amount,
  ee.payment_status,
  ee.contact_name,
  ee.contact_email,
  ee.contact_phone,
  ee.created_at,
  ee.updated_at
FROM event_exhibitors ee
WHERE NOT EXISTS (
  SELECT 1 FROM event_companies ec
  WHERE ec.event_id = ee.event_id AND ec.company_id = ee.company_id
);

-- ============================================
-- STEP 5: Drop redundant tables
-- ============================================

-- Drop session_speakers first (it references event_speakers)
DROP TABLE IF EXISTS session_speakers CASCADE;

-- Drop session_sponsors (references event_sessions)
DROP TABLE IF EXISTS session_sponsors CASCADE;

-- Now drop the duplicate event tables
DROP TABLE IF EXISTS event_speakers CASCADE;
DROP TABLE IF EXISTS event_exhibitors CASCADE;

-- Drop other redundant tables
DROP TABLE IF EXISTS company_leaders CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- ============================================
-- STEP 6: Remove circular reference
-- ============================================
ALTER TABLE companies DROP COLUMN IF EXISTS primary_contact_id;

-- ============================================
-- STEP 7: Add unique constraints to prevent duplicates
-- ============================================
ALTER TABLE event_contacts
  DROP CONSTRAINT IF EXISTS event_contacts_event_contact_unique;
ALTER TABLE event_contacts
  ADD CONSTRAINT event_contacts_event_contact_unique UNIQUE (event_id, contact_id);

ALTER TABLE event_companies
  DROP CONSTRAINT IF EXISTS event_companies_event_company_unique;
ALTER TABLE event_companies
  ADD CONSTRAINT event_companies_event_company_unique UNIQUE (event_id, company_id);

-- ============================================
-- STEP 8: Rename foreign keys for explicit naming
-- ============================================
-- This helps Supabase/PostgREST resolve relationships unambiguously

-- event_contacts foreign keys
ALTER TABLE event_contacts
  DROP CONSTRAINT IF EXISTS event_contacts_event_id_fkey;
ALTER TABLE event_contacts
  ADD CONSTRAINT event_contacts_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_contacts
  DROP CONSTRAINT IF EXISTS event_contacts_contact_id_fkey;
ALTER TABLE event_contacts
  ADD CONSTRAINT event_contacts_contact_id_fkey
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

-- event_companies foreign keys
ALTER TABLE event_companies
  DROP CONSTRAINT IF EXISTS event_companies_event_id_fkey;
ALTER TABLE event_companies
  ADD CONSTRAINT event_companies_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_companies
  DROP CONSTRAINT IF EXISTS event_companies_company_id_fkey;
ALTER TABLE event_companies
  ADD CONSTRAINT event_companies_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- event_presentations foreign keys
ALTER TABLE event_presentations
  DROP CONSTRAINT IF EXISTS event_presentations_event_id_fkey;
ALTER TABLE event_presentations
  ADD CONSTRAINT event_presentations_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_presentations
  DROP CONSTRAINT IF EXISTS event_presentations_presentation_id_fkey;
ALTER TABLE event_presentations
  ADD CONSTRAINT event_presentations_presentation_id_fkey
  FOREIGN KEY (presentation_id) REFERENCES presentations(id) ON DELETE CASCADE;

-- ============================================
-- STEP 9: Update indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_event_contacts_event ON event_contacts(event_id);
CREATE INDEX IF NOT EXISTS idx_event_contacts_contact ON event_contacts(contact_id);
CREATE INDEX IF NOT EXISTS idx_event_companies_event ON event_companies(event_id);
CREATE INDEX IF NOT EXISTS idx_event_companies_company ON event_companies(company_id);

-- ============================================
-- DONE: Schema is now consolidated
-- ============================================
-- Tables for event curation:
--   event_contacts    (links contacts/leaders to events)
--   event_companies   (links companies to events)
--   event_presentations (links presentations to events with scheduling)
--   event_sessions    (non-presentation time blocks)
-- ============================================
