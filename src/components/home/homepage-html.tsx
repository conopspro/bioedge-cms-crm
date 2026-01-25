interface HomepageHtmlProps {
  htmlContent: string
  background?: string
  settings?: {
    bg_color?: string | null
  }
}

/**
 * Homepage Custom HTML Section
 *
 * Renders custom HTML content.
 */
export function HomepageHtml({
  htmlContent,
  background = "white",
  settings,
}: HomepageHtmlProps) {
  // Determine colors - use settings if provided
  const bgColor = settings?.bg_color || null

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
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </section>
  )
}
