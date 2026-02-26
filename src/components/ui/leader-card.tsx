import Link from "next/link"
import { cn } from "@/lib/utils"

export interface LeaderCardProps {
  id: string
  firstName: string
  lastName: string
  title?: string | null
  companyName?: string | null
  companySlug?: string | null
  avatarUrl?: string | null
  slug?: string | null
  href?: string
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "horizontal"
  showCompanyLink?: boolean
}

/**
 * LeaderCard - Consistent leader/contact display card
 *
 * Based on the published event page styling with:
 * - Centered layout with avatar, name, title, company
 * - Gradient avatar fallback with initials
 * - Blue ring around avatar
 * - Hover shadow effect
 */
export function LeaderCard({
  id,
  firstName,
  lastName,
  title,
  companyName,
  companySlug,
  avatarUrl,
  slug,
  href,
  className,
  size = "md",
  variant = "default",
  showCompanyLink = false,
}: LeaderCardProps) {
  const name = `${firstName} ${lastName}`
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
  // Always link to public leader page - prefer slug for clean URLs, fallback to id
  // The public leaders page has fallback logic to handle both
  const linkHref = href || (slug ? `/leaders/${slug}` : `/leaders/${id}`)

  const avatarSizes = {
    sm: "w-14 h-14 text-base",
    md: "w-20 h-20 text-xl",
    lg: "w-24 h-24 text-2xl",
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={linkHref}
        className={cn(
          "be-card hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)] transition-shadow flex items-start gap-4 group",
          className
        )}
        style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className={cn(
              "rounded-full object-cover flex-shrink-0",
              size === "sm" ? "w-12 h-12" : size === "lg" ? "w-16 h-16" : "w-14 h-14"
            )}
            style={{ boxShadow: "0 0 0 3px rgba(1, 122, 178, 0.2)" }}
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              "rounded-full be-avatar-gradient flex items-center justify-center text-white font-heading font-bold flex-shrink-0",
              size === "sm" ? "w-12 h-12 text-sm" : size === "lg" ? "w-16 h-16 text-xl" : "w-14 h-14 text-base"
            )}
            style={{ boxShadow: "0 0 0 3px rgba(1, 122, 178, 0.2)" }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className="font-heading font-semibold transition-colors truncate"
            style={{ color: "#0d2840" }}
          >
            {name}
          </h3>
          {title && (
            <p className="text-sm mt-0.5 truncate" style={{ color: "#0d2840" }}>
              {title}
            </p>
          )}
          {companyName && (
            showCompanyLink && companySlug ? (
              <Link
                href={`/companies/${companySlug}`}
                className="text-xs font-medium mt-1 block truncate hover:underline"
                style={{ color: "#017ab2" }}
                onClick={(e) => e.stopPropagation()}
              >
                {companyName}
              </Link>
            ) : (
              <p className="text-xs font-medium mt-1 truncate" style={{ color: "#017ab2" }}>
                {companyName}
              </p>
            )
          )}
        </div>
      </Link>
    )
  }

  // Default: Centered vertical layout
  return (
    <Link
      href={linkHref}
      className={cn(
        "be-card hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)] transition-shadow text-center group block",
        className
      )}
      style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={cn("rounded-full object-cover mx-auto mb-3", avatarSizes[size])}
          style={{ boxShadow: "0 0 0 4px rgba(1, 122, 178, 0.2)" }}
          loading="lazy"
        />
      ) : (
        <div
          className={cn(
            "rounded-full mx-auto mb-3 be-avatar-gradient flex items-center justify-center text-white font-heading font-bold",
            avatarSizes[size]
          )}
          style={{ boxShadow: "0 0 0 4px rgba(1, 122, 178, 0.2)" }}
        >
          {initials}
        </div>
      )}
      <h3
        className="font-heading font-semibold transition-colors"
        style={{ color: "#0d2840" }}
      >
        {name}
      </h3>
      {title && (
        <p className="text-sm mt-1" style={{ color: "#0d2840" }}>
          {title}
        </p>
      )}
      {companyName && (
        showCompanyLink && companySlug ? (
          <Link
            href={`/companies/${companySlug}`}
            className="text-xs font-medium mt-1 block hover:underline"
            style={{ color: "#017ab2" }}
            onClick={(e) => e.stopPropagation()}
          >
            {companyName}
          </Link>
        ) : (
          <p className="text-xs font-medium mt-1" style={{ color: "#017ab2" }}>
            {companyName}
          </p>
        )
      )}
    </Link>
  )
}

/**
 * LeaderCardGrid - Consistent grid layout for leader cards
 */
export function LeaderCardGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", className)}>
      {children}
    </div>
  )
}
