import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ContactsTable } from "@/components/contacts/contacts-table"

/**
 * Contacts List Page
 *
 * Displays all contacts with company associations.
 */
export default async function ContactsPage() {
  const supabase = await createClient()

  // Fetch all contacts
  const { data: contactsData, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contacts:", error)
  }

  // Fetch companies separately to avoid join issues
  const companyIds = [...new Set((contactsData || []).map(c => c.company_id).filter(Boolean))]
  let companiesMap: Record<string, { id: string; name: string }> = {}

  if (companyIds.length > 0) {
    const { data: companiesData } = await supabase
      .from("companies")
      .select("id, name")
      .in("id", companyIds)

    companiesMap = (companiesData || []).reduce((acc, c) => {
      acc[c.id] = c
      return acc
    }, {} as Record<string, { id: string; name: string }>)
  }

  // Combine contacts with company data
  const contacts = (contactsData || []).map(contact => ({
    ...contact,
    company: contact.company_id ? companiesMap[contact.company_id] || null : null,
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage contacts and track your outreach.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/contacts/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Link>
        </Button>
      </div>

      {/* Contacts Table */}
      <ContactsTable contacts={contacts || []} />
    </div>
  )
}
