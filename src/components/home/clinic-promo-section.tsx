import Link from "next/link"
import { MapPin, Star } from "lucide-react"

interface ClinicPromoSectionProps {
  totalClinics?: number | null
}

export function ClinicPromoSection({ totalClinics }: ClinicPromoSectionProps) {
  const clinicCount = totalClinics ? `${totalClinics.toLocaleString()}+` : null

  return (
    <section className="py-6 px-8">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/clinics"
          className="group relative block overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-navy to-deep-blue transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.25)]"
        >
          <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-electric-blue transition-transform duration-400 group-hover:scale-x-100" />
          <div className="flex items-center gap-6 px-6 py-4 md:gap-8 md:px-8">

            {/* Icon */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-xl transition-transform duration-300 group-hover:scale-105">
              <MapPin className="h-10 w-10 text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-white md:text-2xl">
                  Longevity Clinic Directory
                </h3>
                {clinicCount && (
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-white">
                    {clinicCount} clinics
                  </span>
                )}
              </div>
              <div className="mt-3 hidden sm:block space-y-1.5">
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm italic text-white/80">
                  &ldquo;The Largest Directory of Longevity Clinics in the USA&rdquo;
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Find integrative medicine, IV therapy, hormone optimization, and longevity-focused clinics near you.
                </p>
              </div>
            </div>

            {/* CTA */}
            <span className="hidden flex-shrink-0 items-center gap-2 rounded-full bg-electric-blue px-5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-white group-hover:text-navy sm:inline-flex">
              Find a Clinic
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>

          </div>
        </Link>
      </div>
    </section>
  )
}
