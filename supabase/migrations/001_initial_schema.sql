-- ============================================
-- BioEdge CMS/CRM Initial Database Schema
-- ============================================
-- Run this in your Supabase SQL Editor to create all tables
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor

-- ============================================
-- ENUM TYPES
-- ============================================

-- Function Health package tiers
CREATE TYPE function_health_tier AS ENUM (
  'essentials',
  'comprehensive',
  'total'
);

-- Company pipeline status
CREATE TYPE company_status AS ENUM (
  'researching',
  'article_draft',
  'published',
  'outreach',
  'engaged'
);

-- Contact outreach status
CREATE TYPE outreach_status AS ENUM (
  'not_contacted',
  'contacted',
  'responded',
  'converted'
);

-- Article publication status
CREATE TYPE article_status AS ENUM (
  'draft',
  'review',
  'published'
);

-- Article enhancement types
CREATE TYPE enhancement_type AS ENUM (
  'youtube',
  'scholar',
  'book',
  'image',
  'link'
);

-- Outreach method types
CREATE TYPE outreach_type AS ENUM (
  'email',
  'linkedin',
  'call',
  'other'
);

-- ============================================
-- TABLES
-- ============================================

-- Companies table - Core entity
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  analysis TEXT,
  function_health_tier function_health_tier,
  status company_status NOT NULL DEFAULT 'researching',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contacts table - People at companies
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  linkedin_url TEXT,
  source TEXT,
  outreach_status outreach_status NOT NULL DEFAULT 'not_contacted',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Articles table - Content pieces
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  status article_status NOT NULL DEFAULT 'draft',
  ai_enhanced BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Company Leaders table - Key people at each company
CREATE TABLE company_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  linkedin_url TEXT,
  image_url TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Article Enhancements table - YouTube, Scholar refs, etc.
CREATE TABLE article_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  type enhancement_type NOT NULL,
  title TEXT,
  url TEXT,
  embed_code TEXT,
  metadata JSONB,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Outreach Log table - Track contact attempts
CREATE TABLE outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type outreach_type NOT NULL,
  notes TEXT,
  response_received BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES for better query performance
-- ============================================

-- Companies
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_name ON companies(name);

-- Contacts
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_outreach_status ON contacts(outreach_status);

-- Articles
CREATE INDEX idx_articles_company_id ON articles(company_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);

-- Company Leaders
CREATE INDEX idx_company_leaders_company_id ON company_leaders(company_id);

-- Article Enhancements
CREATE INDEX idx_article_enhancements_article_id ON article_enhancements(article_id);
CREATE INDEX idx_article_enhancements_type ON article_enhancements(type);

-- Outreach Log
CREATE INDEX idx_outreach_log_contact_id ON outreach_log(contact_id);
CREATE INDEX idx_outreach_log_date ON outreach_log(date);

-- ============================================
-- TRIGGERS for updated_at timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to companies
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to contacts
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to articles
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables (required for Supabase)
-- Policies will be added when authentication is set up

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_enhancements ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEMPORARY: Allow all operations for authenticated users
-- Replace these with more specific policies later
-- ============================================

-- Companies policies
CREATE POLICY "Allow all for authenticated users" ON companies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contacts policies
CREATE POLICY "Allow all for authenticated users" ON contacts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Articles policies
CREATE POLICY "Allow all for authenticated users" ON articles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Company Leaders policies
CREATE POLICY "Allow all for authenticated users" ON company_leaders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Article Enhancements policies
CREATE POLICY "Allow all for authenticated users" ON article_enhancements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Outreach Log policies
CREATE POLICY "Allow all for authenticated users" ON outreach_log
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- DONE!
-- ============================================
-- After running this, you'll have:
-- - 6 tables with proper relationships
-- - Enum types for status fields
-- - Indexes for common queries
-- - Auto-updating timestamps
-- - Basic RLS policies for authenticated users
