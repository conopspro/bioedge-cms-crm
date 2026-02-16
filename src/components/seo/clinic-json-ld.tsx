/**
 * LocalBusiness JSON-LD for clinic directory pages
 *
 * Generates schema.org LocalBusiness structured data for Google rich results.
 * Helps clinics appear in Google's local search and knowledge panel.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bioedgelongevity.com"

interface ClinicJsonLdProps {
  name: string
  slug: string
  description?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  country?: string | null
  phone?: string | null
  website?: string | null
  google_rating?: number | null
  reviews_count?: number
  latitude?: number | null
  longitude?: number | null
  photos?: string[]
}

export function ClinicJsonLd({
  name,
  slug,
  description,
  address,
  city,
  state,
  zip_code,
  country,
  phone,
  website,
  google_rating,
  reviews_count,
  latitude,
  longitude,
  photos,
}: ClinicJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name,
    url: `${BASE_URL}/clinics/${slug}`,
  }

  if (description) data.description = description

  // Address
  if (address || city || state) {
    data.address = {
      "@type": "PostalAddress",
      ...(address && { streetAddress: address }),
      ...(city && { addressLocality: city }),
      ...(state && { addressRegion: state }),
      ...(zip_code && { postalCode: zip_code }),
      ...(country && { addressCountry: country }),
    }
  }

  // Geo coordinates (for map features)
  if (latitude && longitude) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    }
  }

  // Contact
  if (phone) data.telephone = phone
  if (website) data.sameAs = website

  // Rating
  if (google_rating && reviews_count && reviews_count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: google_rating,
      reviewCount: reviews_count,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Images
  if (photos && photos.length > 0) {
    data.image = photos
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
