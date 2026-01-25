import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CompanyForm } from "@/components/companies/company-form"

type PageProps = {
  params: Promise<{ id: string }>
}

/**
 * Company Edit/Create Page
 *
 * - /dashboard/companies/new/edit → Create mode (shows form)
 * - /dashboard/companies/[id]/edit → Redirects to detail page (inline editing)
 */
export default async function CompanyEditPage({ params }: PageProps) {
  const { id } = await params
  const isNewCompany = id === "new"

  // For existing companies, redirect to the detail page which has inline editing
  if (!isNewCompany) {
    redirect(`/dashboard/companies/${id}`)
  }

  // For new companies, render the create form
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/companies"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Companies
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Company</h1>
        <p className="text-muted-foreground">
          Add a new company to your research database.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <CompanyForm mode="create" />
      </div>
    </div>
  )
}
