-- ============================================
-- BioEdge CMS/CRM - Fix Missing Tables
-- ============================================
-- Creates company_leaders and outreach_log tables if they don't exist
-- These were in 001 but may have been skipped

-- ============================================
-- OUTREACH TYPE ENUM (if not exists)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'outreach_type') THEN
    CREATE TYPE outreach_type AS ENUM ('email', 'linkedin', 'call', 'other');
  END IF;
END$$;

-- ============================================
-- COMPANY LEADERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS company_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  linkedin_url TEXT,
  image_url TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_company_leaders_company_id ON company_leaders(company_id);

-- RLS
ALTER TABLE company_leaders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON company_leaders;
DROP POLICY IF EXISTS "Allow anon all access" ON company_leaders;

-- Create policies
CREATE POLICY "Allow all for authenticated users" ON company_leaders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon all access" ON company_leaders
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================
-- OUTREACH LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type outreach_type NOT NULL,
  notes TEXT,
  response_received BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_outreach_log_contact_id ON outreach_log(contact_id);
CREATE INDEX IF NOT EXISTS idx_outreach_log_date ON outreach_log(date);

-- RLS
ALTER TABLE outreach_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all for authenticated users" ON outreach_log;
DROP POLICY IF EXISTS "Allow anon all access" ON outreach_log;

-- Create policies
CREATE POLICY "Allow all for authenticated users" ON outreach_log
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon all access" ON outreach_log
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================
-- DONE!
-- ============================================
-- Run this in Supabase SQL Editor to add the missing tables
