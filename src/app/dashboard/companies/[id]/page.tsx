import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { CompanyDetailEditor } from "@/components/companies/company-detail-editor"
import { VisibilityToggle } from "@/components/companies/visibility-toggle"

/**
 * Status badge color mapping
 */
const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  researching: "secondary",
  article_draft: "warning",
  published: "info",
  outreach: "default",
  engaged: "success",
}

const statusLabels: Record<string, string> = {
  researching: "Researching",
  article_draft: "Article Draft",
  published: "Published",
  outreach: "Outreach",
  engaged: "Engaged",
}

type PageProps = {
  params: Promise<{ id: string }>
}

/**
 * Company Detail Page
 *
 * Inline editable detail page - no separate edit page needed.
 */
export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch company
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !company) {
    notFound()
  }

  // Fetch related data
  const [contactsResult, articlesResult] = await Promise.all([
    supabase.from("contacts").select("id, first_name, last_name, title, email, show_on_articles").eq("company_id", id).order("last_name"),
    supabase.from("articles").select("id, title, status, published_at, created_at").eq("company_id", id).order("created_at", { ascending: false }),
  ])

  const contacts = contactsResult.data || []
  const articles = articlesResult.data || []

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/companies"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Companies
      </Link>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <VisibilityToggle companyId={company.id} isDraft={company.is_draft} />
            <Badge variant={statusColors[company.status]}>
              {statusLabels[company.status]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Inline Editable Content */}
      <CompanyDetailEditor
        company={company}
        contacts={contacts}
        articles={articles}
      />
    </div>
  )
}
