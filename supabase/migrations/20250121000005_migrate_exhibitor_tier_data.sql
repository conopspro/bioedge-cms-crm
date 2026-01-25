-- ============================================
-- Update exhibitor_tier enum values - Step 2
-- ============================================
-- Migrate data and update defaults
-- Run this AFTER the first migration has been committed
-- ============================================

-- Update any existing rows that use the old values
-- Map old values to new values:
-- - 'title' -> 'platinum' (title sponsors become platinum)
-- - 'startup' -> 'exhibitor' (startups become regular exhibitors)
-- - 'media' -> 'contributor' (media partners become contributors)

UPDATE event_exhibitors SET tier = 'platinum' WHERE tier = 'title';
UPDATE event_exhibitors SET tier = 'exhibitor' WHERE tier = 'startup';
UPDATE event_exhibitors SET tier = 'contributor' WHERE tier = 'media';

-- Update the default value
ALTER TABLE event_exhibitors ALTER COLUMN tier SET DEFAULT 'exhibitor';

-- Note: PostgreSQL doesn't support removing enum values directly
-- The old values (title, startup, media) will remain in the enum but won't be used
-- This is a PostgreSQL limitation - to fully remove them would require recreating the type
