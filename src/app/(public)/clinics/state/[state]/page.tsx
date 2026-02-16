import { createClient } from "@/lib/supabase/server"
import { ClinicCard } from "@/components/clinics/clinic-card"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

// Map of state abbreviations to full names
const STATE_NAMES: Record<string, string> = {
  al: "Alabama", ak: "Alaska", az: "Arizona", ar: "Arkansas", ca: "California",
  co: "Colorado", ct: "Connecticut", de: "Delaware", fl: "Florida", ga: "Georgia",
  hi: "Hawaii", id: "Idaho", il: "Illinois", in: "Indiana", ia: "Iowa",
  ks: "Kansas", ky: "Kentucky", la: "Louisiana", me: "Maine", md: "Maryland",
  ma: "Massachusetts", mi: "Michigan", mn: "Minnesota", ms: "Mississippi", mo: "Missouri",
  mt: "Montana", ne: "Nebraska", nv: "Nevada", nh: "New Hampshire", nj: "New Jersey",
  nm: "New Mexico", ny: "New York", nc: "North Carolina", nd: "North Dakota", oh: "Ohio",
  ok: "Oklahoma", or: "Oregon", pa: "Pennsylvania", ri: "Rhode Island", sc: "South Carolina",
  sd: "South Dakota", tn: "Tennessee", tx: "Texas", ut: "Utah", vt: "Vermont",
  va: "Virginia", wa: "Washington", wv: "West Virginia", wi: "Wisconsin", wy: "Wyoming",
  dc: "District of Columbia",
}

interface PageProps {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params
  const stateName = STATE_NAMES[stateSlug.toLowerCase()] || decodeURIComponent(stateSlug).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

  return {
    title: `Longevity Clinics in ${stateName} | bioEDGE`,
    description: `Find longevity, anti-aging, and functional medicine clinics in ${stateName}. Browse ratings, services, and contact information.`,
    openGraph: {
      title: `Longevity Clinics in ${stateName}`,
      description: `Find longevity and anti-aging clinics in ${stateName}.`,
      images: [
        {
          url: "https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png",
          width: 512,
          height: 512,
          alt: "bioEDGE Longevity",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Longevity Clinics in ${stateName}`,
      description: `Find longevity and anti-aging clinics in ${stateName}.`,
      images: ["https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"],
    },
  }
}

export default async function StateClinicsPage({ params }: PageProps) {
  const { state: stateSlug } = await params
  const supabase = await createClient()

  // Try to match the state - could be abbreviation or slug
  const stateName = STATE_NAMES[stateSlug.toLowerCase()] || decodeURIComponent(stateSlug).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

  // Query clinics matching the state (try both the slug and the resolved name)
  const { data: clinics, error } = await supabase
    .from("clinics")
    .select("id, name, slug, city, state, country, phone, website, description, tags, photos")
    .eq("is_active", true)
    .eq("is_draft", false)
    .or(`state.ilike.${stateSlug},state.ilike.${stateName}`)
    .order("name", { ascending: true })

  if (error || !clinics || clinics.length === 0) {
    notFound()
  }

  // Get unique cities in this state
  const cities = Array.from(new Set(clinics.map((c) => c.city).filter(Boolean))) as string[]
  cities.sort()

  // Group clinics by city
  const clinicsByCity = new Map<string, typeof clinics>()
  for (const clinic of clinics) {
    const city = clinic.city || "Other"
    if (!clinicsByCity.has(city)) {
      clinicsByCity.set(city, [])
    }
    clinicsByCity.get(city)!.push(clinic)
  }

  const actualStateName = clinics[0]?.state || stateName

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-12 md:py-16">
          <Link
            href="/clinics"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            All Clinics
          </Link>

          <h1 className="mb-3 text-3xl font-bold tracking-wide text-white md:text-4xl">
            Longevity Clinics in {actualStateName}
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            {clinics.length.toLocaleString()} clinic{clinics.length !== 1 ? "s" : ""} across{" "}
            {cities.length} cit{cities.length !== 1 ? "ies" : "y"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1200px] px-8 py-12">
        {/* City quick links */}
        {cities.length > 3 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Jump to City
            </h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <a
                  key={city}
                  href={`#${city.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-muted transition"
                >
                  {city} ({clinicsByCity.get(city)?.length || 0})
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Clinics grouped by city */}
        {Array.from(clinicsByCity.entries()).map(([city, cityClinics]) => (
          <div
            key={city}
            id={city.toLowerCase().replace(/\s+/g, "-")}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold mb-4">
              {city}{" "}
              <span className="text-base font-normal text-muted-foreground">
                ({cityClinics.length})
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cityClinics.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
