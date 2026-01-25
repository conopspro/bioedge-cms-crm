-- Migrate Event Status Data
-- Run this AFTER 20250122000003_update_event_status.sql has been committed

-- Update existing data to use new values
-- announced -> published
-- registration_open -> published
-- sold_out -> published
-- cancelled -> archived
UPDATE events SET status = 'published' WHERE status IN ('announced', 'registration_open', 'sold_out');
UPDATE events SET status = 'archived' WHERE status = 'cancelled';

-- Note: PostgreSQL doesn't allow removing enum values directly.
-- The old values will remain in the enum but won't be used.
-- The UI only shows: draft, published, completed, archived
