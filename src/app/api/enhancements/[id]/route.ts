import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/enhancements/[id]
 *
 * Get a single enhancement
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("article_enhancements")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Enhancement not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching enhancement:", error)
    return NextResponse.json(
      { error: "Failed to fetch enhancement" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/enhancements/[id]
 *
 * Update an enhancement
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { title, url, metadata, position } = body

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) updateData.title = title
    if (url !== undefined) updateData.url = url
    if (metadata !== undefined) updateData.metadata = metadata
    if (position !== undefined) updateData.position = position

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("article_enhancements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating enhancement:", error)
      return NextResponse.json(
        { error: "Failed to update enhancement" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, enhancement: data })
  } catch (error) {
    console.error("Enhancement update error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/enhancements/[id]
 *
 * Delete an enhancement
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("article_enhancements")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting enhancement:", error)
      return NextResponse.json(
        { error: "Failed to delete enhancement" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Enhancement deletion error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
