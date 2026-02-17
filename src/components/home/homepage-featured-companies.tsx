import Link from "next/link"
import { Building2 } from "lucide-react"
import { FeaturedCardSlider } from "@/components/ui/featured-card-slider"

interface Company {
  id: string
  name: string
  slug: string | null
  domain: string | null
  logo_url: string | null
}

interface HomepageFeaturedCompaniesProps {
  label?: string | null
  title?: string | null
  companies: Company[]
  totalCount?: number
  settings?: {
    bg_color?: string | null
    title_color?: string | null
    label_bg_color?: string | null
    text_color?: string | null
  }
}

// Helper to determine if a color is dark (for text contrast)
const isDarkColor = (color: string | null | undefined): boolean => {
  if (!color) return false
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.5
  }
  return color.includes('navy') || color.includes('0a2540') || color.includes('gradient')
}

export function HomepageFeaturedCompanies({
  label = "COMPANIES",
  title = "Featured Companies",
  companies,
  totalCount,
  settings,
}: HomepageFeaturedCompaniesProps) {
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null

  const isDarkBg = bgColor ? isDarkColor(bgColor) : false
  const bgStyle: React.CSSProperties = bgColor ? { background: bgColor } : {}
  const bgClass = bgColor ? "" : "bg-off-white"

  if (companies.length === 0) {
    return (
      <section className={`py-12 px-8 ${bgClass}`} style={bgStyle}>
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 text-center">
            {label && (
              <span
                className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
                style={{ backgroundColor: labelBgColor }}
              >
                {label}
              </span>
            )}
            {title && (
              <h2
                className="text-[30px] font-bold tracking-wide"
                style={{ color: titleColor || (isDarkBg ? "#ffffff" : "#0a2540") }}
              >
                <Link href="/companies" className="hover:text-electric-blue transition-colors">
                  {title}
                </Link>
              </h2>
            )}
          </div>
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl bg-white shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Companies Coming Soon</h3>
              <p className="text-deep-blue">Check back soon for featured partner companies.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-12 px-8 ${bgClass}`} style={bgStyle}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 text-center">
          {label && (
            <span
              className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
              style={{ backgroundColor: labelBgColor }}
            >
              {label}
            </span>
          )}
          {title && (
            <h2
              className="text-[30px] font-bold tracking-wide"
              style={{ color: titleColor || (isDarkBg ? "#ffffff" : "#0a2540") }}
            >
              {title}
            </h2>
          )}
        </div>

        <FeaturedCardSlider>
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.slug || company.domain || company.id}`}
              className="group flex-shrink-0 w-[85vw] sm:w-[280px] overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-full items-center justify-center">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="h-16 max-w-[180px] object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  <h3
                    className="font-bold text-lg transition-colors group-hover:text-electric-blue"
                    style={{ color: textColor || "#0a2540" }}
                  >
                    {company.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </FeaturedCardSlider>

        <div className="mt-8 text-center">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-electric-blue font-semibold hover:text-navy transition-colors"
          >
            View All {totalCount ? `${totalCount} ` : ""}Companies →
          </Link>
        </div>
      </div>
    </section>
  )
}
