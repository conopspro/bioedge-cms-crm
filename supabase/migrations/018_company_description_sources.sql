-- ============================================
-- BioEdge CMS/CRM - Company Description Sources
-- ============================================
-- Adds source citations for AI-generated company descriptions

-- Add description_sources column to store citation sources
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS description_sources JSONB;

-- ============================================
-- DONE!
-- ============================================
-- Run this migration in Supabase SQL Editor
