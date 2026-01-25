-- ============================================
-- BioEdge CMS/CRM - AI Enhancement System
-- ============================================
-- Run this in your Supabase SQL Editor after 003_company_events_and_research.sql
-- Creates tables for tracking AI enhancements across articles, contacts, and companies

-- ============================================
-- ENHANCEMENT TYPES ENUM
-- ============================================

DO $$ BEGIN
  CREATE TYPE enhancement_type AS ENUM ('youtube', 'scholar', 'book', 'image', 'link');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ARTICLE ENHANCEMENTS TABLE
-- ============================================
-- Stores enhancements added to articles (videos, references, books, etc.)

CREATE TABLE IF NOT EXISTS article_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  type enhancement_type NOT NULL,
  title TEXT,
  url TEXT,
  embed_code TEXT,
  metadata JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_article_enhancements_article_id
  ON article_enhancements(article_id);
CREATE INDEX IF NOT EXISTS idx_article_enhancements_type
  ON article_enhancements(type);

-- ============================================
-- ENHANCEMENT LOGS TABLE
-- ============================================
-- Tracks all enhancement operations across all entity types

CREATE TABLE IF NOT EXISTS enhancement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Entity reference (one of these will be set)
  entity_type TEXT NOT NULL CHECK (entity_type IN ('article', 'contact', 'company')),
  entity_id UUID NOT NULL,
  -- Enhancement details
  enhancement_source TEXT NOT NULL, -- 'hunter', 'anthropic', 'openai', 'manual', etc.
  enhancement_type TEXT NOT NULL, -- 'contact_enrichment', 'company_enrichment', 'article_content', 'article_media', etc.
  -- Request/response data
  request_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',
  -- Fields that were updated
  fields_updated TEXT[] DEFAULT '{}',
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  -- Metadata
  credits_used INTEGER DEFAULT 0, -- For tracking API usage
  duration_ms INTEGER, -- How long the enhancement took
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for querying enhancement history
CREATE INDEX IF NOT EXISTS idx_enhancement_logs_entity
  ON enhancement_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_enhancement_logs_source
  ON enhancement_logs(enhancement_source);
CREATE INDEX IF NOT EXISTS idx_enhancement_logs_status
  ON enhancement_logs(status);
CREATE INDEX IF NOT EXISTS idx_enhancement_logs_created
  ON enhancement_logs(created_at DESC);

-- ============================================
-- ADD HUNTER.IO ENRICHMENT FIELDS TO CONTACTS
-- ============================================

-- Hunter.io confidence score
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS hunter_confidence INTEGER;

-- Hunter.io data freshness
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS hunter_verified_at TIMESTAMPTZ;

-- Full name (sometimes Hunter provides full name separately)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Position seniority (c-level, executive, senior, etc.)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS seniority TEXT;

-- ============================================
-- ADD HUNTER.IO ENRICHMENT FIELDS TO COMPANIES
-- ============================================

-- Number of employees (from Hunter)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employee_count INTEGER;

-- Industry (from Hunter)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry TEXT;

-- Company type (private, public, nonprofit, etc.)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_type TEXT;

-- Founded year
ALTER TABLE companies ADD COLUMN IF NOT EXISTS founded_year INTEGER;

-- Technologies used (from Hunter)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';

-- Social profiles
ALTER TABLE companies ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Hunter.io enrichment timestamp
ALTER TABLE companies ADD COLUMN IF NOT EXISTS hunter_enriched_at TIMESTAMPTZ;

-- ============================================
-- ADD AI ENHANCEMENT FIELDS TO COMPANIES
-- ============================================

-- AI-generated company summary
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- AI-generated talking points for outreach
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ai_talking_points TEXT[];

-- AI enhancement timestamp
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ai_enhanced_at TIMESTAMPTZ;

-- ============================================
-- ADD AI ENHANCEMENT FIELDS TO CONTACTS
-- ============================================

-- AI-generated contact summary/bio
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- AI-generated personalized outreach suggestions
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ai_outreach_suggestions TEXT;

-- AI enhancement timestamp
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ai_enhanced_at TIMESTAMPTZ;

-- ============================================
-- FUNCTION: Get enhancement stats
-- ============================================

CREATE OR REPLACE FUNCTION get_enhancement_stats()
RETURNS TABLE (
  entity_type TEXT,
  total_enhancements BIGINT,
  completed_enhancements BIGINT,
  failed_enhancements BIGINT,
  total_credits_used BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    el.entity_type,
    COUNT(*) as total_enhancements,
    COUNT(*) FILTER (WHERE el.status = 'completed') as completed_enhancements,
    COUNT(*) FILTER (WHERE el.status = 'failed') as failed_enhancements,
    COALESCE(SUM(el.credits_used), 0) as total_credits_used
  FROM enhancement_logs el
  GROUP BY el.entity_type;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DONE!
-- ============================================
-- New tables:
-- - article_enhancements: YouTube videos, Scholar refs, books, etc. for articles
-- - enhancement_logs: Track all enhancement operations
--
-- New fields on contacts:
-- - hunter_confidence, hunter_verified_at, full_name, seniority
-- - ai_summary, ai_outreach_suggestions, ai_enhanced_at
--
-- New fields on companies:
-- - employee_count, industry, company_type, founded_year, technologies
-- - linkedin_url, twitter_url, facebook_url, instagram_url
-- - hunter_enriched_at, ai_summary, ai_talking_points, ai_enhanced_at
