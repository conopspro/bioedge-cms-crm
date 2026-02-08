/**
 * JSON-LD Structured Data Components
 *
 * Generates schema.org structured data for Google rich results.
 * Each component renders an invisible <script type="application/ld+json"> tag.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bioedgelongevity.com"

interface JsonLdProps {
  data: Record<string, any>
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─── Article ──────────────────────────────────────────────

interface ArticleJsonLdProps {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  imageUrl?: string | null
  companyName?: string | null
}

export function ArticleJsonLd({
  title,
  slug,
  excerpt,
  publishedAt,
  imageUrl,
  companyName,
}: ArticleJsonLdProps) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    url: `${BASE_URL}/articles/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "bioEDGE Longevity",
      url: BASE_URL,
    },
  }

  if (excerpt) data.description = excerpt
  if (publishedAt) data.datePublished = publishedAt
  if (imageUrl) data.image = imageUrl
  if (companyName) data.author = { "@type": "Organization", name: companyName }

  return <JsonLd data={data} />
}

// ─── Person (Leader) ──────────────────────────────────────

interface PersonJsonLdProps {
  firstName: string
  lastName: string
  slug: string
  jobTitle?: string | null
  bio?: string | null
  imageUrl?: string | null
  companyName?: string | null
  linkedinUrl?: string | null
  youtubeUrl?: string | null
}

export function PersonJsonLd({
  firstName,
  lastName,
  slug,
  jobTitle,
  bio,
  imageUrl,
  companyName,
  linkedinUrl,
  youtubeUrl,
}: PersonJsonLdProps) {
  const fullName = `${firstName} ${lastName}`.trim()

  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    url: `${BASE_URL}/leaders/${slug}`,
  }

  if (jobTitle) data.jobTitle = jobTitle
  if (bio) data.description = bio.slice(0, 300)
  if (imageUrl) data.image = imageUrl
  if (companyName) {
    data.worksFor = { "@type": "Organization", name: companyName }
  }

  const sameAs: string[] = []
  if (linkedinUrl) sameAs.push(linkedinUrl)
  if (youtubeUrl) sameAs.push(youtubeUrl)
  if (sameAs.length > 0) data.sameAs = sameAs

  return <JsonLd data={data} />
}

// ─── Organization (Company) ──────────────────────────────

interface OrganizationJsonLdProps {
  name: string
  slug: string
  description?: string | null
  logoUrl?: string | null
  website?: string | null
}

export function OrganizationJsonLd({
  name,
  slug,
  description,
  logoUrl,
  website,
}: OrganizationJsonLdProps) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: `${BASE_URL}/companies/${slug}`,
  }

  if (description) data.description = description
  if (logoUrl) data.logo = logoUrl
  if (website) data.sameAs = [website]

  return <JsonLd data={data} />
}

// ─── VideoObject (Presentation / Spotlight) ──────────────

interface VideoJsonLdProps {
  title: string
  slug: string
  description?: string | null
  thumbnailUrl?: string | null
  uploadDate?: string | null
  youtubeUrl?: string | null
  basePath: "presentations" | "spotlight"
}

export function VideoJsonLd({
  title,
  slug,
  description,
  thumbnailUrl,
  uploadDate,
  youtubeUrl,
  basePath,
}: VideoJsonLdProps) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    url: `${BASE_URL}/${basePath}/${slug}`,
  }

  if (description) data.description = description
  if (thumbnailUrl) data.thumbnailUrl = thumbnailUrl
  if (uploadDate) data.uploadDate = uploadDate
  if (youtubeUrl) {
    data.embedUrl = youtubeUrl
    data.contentUrl = youtubeUrl
  }

  return <JsonLd data={data} />
}

// ─── Event ───────────────────────────────────────────────

interface EventJsonLdProps {
  name: string
  slug: string
  description?: string | null
  startDate?: string | null
  endDate?: string | null
  venueName?: string | null
  city?: string | null
  state?: string | null
  imageUrl?: string | null
  ticketUrl?: string | null
  status?: string | null
}

export function EventJsonLd({
  name,
  slug,
  description,
  startDate,
  endDate,
  venueName,
  city,
  state,
  imageUrl,
  ticketUrl,
  status,
}: EventJsonLdProps) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    url: `${BASE_URL}/${slug}`,
    organizer: {
      "@type": "Organization",
      name: "bioEDGE Longevity",
      url: BASE_URL,
    },
  }

  if (description) data.description = description.slice(0, 300)
  if (startDate) data.startDate = startDate
  if (endDate) data.endDate = endDate
  if (imageUrl) data.image = imageUrl

  if (venueName || city || state) {
    data.location = {
      "@type": "Place",
      ...(venueName ? { name: venueName } : {}),
      address: {
        "@type": "PostalAddress",
        ...(city ? { addressLocality: city } : {}),
        ...(state ? { addressRegion: state } : {}),
        addressCountry: "US",
      },
    }
  }

  if (ticketUrl) {
    data.offers = {
      "@type": "Offer",
      url: ticketUrl,
      availability: status === "sold_out"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    }
  }

  // Map event status
  if (status === "cancelled") {
    data.eventStatus = "https://schema.org/EventCancelled"
  } else if (status === "postponed") {
    data.eventStatus = "https://schema.org/EventPostponed"
  } else {
    data.eventStatus = "https://schema.org/EventScheduled"
  }

  data.eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode"

  return <JsonLd data={data} />
}

// ─── BreadcrumbList ──────────────────────────────────────

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }

  return <JsonLd data={data} />
}

// ─── WebSite (for sitelinks search box) ──────────────────

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "bioEDGE Longevity",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return <JsonLd data={data} />
}
