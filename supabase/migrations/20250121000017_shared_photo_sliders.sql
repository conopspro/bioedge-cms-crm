-- ============================================================================
-- SHARED PHOTO SLIDERS (Reusable across events)
-- ============================================================================
-- Similar to FAQ templates, sliders can now be created as shared templates
-- and linked to events

-- Create shared photo sliders table
CREATE TABLE IF NOT EXISTS shared_photo_sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Display settings
  auto_play BOOLEAN DEFAULT true,
  auto_play_interval INTEGER DEFAULT 5000,
  show_navigation BOOLEAN DEFAULT true,
  show_dots BOOLEAN DEFAULT true,
  show_captions BOOLEAN DEFAULT true,

  -- Styling
  section_title TEXT,
  section_subtitle TEXT,
  section_background TEXT DEFAULT 'white',

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shared_photo_sliders_slug ON shared_photo_sliders(slug);
CREATE INDEX idx_shared_photo_sliders_active ON shared_photo_sliders(is_active);

-- Create shared slider images table
CREATE TABLE IF NOT EXISTS shared_slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slider_id UUID NOT NULL REFERENCES shared_photo_sliders(id) ON DELETE CASCADE,

  -- Image data
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  link_url TEXT,

  -- Display
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shared_slider_images_slider ON shared_slider_images(slider_id);

-- Add column to event_photo_sliders to link to shared sliders
ALTER TABLE event_photo_sliders ADD COLUMN IF NOT EXISTS shared_slider_id UUID REFERENCES shared_photo_sliders(id) ON DELETE SET NULL;
ALTER TABLE event_photo_sliders ADD COLUMN IF NOT EXISTS is_from_shared BOOLEAN DEFAULT false;

-- ============================================================================
-- Update triggers
-- ============================================================================

DROP TRIGGER IF EXISTS update_shared_photo_sliders_updated_at ON shared_photo_sliders;
CREATE TRIGGER update_shared_photo_sliders_updated_at
  BEFORE UPDATE ON shared_photo_sliders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shared_slider_images_updated_at ON shared_slider_images;
CREATE TRIGGER update_shared_slider_images_updated_at
  BEFORE UPDATE ON shared_slider_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE shared_photo_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_slider_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shared sliders" ON shared_photo_sliders
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage shared sliders" ON shared_photo_sliders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view visible shared slider images" ON shared_slider_images
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can manage shared slider images" ON shared_slider_images
  FOR ALL USING (auth.role() = 'authenticated');
