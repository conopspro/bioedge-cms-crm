-- ============================================
-- Add Event Tracks table
-- ============================================
-- Event tracks are custom track/category names for an event
-- Examples: "Business Track", "Technical Track", "Wellness Track"

CREATE TABLE IF NOT EXISTS event_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Track info
  name TEXT NOT NULL,
  description TEXT,
  color TEXT, -- Optional color for visual distinction (hex code)

  -- Display order
  position INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_tracks_event ON event_tracks(event_id);

-- Unique constraint: no duplicate track names per event
ALTER TABLE event_tracks
  ADD CONSTRAINT event_tracks_event_name_unique UNIQUE (event_id, name);

-- Add event_track_id column to event_presentations
ALTER TABLE event_presentations
  ADD COLUMN IF NOT EXISTS event_track_id UUID REFERENCES event_tracks(id) ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_event_presentations_event_track ON event_presentations(event_track_id);
