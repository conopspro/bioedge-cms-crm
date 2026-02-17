/**
 * Google Places API (New) Integration
 *
 * Uses the Places API v1 (New) for text search to discover clinics.
 * Results are mapped to the clinic_queue insert shape for review.
 *
 * API Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
 */

const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText"

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.addressComponents",
  "places.location",
  "places.googleMapsUri",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.photos",
  "places.editorialSummary",
].join(",")

// Types for the Places API (New) response

interface AddressComponent {
  longText: string
  shortText: string
  types: string[]
}

interface GooglePlacePhoto {
  name: string
  widthPx: number
  heightPx: number
}

export interface GooglePlaceResult {
  id: string
  displayName: { text: string; languageCode: string }
  formattedAddress: string
  addressComponents?: AddressComponent[]
  location?: { latitude: number; longitude: number }
  googleMapsUri?: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  photos?: GooglePlacePhoto[]
  editorialSummary?: { text: string; languageCode: string }
}

interface TextSearchResponse {
  places?: GooglePlaceResult[]
  nextPageToken?: string
}

/** Shape matching clinic_queue insert (without id/timestamps) */
export interface ClinicQueueData {
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  google_place_id: string
  google_maps_url: string | null
  phone: string | null
  phone_formatted: string | null
  website: string | null
  domain: string | null
  description: string | null
  google_rating: number | null
  reviews_count: number
  photos: string[]
  search_tag: string
  search_location: string
  search_query: string
  status: "pending"
  perplexity_status: "pending"
}

class GooglePlacesService {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Search for places using a text query.
   *
   * Uses the Places API (New) textSearch endpoint.
   */
  async textSearch(
    query: string,
    pageToken?: string
  ): Promise<{ places: GooglePlaceResult[]; nextPageToken: string | null }> {
    if (!this.apiKey) {
      throw new Error(
        "Google Places API key not configured. Set GOOGLE_PLACES_API_KEY environment variable."
      )
    }

    const body: Record<string, string> = { textQuery: query }
    if (pageToken) {
      body.pageToken = pageToken
    }

    const response = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new Error(
        error.error?.message || error.message || `Google Places API error: ${response.status}`
      )
    }

    const data: TextSearchResponse = await response.json()

    return {
      places: data.places || [],
      nextPageToken: data.nextPageToken || null,
    }
  }

  /**
   * Map a Google Places result to a clinic_queue insert shape.
   *
   * Extracts address components, domain from website, photo resource names, etc.
   */
  mapToQueueData(
    place: GooglePlaceResult,
    searchTag: string,
    searchLocation: string,
    searchQuery: string
  ): ClinicQueueData {
    // Extract address components by type
    const components = place.addressComponents || []
    const city = this.findComponent(components, "locality")
    const state = this.findComponent(components, "administrative_area_level_1")
    const zipCode = this.findComponent(components, "postal_code")
    const country = this.findComponent(components, "country")

    // Extract domain from website
    const domain = this.extractDomain(place.websiteUri)

    // Map photo resource names
    const photos = (place.photos || []).map((photo) => photo.name)

    return {
      name: place.displayName.text,
      address: place.formattedAddress || null,
      city,
      state,
      zip_code: zipCode,
      country,
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null,
      google_place_id: place.id,
      google_maps_url: place.googleMapsUri || null,
      phone: place.nationalPhoneNumber || null,
      phone_formatted: place.internationalPhoneNumber || null,
      website: place.websiteUri || null,
      domain,
      description: place.editorialSummary?.text || null,
      google_rating: place.rating ?? null,
      reviews_count: place.userRatingCount ?? 0,
      photos,
      search_tag: searchTag,
      search_location: searchLocation,
      search_query: searchQuery,
      status: "pending",
      perplexity_status: "pending",
    }
  }

  /**
   * Find the short text of an address component by type.
   */
  private findComponent(
    components: AddressComponent[],
    type: string
  ): string | null {
    const match = components.find((c) => c.types.includes(type))
    return match?.shortText || null
  }

  /**
   * Extract the domain from a URL, stripping www. prefix.
   */
  private extractDomain(url: string | undefined | null): string | null {
    if (!url) return null
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
      return parsed.hostname.replace(/^www\./, "")
    } catch {
      return null
    }
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService()
