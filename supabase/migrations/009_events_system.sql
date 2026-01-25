-- ============================================
-- BioEdge CMS/CRM - Events System (Expanded)
-- ============================================
-- Run this in your Supabase SQL Editor
-- Combines BioEdge marketing events with ConOpsPro operations concepts
--
-- Tables created:
-- - venues: Reusable venue locations with rooms
-- - venue_rooms: Rooms/spaces within venues
-- - events: Main event info linked to venues
-- - sessions: Schedule items (renamed from agenda_items) with tracks
-- - event_exhibitors: Companies with booths + sponsorship tiers
-- - event_speakers: Contacts registered as speakers for an event
-- - session_speakers: Many-to-many linking speakers to sessions with roles
-- - session_sponsors: Companies sponsoring specific sessions
-- - exhibitor_leads: Pipeline for prospecting exhibitors
-- - exhibitor_lead_contacts: Contacts at prospective exhibitor companies
-- ============================================

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- ENUM TYPES
-- ============================================

-- Event status
CREATE TYPE event_status AS ENUM (
  'draft',
  'announced',
  'registration_open',
  'sold_out',
  'completed',
  'cancelled'
);

-- Session types (expanded)
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

-- Session status
CREATE TYPE session_status AS ENUM (
  'draft',
  'confirmed',
  'cancelled'
);

-- Exhibitor/Sponsor tiers
CREATE TYPE exhibitor_tier AS ENUM (
  'title',
  'platinum',
  'gold',
  'silver',
  'bronze',
  'startup',
  'media'
);

-- Speaker roles within a session
CREATE TYPE speaker_role AS ENUM (
  'keynote',
  'presenter',
  'panelist',
  'moderator',
  'host',
  'mc'
);

-- Venue types
CREATE TYPE venue_type AS ENUM (
  'conference_center',
  'hotel',
  'convention_center',
  'restaurant',
  'outdoor',
  'virtual',
  'hybrid',
  'other'
);

-- Room types within venues
CREATE TYPE room_type AS ENUM (
  'main_hall',
  'breakout_room',
  'workshop_room',
  'expo_hall',
  'registration',
  'vip_lounge',
  'green_room',
  'dining',
  'outdoor',
  'other'
);

-- Room setup configurations
CREATE TYPE room_setup AS ENUM (
  'theater',
  'classroom',
  'u_shape',
  'boardroom',
  'banquet_rounds',
  'cocktail',
  'expo_booths',
  'other'
);

-- Exhibitor lead pipeline stages
CREATE TYPE lead_pipeline_stage AS ENUM (
  'prospect',
  'contacted',
  'interested',
  'qualified',
  'negotiating',
  'won',
  'lost'
);

-- Speaker payment status
CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'paid',
  'complimentary'
);

-- ============================================
-- VENUES TABLE
-- ============================================

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  venue_type venue_type DEFAULT 'other',
  website TEXT,

  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),

  -- Primary contact
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  contact_phone TEXT,

  -- Secondary contact
  secondary_contact_name TEXT,
  secondary_contact_email TEXT,
  secondary_contact_phone TEXT,

  -- Capacity and details
  capacity INTEGER,
  description TEXT,
  notes TEXT,

  -- Images
  photo_url TEXT,
  floor_plan_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- VENUE ROOMS TABLE
-- ============================================

CREATE TABLE venue_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Room info
  name TEXT NOT NULL,
  room_type room_type DEFAULT 'other',
  floor TEXT,
  capacity INTEGER,

  -- Setup
  default_setup room_setup,
  av_equipment TEXT,
  notes TEXT,

  -- Display order
  position INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE (with venue reference)
-- ============================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  extended_info TEXT,

  -- Venue reference (preferred) or inline venue info (fallback)
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  -- Inline venue fields for quick entry or when venue doesn't exist
  venue_name TEXT,
  venue_address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'USA',

  -- Dates and timing
  start_date DATE,
  end_date DATE,
  timezone TEXT DEFAULT 'America/New_York',

  -- Status and registration
  status event_status NOT NULL DEFAULT 'draft',
  registration_url TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_url TEXT,

  -- Capacity and pricing
  capacity INTEGER,
  is_free BOOLEAN DEFAULT TRUE,

  -- Images
  featured_image_url TEXT,
  og_image_url TEXT,
  logo_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SESSIONS TABLE (replaces agenda_items)
-- ============================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_room_id UUID REFERENCES venue_rooms(id) ON DELETE SET NULL,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  session_type session_type NOT NULL DEFAULT 'presentation',
  status session_status DEFAULT 'draft',

  -- Timing
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  day_number INTEGER DEFAULT 1,

  -- Location (override or when no room assigned)
  location TEXT,

  -- Organization
  track TEXT,

  -- Display
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Notes (internal)
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EVENT SPEAKERS TABLE (speaker registered for event)
-- ============================================

CREATE TABLE event_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,

  -- Override fields (event-specific, falls back to contact data)
  bio_override TEXT,
  title_override TEXT,
  headshot_url TEXT,

  -- Social media (event-specific overrides or additions)
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  website_url TEXT,

  -- Speaker fee and payment
  speaker_fee DECIMAL(10,2),
  payment_status payment_status DEFAULT 'unpaid',

  -- Display
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Notes (internal)
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate speaker per event
  UNIQUE(event_id, contact_id)
);

-- ============================================
-- SESSION SPEAKERS TABLE (many-to-many with roles)
-- ============================================

CREATE TABLE session_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  event_speaker_id UUID NOT NULL REFERENCES event_speakers(id) ON DELETE CASCADE,

  -- Role in this session
  role speaker_role NOT NULL DEFAULT 'presenter',

  -- Display order within session
  position INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate speaker per session
  UNIQUE(session_id, event_speaker_id)
);

-- ============================================
-- EVENT EXHIBITORS TABLE (with enhanced sponsorship)
-- ============================================

CREATE TABLE event_exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Exhibitor details
  tier exhibitor_tier NOT NULL DEFAULT 'bronze',
  booth_number TEXT,
  booth_size TEXT,

  -- Sponsorship pricing
  booth_price DECIMAL(10,2),
  sponsorship_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),

  -- Payment tracking
  payment_status payment_status DEFAULT 'unpaid',

  -- Contact override (if different from company primary)
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,

  -- Display
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Notes (internal)
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate company per event
  UNIQUE(event_id, company_id)
);

-- ============================================
-- SESSION SPONSORS TABLE (companies sponsoring specific sessions)
-- ============================================

CREATE TABLE session_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Sponsorship level for this session
  sponsor_level TEXT CHECK (sponsor_level IN ('title', 'presenting', 'supporting', 'media')),

  -- Amount
  sponsor_amount DECIMAL(10,2),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate sponsor per session
  UNIQUE(session_id, company_id)
);

-- ============================================
-- EXHIBITOR LEADS TABLE (prospecting pipeline)
-- ============================================

CREATE TABLE exhibitor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,

  -- Company info (before they become a real company)
  company_name TEXT NOT NULL,
  website TEXT,
  domain TEXT,

  -- Address
  city TEXT,
  state TEXT,
  country TEXT,

  -- Categorization
  category TEXT,
  description TEXT,

  -- Pipeline tracking
  pipeline_stage lead_pipeline_stage DEFAULT 'prospect',
  source TEXT,

  -- Outreach tracking
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_date DATE,

  -- Notes
  notes TEXT,

  -- Link to company if converted
  converted_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  converted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EXHIBITOR LEAD CONTACTS TABLE
-- ============================================

CREATE TABLE exhibitor_lead_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES exhibitor_leads(id) ON DELETE CASCADE,

  -- Contact info
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  linkedin_url TEXT,

  -- Verification (from Hunter.io or similar)
  email_confidence INTEGER,
  verified_at TIMESTAMPTZ,

  -- Is this the primary contact?
  is_primary BOOLEAN DEFAULT FALSE,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One email per lead
  UNIQUE(lead_id, email)
);

-- ============================================
-- INDEXES
-- ============================================

-- Venues
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_name ON venues(name);

-- Venue Rooms
CREATE INDEX idx_venue_rooms_venue ON venue_rooms(venue_id);

-- Events
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_venue ON events(venue_id) WHERE venue_id IS NOT NULL;

-- Sessions
CREATE INDEX idx_sessions_event ON sessions(event_id);
CREATE INDEX idx_sessions_room ON sessions(venue_room_id) WHERE venue_room_id IS NOT NULL;
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_sessions_day ON sessions(day_number);
CREATE INDEX idx_sessions_track ON sessions(track) WHERE track IS NOT NULL;

-- Event Speakers
CREATE INDEX idx_event_speakers_event ON event_speakers(event_id);
CREATE INDEX idx_event_speakers_contact ON event_speakers(contact_id);

-- Session Speakers
CREATE INDEX idx_session_speakers_session ON session_speakers(session_id);
CREATE INDEX idx_session_speakers_speaker ON session_speakers(event_speaker_id);

-- Event Exhibitors
CREATE INDEX idx_event_exhibitors_event ON event_exhibitors(event_id);
CREATE INDEX idx_event_exhibitors_company ON event_exhibitors(company_id);
CREATE INDEX idx_event_exhibitors_tier ON event_exhibitors(tier);

-- Session Sponsors
CREATE INDEX idx_session_sponsors_session ON session_sponsors(session_id);
CREATE INDEX idx_session_sponsors_company ON session_sponsors(company_id);

-- Exhibitor Leads
CREATE INDEX idx_exhibitor_leads_event ON exhibitor_leads(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_exhibitor_leads_stage ON exhibitor_leads(pipeline_stage);
CREATE INDEX idx_exhibitor_leads_domain ON exhibitor_leads(domain) WHERE domain IS NOT NULL;

-- Exhibitor Lead Contacts
CREATE INDEX idx_exhibitor_lead_contacts_lead ON exhibitor_lead_contacts(lead_id);
CREATE INDEX idx_exhibitor_lead_contacts_email ON exhibitor_lead_contacts(email);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venue_rooms_updated_at
  BEFORE UPDATE ON venue_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_speakers_updated_at
  BEFORE UPDATE ON event_speakers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_exhibitors_updated_at
  BEFORE UPDATE ON event_exhibitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exhibitor_leads_updated_at
  BEFORE UPDATE ON exhibitor_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_lead_contacts ENABLE ROW LEVEL SECURITY;

-- Admin policies (authenticated users can do everything)
CREATE POLICY "Allow all for authenticated users" ON venues
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON venue_rooms
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON sessions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON event_speakers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON session_speakers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON event_exhibitors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON session_sponsors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON exhibitor_leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON exhibitor_lead_contacts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read access for published events and related data
CREATE POLICY "Public read for non-draft events" ON events
  FOR SELECT TO anon USING (status != 'draft');

CREATE POLICY "Public read venues" ON venues
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public read venue rooms" ON venue_rooms
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public read sessions for non-draft events" ON sessions
  FOR SELECT TO anon USING (
    event_id IN (SELECT id FROM events WHERE status != 'draft')
  );

CREATE POLICY "Public read speakers for non-draft events" ON event_speakers
  FOR SELECT TO anon USING (
    event_id IN (SELECT id FROM events WHERE status != 'draft')
  );

CREATE POLICY "Public read session speakers for non-draft events" ON session_speakers
  FOR SELECT TO anon USING (
    session_id IN (
      SELECT s.id FROM sessions s
      JOIN events e ON s.event_id = e.id
      WHERE e.status != 'draft'
    )
  );

CREATE POLICY "Public read exhibitors for non-draft events" ON event_exhibitors
  FOR SELECT TO anon USING (
    event_id IN (SELECT id FROM events WHERE status != 'draft')
  );

CREATE POLICY "Public read session sponsors for non-draft events" ON session_sponsors
  FOR SELECT TO anon USING (
    session_id IN (
      SELECT s.id FROM sessions s
      JOIN events e ON s.event_id = e.id
      WHERE e.status != 'draft'
    )
  );

-- Exhibitor leads are NEVER public (internal sales pipeline)
-- No anon policy = no public access

-- ============================================
-- DONE!
-- ============================================
-- 10 tables created:
--
-- VENUES & ROOMS:
-- - venues: Reusable venue locations
-- - venue_rooms: Rooms/spaces within venues
--
-- EVENTS & SESSIONS:
-- - events: Main event info with venue reference
-- - sessions: Schedule items with tracks and room assignments
--
-- SPEAKERS:
-- - event_speakers: Speakers registered for an event
-- - session_speakers: Many-to-many linking speakers to sessions
--
-- EXHIBITORS & SPONSORS:
-- - event_exhibitors: Companies exhibiting at events
-- - session_sponsors: Companies sponsoring specific sessions
--
-- LEAD PIPELINE:
-- - exhibitor_leads: Prospective exhibitor companies
-- - exhibitor_lead_contacts: Contacts at prospective companies
