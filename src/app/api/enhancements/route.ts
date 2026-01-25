import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/enhancements
 *
 * Create a new article enhancement manually
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { article_id, type, title, url, metadata } = body

    if (!article_id || !type) {
      return NextResponse.json(
        { error: "article_id and type are required" },
        { status: 400 }
      )
    }

    if (!["youtube", "scholar", "book", "link", "image"].includes(type)) {
      return NextResponse.json(
        { error: "type must be youtube, scholar, book, link, or image" },
        { status: 400 }
      )
    }

    // Get the next position
    const { data: existing } = await supabase
      .from("article_enhancements")
      .select("position")
      .eq("article_id", article_id)
      .order("position", { ascending: false })
      .limit(1)

    const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0

    // Build metadata based on type
    let enhancementMetadata = metadata || {}

    // For YouTube, extract video ID and build embed URL
    if (type === "youtube" && url) {
      const videoId = extractYouTubeVideoId(url)
      if (videoId) {
        enhancementMetadata = {
          ...enhancementMetadata,
          videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        }
      }
    }

    const { data, error } = await supabase
      .from("article_enhancements")
      .insert({
        article_id,
        type,
        title: title || null,
        url: url || null,
        embed_code: type === "youtube" && enhancementMetadata.videoId
          ? `https://www.youtube.com/embed/${enhancementMetadata.videoId}`
          : null,
        metadata: Object.keys(enhancementMetadata).length > 0 ? enhancementMetadata : null,
        position: nextPosition,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating enhancement:", error)
      return NextResponse.json(
        { error: "Failed to create enhancement" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, enhancement: data })
  } catch (error) {
    console.error("Enhancement creation error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the video ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
