import { createClient } from "@/lib/supabase/server"
import { ClinicJsonLd } from "@/components/seo/clinic-json-ld"
import { NearbyClinicSection } from "@/components/clinics/nearby-clinics"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Globe, ExternalLink, Share2 } from "lucide-react"
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
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: ["https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"],
    },
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

          {/* Contact info card (includes social media) */}
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

              {/* Social media icons — merged under website */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  <Share2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-2">Social Media</p>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title={social.name}
                        >
                          <SocialIcon name={social.name} />
                        </a>
                      ))}
                    </div>
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

/** SVG social media icons */
function SocialIcon({ name }: { name: string }) {
  const cls = "h-5 w-5"
  switch (name) {
    case "Facebook":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case "Instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    case "LinkedIn":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case "YouTube":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case "Twitter/X":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case "TikTok":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    case "Threads":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.02.88-.724 2.083-1.12 3.476-1.145 1.035-.019 1.96.13 2.77.417-.022-1.237-.34-2.18-1.008-2.768-.747-.659-1.882-.982-3.37-.962l-.018-2.118c1.96-.025 3.537.467 4.688 1.463.967.837 1.58 2.005 1.82 3.438.395.2.756.44 1.073.716 1.079.94 1.72 2.27 1.855 3.85.088 1.03-.05 2.628-1.217 4.186-1.835 2.448-4.862 3.65-8.997 3.572zm-.063-7.462c-.91.013-1.63.219-2.14.614-.47.365-.686.844-.66 1.392.042.708.482 1.276 1.24 1.601.562.241 1.207.354 1.897.318 1.09-.059 1.876-.43 2.41-1.096.42-.525.717-1.2.87-2.01-.63-.26-1.357-.416-2.182-.443-.469-.017-.936-.005-1.435.024v-.4z" />
        </svg>
      )
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      )
  }
}
