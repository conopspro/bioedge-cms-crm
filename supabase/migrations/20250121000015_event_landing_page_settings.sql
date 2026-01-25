-- ============================================================================
-- EVENT LANDING PAGE SETTINGS & CUSTOMIZATION
-- ============================================================================
-- Adds fields for controlling landing page sections, custom content,
-- photo galleries, and sliders

-- Add landing page section visibility and content fields to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS landing_page_settings JSONB DEFAULT '{}'::jsonb;

-- Landing page sections with visibility, titles, and content
-- Structure: {
--   "hero": { "visible": true, "title": "", "subtitle": "" },
--   "value_props": { "visible": true, "title": "What You'll Get", "subtitle": "Why Attend" },
--   "testimonials": { "visible": true, "title": "Don't Take Our Word For It", "subtitle": "What Attendees Say" },
--   "leaders": { "visible": true, "title": "Featured Leaders", "subtitle": "Who You'll Learn From" },
--   "tickets": { "visible": true, "title": "Choose Your Experience", "subtitle": "Reserve Your Spot" },
--   "venue": { "visible": true, "title": "", "subtitle": "The Venue" },
--   "companies": { "visible": true, "title": "Companies & Sponsors", "subtitle": "Our Partners" },
--   "faq": { "visible": true, "title": "Frequently Asked Questions", "subtitle": "Questions?" },
--   "final_cta": { "visible": true, "title": "Ready to Join Us?", "subtitle": "" }
-- }

-- Add photo gallery support
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_gallery JSONB DEFAULT '[]'::jsonb;
-- Structure: [{ "url": "...", "caption": "...", "alt": "..." }]

-- ============================================================================
-- EVENT PHOTO SLIDERS
-- ============================================================================
-- Allows adding multiple photo sliders to landing pages

CREATE TABLE IF NOT EXISTS event_photo_sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Slider identification
  name TEXT NOT NULL, -- "Hero Gallery", "Venue Photos", etc.
  slug TEXT NOT NULL, -- unique identifier for embedding

  -- Placement
  position TEXT NOT NULL DEFAULT 'after_hero', -- "after_hero", "before_venue", "custom", etc.
  display_order INTEGER DEFAULT 0,

  -- Settings
  auto_play BOOLEAN DEFAULT true,
  auto_play_interval INTEGER DEFAULT 5000, -- milliseconds
  show_navigation BOOLEAN DEFAULT true,
  show_dots BOOLEAN DEFAULT true,
  show_captions BOOLEAN DEFAULT true,

  -- Visibility
  is_visible BOOLEAN DEFAULT true,

  -- Section customization
  section_title TEXT,
  section_subtitle TEXT,
  section_background TEXT DEFAULT 'white', -- 'white', 'muted', 'navy', 'gradient'

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id, slug)
);

CREATE INDEX idx_event_photo_sliders_event_id ON event_photo_sliders(event_id);

-- ============================================================================
-- EVENT PHOTO SLIDER IMAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slider_id UUID NOT NULL REFERENCES event_photo_sliders(id) ON DELETE CASCADE,

  -- Image data
  image_url TEXT NOT NULL,
  thumbnail_url TEXT, -- optional smaller version
  alt_text TEXT,
  caption TEXT,

  -- Link (optional click through)
  link_url TEXT,
  link_target TEXT DEFAULT '_blank',

  -- Ordering
  display_order INTEGER DEFAULT 0,

  -- Visibility
  is_visible BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_slider_images_slider_id ON event_slider_images(slider_id);
CREATE INDEX idx_event_slider_images_display_order ON event_slider_images(display_order);

-- ============================================================================
-- EVENT SECTION PHOTOS
-- ============================================================================
-- Individual photos for specific sections (hero background, venue, etc.)

CREATE TABLE IF NOT EXISTS event_section_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Section identification
  section TEXT NOT NULL, -- 'hero', 'venue', 'value_props', etc.

  -- Image data
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,

  -- Image settings
  focal_point_x INTEGER DEFAULT 50, -- percentage for object-position
  focal_point_y INTEGER DEFAULT 50,
  overlay_opacity INTEGER DEFAULT 70, -- 0-100

  -- Ordering (for multiple images per section)
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false, -- primary image for the section

  -- Visibility
  is_visible BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_section_photos_event_id ON event_section_photos(event_id);
CREATE INDEX idx_event_section_photos_section ON event_section_photos(section);

-- ============================================================================
-- Update trigger for timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_event_photo_sliders_updated_at ON event_photo_sliders;
CREATE TRIGGER update_event_photo_sliders_updated_at
  BEFORE UPDATE ON event_photo_sliders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_slider_images_updated_at ON event_slider_images;
CREATE TRIGGER update_event_slider_images_updated_at
  BEFORE UPDATE ON event_slider_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_section_photos_updated_at ON event_section_photos;
CREATE TRIGGER update_event_section_photos_updated_at
  BEFORE UPDATE ON event_section_photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE event_photo_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_slider_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_section_photos ENABLE ROW LEVEL SECURITY;

-- Sliders policies
CREATE POLICY "Anyone can view visible sliders" ON event_photo_sliders
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can manage sliders" ON event_photo_sliders
  FOR ALL USING (auth.role() = 'authenticated');

-- Slider images policies
CREATE POLICY "Anyone can view visible slider images" ON event_slider_images
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can manage slider images" ON event_slider_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Section photos policies
CREATE POLICY "Anyone can view visible section photos" ON event_section_photos
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can manage section photos" ON event_section_photos
  FOR ALL USING (auth.role() = 'authenticated');
