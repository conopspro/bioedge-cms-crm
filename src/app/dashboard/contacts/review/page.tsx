import { createClient } from "@/lib/supabase/server"
import { UnassignedContactsReview } from "@/components/contacts/unassigned-contacts-review"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Review Unassigned Contacts | BioEdge CMS",
  description: "Assign imported contacts to companies",
}

export default async function ReviewContactsPage() {
  const supabase = await createClient()

  // Fetch unassigned contacts
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .is("company_id", null)
    .order("created_at", { ascending: false })

  // Fetch all companies for assignment
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Review Unassigned Contacts
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign imported contacts to their correct companies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/contacts">All Contacts</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/import">Import More</Link>
          </Button>
        </div>
      </div>

      {/* Review Interface */}
      <UnassignedContactsReview
        initialContacts={contacts || []}
        companies={companies || []}
      />
    </div>
  )
}
