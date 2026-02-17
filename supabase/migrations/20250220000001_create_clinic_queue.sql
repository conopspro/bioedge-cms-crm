-- Clinic discovery queue: holds Google Places results for review before importing
CREATE TABLE IF NOT EXISTS clinic_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Google Places data (mirrors key clinic fields)
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  google_place_id TEXT NOT NULL UNIQUE,
  google_maps_url TEXT,
  phone TEXT,
  phone_formatted TEXT,
  website TEXT,
  domain TEXT,
  description TEXT,
  google_rating DECIMAL(2, 1),
  reviews_count INTEGER DEFAULT 0,
  photos TEXT[] DEFAULT '{}',

  -- Search context
  search_tag TEXT NOT NULL,
  search_location TEXT NOT NULL,
  search_query TEXT,

  -- Perplexity email lookup
  email TEXT,
  perplexity_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (perplexity_status IN ('pending', 'searching', 'found', 'not_found', 'error')),
  perplexity_searched_at TIMESTAMPTZ,

  -- Queue status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'imported')),
  imported_clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
  imported_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clinic_queue_status ON clinic_queue(status);
CREATE INDEX IF NOT EXISTS idx_clinic_queue_google_place_id ON clinic_queue(google_place_id);
CREATE INDEX IF NOT EXISTS idx_clinic_queue_search_tag ON clinic_queue(search_tag);
CREATE INDEX IF NOT EXISTS idx_clinic_queue_perplexity_status ON clinic_queue(perplexity_status);

-- Auto-update updated_at (reuses existing trigger function from clinics migration)
CREATE TRIGGER update_clinic_queue_updated_at
  BEFORE UPDATE ON clinic_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: dashboard-only table, authenticated users can do everything
ALTER TABLE clinic_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage clinic_queue"
  ON clinic_queue FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
