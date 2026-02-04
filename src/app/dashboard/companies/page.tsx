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

  // Fetch all companies (sorted alphabetically by name)
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching companies:", error)
  }

  return <CompaniesPageTabs companies={companies || []} />
}
