-- Add slug field to companies table for URL-friendly company names
-- This replaces the domain-based URL pattern with company-name-based slugs

-- Add slug column if it doesn't exist
ALTER TABLE companies ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Create a function to generate slugs from company names
CREATE OR REPLACE FUNCTION generate_company_slug(company_name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          trim(company_name),
          '[^\w\s-]', '', 'g'  -- Remove special characters
        ),
        '\s+', '-', 'g'  -- Replace spaces with hyphens
      ),
      '-+', '-', 'g'  -- Collapse multiple hyphens
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Update existing companies with slugs generated from their names
UPDATE companies
SET slug = generate_company_slug(name)
WHERE slug IS NULL AND name IS NOT NULL;

-- Add a unique constraint on slug (after populating to avoid conflicts)
-- Note: This may fail if there are duplicate company names - handle manually if needed
-- ALTER TABLE companies ADD CONSTRAINT companies_slug_unique UNIQUE (slug);
