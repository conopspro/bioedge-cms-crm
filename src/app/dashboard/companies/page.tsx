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

  // Fetch all companies with article counts (sorted alphabetically by name)
  const { data: companies, error } = await supabase
    .from("companies")
    .select(`
      *,
      articles:articles(id, status)
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching companies:", error)
  }

  // Compute derived status based on articles
  const companiesWithDerivedStatus = (companies || []).map((company: any) => {
    const articles = company.articles || []
    const publishedArticles = articles.filter((a: any) => a.status === "published")
    const draftArticles = articles.filter((a: any) => a.status === "draft")

    // Derive status from actual article data
    let derivedStatus = company.status // fallback to manual status

    if (publishedArticles.length > 0) {
      derivedStatus = "published"
    } else if (draftArticles.length > 0 || articles.length > 0) {
      derivedStatus = "article_draft"
    } else if (!company.status || company.status === "researching") {
      derivedStatus = "researching"
    }
    // Keep manual outreach/engaged status if set
    if (company.status === "outreach" || company.status === "engaged") {
      derivedStatus = company.status
    }

    return {
      ...company,
      derivedStatus,
      articles: undefined, // Remove articles array from passed data
    }
  })

  return <CompaniesPageTabs companies={companiesWithDerivedStatus} />
}
