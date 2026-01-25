"use client"

import { getSectionColors, getBackgroundStyle, SectionColorsSettings } from "@/lib/event-colors"

interface FinalCtaSectionProps {
  event: {
    registration_url?: string | null
    tagline?: string | null
  }
  sectionColors: Partial<SectionColorsSettings> | null
  landingPageSettings: {
    final_cta?: {
      visible?: boolean
      title?: string
      description?: string
      button_text?: string
    }
  } | null
}

/**
 * Reusable Final CTA Section
 *
 * This component renders the Final Call-to-Action section consistently
 * across the landing page and all subpages (agenda, leaders, companies).
 *
 * It uses the CTA colors from section_colors and content from landing_page_settings.
 */
export function FinalCtaSection({ event, sectionColors, landingPageSettings }: FinalCtaSectionProps) {
  const ctaColors = getSectionColors(sectionColors, 'cta')

  // Don't render if explicitly hidden or no registration URL
  if (landingPageSettings?.final_cta?.visible === false || !event.registration_url) {
    return null
  }

  return (
    <section
      className="py-5"
      style={ctaColors.background
        ? getBackgroundStyle(ctaColors.background)
        : { background: 'linear-gradient(to bottom right, #0a2540, #1e3a5f, #3b82f6)' }
      }
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3" style={{ color: ctaColors.title }}>
          {landingPageSettings?.final_cta?.title || "Ready to Join Us?"}
        </h2>
        {(landingPageSettings?.final_cta?.description || event.tagline) && (
          <p className="text-lg mb-5" style={{ color: ctaColors.text }}>
            {landingPageSettings?.final_cta?.description || event.tagline}
          </p>
        )}
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-sm px-8 py-3 rounded-full transition-colors"
          style={{
            backgroundColor: ctaColors.button_bg || '#c9a227',
            color: ctaColors.button_text || '#ffffff',
          }}
        >
          {landingPageSettings?.final_cta?.button_text || "Get Your Tickets Now"}
        </a>
      </div>
    </section>
  )
}
