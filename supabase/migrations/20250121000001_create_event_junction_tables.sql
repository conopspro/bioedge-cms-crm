-- Create event junction tables for many-to-many relationships
-- These tables link events to companies (exhibitors), contacts (speakers), and presentations (sessions)
-- with event-specific details

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Role for companies at events
CREATE TYPE event_company_role AS ENUM (
  'platinum_sponsor',
  'gold_sponsor',
  'silver_sponsor',
  'bronze_sponsor',
  'exhibitor',
  'media_partner',
  'supporting_organization'
);

-- Status for event participants
CREATE TYPE event_participant_status AS ENUM (
  'confirmed',
  'pending',
  'tentative',
  'cancelled',
  'waitlist'
);

-- Role for contacts at events
CREATE TYPE event_contact_role AS ENUM (
  'keynote_speaker',
  'speaker',
  'panelist',
  'moderator',
  'workshop_leader',
  'mc',
  'host',
  'judge',
  'mentor',
  'organizer'
);

-- Status for scheduled presentations
CREATE TYPE event_presentation_status AS ENUM (
  'scheduled',
  'confirmed',
  'tentative',
  'cancelled',
  'completed'
);

-- ============================================================================
-- EVENT_COMPANIES (Exhibitors/Sponsors)
-- ============================================================================
-- Links companies to events as exhibitors or sponsors

CREATE TABLE event_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Event-specific details
  role event_company_role NOT NULL DEFAULT 'exhibitor',
  booth_number TEXT,
  display_order INTEGER DEFAULT 0,
  status event_participant_status NOT NULL DEFAULT 'confirmed',

  -- Flags
  is_featured BOOLEAN DEFAULT false,
  is_debut BOOLEAN DEFAULT false, -- First time at this event series

  -- Notes
  notes TEXT, -- Internal notes

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Ensure unique company per event
  UNIQUE(event_id, company_id)
);

-- Indexes for event_companies
CREATE INDEX idx_event_companies_event_id ON event_companies(event_id);
CREATE INDEX idx_event_companies_company_id ON event_companies(company_id);
CREATE INDEX idx_event_companies_role ON event_companies(role);
CREATE INDEX idx_event_companies_status ON event_companies(status);

-- ============================================================================
-- EVENT_CONTACTS (Speakers/Leaders)
-- ============================================================================
-- Links contacts to events as speakers, panelists, moderators, etc.

CREATE TABLE event_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

  -- Event-specific details
  role event_contact_role NOT NULL DEFAULT 'speaker',
  display_order INTEGER DEFAULT 0,
  status event_participant_status NOT NULL DEFAULT 'confirmed',

  -- Event-specific overrides (use these instead of contact's main fields)
  title_override TEXT,
  bio_override TEXT,
  headshot_override TEXT,

  -- Flags
  is_featured BOOLEAN DEFAULT false,
  is_debut BOOLEAN DEFAULT false, -- First time speaking at this event series

  -- Notes
  notes TEXT, -- Internal notes

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Ensure unique contact per event
  UNIQUE(event_id, contact_id)
);

-- Indexes for event_contacts
CREATE INDEX idx_event_contacts_event_id ON event_contacts(event_id);
CREATE INDEX idx_event_contacts_contact_id ON event_contacts(contact_id);
CREATE INDEX idx_event_contacts_role ON event_contacts(role);
CREATE INDEX idx_event_contacts_status ON event_contacts(status);

-- ============================================================================
-- EVENT_PRESENTATIONS (Sessions/Agenda Items)
-- ============================================================================
-- Links presentations (agenda_items) to events with scheduling and location details

CREATE TABLE event_presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  presentation_id UUID NOT NULL REFERENCES agenda_items(id) ON DELETE CASCADE,

  -- Scheduling
  scheduled_date DATE, -- Day of the presentation
  start_time TIME, -- Start time
  end_time TIME, -- End time
  duration_minutes INTEGER, -- Duration in minutes (can calculate from start/end or specify directly)

  -- Location
  room TEXT, -- Room name or number
  location TEXT, -- Building or area (for multi-venue events)
  track TEXT, -- Track name (e.g., "Main Stage", "Innovation Track")

  -- Ordering and status
  display_order INTEGER DEFAULT 0,
  status event_presentation_status NOT NULL DEFAULT 'scheduled',

  -- Flags
  is_featured BOOLEAN DEFAULT false,
  is_livestreamed BOOLEAN DEFAULT false,
  requires_registration BOOLEAN DEFAULT false, -- Separate registration needed

  -- Capacity
  max_attendees INTEGER, -- For sessions with limited seating

  -- Notes
  notes TEXT, -- Internal notes

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Ensure unique presentation per event
  UNIQUE(event_id, presentation_id)
);

-- Indexes for event_presentations
CREATE INDEX idx_event_presentations_event_id ON event_presentations(event_id);
CREATE INDEX idx_event_presentations_presentation_id ON event_presentations(presentation_id);
CREATE INDEX idx_event_presentations_scheduled_date ON event_presentations(scheduled_date);
CREATE INDEX idx_event_presentations_track ON event_presentations(track);
CREATE INDEX idx_event_presentations_status ON event_presentations(status);
CREATE INDEX idx_event_presentations_room ON event_presentations(room);
-- Compound index for schedule queries
CREATE INDEX idx_event_presentations_schedule ON event_presentations(event_id, scheduled_date, start_time);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER update_event_companies_updated_at
  BEFORE UPDATE ON event_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_contacts_updated_at
  BEFORE UPDATE ON event_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_presentations_updated_at
  BEFORE UPDATE ON event_presentations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE event_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_presentations ENABLE ROW LEVEL SECURITY;

-- event_companies policies
CREATE POLICY "Anyone can view event companies"
  ON event_companies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage event companies"
  ON event_companies FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- event_contacts policies
CREATE POLICY "Anyone can view event contacts"
  ON event_contacts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage event contacts"
  ON event_contacts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- event_presentations policies
CREATE POLICY "Anyone can view event presentations"
  ON event_presentations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage event presentations"
  ON event_presentations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View for event agenda with full presentation details
CREATE VIEW event_agenda_view AS
SELECT
  ep.id,
  ep.event_id,
  ep.presentation_id,
  ep.scheduled_date,
  ep.start_time,
  ep.end_time,
  ep.duration_minutes,
  ep.room,
  ep.location,
  ep.track,
  ep.display_order,
  ep.status,
  ep.is_featured,
  ep.is_livestreamed,
  ep.requires_registration,
  ep.max_attendees,
  -- Presentation details
  ai.title,
  ai.short_description,
  ai.long_description,
  ai.recording_url,
  ai.recording_embed,
  ai.status as presentation_status,
  -- Speaker (from presentation's contact)
  ai.contact_id,
  c.first_name as speaker_first_name,
  c.last_name as speaker_last_name,
  c.title as speaker_title,
  c.avatar_url as speaker_avatar,
  -- Company
  ai.company_id,
  co.name as company_name,
  co.logo_url as company_logo,
  -- Event details for filtering
  e.name as event_name,
  e.start_date as event_start_date
FROM event_presentations ep
JOIN agenda_items ai ON ai.id = ep.presentation_id
LEFT JOIN contacts c ON c.id = ai.contact_id
LEFT JOIN companies co ON co.id = ai.company_id
JOIN events e ON e.id = ep.event_id;

-- View for event speakers with contact details
CREATE VIEW event_speakers_view AS
SELECT
  ec.id,
  ec.event_id,
  ec.contact_id,
  ec.role,
  ec.display_order,
  ec.status,
  ec.is_featured,
  ec.is_debut,
  -- Use override or fall back to contact field
  COALESCE(ec.title_override, c.title) as title,
  COALESCE(ec.bio_override, c.bio) as bio,
  COALESCE(ec.headshot_override, c.avatar_url) as headshot_url,
  -- Contact details
  c.first_name,
  c.last_name,
  c.email,
  c.linkedin_url,
  c.slug as contact_slug,
  -- Company info
  c.company_id,
  co.name as company_name,
  co.logo_url as company_logo,
  co.slug as company_slug,
  -- Event details
  e.name as event_name
FROM event_contacts ec
JOIN contacts c ON c.id = ec.contact_id
LEFT JOIN companies co ON co.id = c.company_id
JOIN events e ON e.id = ec.event_id;

-- View for event exhibitors with company details
CREATE VIEW event_exhibitors_view AS
SELECT
  ec.id,
  ec.event_id,
  ec.company_id,
  ec.role,
  ec.booth_number,
  ec.display_order,
  ec.status,
  ec.is_featured,
  ec.is_debut,
  -- Company details
  co.name,
  co.slug,
  co.logo_url,
  co.website,
  co.description,
  co.domain,
  -- Event details
  e.name as event_name
FROM event_companies ec
JOIN companies co ON co.id = ec.company_id
JOIN events e ON e.id = ec.event_id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE event_companies IS 'Junction table linking companies to events as exhibitors/sponsors';
COMMENT ON TABLE event_contacts IS 'Junction table linking contacts to events as speakers/participants';
COMMENT ON TABLE event_presentations IS 'Junction table linking presentations to events with scheduling details';

COMMENT ON COLUMN event_companies.is_debut IS 'Whether this is the company''s first appearance at this event series';
COMMENT ON COLUMN event_contacts.bio_override IS 'Event-specific bio that overrides the contact''s main bio';
COMMENT ON COLUMN event_contacts.title_override IS 'Event-specific title that overrides the contact''s main title';
COMMENT ON COLUMN event_presentations.track IS 'Track or stage name for multi-track events';
COMMENT ON COLUMN event_presentations.requires_registration IS 'Whether attendees need to register separately for this session';

COMMENT ON VIEW event_agenda_view IS 'Denormalized view of event schedule with presentation and speaker details';
COMMENT ON VIEW event_speakers_view IS 'Denormalized view of event speakers with contact and company details';
COMMENT ON VIEW event_exhibitors_view IS 'Denormalized view of event exhibitors with company details';
