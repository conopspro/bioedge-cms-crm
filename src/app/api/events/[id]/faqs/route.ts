import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/events/[id]/faqs
 * Fetch all FAQs for an event (both custom and linked templates)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()

    // Fetch event FAQs (custom)
    const { data: customFaqs, error: customError } = await supabase
      .from("event_faqs")
      .select("*")
      .eq("event_id", eventId)
      .eq("is_from_template", false)
      .order("display_order", { ascending: true })

    if (customError) {
      console.error("Error fetching custom FAQs:", customError)
    }

    // Fetch linked FAQ templates
    const { data: linkedFaqs, error: linkedError } = await supabase
      .from("event_faq_links")
      .select(`
        *,
        template:faq_templates(*)
      `)
      .eq("event_id", eventId)
      .eq("is_visible", true)
      .order("display_order", { ascending: true })

    if (linkedError) {
      console.error("Error fetching linked FAQs:", linkedError)
    }

    return NextResponse.json({
      custom: customFaqs || [],
      linked: linkedFaqs || [],
    })
  } catch (error) {
    console.error("Error in GET /api/events/[id]/faqs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/events/[id]/faqs
 * Create a custom FAQ or link a template
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()
    const body = await request.json()

    // If linking a template
    if (body.faq_template_id) {
      const { faq_template_id, question_override, answer_override } = body

      // Get max display order
      const { data: existing } = await supabase
        .from("event_faq_links")
        .select("display_order")
        .eq("event_id", eventId)
        .order("display_order", { ascending: false })
        .limit(1)

      const displayOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

      const { data: link, error } = await supabase
        .from("event_faq_links")
        .insert({
          event_id: eventId,
          faq_template_id,
          question_override,
          answer_override,
          display_order: displayOrder,
        })
        .select(`
          *,
          template:faq_templates(*)
        `)
        .single()

      if (error) {
        console.error("Error linking FAQ template:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ type: "linked", data: link }, { status: 201 })
    }

    // Creating a custom FAQ
    const { question, answer, category } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      )
    }

    // Get max display order
    const { data: existing } = await supabase
      .from("event_faqs")
      .select("display_order")
      .eq("event_id", eventId)
      .order("display_order", { ascending: false })
      .limit(1)

    const displayOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

    const { data: faq, error } = await supabase
      .from("event_faqs")
      .insert({
        event_id: eventId,
        question,
        answer,
        category,
        display_order: displayOrder,
        is_from_template: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating custom FAQ:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ type: "custom", data: faq }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/events/[id]/faqs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
