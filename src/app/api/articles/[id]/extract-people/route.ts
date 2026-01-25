import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { anthropicService } from "@/lib/services/anthropic"

/**
 * POST /api/articles/[id]/extract-people
 *
 * Extracts key people from an article using AI.
 * This is a standalone endpoint that only does extraction,
 * separate from the full enhancement flow.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    if (!anthropicService.isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 400 }
      )
    }

    // Get the article
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("id, title, content, excerpt, key_people")
      .eq("id", id)
      .single()

    if (articleError || !article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    const articleContent = article.content || article.excerpt || ""

    if (!articleContent) {
      return NextResponse.json(
        { error: "Article has no content to analyze" },
        { status: 400 }
      )
    }

    console.log(`Extracting key people from article: ${article.title}`)
    console.log(`Content length: ${articleContent.length} characters`)
    console.log(`Content preview: ${articleContent.slice(0, 500)}...`)

    // Extract key people using AI
    const keyPeople = await anthropicService.extractKeyPeople(
      article.title,
      articleContent
    )

    console.log(`Extracted key people: ${keyPeople.join(", ") || "none found"}`)

    // Save to database
    const { error: updateError } = await supabase
      .from("articles")
      .update({ key_people: keyPeople })
      .eq("id", id)

    if (updateError) {
      console.error("Failed to save key people:", updateError)
      return NextResponse.json(
        { error: `Failed to save key people to database: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log(`Successfully saved key_people to article ${id}:`, keyPeople)

    return NextResponse.json({
      success: true,
      keyPeople,
      message: keyPeople.length > 0
        ? `Found ${keyPeople.length} key people: ${keyPeople.join(", ")}`
        : "No key people found in article content",
    })
  } catch (error) {
    console.error("Error extracting key people:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract key people" },
      { status: 500 }
    )
  }
}
