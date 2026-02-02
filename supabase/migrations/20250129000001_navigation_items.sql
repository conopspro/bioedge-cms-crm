-- ============================================================================
-- NAVIGATION ITEMS
-- ============================================================================
-- Database-driven navigation for headers and footers on main site and event pages

CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Where this item appears
  location TEXT NOT NULL CHECK (location IN ('main_header', 'main_footer', 'event_header', 'event_footer')),

  -- Content
  label TEXT NOT NULL,
  href TEXT NOT NULL,

  -- Behavior
  is_external BOOLEAN DEFAULT false,

  -- Ordering & visibility
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,

  -- Event-specific (null = main site)
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_navigation_items_location ON navigation_items(location);
CREATE INDEX idx_navigation_items_event_id ON navigation_items(event_id);

-- Update trigger
DROP TRIGGER IF EXISTS update_navigation_items_updated_at ON navigation_items;
CREATE TRIGGER update_navigation_items_updated_at
  BEFORE UPDATE ON navigation_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible navigation items" ON navigation_items
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can manage navigation items" ON navigation_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- Seed default main header items (from current hardcoded values)
-- ============================================================================

INSERT INTO navigation_items (location, label, href, is_external, display_order) VALUES
  ('main_header', 'Articles', '/articles', false, 1),
  ('main_header', 'Companies', '/companies', false, 2),
  ('main_header', 'Leaders', '/leaders', false, 3),
  ('main_header', 'Presentations', '/presentations', false, 4),
  ('main_header', 'Coach', 'https://bioedge.circle.so/', true, 5),
  ('main_header', 'Decoder', 'https://www.bioedgedecoder.com/', true, 6),
  ('main_header', 'Systems', '/systems', false, 7),
  ('main_header', 'News', 'https://longevitynewswire.com/', true, 8);

-- Seed default main footer items
INSERT INTO navigation_items (location, label, href, is_external, display_order) VALUES
  ('main_footer', 'Articles', '/articles', false, 1),
  ('main_footer', 'Presentations', '/presentations', false, 2),
  ('main_footer', 'Companies', '/companies', false, 3),
  ('main_footer', 'Leaders', '/leaders', false, 4);
