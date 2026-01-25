import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

/**
 * AI Event Content Generation
 *
 * Uses Claude to generate tagline, description, and extended information
 * for an event based on the event name, location, dates, and optional notes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventName, city, state, country, startDate, endDate, notes } = body

    if (!eventName) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      )
    }

    // Build context for Claude
    let locationStr = ""
    if (city || state || country) {
      const parts = [city, state, country].filter(Boolean)
      locationStr = parts.join(", ")
    }

    let dateStr = ""
    if (startDate) {
      const start = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        dateStr = `${start.toLocaleDateString("en-US", { month: "long", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
      } else {
        dateStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      }
    }

    const prompt = `You are a marketing copywriter for bioEDGE, a media company focused on longevity, biohacking, and health optimization. Generate compelling content for an event.

Event Name: ${eventName}
${locationStr ? `Location: ${locationStr}` : ""}
${dateStr ? `Dates: ${dateStr}` : ""}
${notes ? `\nAdditional Notes from organizer:\n${notes}` : ""}

Generate the following in JSON format:

1. **tagline**: A catchy, memorable tagline (under 80 characters). Should evoke excitement and capture the essence of bioEDGE's focus on cutting-edge health optimization. Can be clever/punny if appropriate.

2. **description**: A compelling event description (2-3 paragraphs, ~150-200 words). Should:
   - Open with an engaging hook
   - Explain what attendees will experience
   - Highlight the value proposition (networking, learning, etc.)
   - Include a call to action
   - Maintain bioEDGE's authoritative yet approachable tone

3. **extended_info**: Extended information about the event (3-4 paragraphs, ~200-300 words). Should include:
   - What to expect at the event
   - Who should attend (target audience)
   - Topics that may be covered
   - Any logistics or practical information
   - Why this event is unique/valuable

Respond ONLY with valid JSON in this exact format:
{
  "tagline": "...",
  "description": "...",
  "extended_info": "..."
}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    // Extract text content
    const textContent = message.content.find((block) => block.type === "text")
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude")
    }

    // Parse JSON response
    let result
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse Claude response:", textContent.text)
      throw new Error("Failed to parse AI response")
    }

    return NextResponse.json({
      tagline: result.tagline || "",
      description: result.description || "",
      extended_info: result.extended_info || "",
    })
  } catch (error) {
    console.error("AI event content generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    )
  }
}
