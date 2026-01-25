-- ============================================
-- BioEdge CMS/CRM - Anon Read Access for Development
-- ============================================
-- Run this in your Supabase SQL Editor
-- Allows anonymous users to read data (for development/dashboard access)
-- In production, you may want to remove these or add proper auth checks

-- ============================================
-- DROP EXISTING POLICIES IF THEY EXIST
-- ============================================

-- Companies
DROP POLICY IF EXISTS "Allow anon read access" ON companies;
DROP POLICY IF EXISTS "Allow anon all access" ON companies;

-- Contacts
DROP POLICY IF EXISTS "Allow anon read access" ON contacts;
DROP POLICY IF EXISTS "Allow anon all access" ON contacts;

-- Articles
DROP POLICY IF EXISTS "Allow anon read access" ON articles;
DROP POLICY IF EXISTS "Allow anon all access" ON articles;

-- Company Leaders
DROP POLICY IF EXISTS "Allow anon read access" ON company_leaders;
DROP POLICY IF EXISTS "Allow anon all access" ON company_leaders;

-- Article Enhancements
DROP POLICY IF EXISTS "Allow anon read access" ON article_enhancements;
DROP POLICY IF EXISTS "Allow anon all access" ON article_enhancements;

-- Outreach Log
DROP POLICY IF EXISTS "Allow anon read access" ON outreach_log;
DROP POLICY IF EXISTS "Allow anon all access" ON outreach_log;

-- ============================================
-- ADD ANON ALL ACCESS POLICIES (DEVELOPMENT)
-- ============================================
-- These policies allow anonymous users full access for development
-- Replace with more restrictive policies in production

-- Companies
CREATE POLICY "Allow anon all access" ON companies
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Contacts
CREATE POLICY "Allow anon all access" ON contacts
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Articles
CREATE POLICY "Allow anon all access" ON articles
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Company Leaders
CREATE POLICY "Allow anon all access" ON company_leaders
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Article Enhancements
CREATE POLICY "Allow anon all access" ON article_enhancements
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Outreach Log
CREATE POLICY "Allow anon all access" ON outreach_log
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================
-- DONE!
-- ============================================
-- Anonymous users can now read and write all data
-- This is suitable for development but should be
-- replaced with proper auth in production
