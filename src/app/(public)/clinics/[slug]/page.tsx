import { createClient } from "@/lib/supabase/server"
import { ClinicJsonLd } from "@/components/seo/clinic-json-ld"
import { NearbyClinicSection } from "@/components/clinics/nearby-clinics"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Globe, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: clinic } = await supabase
    .from("clinics")
    .select("name, city, state, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("is_draft", false)
    .single()

  if (!clinic) {
    return { title: "Clinic Not Found" }
  }

  const location = [clinic.city, clinic.state].filter(Boolean).join(", ")
  const title = location
    ? `${clinic.name} - ${location} | Longevity Clinic`
    : `${clinic.name} | Longevity Clinic`

  const description = clinic.description
    ? clinic.description.slice(0, 160)
    : `${clinic.name} is a longevity clinic${location ? ` in ${location}` : ""}. View details, ratings, and contact information.`

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function ClinicDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch clinic by slug
  const { data: clinic, error } = await supabase
    .from("clinics")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("is_draft", false)
    .single()

  if (error || !clinic) {
    notFound()
  }

  const location = [clinic.city, clinic.state].filter(Boolean).join(", ")
  const fullAddress = [clinic.address, clinic.city, clinic.state, clinic.zip_code]
    .filter(Boolean)
    .join(", ")

  // Fetch first batch of city clinics + total count for lazy loading
  const INITIAL_BATCH = 24
  let initialNearbyClinics: Array<{
    id: string
    name: string
    slug: string
    city: string | null
    state: string | null
    country: string | null
    phone: string | null
    website: string | null
    description: string | null
    tags: string[]
    photos: string[]
  }> = []
  let nearbyTotalCount = 0

  if (clinic.city) {
    const { data: cityResults, count } = await supabase
      .from("clinics")
      .select(
        "id, name, slug, city, state, country, phone, website, description, tags, photos",
        { count: "exact" }
      )
      .eq("city", clinic.city)
      .eq("is_active", true)
      .eq("is_draft", false)
      .neq("id", clinic.id)
      .order("name", { ascending: true })
      .range(0, INITIAL_BATCH - 1)

    initialNearbyClinics = cityResults || []
    nearbyTotalCount = count || 0
  }

  // Social links
  const socialLinks = [
    { name: "Facebook", url: clinic.facebook },
    { name: "Instagram", url: clinic.instagram },
    { name: "LinkedIn", url: clinic.linkedin },
    { name: "YouTube", url: clinic.youtube },
    { name: "Twitter/X", url: clinic.twitter },
    { name: "TikTok", url: clinic.tiktok },
    { name: "Threads", url: clinic.threads },
  ].filter((s) => s.url)

  return (
    <div className="min-h-screen bg-off-white">
      <ClinicJsonLd
        name={clinic.name}
        slug={clinic.slug}
        description={clinic.description}
        address={clinic.address}
        city={clinic.city}
        state={clinic.state}
        zip_code={clinic.zip_code}
        country={clinic.country}
        phone={clinic.phone}
        website={clinic.website}
        google_rating={clinic.google_rating}
        reviews_count={clinic.reviews_count}
        latitude={clinic.latitude}
        longitude={clinic.longitude}
        photos={clinic.photos}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-12 md:py-16">
          <Link
            href="/clinics"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>

          <h1 className="mb-3 text-3xl font-bold tracking-wide text-white md:text-4xl">
            {clinic.name}
          </h1>

          {location && (
            <div className="flex items-center gap-2 text-white/90 mb-4">
              <MapPin className="h-4 w-4" />
              <span className="text-lg">{location}</span>
            </div>
          )}

          {clinic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {clinic.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content — single column layout */}
      <section className="mx-auto max-w-[800px] px-8 py-12 space-y-8">
        <div className="space-y-8">
          {/* Description */}
          {clinic.description && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {clinic.description}
              </p>
            </div>
          )}

          {/* Contact info card */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

            <div className="space-y-4">
              {/* Address */}
              {fullAddress && (
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    {clinic.google_maps_url ? (
                      <a
                        href={clinic.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {fullAddress}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{fullAddress}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Phone */}
              {clinic.phone && (
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a
                      href={`tel:${clinic.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {clinic.phone_formatted || clinic.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Website — NO email displayed */}
              {clinic.website && (
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {clinic.domain || "Visit website"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {clinic.photos.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-3">Photos</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {clinic.photos.map((photo: string, i: number) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`${clinic.name} photo ${i + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {clinic.videos.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-3">Videos</h2>
              <div className="space-y-4">
                {clinic.videos.map((video: string, i: number) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: video }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Social media */}
          {socialLinks.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-3">Social Media</h2>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-sm text-primary hover:bg-muted transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Custom links */}
          {clinic.custom_urls && clinic.custom_urls.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-3">Links</h2>
              <div className="space-y-2">
                {clinic.custom_urls.map((link: { title: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps link */}
          {clinic.google_maps_url && (
            <a
              href={clinic.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border bg-white p-4 text-sm font-medium text-primary hover:bg-muted transition"
            >
              <MapPin className="h-4 w-4" />
              View on Google Maps
            </a>
          )}
        </div>
      </section>

      {/* Nearby clinics — lazy loaded, full width */}
      {clinic.city && nearbyTotalCount > 0 && (
        <NearbyClinicSection
          initialClinics={initialNearbyClinics}
          totalCount={nearbyTotalCount}
          city={clinic.city}
          state={clinic.state}
          excludeId={clinic.id}
          heading={`Nearby Clinics in ${clinic.city}`}
          latitude={clinic.latitude}
          longitude={clinic.longitude}
        />
      )}
    </div>
  )
}
