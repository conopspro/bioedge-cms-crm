-- ============================================
-- Add Event Rooms table
-- ============================================
-- Event rooms are custom room/stage names for an event
-- These are independent of the physical venue rooms
-- Examples: "Main Stage", "Celler8 Stage", "Workshop Room A"

CREATE TABLE IF NOT EXISTS event_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Room info
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER,

  -- Display order
  position INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_rooms_event ON event_rooms(event_id);

-- Unique constraint: no duplicate room names per event
ALTER TABLE event_rooms
  ADD CONSTRAINT event_rooms_event_name_unique UNIQUE (event_id, name);

-- Update event_presentations to reference event_rooms instead of venue_rooms
-- First drop the venue_room_id column if it exists
ALTER TABLE event_presentations
  DROP COLUMN IF EXISTS venue_room_id;

-- Add event_room_id column
ALTER TABLE event_presentations
  ADD COLUMN IF NOT EXISTS event_room_id UUID REFERENCES event_rooms(id) ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_event_presentations_event_room ON event_presentations(event_room_id);
