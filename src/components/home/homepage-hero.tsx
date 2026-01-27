import Link from "next/link"
import { getYouTubeEmbedUrl } from "@/lib/youtube"

interface HomepageSettings {
  hero_label?: string | null
  hero_title?: string | null
  hero_subtitle?: string | null
  hero_description?: string | null
  hero_video_url?: string | null
  hero_image_url?: string | null
  hero_cta_text?: string | null
  hero_cta_url?: string | null
  hero_secondary_cta_text?: string | null
  hero_secondary_cta_url?: string | null
}

interface HomepageHeroProps {
  settings: HomepageSettings | null
}

/**
 * Homepage Hero Section
 *
 * Renders the hero section with content from database settings.
 * Falls back to defaults if no settings exist.
 */
export function HomepageHero({ settings }: HomepageHeroProps) {
  const label = settings?.hero_label || "National Tour 2026"
  const title = settings?.hero_title || "bioEDGE Longevity Summit"
  const subtitle = settings?.hero_subtitle || "Where Biohacking Starts with NO"
  const description = settings?.hero_description || "A transformational live experience bringing the EDGE Framework to cities across America. Learn to eliminate interference, decode your body's signals, and unlock your path to 120 years of vitality."
  const ctaText = settings?.hero_cta_text || "Get Notified"
  const ctaUrl = settings?.hero_cta_url || "#notify"
  const secondaryCtaText = settings?.hero_secondary_cta_text || "Get the Book"
  const secondaryCtaUrl = settings?.hero_secondary_cta_url || "https://biohackingstartswithno.com"

  // Convert any YouTube URL format (including Shorts) to embed URL
  const rawVideoUrl = settings?.hero_video_url || "https://www.youtube.com/shorts/4GIOlpIdr80"
  const videoUrl = getYouTubeEmbedUrl(rawVideoUrl)

  return (
    <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 px-8 py-12 lg:flex-row lg:gap-16">
        <div className="animate-fade-in-up text-center lg:flex-1 lg:text-left">
          <span className="mb-6 inline-block rounded-full border border-gold/30 bg-white/15 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-gold backdrop-blur-sm">
            {label}
          </span>

          <h1 className="mb-2 text-4xl font-bold leading-tight tracking-wide text-white md:text-5xl lg:text-[60px]">
            <span className="text-[28px] text-white md:text-[32px] lg:text-[40px]">BIO</span>
            <span className="text-gold">EDGE</span>
            <br className="leading-none" />
            <span className="-mt-2 block text-[28px] text-white md:-mt-3 md:text-[32px] lg:-mt-4 lg:text-[40px]">
              LONGEVITY SUMMIT
            </span>
          </h1>

          <p className="mx-auto mb-8 text-lg font-bold text-white lg:mx-0 lg:max-w-[600px]">
            {subtitle}
          </p>

          <div
            className="mx-auto mb-10 max-w-[550px] text-lg leading-relaxed text-white lg:mx-0"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-base font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-[#e87a3a] hover:shadow-[0_10px_30px_rgba(255,145,77,0.3)]"
            >
              {ctaText} →
            </Link>
            {secondaryCtaUrl && secondaryCtaText && (
              <a
                href={secondaryCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/50 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>

        {videoUrl && (
          <div className="hidden lg:flex lg:flex-1 lg:flex-shrink-0 lg:items-center lg:justify-center">
            <div
              className="relative overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
              style={{
                width: 315,
                height: 560,
                border: "3px solid rgba(255, 145, 77, 0.6)",
                boxShadow: "0 0 30px rgba(255, 145, 77, 0.2), 0 25px 50px -12px rgba(0,0,0,0.4)"
              }}
            >
              <iframe
                src={videoUrl}
                title="bioEDGE Longevity Summit"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
