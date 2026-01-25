-- ============================================
-- BioEdge CMS/CRM - Contact Bio Field
-- ============================================
-- Adds bio and AI research fields to contacts table
-- for storing AI-generated professional summaries

-- Add bio field for AI-generated professional summary
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add field to track when AI research was performed
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS ai_researched_at TIMESTAMP WITH TIME ZONE;

-- Add field to store research highlights (JSON array)
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS ai_highlights JSONB;

-- Add field to store expertise areas (JSON array)
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS ai_expertise JSONB;

-- ============================================
-- DONE!
-- ============================================
-- Run this migration in Supabase SQL Editor
-- Then contacts will have bio, ai_researched_at,
-- ai_highlights, and ai_expertise fields
