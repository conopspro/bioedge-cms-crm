-- Create company_categories table
CREATE TABLE IF NOT EXISTS company_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on slug for lookups
CREATE INDEX IF NOT EXISTS idx_company_categories_slug ON company_categories(slug);

-- Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_company_categories_order ON company_categories(display_order);

-- Insert default categories
INSERT INTO company_categories (name, slug, description, display_order) VALUES
  ('Diagnostics & Testing', 'diagnostics_testing', 'Kits and services that decode your biology. At-home lab tests, biological age tests, microbiome analysis, genetic testing, and advanced imaging.', 1),
  ('Energy & Light Therapy', 'energy_light_therapy', 'Devices that deliver heat, cold, or light to drive adaptation. Saunas, cold plunges, red light panels, blue light blockers, and circadian lighting.', 2),
  ('Environment', 'environment', 'Products that reduce interference from your surroundings. Air purifiers, water filters, EMF meters, grounding mats, and non-toxic home solutions.', 3),
  ('Fitness', 'fitness', 'Equipment that supports physical training and performance. Vibration plates, resistance tools, strength equipment, and movement trackers.', 4),
  ('Mind & Neurotech', 'mind_neurotech', 'Tools that train and enhance brain function. Neurofeedback headsets, meditation devices, breathwork trainers, focus tools, and sensory deprivation tanks.', 5),
  ('Recovery', 'recovery', 'Devices that accelerate repair and reduce pain. Massage guns, compression boots, PEMF mats, TENS/EMS units, foam rollers, and inversion tables.', 6),
  ('Sleep Technology', 'sleep_technology', 'Devices designed to optimize your most critical recovery window. Smart mattresses, sleep trackers, cooling systems, white noise machines, and blackout solutions.', 7),
  ('Supplements & Compounds', 'supplements_compounds', 'What you put in your body to support biological function. Vitamins, minerals, nootropics, peptides, functional foods, hydration, and IV therapies.', 8),
  ('Wearables & Monitoring', 'wearables_monitoring', 'Devices that track what''s happening inside you. Fitness trackers, CGMs, HRV monitors, smart rings, smart scales, and pulse oximeters.', 9)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Enable RLS
ALTER TABLE company_categories ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (categories are public info)
CREATE POLICY "Anyone can view company categories"
  ON company_categories FOR SELECT
  USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Authenticated users can insert company categories"
  ON company_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update company categories"
  ON company_categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete company categories"
  ON company_categories FOR DELETE
  TO authenticated
  USING (true);
