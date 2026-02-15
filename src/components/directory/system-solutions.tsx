import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const CATEGORY_LABELS: Record<string, string> = {
  diagnostics_testing: "Diagnostics & Testing",
  energy_light_therapy: "Energy & Light Therapy",
  environment: "Environment",
  fitness: "Fitness",
  mind_neurotech: "Mind & Neurotech",
  recovery: "Recovery",
  sleep_technology: "Sleep Technology",
  supplements_compounds: "Supplements & Compounds",
  wearables_monitoring: "Wearables & Monitoring",
  longevity_clinics: "Longevity Clinics",
}

const EDGE_ORDER = ["eliminate", "decode", "gain", "execute"]

interface SystemDirectoryProps {
  /** The biological system name exactly as stored in DB, e.g. "Breath", "Energy Production" */
  system: string
  /** Display label for the heading, e.g. "Breath" or "Energy Production" */
  label: string
}

/**
 * Server component that fetches and displays consumer companies
 * supporting a specific biological system. Designed to be embedded
 * at the bottom of each system detail page.
 */
export async function SystemDirectory({ system, label }: SystemDirectoryProps) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("companies")
    .select("id, name, slug, domain, logo_url, category, edge_categories, access_levels")
    .contains("access_levels", ["consumer"])
    .contains("systems_supported", [system])
    .or("is_draft.is.null,is_draft.eq.false")

  if (!data || data.length === 0) return null

  // Sort: companies with logos first, then alphabetical
  const sorted = data.sort((a, b) => {
    const aHasLogo = a.logo_url ? 0 : 1
    const bHasLogo = b.logo_url ? 0 : 1
    if (aHasLogo !== bHasLogo) return aHasLogo - bHasLogo
    return a.name.localeCompare(b.name)
  })

  return (
    <div id="directory" className="scroll-mt-16 border-t border-border pt-10 mt-10">
      <h2 className="font-heading font-bold text-2xl text-navy mb-2">
        {label} Directory
      </h2>
      <p className="text-text-light mb-6">
        Consumer-accessible products and services that support this system.
      </p>

      <div className="divide-y divide-gray-200">
        {sorted.map((company) => {
          const categoryLabel = company.category
            ? CATEGORY_LABELS[company.category] || company.category
            : null
          const edgeLabel = company.edge_categories?.length
            ? EDGE_ORDER
                .filter((e) => (company.edge_categories as string[]).includes(e))
                .map((ec) => ec.charAt(0).toUpperCase() + ec.slice(1))
                .join(", ")
            : null

          return (
            <Link
              key={company.id}
              href={`/companies/${company.slug || company.domain || company.id}`}
              className="group flex items-center gap-4 px-2 py-3 transition-colors hover:bg-white rounded-lg"
            >
              {/* Logo */}
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg${company.logo_url ? " bg-white" : ""}`}>
                {company.logo_url && (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="max-h-8 max-w-[32px] object-contain"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Name + metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-body font-semibold text-navy transition-colors group-hover:text-electric-blue">
                    {company.name}
                  </span>
                  {categoryLabel && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="font-body text-sm text-text-light">
                        {categoryLabel}
                      </span>
                    </>
                  )}
                  {edgeLabel && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="font-body text-sm text-text-light">
                        {edgeLabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-6">
        <Link
          href={`/directory?system=${encodeURIComponent(system)}`}
          className="text-sm font-medium text-electric-blue hover:text-navy transition-colors"
        >
          View all in the directory →
        </Link>
      </div>
    </div>
  )
}
