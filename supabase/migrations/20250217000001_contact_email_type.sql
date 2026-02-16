-- Add email_type column to contacts table
-- Values: 'personal', 'catch_all', or NULL (unknown/not checked)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email_type text;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_contacts_email_type ON contacts(email_type);
