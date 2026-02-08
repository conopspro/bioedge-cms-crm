import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/fetch-metadata
 *
 * Fetches metadata (title, author) from a URL by scraping the actual page.
 * Extracts Open Graph tags, meta tags, and structured data from the HTML.
 * No AI involved - returns the exact metadata from the source page.
 */
export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Fetch the actual page HTML
    let html = ""
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      })

      if (!response.ok) {
        console.error("Failed to fetch URL:", response.status, url)
        return NextResponse.json(
          { error: "Failed to fetch page" },
          { status: 502 }
        )
      }

      html = await response.text()
    } catch (fetchError) {
      console.error("Error fetching URL:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch page" },
        { status: 502 }
      )
    }

    // Extract metadata from HTML
    const metadata = extractMetadata(html, type, url)

    return NextResponse.json(metadata)
  } catch (error) {
    console.error("Fetch metadata error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Extract metadata from HTML based on content type
 */
function extractMetadata(
  html: string,
  type: string,
  url: string
): Record<string, string> {
  const result: Record<string, string> = {}

  if (type === "book") {
    // For Amazon books, extract title and author from the page
    result.title = extractBookTitle(html) || extractOGTitle(html) || extractPageTitle(html) || ""
    result.author = extractBookAuthor(html) || ""
  } else if (type === "scholar") {
    // For research papers, extract title and publication
    result.title = extractOGTitle(html) || extractPageTitle(html) || ""
    result.publication = extractMetaContent(html, "citation_journal_title") || ""
  } else {
    // Generic: just get the page title
    result.title = extractOGTitle(html) || extractPageTitle(html) || ""
  }

  // Clean up titles - remove site name suffixes
  if (result.title) {
    result.title = cleanTitle(result.title, url)
  }

  return result
}

/**
 * Extract book title from Amazon page HTML
 * Tries multiple approaches in order of reliability
 */
function extractBookTitle(html: string): string {
  // 1. Try the product title span (most reliable on Amazon)
  const productTitleMatch = html.match(
    /id="productTitle"[^>]*>\s*([^<]+)/i
  )
  if (productTitleMatch) {
    return productTitleMatch[1].trim()
  }

  // 2. Try the ebook product title
  const ebookTitleMatch = html.match(
    /id="ebooksProductTitle"[^>]*>\s*([^<]+)/i
  )
  if (ebookTitleMatch) {
    return ebookTitleMatch[1].trim()
  }

  // 3. Try schema.org structured data for name
  const schemaNameMatch = html.match(
    /"name"\s*:\s*"([^"]+)"/
  )
  if (schemaNameMatch) {
    return decodeHTMLEntities(schemaNameMatch[1].trim())
  }

  // 4. Try og:title
  return extractOGTitle(html) || ""
}

/**
 * Extract book author from Amazon page HTML
 */
function extractBookAuthor(html: string): string {
  // 1. Try the author link/span on Amazon
  // Amazon uses "bylineInfo" div with author links
  const bylineMatch = html.match(
    /id="bylineInfo"[\s\S]*?class="author[\s\S]*?<a[^>]*>([^<]+)/i
  )
  if (bylineMatch) {
    return bylineMatch[1].trim()
  }

  // 2. Try contributorNameID
  const contributorMatch = html.match(
    /class="contributorNameID"[^>]*>([^<]+)/i
  )
  if (contributorMatch) {
    return contributorMatch[1].trim()
  }

  // 3. Try the simpler author pattern on Amazon
  const authorLinkMatch = html.match(
    /class="a-link-normal contributorNameID"[^>]*>([^<]+)/i
  )
  if (authorLinkMatch) {
    return authorLinkMatch[1].trim()
  }

  // 4. Try any link within bylineInfo
  const bylineAnyMatch = html.match(
    /id="bylineInfo"[\s\S]*?<a[^>]*class="a-link-normal"[^>]*>([^<]+)/i
  )
  if (bylineAnyMatch) {
    return bylineAnyMatch[1].trim()
  }

  // 5. Try schema.org author
  const schemaAuthorMatch = html.match(
    /"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/
  )
  if (schemaAuthorMatch) {
    return decodeHTMLEntities(schemaAuthorMatch[1].trim())
  }

  // 6. Try simple schema.org author (string value)
  const schemaAuthorSimple = html.match(
    /"author"\s*:\s*"([^"]+)"/
  )
  if (schemaAuthorSimple) {
    return decodeHTMLEntities(schemaAuthorSimple[1].trim())
  }

  // 7. Try meta tag author
  return extractMetaContent(html, "author") || ""
}

/**
 * Extract Open Graph title
 */
function extractOGTitle(html: string): string {
  const match = html.match(
    /<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i
  ) || html.match(
    /<meta\s+content="([^"]+)"\s+(?:property|name)="og:title"/i
  )
  return match ? decodeHTMLEntities(match[1].trim()) : ""
}

/**
 * Extract <title> tag content
 */
function extractPageTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? decodeHTMLEntities(match[1].trim()) : ""
}

/**
 * Extract content from a meta tag by name
 */
function extractMetaContent(html: string, name: string): string {
  const match = html.match(
    new RegExp(
      `<meta\\s+(?:name|property)="${name}"\\s+content="([^"]+)"`,
      "i"
    )
  ) || html.match(
    new RegExp(
      `<meta\\s+content="([^"]+)"\\s+(?:name|property)="${name}"`,
      "i"
    )
  )
  return match ? decodeHTMLEntities(match[1].trim()) : ""
}

/**
 * Clean title by removing common site name suffixes
 */
function cleanTitle(title: string, url: string): string {
  // Remove Amazon-style suffixes
  if (url.includes("amazon")) {
    title = title
      .replace(/\s*:\s*Amazon\.com\s*:\s*Books\s*$/i, "")
      .replace(/\s*-\s*Amazon\.com\s*$/i, "")
      .replace(/\s*\|\s*Amazon\.com\s*$/i, "")
      .replace(/Amazon\.com\s*:\s*/i, "")
  }

  // Remove generic suffixes
  title = title
    .replace(/\s*\|\s*[^|]+$/, "") // Remove " | Site Name"
    .replace(/\s*-\s*[^-]+$/, "") // Remove " - Site Name" (careful: only last one)

  return title.trim()
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
}
