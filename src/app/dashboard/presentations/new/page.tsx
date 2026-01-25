import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PresentationForm } from "@/components/presentations/presentation-form"

/**
 * New Presentation Page
 */
export default async function NewPresentationPage() {
  const supabase = await createClient()

  // Fetch related entities for the form
  const [companiesResult, contactsResult, articlesResult] = await Promise.all([
    supabase.from("companies").select("id, name, logo_url, description").order("name"),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, title, show_on_articles, company_id, bio")
      .eq("show_on_articles", true)
      .order("last_name"),
    supabase
      .from("articles")
      .select("id, title, slug, company_id, excerpt")
      .eq("status", "published")
      .order("title"),
  ])

  const companies = companiesResult.data || []
  const contacts = contactsResult.data || []
  const articles = articlesResult.data || []

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/presentations"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Presentations
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Presentation</h1>
        <p className="text-muted-foreground">
          Create a new session, panel, or talk for your content library
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <PresentationForm
          companies={companies as any}
          contacts={contacts as any}
          articles={articles as any}
        />
      </div>
    </div>
  )
}
