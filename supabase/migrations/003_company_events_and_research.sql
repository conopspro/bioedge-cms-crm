-- ============================================
-- BioEdge CMS/CRM - Company Events & Research Fields
-- ============================================
-- Run this in your Supabase SQL Editor after 002_extended_contact_fields.sql
-- Adds events tracking and research-related fields to companies

-- ============================================
-- ADD EVENTS ARRAY TO COMPANIES TABLE
-- ============================================
-- Tracks which events we noticed this company at
-- e.g., ["Biohacking Conference 2024", "Eudēmonia Summit 2025"]

ALTER TABLE companies ADD COLUMN IF NOT EXISTS events TEXT[] DEFAULT '{}';

-- Index for searching companies by event
CREATE INDEX IF NOT EXISTS idx_companies_events
  ON companies USING GIN(events);

-- ============================================
-- ADD RESEARCH/CONTENT FIELDS TO COMPANIES
-- ============================================

-- Category of the company (Supplement, Device, Service, Clinic, etc.)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS category TEXT;

-- The 15 biological systems this company's solutions support
-- Stored as array: ["Energy Production", "Circulation", "Hormones"]
ALTER TABLE companies ADD COLUMN IF NOT EXISTS systems_supported TEXT[] DEFAULT '{}';

-- Key differentiators (what sets them apart)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS differentiators TEXT;

-- Evidence/credibility (clinical studies, endorsements, certifications)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS evidence TEXT;

-- bioEDGE fit (why this aligns with bioEDGE audience)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bioedge_fit TEXT;

-- Warm pitch email (draft)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS warm_pitch TEXT;

-- Research notes (raw research findings before processing)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS research_notes TEXT;

-- Track when research was last performed
ALTER TABLE companies ADD COLUMN IF NOT EXISTS researched_at TIMESTAMPTZ;

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_companies_category
  ON companies(category);

-- Index for searching by systems supported
CREATE INDEX IF NOT EXISTS idx_companies_systems
  ON companies USING GIN(systems_supported);

-- ============================================
-- ADD PRIMARY CONTACT REFERENCE
-- ============================================
-- Link to the primary contact for outreach

ALTER TABLE companies ADD COLUMN IF NOT EXISTS primary_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL;

-- ============================================
-- DONE!
-- ============================================
-- New fields added to companies:
-- - events: TEXT[] - Events where company was noticed
-- - category: TEXT - Company category (Supplement, Device, etc.)
-- - systems_supported: TEXT[] - Which of the 15 biological systems
-- - differentiators: TEXT - Key differentiators
-- - evidence: TEXT - Evidence/credibility
-- - bioedge_fit: TEXT - Why this fits bioEDGE
-- - warm_pitch: TEXT - Draft pitch email
-- - research_notes: TEXT - Raw research findings
-- - researched_at: TIMESTAMPTZ - When research was performed
-- - primary_contact_id: UUID - Reference to primary contact
