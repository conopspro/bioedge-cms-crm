import { createClient } from "@/lib/supabase/server"
import { CompaniesPageTabs } from "@/components/companies/companies-page-tabs"

/**
 * Companies List Page
 *
 * Displays all companies in a searchable, sortable table.
 * Includes a Settings tab for managing company categories.
 * Server component that fetches data from Supabase.
 */
export default async function CompaniesPage() {
  const supabase = await createClient()

  // Fetch all companies
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching companies:", error)
  }

  return <CompaniesPageTabs companies={companies || []} />
}
