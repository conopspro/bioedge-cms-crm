import { ImportContacts } from "@/components/import/import-contacts"

/**
 * Import Page
 *
 * Smart contact import with automatic company creation.
 * - Creates companies on-the-fly if they don't exist
 * - Matches existing companies by name or domain
 * - Skips duplicate contacts (by email)
 */
export default function ImportPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Contacts</h1>
        <p className="text-muted-foreground">
          Import contacts from CSV files. Companies will be created automatically if they don&apos;t exist.
        </p>
      </div>

      {/* Import Form */}
      <div className="max-w-3xl">
        <ImportContacts />
      </div>
    </div>
  )
}
