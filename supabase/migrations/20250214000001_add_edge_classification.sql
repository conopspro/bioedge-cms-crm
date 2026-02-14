-- Add EDGE Framework classification fields to companies
-- EDGE = Eliminate, Decode, Gain, Execute

-- EDGE categories (array — companies can serve multiple roles)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS edge_categories TEXT[] DEFAULT '{}';

-- Access levels (array — e.g. Thorne is both consumer AND practitioner)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS access_levels TEXT[] DEFAULT '{}';

-- Affiliate program flag
ALTER TABLE companies ADD COLUMN IF NOT EXISTS has_affiliate BOOLEAN DEFAULT false;

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_companies_edge_categories ON companies USING GIN(edge_categories);
CREATE INDEX IF NOT EXISTS idx_companies_access_levels ON companies USING GIN(access_levels);

-- Add "Longevity Clinics" company category
INSERT INTO company_categories (name, slug, description, display_order)
VALUES (
  'Longevity Clinics',
  'longevity_clinics',
  'Longevity clinics, regenerative medicine clinics, and hormone therapy networks',
  10
)
ON CONFLICT (slug) DO NOTHING;

-- Grant anon read access to new columns (matches existing RLS policies)
-- The existing SELECT policy on companies already covers all columns
