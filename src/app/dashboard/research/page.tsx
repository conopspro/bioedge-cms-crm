import { CompanyResearchForm } from "@/components/research/company-research-form"

export const metadata = {
  title: "Research Company | BioEdge CMS",
  description: "Research a new company and generate content",
}

/**
 * Company Research Page
 *
 * Entry point for researching new companies and generating:
 * - Company brief
 * - Native article
 * - Warm pitch email
 */
export default function ResearchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Company</h1>
        <p className="text-muted-foreground mt-1">
          Enter company details to generate a company brief, native article, and warm pitch email
        </p>
      </div>

      {/* Research Form */}
      <CompanyResearchForm />
    </div>
  )
}
