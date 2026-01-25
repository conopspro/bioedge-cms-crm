-- ============================================
-- BioEdge CMS/CRM - Extended Contact Fields
-- ============================================
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql
-- Adds additional fields for contact management and import matching

-- ============================================
-- ADD NEW COLUMNS TO CONTACTS TABLE
-- ============================================

-- Company name from CSV (for reference and matching)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company_name_raw TEXT;

-- Address fields
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS address1 TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS address2 TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS country TEXT;

-- Department
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS department TEXT;

-- Social media URLs
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

-- Display control flag
-- When true, this contact can appear on public article pages for their company
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS show_on_articles BOOLEAN NOT NULL DEFAULT FALSE;

-- Email domain (extracted from email for matching)
-- e.g., "acme.com" from "john@acme.com"
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email_domain TEXT;

-- ============================================
-- MAKE COMPANY_ID NULLABLE
-- ============================================
-- Allows contacts to be imported without immediate company assignment
-- They can be assigned later via the review interface

ALTER TABLE contacts ALTER COLUMN company_id DROP NOT NULL;

-- ============================================
-- ADD INDEX FOR UNASSIGNED CONTACTS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_contacts_unassigned
  ON contacts(company_id)
  WHERE company_id IS NULL;

-- Index for email domain matching
CREATE INDEX IF NOT EXISTS idx_contacts_email_domain
  ON contacts(email_domain);

-- Index for show_on_articles filtering
CREATE INDEX IF NOT EXISTS idx_contacts_show_on_articles
  ON contacts(show_on_articles)
  WHERE show_on_articles = TRUE;

-- ============================================
-- ADD DOMAIN TO COMPANIES TABLE
-- ============================================
-- Extracted domain for matching (e.g., "acme.com")

ALTER TABLE companies ADD COLUMN IF NOT EXISTS domain TEXT;

CREATE INDEX IF NOT EXISTS idx_companies_domain
  ON companies(domain);

-- ============================================
-- FUNCTION TO EXTRACT DOMAIN FROM EMAIL
-- ============================================

CREATE OR REPLACE FUNCTION extract_email_domain(email TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email IS NULL OR email = '' THEN
    RETURN NULL;
  END IF;
  -- Extract everything after @ symbol, lowercase
  RETURN LOWER(SPLIT_PART(email, '@', 2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCTION TO EXTRACT DOMAIN FROM URL
-- ============================================

CREATE OR REPLACE FUNCTION extract_url_domain(url TEXT)
RETURNS TEXT AS $$
DECLARE
  domain TEXT;
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN NULL;
  END IF;

  -- Remove protocol (http://, https://)
  domain := REGEXP_REPLACE(url, '^https?://', '', 'i');

  -- Remove www. prefix
  domain := REGEXP_REPLACE(domain, '^www\.', '', 'i');

  -- Remove path (everything after first /)
  domain := SPLIT_PART(domain, '/', 1);

  -- Remove port if present
  domain := SPLIT_PART(domain, ':', 1);

  RETURN LOWER(domain);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- TRIGGER TO AUTO-POPULATE EMAIL DOMAIN
-- ============================================

CREATE OR REPLACE FUNCTION set_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_domain := extract_email_domain(NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_email_domain ON contacts;
CREATE TRIGGER trigger_set_email_domain
  BEFORE INSERT OR UPDATE OF email ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_email_domain();

-- ============================================
-- TRIGGER TO AUTO-POPULATE COMPANY DOMAIN
-- ============================================

CREATE OR REPLACE FUNCTION set_company_domain()
RETURNS TRIGGER AS $$
BEGIN
  NEW.domain := extract_url_domain(NEW.website);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_company_domain ON companies;
CREATE TRIGGER trigger_set_company_domain
  BEFORE INSERT OR UPDATE OF website ON companies
  FOR EACH ROW
  EXECUTE FUNCTION set_company_domain();

-- ============================================
-- UPDATE EXISTING RECORDS
-- ============================================

-- Backfill email_domain for existing contacts
UPDATE contacts
SET email_domain = extract_email_domain(email)
WHERE email_domain IS NULL AND email IS NOT NULL;

-- Backfill domain for existing companies
UPDATE companies
SET domain = extract_url_domain(website)
WHERE domain IS NULL AND website IS NOT NULL;

-- ============================================
-- DONE!
-- ============================================
-- New fields added:
-- contacts: company_name_raw, address1, address2, city, state, zip, country,
--           department, instagram_url, twitter_url, tiktok_url,
--           show_on_articles, email_domain
-- companies: domain
--
-- company_id is now nullable (allows unassigned contacts)
-- Automatic domain extraction from emails and websites
