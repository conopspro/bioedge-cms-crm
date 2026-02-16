-- ============================================
-- Clinic Directory Tables
-- ============================================
-- Stores 22K+ longevity clinic locations for:
-- 1. Public SEO directory (LocalBusiness JSON-LD)
-- 2. Campaign outreach to clinic contacts

-- ============================================
-- CLINICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  external_id TEXT UNIQUE, -- Original CSV ID for dedup

  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  metro_area TEXT,
  google_maps_url TEXT,
  google_place_id TEXT,

  -- Contact info
  phone TEXT,
  phone_formatted TEXT,
  email TEXT,  -- Internal only, never shown on public pages
  website TEXT,
  domain TEXT,

  -- Details
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  search_term TEXT,

  -- Ratings
  google_rating DECIMAL(2, 1),
  reviews_count INTEGER DEFAULT 0,

  -- Media
  photos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  custom_urls JSONB DEFAULT '[]', -- Array of {title, url}

  -- Social media
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  youtube TEXT,
  twitter TEXT,
  tiktok TEXT,
  threads TEXT,

  -- Flags
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_draft BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for public directory queries
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);
CREATE INDEX IF NOT EXISTS idx_clinics_state ON clinics(state);
CREATE INDEX IF NOT EXISTS idx_clinics_city ON clinics(city);
CREATE INDEX IF NOT EXISTS idx_clinics_country ON clinics(country);
CREATE INDEX IF NOT EXISTS idx_clinics_is_active ON clinics(is_active);
CREATE INDEX IF NOT EXISTS idx_clinics_google_rating ON clinics(google_rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_clinics_tags ON clinics USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_clinics_external_id ON clinics(external_id);
CREATE INDEX IF NOT EXISTS idx_clinics_lat_lng ON clinics(latitude, longitude);

-- Auto-update updated_at
CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CLINIC CONTACTS TABLE
-- ============================================
-- Up to 5 Hunter-discovered contacts per clinic
CREATE TABLE IF NOT EXISTS clinic_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,  -- Internal only, never shown on public pages
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinic_contacts_clinic_id ON clinic_contacts(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_contacts_email ON clinic_contacts(email);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_contacts ENABLE ROW LEVEL SECURITY;

-- Public can view active clinics (for directory pages)
CREATE POLICY "Anyone can view active clinics"
  ON clinics FOR SELECT
  USING (is_active = true AND is_draft = false);

-- Authenticated users get full access
CREATE POLICY "Authenticated users can do anything with clinics"
  ON clinics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clinic contacts: public can view (but frontend will NOT display emails)
CREATE POLICY "Anyone can view clinic contacts"
  ON clinic_contacts FOR SELECT
  USING (true);

-- Authenticated users get full access to clinic contacts
CREATE POLICY "Authenticated users can do anything with clinic contacts"
  ON clinic_contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
