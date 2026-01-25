-- ============================================
-- Event Landing Page Schema Enhancements
-- ============================================
-- Adds ticket tiers, testimonials, FAQ, and
-- enhanced content fields for event landing pages

-- ============================================
-- TICKET TIERS
-- ============================================
-- Stores ticket pricing tiers (GA, VIP, etc.)
-- Each tier links to an external registration URL

CREATE TABLE IF NOT EXISTS event_ticket_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Tier info
  name TEXT NOT NULL,                    -- "General Admission", "VIP", "Professional"
  description TEXT,                       -- Brief description of the tier

  -- Pricing
  price DECIMAL(10,2) NOT NULL,          -- Current price
  original_price DECIMAL(10,2),          -- Strike-through price (if discounted)
  currency TEXT DEFAULT 'USD',

  -- Availability
  max_quantity INTEGER,                   -- NULL = unlimited
  sold_count INTEGER DEFAULT 0,
  is_sold_out BOOLEAN DEFAULT FALSE,
  waitlist_url TEXT,                      -- URL for waitlist if sold out

  -- Registration
  registration_url TEXT NOT NULL,         -- External ticket purchase URL

  -- Display
  display_order INTEGER DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT FALSE,   -- Highlight as "recommended" tier
  is_visible BOOLEAN DEFAULT TRUE,
  highlight_text TEXT,                    -- "MOST POPULAR", "BEST VALUE", etc.

  -- Dates
  available_from TIMESTAMPTZ,             -- When this tier goes on sale
  available_until TIMESTAMPTZ,            -- When this tier expires

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_ticket_tiers_event ON event_ticket_tiers(event_id);
CREATE INDEX idx_event_ticket_tiers_order ON event_ticket_tiers(event_id, display_order);

-- ============================================
-- TICKET TIER FEATURES
-- ============================================
-- Individual features/inclusions for each tier
-- Supports value stacking (showing dollar values)

CREATE TABLE IF NOT EXISTS event_ticket_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID NOT NULL REFERENCES event_ticket_tiers(id) ON DELETE CASCADE,

  -- Feature info
  feature_text TEXT NOT NULL,             -- "VIP Dinner with Founder"
  dollar_value DECIMAL(10,2),             -- Optional: "$500 value"

  -- Display
  display_order INTEGER DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT FALSE,   -- Emphasize this feature

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_ticket_features_tier ON event_ticket_features(tier_id);

-- ============================================
-- EVENT TESTIMONIALS
-- ============================================
-- Social proof from past attendees

CREATE TABLE IF NOT EXISTS event_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Can link to existing contact or be standalone
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,

  -- Testimonial content
  quote TEXT NOT NULL,

  -- Attribution (used if no contact_id linked)
  author_name TEXT,
  author_title TEXT,
  author_company TEXT,
  author_image_url TEXT,

  -- Optional video
  video_url TEXT,

  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_testimonials_event ON event_testimonials(event_id);

-- ============================================
-- EVENT FAQ
-- ============================================
-- Frequently asked questions for event pages

CREATE TABLE IF NOT EXISTS event_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- FAQ content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,

  -- Categorization
  category TEXT,                          -- "Tickets", "Logistics", "Experience", etc.

  -- Display
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_faqs_event ON event_faqs(event_id);

-- ============================================
-- ENHANCE EVENTS TABLE
-- ============================================
-- Add fields for landing page content

ALTER TABLE events
  -- Hero section
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_video_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_overlay_opacity INTEGER DEFAULT 50,

  -- Value proposition (benefits checklist as JSON array)
  -- Format: [{"icon": "check", "text": "Benefit text", "highlight": false}]
  ADD COLUMN IF NOT EXISTS value_props JSONB DEFAULT '[]'::jsonb,

  -- Attendee composition (pie chart data as JSON)
  -- Format: [{"label": "Health Enthusiasts", "percentage": 35}]
  ADD COLUMN IF NOT EXISTS attendee_composition JSONB,

  -- Additional content
  ADD COLUMN IF NOT EXISTS experience_description TEXT,     -- "What to Expect" section
  ADD COLUMN IF NOT EXISTS venue_description TEXT,          -- Extended venue info
  ADD COLUMN IF NOT EXISTS transportation_info TEXT,        -- Airport, parking, etc.
  ADD COLUMN IF NOT EXISTS hotel_booking_url TEXT,
  ADD COLUMN IF NOT EXISTS hotel_group_rate TEXT,           -- "Use code BIOEDGE for $199/night"

  -- SEO
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,

  -- Urgency elements
  ADD COLUMN IF NOT EXISTS show_countdown BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS early_bird_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS early_bird_text TEXT;            -- "Early Bird ends March 15"

-- ============================================
-- ENHANCE EVENT_COMPANIES TABLE
-- ============================================
-- Add title sponsor support

-- First check if the column exists, add if not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_companies' AND column_name = 'is_title_sponsor'
  ) THEN
    ALTER TABLE event_companies ADD COLUMN is_title_sponsor BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE event_ticket_tiers IS 'Ticket pricing tiers for events (GA, VIP, etc.)';
COMMENT ON TABLE event_ticket_features IS 'Individual features included in each ticket tier';
COMMENT ON TABLE event_testimonials IS 'Social proof testimonials for event pages';
COMMENT ON TABLE event_faqs IS 'FAQ items for event pages';
COMMENT ON COLUMN events.value_props IS 'JSON array of value proposition items for landing page';
COMMENT ON COLUMN events.attendee_composition IS 'JSON array of attendee demographic breakdown';
