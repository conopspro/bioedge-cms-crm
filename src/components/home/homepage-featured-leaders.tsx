import Link from "next/link"
import { Users, Linkedin } from "lucide-react"
import { FeaturedCardSlider } from "@/components/ui/featured-card-slider"

interface Leader {
  id: string
  slug: string | null
  first_name: string
  last_name: string
  title: string | null
  avatar_url: string | null
  linkedin_url: string | null
  company: { name: string } | null
}

interface HomepageFeaturedLeadersProps {
  label?: string | null
  title?: string | null
  leaders: Leader[]
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

export function HomepageFeaturedLeaders({
  label = "LEADERS",
  title = "Featured Leaders",
  leaders,
  totalCount,
  settings,
}: HomepageFeaturedLeadersProps) {
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null

  const isDarkBg = bgColor ? isDarkColor(bgColor) : false
  const bgStyle: React.CSSProperties = bgColor ? { background: bgColor } : {}
  const bgClass = bgColor ? "" : "bg-off-white"

  if (leaders.length === 0) {
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
                <Link href="/leaders" className="hover:text-electric-blue transition-colors">
                  {title}
                </Link>
              </h2>
            )}
          </div>
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl bg-white shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Leaders Coming Soon</h3>
              <p className="text-deep-blue">Check back soon for featured industry leaders.</p>
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
          {leaders.map((leader) => (
            <Link
              key={leader.id}
              href={`/leaders/${leader.slug || leader.id}`}
              className="group flex-shrink-0 w-[85vw] sm:w-[280px] overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  {leader.avatar_url ? (
                    <img
                      src={leader.avatar_url}
                      alt={`${leader.first_name} ${leader.last_name}`}
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-electric-blue/20 mb-4"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy via-deep-blue to-electric-blue text-2xl font-bold text-white mb-4">
                      {leader.first_name?.charAt(0) || "?"}
                    </div>
                  )}

                  <h3
                    className="font-bold text-lg transition-colors group-hover:text-electric-blue"
                    style={{ color: textColor || "#0a2540" }}
                  >
                    {leader.first_name} {leader.last_name}
                  </h3>

                  {leader.title && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {leader.title}
                    </p>
                  )}

                  {leader.company?.name && (
                    <p className="text-xs font-medium text-electric-blue mt-1">
                      {leader.company.name}
                    </p>
                  )}

                  {leader.linkedin_url && (
                    <Linkedin className="h-4 w-4 text-[#017ab2] mt-3" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </FeaturedCardSlider>

        <div className="mt-8 text-center">
          <Link
            href="/leaders"
            className="inline-flex items-center gap-2 text-electric-blue font-semibold hover:text-navy transition-colors"
          >
            View All {totalCount ? `${totalCount} ` : ""}Leaders →
          </Link>
        </div>
      </div>
    </section>
  )
}
