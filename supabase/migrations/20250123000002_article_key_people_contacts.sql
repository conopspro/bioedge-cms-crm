-- Migration: Add key_people_contact_ids to articles table
-- This allows linking articles to existing contacts as key people

-- Add array of contact UUIDs for key people
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS key_people_contact_ids UUID[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN articles.key_people_contact_ids IS 'Array of contact IDs representing key people associated with this article';
