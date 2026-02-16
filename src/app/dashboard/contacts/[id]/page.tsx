import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ContactDetailEditor } from "@/components/contacts/contact-detail-editor"

type PageProps = {
  params: Promise<{ id: string }>
}

/**
 * Contact Detail Page
 *
 * Fully editable contact page with inline editing for each section.
 */
export default async function ContactDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch contact first
  const contactResult = await supabase.from("contacts").select("*").eq("id", id).single()

  if (contactResult.error || !contactResult.data) {
    console.error("Error fetching contact:", contactResult.error)
    notFound()
  }

  // Fetch additional data (these tables may not exist)
  const companiesResult = await supabase.from("companies").select("id, name, domain").order("name")

  let enhancementsResult = { data: [] as any[] }
  try {
    const result = await supabase.from("contact_enhancements").select("*").eq("contact_id", id).order("position")
    enhancementsResult = { data: result.data || [] }
  } catch (e) {
    console.log("contact_enhancements table may not exist")
  }

  let outreachResult = { data: [] as any[] }
  try {
    const result = await supabase.from("outreach_log").select("*").eq("contact_id", id).order("date", { ascending: false })
    outreachResult = { data: result.data || [] }
  } catch (e) {
    console.log("outreach_log table may not exist")
  }

  const contact = contactResult.data
  const companies = companiesResult.data || []
  const enhancements = enhancementsResult.data || []
  const outreachLog = outreachResult.data || []

  // Fetch company separately if contact has company_id
  let company = null
  if (contact.company_id) {
    company = companies.find(c => c.id === contact.company_id) || null
  }

  const displayName = `${contact.first_name} ${contact.last_name}`.trim() || contact.email || "Unknown Contact"

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/contacts"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Contacts
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
        {contact.title && (
          <p className="mt-1 text-lg text-muted-foreground">{contact.title}</p>
        )}
      </div>

      {/* Editable Content */}
      <ContactDetailEditor
        contact={contact}
        company={company}
        companies={companies}
        enhancements={enhancements}
        outreachLog={outreachLog}
      />
    </div>
  )
}
