import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ContactForm } from "@/components/contacts/contact-form"

/**
 * New Contact Page
 *
 * Form to create a new contact.
 */
export default async function NewContactPage() {
  const supabase = await createClient()

  // Fetch companies for the dropdown
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .order("name")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Contact</h1>
        <p className="text-muted-foreground">
          Add a new contact to your CRM.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ContactForm companies={companies || []} mode="create" />
        </Suspense>
      </div>
    </div>
  )
}
