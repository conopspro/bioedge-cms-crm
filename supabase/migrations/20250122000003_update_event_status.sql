-- Update Event Status Enum
-- Changes from: draft, announced, registration_open, sold_out, completed, cancelled
-- To: draft, published, completed, archived

-- Step 1: Add new enum values
ALTER TYPE event_status ADD VALUE IF NOT EXISTS 'published';
ALTER TYPE event_status ADD VALUE IF NOT EXISTS 'archived';

-- IMPORTANT: You must run this migration first, then run the second migration
-- file (20250122000004_migrate_event_status_data.sql) to update the actual data.
-- PostgreSQL requires new enum values to be committed before they can be used.
