-- Add new outreach type values: text, phone, meeting
-- The original enum had: email, linkedin, call, other
-- The UI was already using 'phone' and 'meeting' (mismatch with DB 'call'/'other')
-- This migration adds the missing values so both old and new entries work correctly

ALTER TYPE outreach_type ADD VALUE IF NOT EXISTS 'text';
ALTER TYPE outreach_type ADD VALUE IF NOT EXISTS 'phone';
ALTER TYPE outreach_type ADD VALUE IF NOT EXISTS 'meeting';
