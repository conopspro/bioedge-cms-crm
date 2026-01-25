-- ============================================
-- BioEdge CMS/CRM - Contact Enhancements Table
-- ============================================
-- Stores YouTube videos, papers, and books for leaders
-- Same structure as article_enhancements but for contacts

CREATE TABLE IF NOT EXISTS contact_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'scholar', 'book', 'image', 'link')),
  title TEXT,
  url TEXT,
  embed_code TEXT,
  metadata JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_enhancements_contact_id ON contact_enhancements(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_enhancements_type ON contact_enhancements(type);

-- RLS
ALTER TABLE contact_enhancements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all for authenticated users" ON contact_enhancements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon read access" ON contact_enhancements
  FOR SELECT TO anon USING (true);

-- ============================================
-- DONE!
-- ============================================
-- Run this in Supabase SQL Editor to create the contact_enhancements table
