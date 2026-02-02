import { LazyYouTube } from "@/components/ui/lazy-youtube"

interface HomepageVideoProps {
  label?: string | null
  title?: string | null
  videoUrl: string
  background?: string
  settings?: {
    bg_color?: string | null
    title_color?: string | null
    label_bg_color?: string | null
    text_color?: string | null
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
 * Homepage Video Section
 *
 * Displays an embedded video with optional label and title.
 */
export function HomepageVideo({
  label,
  title,
  videoUrl,
  background = "white",
  settings,
}: HomepageVideoProps) {
  // Determine colors - use settings if provided
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"

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
    <section className={`py-12 px-8 ${bgClass}`} style={bgStyle}>
      <div className="mx-auto max-w-[1200px]">
        {(label || title) && (
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
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            <LazyYouTube
              url={videoUrl}
              title={title || "Video"}
              thumbnailQuality="sddefault"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
