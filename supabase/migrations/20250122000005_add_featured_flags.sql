-- Migration: Add is_featured flags to enable homepage featuring
-- These flags mark items to be displayed on the homepage

-- Add is_featured to articles
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN articles.is_featured IS 'Whether this article should be featured on the homepage';

-- Add is_featured to contacts (leaders)
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN contacts.is_featured IS 'Whether this contact/leader should be featured on the homepage';

-- Add is_featured to companies
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN companies.is_featured IS 'Whether this company should be featured on the homepage';

-- Add is_featured to presentations
ALTER TABLE presentations
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN presentations.is_featured IS 'Whether this presentation should be featured on the homepage';

-- Create indexes for faster homepage queries
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_contacts_featured ON contacts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_companies_featured ON companies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_presentations_featured ON presentations(is_featured) WHERE is_featured = true;
