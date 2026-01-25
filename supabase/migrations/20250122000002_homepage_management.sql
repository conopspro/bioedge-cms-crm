-- Homepage Management System
-- Provides full control over homepage content, layout, and design

-- Homepage Settings (singleton - only one row)
CREATE TABLE IF NOT EXISTS homepage_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  page_title text DEFAULT 'bioEDGE Longevity Summit | National Tour 2026',
  meta_description text DEFAULT 'A transformational live experience bringing the EDGE Framework to cities across America.',
  og_image_url text,

  -- Hero Section
  hero_label text DEFAULT 'NATIONAL TOUR 2026',
  hero_title text DEFAULT 'bioEDGE Longevity Summit',
  hero_subtitle text DEFAULT 'Where Biohacking Starts with NO',
  hero_description text,
  hero_video_url text,
  hero_image_url text,
  hero_cta_text text DEFAULT 'Get Notified',
  hero_cta_url text,
  hero_secondary_cta_text text DEFAULT 'Get the Book',
  hero_secondary_cta_url text,

  -- Global Design Settings
  section_colors jsonb DEFAULT '{}',

  -- Section Order (array of section keys)
  section_order text[] DEFAULT ARRAY[
    'hero',
    'events',
    'edge_framework',
    'photo_slider',
    'video',
    'custom_html',
    'final_cta'
  ],

  -- Status
  is_published boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Homepage Sections (flexible sections that can be reordered)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Section Identity
  section_key text NOT NULL UNIQUE, -- 'events', 'edge_framework', 'photo_slider', 'video', 'custom_html', 'final_cta'
  section_type text NOT NULL, -- 'events', 'edge_framework', 'slider', 'video', 'html', 'cta'

  -- Visibility & Order
  is_visible boolean DEFAULT true,
  display_order integer DEFAULT 0,

  -- Content
  label text, -- The small text in rounded box (e.g., "UPCOMING EVENTS")
  title text, -- Main heading
  subtitle text, -- Secondary text
  description text,

  -- Design
  background text DEFAULT 'white', -- 'white', 'muted', 'navy', 'gradient'

  -- Section-Specific Settings (JSON for flexibility)
  settings jsonb DEFAULT '{}',
  -- For events: { columns: 1|2|3, show_coming_soon: true }
  -- For slider: { slider_id: "uuid", card_width: 400, card_height: 300, show_captions: true }
  -- For video: { video_url: "...", autoplay: false }
  -- For html: { html_content: "..." }
  -- For cta: { button_text: "...", button_url: "..." }

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Homepage Featured Events (links events to homepage with explicit ordering)
CREATE TABLE IF NOT EXISTS homepage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,

  -- Override event details for homepage display (optional)
  custom_title text,
  custom_tagline text,
  custom_image_url text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(event_id) -- Each event can only be featured once
);

-- Insert default homepage settings
INSERT INTO homepage_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Insert default sections
INSERT INTO homepage_sections (section_key, section_type, display_order, label, title, is_visible, settings) VALUES
  ('events', 'events', 1, 'UPCOMING EVENTS', 'Join Us at a Summit', true, '{"columns": 1, "show_coming_soon": true}'),
  ('edge_framework', 'edge_framework', 2, 'THE EDGE FRAMEWORK', 'ORDER MATTERS', true, '{}'),
  ('photo_slider', 'slider', 3, 'EVENT HIGHLIGHTS', 'Experience the Summit', false, '{"slider_id": null, "card_width": 400, "card_height": 300}'),
  ('video', 'video', 4, 'WATCH', 'See the Experience', false, '{"video_url": null}'),
  ('custom_html', 'html', 5, null, null, false, '{"html_content": ""}'),
  ('final_cta', 'cta', 6, null, 'Ready to Transform Your Health?', false, '{"button_text": "Get Notified", "button_url": "#"}')
ON CONFLICT (section_key) DO NOTHING;

-- RLS Policies
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_events ENABLE ROW LEVEL SECURITY;

-- Public read access for published homepage
CREATE POLICY "Public can view homepage settings" ON homepage_settings
  FOR SELECT USING (true);

CREATE POLICY "Public can view visible sections" ON homepage_sections
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can view visible homepage events" ON homepage_events
  FOR SELECT USING (is_visible = true);

-- Authenticated users can manage everything
CREATE POLICY "Authenticated users can manage homepage settings" ON homepage_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage homepage sections" ON homepage_sections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage homepage events" ON homepage_events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON homepage_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_events_order ON homepage_events(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_events_event_id ON homepage_events(event_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_homepage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER homepage_settings_updated_at
  BEFORE UPDATE ON homepage_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_updated_at();

CREATE TRIGGER homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_updated_at();

CREATE TRIGGER homepage_events_updated_at
  BEFORE UPDATE ON homepage_events
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_updated_at();
