/**
 * YouTube URL utilities
 *
 * Extracts video IDs and generates thumbnail URLs from YouTube links.
 */

/**
 * Extract YouTube video ID from various URL formats
 *
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null

  // Clean the URL
  const cleanUrl = url.trim()

  // Try different patterns
  const patterns = [
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&\s]+)/,
    // Short URL: youtu.be/VIDEO_ID
    /youtu\.be\/([^?\s]+)/,
    // Embed URL: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([^?\s]+)/,
    // Old embed URL: youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([^?\s]+)/,
    // Shorts URL: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([^?\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Get YouTube thumbnail URL for a video
 *
 * Quality options:
 * - maxresdefault: 1280x720 (highest, may not exist for all videos)
 * - sddefault: 640x480
 * - hqdefault: 480x360
 * - mqdefault: 320x180 (always exists)
 *
 * We default to maxresdefault with hqdefault as fallback logic in components
 */
export function getYouTubeThumbnailUrl(
  videoIdOrUrl: string | null | undefined,
  quality: "maxresdefault" | "sddefault" | "hqdefault" | "mqdefault" = "maxresdefault"
): string | null {
  if (!videoIdOrUrl) return null

  // Check if it's a URL or already a video ID
  const videoId = videoIdOrUrl.includes("youtube") || videoIdOrUrl.includes("youtu.be")
    ? extractYouTubeVideoId(videoIdOrUrl)
    : videoIdOrUrl

  if (!videoId) return null

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Get the article image URL, falling back to YouTube thumbnail if no featured image
 */
export function getArticleImageUrl(
  featuredImageUrl: string | null | undefined,
  youtubeUrl: string | null | undefined
): string | null {
  // Use featured image if available
  if (featuredImageUrl) {
    return featuredImageUrl
  }

  // Fall back to YouTube thumbnail
  if (youtubeUrl) {
    return getYouTubeThumbnailUrl(youtubeUrl)
  }

  return null
}

/**
 * Check if a URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string | null | undefined): boolean {
  return extractYouTubeVideoId(url) !== null
}

/**
 * Convert any YouTube URL to an embed URL
 *
 * Handles all YouTube URL formats including:
 * - Regular watch URLs
 * - Short URLs (youtu.be)
 * - Shorts URLs (youtube.com/shorts/)
 * - Already-embed URLs
 *
 * Options:
 * - autoplay: Start playing automatically
 * - loop: Loop the video
 * - mute: Start muted (required for autoplay in most browsers)
 * - controls: Show player controls (default: true)
 * - playlist: For looping, set to video ID
 */
export function getYouTubeEmbedUrl(
  url: string | null | undefined,
  options?: {
    autoplay?: boolean
    loop?: boolean
    mute?: boolean
    controls?: boolean
    playsinline?: boolean
  }
): string | null {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  const params = new URLSearchParams()

  if (options?.autoplay) {
    params.set("autoplay", "1")
  }

  if (options?.loop) {
    params.set("loop", "1")
    // YouTube requires playlist param for loop to work
    params.set("playlist", videoId)
  }

  if (options?.mute) {
    params.set("mute", "1")
  }

  if (options?.controls === false) {
    params.set("controls", "0")
  }

  if (options?.playsinline) {
    params.set("playsinline", "1")
  }

  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`
}
