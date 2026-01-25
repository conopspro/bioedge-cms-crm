-- Migration: Add address fields to contacts table
-- This allows storing full address information for contacts

-- Add address fields to contacts table
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS address1 TEXT,
ADD COLUMN IF NOT EXISTS address2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add comments for documentation
COMMENT ON COLUMN contacts.address1 IS 'Street address line 1';
COMMENT ON COLUMN contacts.address2 IS 'Street address line 2 (apt, suite, etc.)';
COMMENT ON COLUMN contacts.city IS 'City';
COMMENT ON COLUMN contacts.state IS 'State or province';
COMMENT ON COLUMN contacts.zip IS 'Postal/ZIP code';
COMMENT ON COLUMN contacts.country IS 'Country';
