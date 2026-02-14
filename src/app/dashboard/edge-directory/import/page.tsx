import { EdgeResourceImport } from "@/components/import/edge-resource-import"

/**
 * EDGE Resource Guide Import Page
 *
 * Import companies from the bioEDGE Coach Resource Guide markdown file.
 * Parses the guide, matches against existing companies, and bulk creates/updates.
 */
export default function EdgeImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import EDGE Resource Guide</h1>
        <p className="text-muted-foreground">
          Upload the bioEDGE Coach Resource Guide markdown file to import companies with EDGE classification data.
          Existing companies will be updated; new companies will be created as drafts.
        </p>
      </div>

      <div className="max-w-5xl">
        <EdgeResourceImport />
      </div>
    </div>
  )
}
