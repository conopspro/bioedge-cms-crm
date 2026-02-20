-- Company Import Queue
--
-- Holds companies parsed from CSV during batch import.
-- Enrichment results (Perplexity + Hunter) are stored as JSONB on the row
-- until the user approves — no writes to companies/contacts until then.
--
-- Status flows:
--   enrich_status: pending → enriching → enriched | error
--   hunter_status:  pending → searching → found | not_found | error
--   status:         pending → approved | rejected

CREATE TABLE company_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Input data (from CSV upload)
  name TEXT NOT NULL,
  website TEXT,
  domain TEXT,  -- auto-extracted from website on insert

  -- Perplexity enrichment results (held in queue until approval)
  description TEXT,
  category TEXT,
  differentiators TEXT,
  evidence TEXT,
  systems_supported TEXT[],
  edge_categories TEXT[],
  access_levels TEXT[],
  has_affiliate BOOLEAN DEFAULT false,
  bioedge_fit TEXT,
  description_sources JSONB,
  -- [{name, title, email, linkedin_url}] from Perplexity key-people research
  discovered_contacts JSONB,

  -- Perplexity enrichment status
  enrich_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (enrich_status IN ('pending','enriching','enriched','error')),
  enrich_error TEXT,
  enriched_at TIMESTAMPTZ,

  -- Hunter.io contact discovery results (held in queue until approval)
  -- [{email, first_name, last_name, title, confidence, seniority, linkedin, phone}]
  hunter_contacts JSONB,

  -- Hunter status
  hunter_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (hunter_status IN ('pending','searching','found','not_found','error')),
  hunter_error TEXT,
  hunter_searched_at TIMESTAMPTZ,

  -- Duplicate detection — set if a matching company was found on import
  duplicate_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,

  -- Queue approval status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  imported_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  imported_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_company_queue_status        ON company_queue(status);
CREATE INDEX idx_company_queue_enrich_status ON company_queue(enrich_status);
CREATE INDEX idx_company_queue_hunter_status ON company_queue(hunter_status);
CREATE INDEX idx_company_queue_domain        ON company_queue(domain);
CREATE INDEX idx_company_queue_created_at    ON company_queue(created_at DESC);
