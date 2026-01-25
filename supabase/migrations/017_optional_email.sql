-- ============================================
-- BioEdge CMS/CRM - Make Email Optional
-- ============================================
-- Allows contacts to be created without email addresses
-- (useful for leaders/key persons discovered through research)

-- Remove NOT NULL constraint from email
ALTER TABLE contacts
ALTER COLUMN email DROP NOT NULL;

-- ============================================
-- DONE!
-- ============================================
-- Run this migration in Supabase SQL Editor
