-- Add is_draft column to companies table for draft/publish functionality
-- Draft companies won't appear on public pages

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT true;

-- Add comment to explain the column
COMMENT ON COLUMN companies.is_draft IS 'When true, company is a draft and will not appear on public pages. NULL is treated as true (draft) for backward compatibility.';

-- Create index for faster filtering on public pages
CREATE INDEX IF NOT EXISTS idx_companies_is_draft ON companies(is_draft);
