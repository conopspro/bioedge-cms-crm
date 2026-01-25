-- ============================================
-- Update exhibitor_tier enum values - Step 1
-- ============================================
-- Add new enum values only
-- Run this first, then run step 2 in a separate transaction
-- ============================================

-- Add the new enum values
ALTER TYPE exhibitor_tier ADD VALUE IF NOT EXISTS 'exhibitor';
ALTER TYPE exhibitor_tier ADD VALUE IF NOT EXISTS 'contributor';
