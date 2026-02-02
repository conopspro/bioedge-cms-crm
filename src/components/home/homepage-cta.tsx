import Link from "next/link"

interface HomepageCtaProps {
  label?: string | null
  title?: string | null
  description?: string | null
  buttonText?: string | null
  buttonUrl?: string | null
  background?: string
  settings?: {
    bg_color?: string | null
    title_color?: string | null
    label_bg_color?: string | null
    text_color?: string | null
    button_bg?: string | null
    button_text_color?: string | null
  }
}

// Helper to determine if a color is dark
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

/**
 * Homepage CTA Section
 *
 * A call-to-action section with title and button.
 */
export function HomepageCta({
  label,
  title = "Ready to Transform Your Health?",
  description,
  buttonText = "Get Notified",
  buttonUrl = "#notify",
  background = "gradient",
  settings,
}: HomepageCtaProps) {
  // Determine colors - use settings if provided
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"
  const textColor = settings?.text_color || null
  const buttonBg = settings?.button_bg || "#c9a227"
  const buttonTextColor = settings?.button_text_color || "#0a2540"

  // Determine if background is dark for text contrast
  const isDarkBg = bgColor
    ? isDarkColor(bgColor)
    : (background === "navy" || background === "gradient")

  // Build background style
  const bgStyle: React.CSSProperties = bgColor
    ? { background: bgColor }
    : {}

  // Fallback class if no custom color
  const bgClass = bgColor ? "" : (
    background === "navy" ? "bg-navy" :
    background === "gradient" ? "bg-gradient-to-br from-navy via-deep-blue to-electric-blue" :
    background === "muted" ? "bg-off-white" :
    "bg-white"
  )

  return (
    <section className={`py-16 px-8 ${bgClass}`} style={bgStyle}>
      <div className="mx-auto max-w-[800px] text-center">
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
            className="text-[30px] font-bold tracking-wide mb-4"
            style={{ color: titleColor || (isDarkBg ? "#ffffff" : "#0a2540") }}
          >
            {title}
          </h2>
        )}
        {description && (
          <div
            className="text-lg mb-8 max-w-2xl mx-auto space-y-4"
            style={{ color: textColor || (isDarkBg ? "rgba(255,255,255,0.9)" : "#374151") }}
          >
            {description.split(/\n+/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {buttonUrl && buttonText && (
          <Link
            href={buttonUrl}
            className="inline-flex items-center gap-2 rounded-lg px-10 py-4 text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: buttonBg, color: buttonTextColor }}
          >
            {buttonText} →
          </Link>
        )}
      </div>
    </section>
  )
}
