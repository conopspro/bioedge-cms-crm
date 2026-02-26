import { createClient } from "@/lib/supabase/server"
import { PhotoSlider } from "@/components/events/public/photo-slider"

interface SliderImage {
  id: string
  image_url: string
  thumbnail_url?: string | null
  alt_text?: string | null
  caption?: string | null
  link_url?: string | null
  display_order: number
  is_visible: boolean
}

interface SharedSlider {
  id: string
  name: string
  slug: string
  description: string | null
  section_title: string | null
  section_subtitle: string | null
  section_background: string
  show_captions: boolean
  is_active: boolean
  images: SliderImage[]
}

interface PhotoSliderSectionProps {
  sliderSlug?: string
  sliderId?: string
  label?: string
  title?: string
  cardWidth?: number
  cardHeight?: number
  className?: string
  settings?: {
    bg_color?: string | null
    title_color?: string | null
    label_bg_color?: string | null
    text_color?: string | null
  }
  prefetchedSlider?: SharedSlider | null
}

/**
 * Photo Slider Section
 *
 * Fetches and displays a shared photo slider by slug or ID.
 * Can be placed anywhere on the site.
 */
export async function PhotoSliderSection({
  sliderSlug,
  sliderId,
  label,
  title,
  cardWidth = 280,
  cardHeight = 210,
  className,
  settings,
  prefetchedSlider,
}: PhotoSliderSectionProps) {
  let slider: SharedSlider | null = prefetchedSlider || null

  // Only fetch from DB if no prefetched data was provided
  if (!slider) {
    const identifier = sliderId || sliderSlug
    if (!identifier) return null

    const supabase = await createClient()
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    let query = supabase
      .from("shared_photo_sliders")
      .select(`
        *,
        images:shared_slider_images(*)
      `)
      .eq("is_active", true)

    if (isUUID) {
      query = query.eq("id", identifier)
    } else {
      query = query.eq("slug", identifier)
    }

    const { data, error } = await query.single()
    if (error || !data) return null
    slider = data as SharedSlider
  }

  // Filter visible images and sort by display_order
  const visibleImages = (slider.images || [])
    .filter((img: SliderImage) => img.is_visible !== false)
    .sort((a: SliderImage, b: SliderImage) => a.display_order - b.display_order)

  if (visibleImages.length === 0) {
    return null
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

  // Determine colors - use settings if provided
  const bgColor = settings?.bg_color || null
  const titleColor = settings?.title_color || null
  const labelBgColor = settings?.label_bg_color || "#0d598a"

  // Determine if background is dark for text contrast
  const isDarkBg = bgColor
    ? isDarkColor(bgColor)
    : (slider.section_background === "navy" || slider.section_background === "gradient")

  // Build background style
  const bgStyle: React.CSSProperties = bgColor
    ? { background: bgColor }
    : {}

  // Fallback class if no custom color
  const bgClass = bgColor ? "" : (
    slider.section_background === "navy" ? "bg-navy" :
    slider.section_background === "gradient" ? "bg-gradient-to-br from-navy via-deep-blue to-electric-blue" :
    slider.section_background === "muted" ? "bg-off-white" :
    "bg-white"
  )

  // Use props if provided, otherwise fall back to slider data
  const displayLabel = label || slider.section_subtitle
  const displayTitle = title || slider.section_title

  return (
    <section className={`py-12 px-8 ${bgClass} ${className || ""}`} style={bgStyle}>
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header - EDGE Framework style */}
        {(displayLabel || displayTitle) && (
          <div className="mb-8 text-center">
            {displayLabel && (
              <span
                className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
                style={{ backgroundColor: labelBgColor }}
              >
                {displayLabel}
              </span>
            )}
            {displayTitle && (
              <h2
                className="text-[30px] font-bold tracking-wide"
                style={{ color: titleColor || (isDarkBg ? "#ffffff" : "#0a2540") }}
              >
                {displayTitle}
              </h2>
            )}
          </div>
        )}

        {/* Photo Slider */}
        <PhotoSlider
          images={visibleImages}
          showCaption={slider.show_captions}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
        />
      </div>
    </section>
  )
}
