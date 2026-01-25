-- ============================================
-- BioEdge CMS/CRM - Contact Slugs
-- ============================================
-- Adds slug field for SEO-friendly URLs on leader profile pages

-- Add slug column
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_slug_unique
ON contacts(slug) WHERE slug IS NOT NULL;

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_contact_slug(first_name TEXT, last_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from name
  base_slug := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')),
        '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove special chars
      ),
      '\s+', '-', 'g'  -- Replace spaces with dashes
    )
  );

  -- Remove leading/trailing dashes
  base_slug := TRIM(BOTH '-' FROM base_slug);

  -- If empty, use 'contact'
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'contact';
  END IF;

  final_slug := base_slug;

  -- Check for duplicates and add number if needed
  WHILE EXISTS (SELECT 1 FROM contacts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Populate slugs for existing contacts that are leaders (show_on_articles = true)
UPDATE contacts
SET slug = generate_contact_slug(first_name, last_name)
WHERE show_on_articles = true AND slug IS NULL;

-- Trigger to auto-generate slug when contact becomes a leader
CREATE OR REPLACE FUNCTION auto_generate_contact_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug when show_on_articles is set to true and slug is null
  IF NEW.show_on_articles = true AND (NEW.slug IS NULL OR NEW.slug = '') THEN
    NEW.slug := generate_contact_slug(NEW.first_name, NEW.last_name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contact_slug_trigger ON contacts;
CREATE TRIGGER contact_slug_trigger
BEFORE INSERT OR UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION auto_generate_contact_slug();

-- ============================================
-- DONE!
-- ============================================
-- Run this migration in Supabase SQL Editor
-- This will:
-- 1. Add slug column to contacts
-- 2. Auto-generate slugs for existing leaders
-- 3. Auto-generate slugs when contacts become leaders
