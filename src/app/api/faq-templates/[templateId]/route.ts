import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ templateId: string }>
}

/**
 * GET /api/faq-templates/[templateId]
 * Fetch a specific FAQ template
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { templateId } = await params
    const supabase = await createClient()

    const { data: template, error } = await supabase
      .from("faq_templates")
      .select("*")
      .eq("id", templateId)
      .single()

    if (error) {
      console.error("Error fetching FAQ template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!template) {
      return NextResponse.json({ error: "FAQ template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error in GET /api/faq-templates/[templateId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/faq-templates/[templateId]
 * Update a FAQ template
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { templateId } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "question",
      "answer",
      "category",
      "display_order",
      "is_active",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: template, error } = await supabase
      .from("faq_templates")
      .update(updateData)
      .eq("id", templateId)
      .select()
      .single()

    if (error) {
      console.error("Error updating FAQ template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error in PATCH /api/faq-templates/[templateId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/faq-templates/[templateId]
 * Delete a FAQ template
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { templateId } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("faq_templates")
      .delete()
      .eq("id", templateId)

    if (error) {
      console.error("Error deleting FAQ template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/faq-templates/[templateId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
