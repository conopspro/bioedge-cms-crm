-- =============================================
-- Rename agenda_items to presentations
-- =============================================
-- This migration renames the table and all related objects
-- for consistency with the UI terminology.

-- Step 1: Rename the enum type
ALTER TYPE agenda_item_status RENAME TO presentation_status;

-- Step 2: Rename the table
ALTER TABLE agenda_items RENAME TO presentations;

-- Step 3: Rename indexes
ALTER INDEX idx_agenda_items_slug RENAME TO idx_presentations_slug;
ALTER INDEX idx_agenda_items_status RENAME TO idx_presentations_status;
ALTER INDEX idx_agenda_items_contact RENAME TO idx_presentations_contact;
ALTER INDEX idx_agenda_items_company RENAME TO idx_presentations_company;
ALTER INDEX idx_agenda_items_article RENAME TO idx_presentations_article;

-- Step 4: Rename the trigger
ALTER TRIGGER update_agenda_items_updated_at ON presentations RENAME TO update_presentations_updated_at;

-- Step 5: Drop old policies and create new ones with updated names
DROP POLICY IF EXISTS "Allow all for authenticated users" ON presentations;
DROP POLICY IF EXISTS "Allow public read for published" ON presentations;

CREATE POLICY "presentations_authenticated_all" ON presentations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "presentations_public_read_published" ON presentations
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Step 6: Add session_type column to presentations
-- Create enum only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_type') THEN
    CREATE TYPE session_type AS ENUM (
      'keynote',
      'panel',
      'workshop',
      'fireside_chat',
      'presentation',
      'demo',
      'networking',
      'break',
      'meal',
      'registration',
      'other'
    );
  END IF;
END
$$;

ALTER TABLE presentations
  ADD COLUMN IF NOT EXISTS session_type session_type DEFAULT 'presentation';

CREATE INDEX idx_presentations_session_type ON presentations(session_type);

COMMENT ON COLUMN presentations.session_type IS 'Type of session (keynote, panel, workshop, etc.)';

-- Step 7: Update comments
COMMENT ON TABLE presentations IS 'Content library for sessions, panels, talks - can be scheduled at events';
COMMENT ON COLUMN presentations.short_description IS 'Brief description (~100 words) for listings and cards';
COMMENT ON COLUMN presentations.long_description IS 'Full description (~400 words) for detail page';
COMMENT ON COLUMN presentations.recording_url IS 'YouTube URL for session recording';
COMMENT ON COLUMN presentations.recording_metadata IS 'YouTube video metadata (videoId, channel, duration, thumbnail)';

-- Step 7: Update the presentation_panelists foreign key constraint name (if needed)
-- The FK already references the table by ID, so it will follow the rename automatically.
-- But let's update the constraint name for clarity.
ALTER TABLE presentation_panelists
  DROP CONSTRAINT IF EXISTS presentation_panelists_presentation_id_fkey;

ALTER TABLE presentation_panelists
  ADD CONSTRAINT presentation_panelists_presentation_id_fkey
  FOREIGN KEY (presentation_id) REFERENCES presentations(id) ON DELETE CASCADE;

-- Step 8: Update the event_presentations foreign key (from event junction tables)
-- This references agenda_items which is now presentations
ALTER TABLE event_presentations
  DROP CONSTRAINT IF EXISTS event_presentations_presentation_id_fkey;

ALTER TABLE event_presentations
  ADD CONSTRAINT event_presentations_presentation_id_fkey
  FOREIGN KEY (presentation_id) REFERENCES presentations(id) ON DELETE CASCADE;

-- Step 9: Recreate the presentation_panelists_view with new table name
DROP VIEW IF EXISTS presentation_panelists_view;

CREATE VIEW presentation_panelists_view AS
SELECT
  pp.id,
  pp.presentation_id,
  pp.contact_id,
  pp.role,
  pp.display_order,
  pp.notes,
  pp.created_at,
  -- Contact details
  c.first_name,
  c.last_name,
  c.title,
  c.avatar_url,
  c.linkedin_url,
  c.bio,
  c.slug as contact_slug,
  -- Company (use override if set, otherwise contact's company)
  COALESCE(pp.company_id, c.company_id) as company_id,
  COALESCE(co_override.name, co_contact.name) as company_name,
  COALESCE(co_override.logo_url, co_contact.logo_url) as company_logo,
  COALESCE(co_override.slug, co_contact.slug) as company_slug,
  -- Article (use override if set)
  pp.article_id,
  a.title as article_title,
  a.slug as article_slug,
  -- Presentation details for context
  p.title as presentation_title,
  p.slug as presentation_slug
FROM presentation_panelists pp
JOIN contacts c ON c.id = pp.contact_id
LEFT JOIN companies co_override ON co_override.id = pp.company_id
LEFT JOIN companies co_contact ON co_contact.id = c.company_id
LEFT JOIN articles a ON a.id = pp.article_id
JOIN presentations p ON p.id = pp.presentation_id
ORDER BY pp.presentation_id, pp.display_order;

-- Step 10: Rename event_agenda_view to event_presentations_view
DROP VIEW IF EXISTS event_agenda_view;

CREATE VIEW event_presentations_view AS
SELECT
  ep.id,
  ep.event_id,
  ep.presentation_id,
  ep.scheduled_date,
  ep.start_time,
  ep.end_time,
  ep.room,
  ep.track,
  ep.status,
  ep.is_featured,
  ep.display_order,
  -- Presentation details
  p.title,
  p.short_description,
  p.long_description,
  p.recording_url,
  p.recording_embed,
  p.status as presentation_status,
  p.session_type,
  -- Primary speaker (from presentation's contact_id)
  p.contact_id,
  c.first_name as speaker_first_name,
  c.last_name as speaker_last_name,
  c.title as speaker_title,
  c.avatar_url as speaker_avatar,
  -- Company
  p.company_id,
  co.name as company_name,
  co.logo_url as company_logo,
  -- Event info for context
  e.name as event_name,
  e.start_date as event_start_date
FROM event_presentations ep
JOIN presentations p ON p.id = ep.presentation_id
JOIN events e ON e.id = ep.event_id
LEFT JOIN contacts c ON c.id = p.contact_id
LEFT JOIN companies co ON co.id = p.company_id
ORDER BY ep.event_id, ep.scheduled_date, ep.start_time, ep.display_order;

-- Done! Summary of changes:
-- - Table: agenda_items → presentations
-- - Enum: agenda_item_status → presentation_status
-- - New column: session_type (keynote, panel, workshop, etc.)
-- - View: event_agenda_view → event_presentations_view
