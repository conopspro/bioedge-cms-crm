import { redirect } from "next/navigation"

type PageProps = {
  params: Promise<{ id: string }>
}

/**
 * Edit Article Page - Redirects to Detail Page
 *
 * The article detail page now has inline editing,
 * so this page just redirects there.
 */
export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params
  redirect(`/dashboard/articles/${id}`)
}
