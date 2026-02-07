import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface LeaderContext {
  name: string
  title?: string
  bio?: string
  role?: string
  company?: string
  article?: string
}

interface CompanyContext {
  name: string
  description?: string
}

interface ArticleContext {
  title: string
  excerpt?: string
}

/**
 * Build context sections for the AI prompt - supports multiple leaders
 */
function buildContextSections(
  leaders?: LeaderContext[],
  leader?: LeaderContext,
  company?: CompanyContext,
  article?: ArticleContext
): string {
  let contextSections = ""

  // Support multiple leaders (panels)
  if (leaders && leaders.length > 0) {
    if (leaders.length === 1) {
      const l = leaders[0]
      contextSections += `\n\n**Speaker:**
- Name: ${l.name}
${l.title ? `- Title: ${l.title}` : ""}
${l.bio ? `- Bio: ${l.bio}` : ""}
${l.company ? `- Company: ${l.company}` : ""}
${l.article ? `- Related Article: ${l.article}` : ""}`
    } else {
      contextSections += `\n\n**Panel Speakers (${leaders.length} participants):**`
      leaders.forEach((l, i) => {
        contextSections += `\n\n${i + 1}. **${l.name}**${l.role ? ` (${l.role})` : ""}
${l.title ? `   - Title: ${l.title}` : ""}
${l.bio ? `   - Bio: ${l.bio}` : ""}
${l.company ? `   - Company: ${l.company}` : ""}
${l.article ? `   - Related Article: ${l.article}` : ""}`
      })
    }
  } else if (leader) {
    // Backwards compatibility with single leader
    contextSections += `\n\n**Speaker/Leader:**
- Name: ${leader.name}
${leader.title ? `- Title/Role: ${leader.title}` : ""}
${leader.bio ? `- Bio: ${leader.bio}` : ""}`
  }

  if (company) {
    contextSections += `\n\n**Company/Organization:**
- Name: ${company.name}
${company.description ? `- About: ${company.description}` : ""}`
  }

  if (article) {
    contextSections += `\n\n**Related Article:**
- Title: ${article.title}
${article.excerpt ? `- Excerpt: ${article.excerpt}` : ""}`
  }

  return contextSections
}

/**
 * AI Agenda Content Generation
 *
 * Supports two modes:
 * 1. mode: "titles" - Generate 3 title suggestions based on context
 * 2. mode: "descriptions" (default) - Generate descriptions for a given title
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode = "descriptions", title, notes, transcript, leaders, leader, company, article } = body as {
      mode?: "titles" | "descriptions"
      title?: string
      notes?: string
      transcript?: string
      leaders?: LeaderContext[]
      leader?: LeaderContext
      company?: CompanyContext
      article?: ArticleContext
    }

    const contextSections = buildContextSections(leaders, leader, company, article)
    const hasLeaders = (leaders && leaders.length > 0) || leader
    const isPanel = leaders && leaders.length > 1

    // Mode: Generate title suggestions
    if (mode === "titles") {
      if (!hasLeaders && !company && !article && !notes && !transcript) {
        return NextResponse.json(
          { error: "Please select a leader, company, article, add notes, or paste a transcript to generate title suggestions" },
          { status: 400 }
        )
      }

      const titlePrompt = `You are a content writer for bioEDGE, a media company focused on longevity, biohacking, and health optimization. Generate 3 compelling ${isPanel ? "panel discussion" : "session/presentation"} title suggestions based on the following context.
${contextSections}
${notes ? `\nAdditional Notes from organizer:\n${notes}` : ""}
${transcript ? `\n**Transcript from the presentation:**\n${transcript.slice(0, 8000)}` : ""}

Generate 3 distinct title options that:
- Are engaging and capture attention
- Are suitable for a conference/event agenda
- Reflect the longevity/biohacking/health optimization space
${isPanel ? "- Reflect that this is a panel discussion with multiple speakers" : ""}
- Range from straightforward to creative
- Are concise (ideally under 10 words each)

Respond ONLY with valid JSON in this exact format:
{
  "titles": [
    "First title option",
    "Second title option",
    "Third title option"
  ]
}`

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: titlePrompt }],
      })

      const textContent = message.content.find((block) => block.type === "text")
      if (!textContent || textContent.type !== "text") {
        throw new Error("No text response from Claude")
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      const result = JSON.parse(jsonMatch[0])
      return NextResponse.json({ titles: result.titles || [] })
    }

    // Mode: Generate descriptions (default)
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const prompt = `You are a content writer for bioEDGE, a media company focused on longevity, biohacking, and health optimization. Generate compelling descriptions for ${isPanel ? "a panel discussion" : "an agenda session/presentation"}.

Session Title: ${title}
${notes ? `\nAdditional Notes from organizer:\n${notes}` : ""}
${contextSections}
${transcript ? `\n**Transcript from the presentation:**\nUse this transcript to extract specific topics, insights, key points, and the actual substance of what was discussed. Ground the descriptions in the real content rather than making general assumptions.\n\n${transcript.slice(0, 12000)}` : ""}

Generate the following in JSON format:

1. **short_description**: A concise, engaging summary (~100 words). Should:
   - Capture the essence of the ${isPanel ? "panel discussion" : "session"} topic
   - Highlight why it's relevant to longevity/health enthusiasts
   - Be suitable for listings, cards, and previews
   - Use active, engaging language
   ${isPanel ? "- Mention it's a panel discussion with multiple expert perspectives" : ""}
   ${hasLeaders ? "- Reference the speaker(s) expertise or background where relevant" : ""}
   ${company ? "- Mention the company's work or focus area if it adds value" : ""}

2. **long_description**: A comprehensive description (~400 words). Should:
   - Provide a thorough overview of what the ${isPanel ? "panel" : "session"} covers
   - Explain key topics, themes, or questions that will be addressed
   - Describe what attendees will learn or gain
   - Include context about why this topic matters in the longevity/biohacking space
   - Maintain bioEDGE's authoritative yet approachable tone
   - Be suitable for a detail page
   - IMPORTANT: Structure with 3-4 paragraphs separated by double newlines (\\n\\n) for readability
   - First paragraph: Hook and overview
   - Middle paragraphs: Key topics and what attendees will learn
   - Final paragraph: Takeaways and why this matters
   ${isPanel ? "- Highlight the diverse expertise of the panelists and how they'll contribute unique perspectives" : ""}
   ${hasLeaders ? "- Incorporate the speaker(s) credentials and perspectives" : ""}
   ${company ? "- Weave in the company's expertise and contributions to the field" : ""}
   ${article ? "- Reference or build upon themes from the related article" : ""}

Respond ONLY with valid JSON in this exact format:
{
  "short_description": "...",
  "long_description": "..."
}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: transcript ? 2000 : 1500,
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
      short_description: result.short_description || "",
      long_description: result.long_description || "",
    })
  } catch (error) {
    console.error("AI agenda content generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    )
  }
}
