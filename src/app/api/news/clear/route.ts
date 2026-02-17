/**
 * News Clear API
 *
 * DELETE /api/news/clear
 *
 * Deletes news articles from the database.
 * Send { ids: [...] } in the body to delete specific articles.
 * Send no body (or empty ids) to delete ALL articles.
 * Protected by admin session only.
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  // Auth: admin session only
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check for specific IDs in the body
  let ids: string[] = []
  try {
    const body = await request.json()
    if (body.ids && Array.isArray(body.ids) && body.ids.length > 0) {
      ids = body.ids
    }
  } catch {
    // No body or invalid JSON — delete all
  }

  if (ids.length > 0) {
    // Delete specific articles
    const { error, count } = await supabase
      .from("news_articles")
      .delete()
      .in("id", ids)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ deleted: count || ids.length, message: `${count || ids.length} articles deleted` })
  } else {
    // Delete all articles
    const { error, count } = await supabase
      .from("news_articles")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ deleted: count || 0, message: "All news articles deleted" })
  }
}
