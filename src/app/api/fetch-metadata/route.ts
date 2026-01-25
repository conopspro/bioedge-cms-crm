import { NextRequest, NextResponse } from "next/server"

const PERPLEXITY_API = "https://api.perplexity.ai/chat/completions"

/**
 * POST /api/fetch-metadata
 *
 * Fetches metadata (title, author) from a URL using Perplexity.
 * Useful for auto-filling book info from Amazon links.
 */
export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Perplexity API not configured" },
        { status: 500 }
      )
    }

    // Check if URL is an Amazon link (including short URLs like a.co and amzn.to)
    const isAmazonUrl = url.includes("amazon") || url.includes("a.co") || url.includes("amzn")

    // Build prompt based on type
    let prompt = ""
    if (type === "book" && isAmazonUrl) {
      prompt = `Look at this Amazon book URL and extract the book information:
URL: ${url}

Return ONLY a JSON object with these fields:
{
  "title": "Full book title including subtitle",
  "author": "Author name(s)"
}

Only return the JSON, no other text.`
    } else if (type === "scholar") {
      prompt = `Look at this research paper/academic article URL and extract the paper information:
URL: ${url}

Return ONLY a JSON object with these fields:
{
  "title": "Full paper title",
  "publication": "Journal name, conference name, or publisher (if available)"
}

Only return the JSON, no other text.`
    } else {
      // Generic URL metadata extraction
      prompt = `Look at this URL and extract the page title:
URL: ${url}

Return ONLY a JSON object with:
{
  "title": "The page/content title"
}

Only return the JSON, no other text.`
    }

    const response = await fetch(PERPLEXITY_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a metadata extraction assistant. Extract information from URLs and return clean JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.error("Perplexity API error:", response.status)
      return NextResponse.json(
        { error: "Failed to fetch metadata" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    // Parse JSON from response
    let metadata = {}
    try {
      let jsonStr = content.trim()
      // Extract JSON from markdown code block if present
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }
      // Find JSON object
      const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (objectMatch) {
        jsonStr = objectMatch[0]
      }
      metadata = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error("Failed to parse metadata:", parseError)
      return NextResponse.json(
        { error: "Failed to parse metadata" },
        { status: 500 }
      )
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error("Fetch metadata error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
