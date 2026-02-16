-- Add reference_email column to campaigns table
-- Stores a sample email used as a style/tone reference for the AI
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS reference_email text;
