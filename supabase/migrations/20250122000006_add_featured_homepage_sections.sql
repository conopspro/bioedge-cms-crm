-- Migration: Add default homepage sections for featured content
-- These sections allow displaying featured leaders, companies, presentations, and articles on the homepage

-- Insert Featured Leaders section (hidden by default)
INSERT INTO homepage_sections (section_key, section_type, is_visible, display_order, label, title, background, settings)
VALUES (
  'featured_leaders',
  'featured_leaders',
  false,
  10,
  'LEADERS',
  'Leaders',
  'muted',
  '{}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Insert Featured Companies section (hidden by default)
INSERT INTO homepage_sections (section_key, section_type, is_visible, display_order, label, title, background, settings)
VALUES (
  'featured_companies',
  'featured_companies',
  false,
  11,
  'COMPANIES',
  'Companies',
  'muted',
  '{}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Insert Featured Presentations section (hidden by default)
INSERT INTO homepage_sections (section_key, section_type, is_visible, display_order, label, title, background, settings)
VALUES (
  'featured_presentations',
  'featured_presentations',
  false,
  12,
  'PRESENTATIONS',
  'Presentations',
  'muted',
  '{}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Insert Featured Articles section (hidden by default)
INSERT INTO homepage_sections (section_key, section_type, is_visible, display_order, label, title, background, settings)
VALUES (
  'featured_articles',
  'featured_articles',
  false,
  13,
  'ARTICLES',
  'Articles',
  'muted',
  '{}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;
