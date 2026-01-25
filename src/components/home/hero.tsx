import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
      {/* Background decorative gradients */}

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 px-8 py-12 lg:flex-row lg:gap-16">
        <div className="animate-fade-in-up text-center lg:flex-1 lg:text-left">
          <span className="mb-6 inline-block rounded-full border border-gold/30 bg-white/15 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-gold backdrop-blur-sm">
            National Tour 2026
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
            Where Biohacking Starts with NO
          </p>

          <p className="mx-auto mb-10 max-w-[550px] text-lg leading-relaxed text-white lg:mx-0">
            A transformational live experience bringing the EDGE Framework to cities across America. Learn to eliminate
            interference, decode your body&apos;s signals, and unlock your path to 120 years of vitality.
          </p>

          <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              href="#notify"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-base font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-[#e87a3a] hover:shadow-[0_10px_30px_rgba(255,145,77,0.3)]"
            >
              Get Notified →
            </Link>
            <a
              href="https://biohackingstartswithno.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/50 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Get the Book
            </a>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:flex-shrink-0 lg:items-center lg:justify-center">
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: 315, height: 560, border: "4px solid #0d2840" }}
          >
            <iframe
              src="https://www.youtube.com/embed/4GIOlpIdr80"
              title="bioEDGE Longevity Summit"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
