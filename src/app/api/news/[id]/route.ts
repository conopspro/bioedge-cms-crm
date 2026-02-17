/**
 * News Article API (Individual)
 *
 * PATCH /api/news/[id] — Update a news article (status, etc.)
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  // Only allow specific fields to be updated
  const allowedFields: Record<string, unknown> = {}
  if (body.status && ["draft", "published", "hidden"].includes(body.status)) {
    allowedFields.status = body.status
  }

  if (Object.keys(allowedFields).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  allowedFields.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("news_articles")
    .update(allowedFields)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
