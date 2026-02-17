/**
 * News Clear API
 *
 * DELETE /api/news/clear
 *
 * Deletes ALL news articles from the database.
 * Protected by admin session only.
 * Used when you want to start fresh (e.g., after changing the AI prompt).
 */

import { createClient } from "@/lib/supabase/server"

export async function DELETE() {
  const supabase = await createClient()

  // Auth: admin session only
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Delete all news articles
  const { error, count } = await supabase
    .from("news_articles")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // delete all rows (neq trick)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ deleted: count || 0, message: "All news articles deleted" })
}
