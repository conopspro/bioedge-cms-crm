-- Migration: Add featured spotlight homepage section
-- This section allows displaying featured spotlight content on the homepage

INSERT INTO homepage_sections (section_key, section_type, is_visible, display_order, label, title, background, settings)
VALUES (
  'featured_spotlight',
  'featured_spotlight',
  false,
  14,
  'EDUCATION SPOTLIGHT',
  'Education Spotlight',
  'muted',
  '{}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;
