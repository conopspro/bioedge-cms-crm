-- ============================================================================
-- NAVIGATION: Add parent_id for dropdown menu support
-- ============================================================================
-- Enables nested navigation: top-level items with parent_id = NULL are shown
-- in the header bar, items with a parent_id are rendered as dropdown children.

ALTER TABLE navigation_items
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_id ON navigation_items(parent_id);

-- ============================================================================
-- Restructure main_header into dropdown groups
-- ============================================================================

-- 1. Create parent group items (href='#' means it's a dropdown trigger, not a link)
INSERT INTO navigation_items (location, label, href, is_external, display_order, is_visible, parent_id)
VALUES
  ('main_header', 'Longevity News', '#', false, 1, true, NULL),
  ('main_header', 'Longevity Directories', '#', false, 2, true, NULL),
  ('main_header', 'Longevity Tools', '#', false, 3, true, NULL);

-- 2. Move existing items under their parent groups

-- Articles, Presentations → Longevity News
UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity News' AND parent_id IS NULL LIMIT 1),
    display_order = 1
WHERE location = 'main_header' AND label = 'Articles' AND parent_id IS NULL;

UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity News' AND parent_id IS NULL LIMIT 1),
    display_order = 2
WHERE location = 'main_header' AND label = 'Presentations' AND parent_id IS NULL;

-- News (external) → Longevity News
UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity News' AND parent_id IS NULL LIMIT 1),
    display_order = 4
WHERE location = 'main_header' AND label = 'News' AND parent_id IS NULL;

-- Companies, Leaders → Longevity Directories
UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity Directories' AND parent_id IS NULL LIMIT 1),
    display_order = 1
WHERE location = 'main_header' AND label = 'Companies' AND parent_id IS NULL;

UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity Directories' AND parent_id IS NULL LIMIT 1),
    display_order = 2
WHERE location = 'main_header' AND label = 'Leaders' AND parent_id IS NULL;

-- Coach, Decoder → Longevity Tools
UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity Tools' AND parent_id IS NULL LIMIT 1),
    display_order = 1
WHERE location = 'main_header' AND label = 'Coach' AND parent_id IS NULL;

UPDATE navigation_items
SET parent_id = (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity Tools' AND parent_id IS NULL LIMIT 1),
    display_order = 2
WHERE location = 'main_header' AND label = 'Decoder' AND parent_id IS NULL;

-- 3. Rename Systems → Biological Systems (stays top-level, direct link)
UPDATE navigation_items
SET label = 'Biological Systems', display_order = 4
WHERE location = 'main_header' AND label = 'Systems' AND parent_id IS NULL;

-- 4. Add items that weren't in the original seed

-- Spotlight → under Longevity News
INSERT INTO navigation_items (location, label, href, is_external, display_order, is_visible, parent_id)
VALUES (
  'main_header', 'Spotlight', '/spotlight', false, 3, true,
  (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity News' AND parent_id IS NULL LIMIT 1)
);

-- Clinics → under Longevity Directories
INSERT INTO navigation_items (location, label, href, is_external, display_order, is_visible, parent_id)
VALUES (
  'main_header', 'Clinics', '/clinics', false, 3, true,
  (SELECT id FROM navigation_items WHERE location = 'main_header' AND label = 'Longevity Directories' AND parent_id IS NULL LIMIT 1)
);
