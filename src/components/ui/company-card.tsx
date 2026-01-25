import Link from "next/link"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Category labels for display
const categoryLabels: Record<string, string> = {
  supplements: "Supplements",
  diagnostics: "Diagnostics",
  therapeutics: "Therapeutics",
  devices: "Devices",
  digital_health: "Digital Health",
  fitness: "Fitness",
  nutrition: "Nutrition",
  wellness: "Wellness",
  research: "Research",
  biotech: "Biotech",
  pharma: "Pharma",
  other: "Other",
}

export interface CompanyCardProps {
  id: string
  name: string
  slug?: string | null
  logoUrl?: string | null
  category?: string | null
  description?: string | null
  website?: string | null
  href?: string
  className?: string
  variant?: "default" | "compact" | "horizontal"
  showCategory?: boolean
  showDescription?: boolean
  descriptionLength?: number
}

/**
 * CompanyCard - Consistent company display card
 *
 * Based on the published event page styling with:
 * - Logo display with Building2 fallback
 * - Company name and category tag
 * - Hover shadow effect
 */
export function CompanyCard({
  id,
  name,
  slug,
  logoUrl,
  category,
  description,
  href,
  className,
  variant = "default",
  showCategory = true,
  showDescription = true,
  descriptionLength = 140,
}: CompanyCardProps) {
  // Always link to public company page - prefer slug for clean URLs, fallback to id
  // The public companies page has fallback logic to handle slug, domain, and id
  const linkHref = href || (slug ? `/companies/${slug}` : `/companies/${id}`)
  const categoryLabel = category ? categoryLabels[category] || category : null

  // Truncate description to specified length
  const truncatedDescription = description && showDescription
    ? description.length > descriptionLength
      ? description.slice(0, descriptionLength).trim() + "..."
      : description
    : null

  if (variant === "compact") {
    // Compact variant: Just logo/name, good for sponsor grids
    return (
      <Link
        href={linkHref}
        className={cn(
          "be-card flex items-center justify-center p-3 hover:shadow-lg transition-shadow",
          className
        )}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="object-contain max-h-28 max-w-full"
          />
        ) : (
          <span className="font-heading font-medium text-xs text-center" style={{ color: "#0d2840" }}>
            {name}
          </span>
        )}
      </Link>
    )
  }

  if (variant === "horizontal") {
    // Horizontal variant: Logo on left, info on right
    return (
      <Link
        href={linkHref}
        className={cn(
          "be-card hover:shadow-lg transition-shadow flex items-center gap-4 group",
          className
        )}
        style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
      >
        {logoUrl ? (
          <div className="flex items-center justify-center w-40 h-32 flex-shrink-0">
            <img
              src={logoUrl}
              alt={name}
              className="object-contain max-h-32 max-w-40"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center bg-navy/5 rounded-lg w-40 h-32 flex-shrink-0">
            <Building2 className="h-16 w-16 text-navy/30" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className="font-heading font-semibold transition-colors truncate"
            style={{ color: "#0d2840" }}
          >
            {name}
          </h3>
          {showCategory && categoryLabel && (
            <span
              className="inline-block px-2 py-0.5 text-xs font-medium rounded-md mt-1"
              style={{ backgroundColor: "rgba(1, 122, 178, 0.1)", color: "#017ab2" }}
            >
              {categoryLabel}
            </span>
          )}
          {truncatedDescription && (
            <p className="text-sm text-text-dark mt-2 line-clamp-2">
              {truncatedDescription}
            </p>
          )}
        </div>
      </Link>
    )
  }

  // Default: Vertical layout with logo, name, category
  return (
    <Link
      href={linkHref}
      className={cn(
        "be-card hover:shadow-lg transition-shadow block",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {/* Logo */}
      {logoUrl ? (
        <div className="flex items-center justify-center mb-4 h-32">
          <img
            src={logoUrl}
            alt={name}
            className="object-contain max-h-32"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-navy/5 rounded-lg mb-4 h-32">
          <Building2 className="h-16 w-16 text-navy/30" />
        </div>
      )}

      {/* Company Name */}
      <h3
        className="font-heading font-semibold mb-2"
        style={{ color: "#0d2840" }}
      >
        {name}
      </h3>

      {/* Category Tag */}
      {showCategory && categoryLabel && (
        <span
          className="inline-block px-2 py-0.5 text-xs font-medium rounded-md"
          style={{ backgroundColor: "rgba(1, 122, 178, 0.1)", color: "#017ab2" }}
        >
          {categoryLabel}
        </span>
      )}

      {/* Description */}
      {truncatedDescription && (
        <p className="text-sm text-text-dark mt-2 line-clamp-3">
          {truncatedDescription}
        </p>
      )}
    </Link>
  )
}

/**
 * CompanyCardGrid - Consistent grid layout for company cards
 */
export function CompanyCardGrid({
  children,
  className,
  columns = "default",
}: {
  children: React.ReactNode
  className?: string
  columns?: "default" | "compact"
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === "compact"
          ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}
