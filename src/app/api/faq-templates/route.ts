import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/faq-templates
 * Fetch all FAQ templates
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: templates, error } = await supabase
      .from("faq_templates")
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching FAQ templates:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error in GET /api/faq-templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/faq-templates
 * Create a new FAQ template
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { question, answer, category } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      )
    }

    // Get max display order for category
    const { data: existing } = await supabase
      .from("faq_templates")
      .select("display_order")
      .eq("category", category || null)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

    const { data: template, error } = await supabase
      .from("faq_templates")
      .insert({
        question,
        answer,
        category,
        display_order: displayOrder,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating FAQ template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/faq-templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
