-- ============================================
-- BioEdge CMS/CRM - Contact Bio Sources
-- ============================================
-- Adds field to store source citations for AI-generated bios

-- Add field to store bio sources (JSON array of {title, url} objects)
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS bio_sources JSONB;

-- ============================================
-- DONE!
-- ============================================
-- Run this migration in Supabase SQL Editor
-- Then contacts will have bio_sources field for citations
