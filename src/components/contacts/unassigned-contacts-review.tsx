"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Contact, Company } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UnassignedContactsReviewProps {
  initialContacts: Contact[]
  companies: Company[]
}

/**
 * Review Unassigned Contacts Component
 *
 * Displays contacts that weren't matched to companies during import.
 * Allows manual assignment to companies with intelligent suggestions.
 */
export function UnassignedContactsReview({
  initialContacts,
  companies,
}: UnassignedContactsReviewProps) {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [isAssigning, setIsAssigning] = useState<string | null>(null)
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [expandedContact, setExpandedContact] = useState<string | null>(null)

  // Build a map of domains to company for suggestions
  const domainToCompany = new Map<string, Company>()
  companies.forEach((company) => {
    if (company.domain) {
      domainToCompany.set(company.domain.toLowerCase(), company)
    }
  })

  // Get suggested companies for a contact based on email domain and raw company name
  const getSuggestions = (contact: Contact): Company[] => {
    const suggestions: Company[] = []

    // 1. Try email domain match
    if (contact.email) {
      const emailDomain = contact.email.split("@")[1]?.toLowerCase()
      if (emailDomain) {
        const domainMatch = domainToCompany.get(emailDomain)
        if (domainMatch && !suggestions.find((s) => s.id === domainMatch.id)) {
          suggestions.push(domainMatch)
        }
      }
    }

    // 2. Try domain field match (if available)
    if (contact.domain) {
      const contactDomain = contact.domain.toLowerCase()
      const domainMatch = domainToCompany.get(contactDomain)
      if (domainMatch && !suggestions.find((s) => s.id === domainMatch.id)) {
        suggestions.push(domainMatch)
      }
    }

    return suggestions.slice(0, 3) // Max 3 suggestions
  }

  // Filter companies based on search term
  const getFilteredCompanies = (contactId: string): Company[] => {
    const searchTerm = searchTerms[contactId]?.toLowerCase() || ""
    if (!searchTerm) return companies.slice(0, 10) // Show first 10 if no search

    return companies
      .filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm) ||
          company.domain?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10)
  }

  // Assign contact to company
  const handleAssign = async (contactId: string, companyId: string) => {
    setIsAssigning(contactId)

    try {
      const response = await fetch(`/api/contacts/${contactId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign contact")
      }

      // Remove from list
      setContacts((prev) => prev.filter((c) => c.id !== contactId))
      setExpandedContact(null)
    } catch (error) {
      console.error("Error assigning contact:", error)
      alert("Failed to assign contact. Please try again.")
    } finally {
      setIsAssigning(null)
    }
  }

  // Skip/delete contact
  const handleSkip = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return

    setIsAssigning(contactId)

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete contact")
      }

      setContacts((prev) => prev.filter((c) => c.id !== contactId))
    } catch (error) {
      console.error("Error deleting contact:", error)
      alert("Failed to delete contact. Please try again.")
    } finally {
      setIsAssigning(null)
    }
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground mb-4">
            No unassigned contacts to review.
          </p>
          <Button onClick={() => router.push("/dashboard/contacts")}>
            View All Contacts
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} need
          company assignment
        </p>
      </div>

      {contacts.map((contact) => {
        const suggestions = getSuggestions(contact)
        const isExpanded = expandedContact === contact.id
        const filteredCompanies = getFilteredCompanies(contact.id)

        return (
          <Card
            key={contact.id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {`${contact.first_name} ${contact.last_name}`.trim() || contact.email || "Unknown"}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {contact.email}
                    {contact.title && (
                      <span className="ml-2 text-foreground/70">
                        • {contact.title}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSkip(contact.id)}
                    disabled={isAssigning === contact.id}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {contact.domain && (
                  <div>
                    <span className="text-muted-foreground">Domain:</span>
                    <p className="font-medium">{contact.domain}</p>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{contact.phone}</p>
                  </div>
                )}
                {contact.source && (
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <p className="font-medium">{contact.source}</p>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Suggested matches:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((company) => (
                      <Button
                        key={company.id}
                        size="sm"
                        variant="outline"
                        className="h-auto py-1.5"
                        onClick={() => handleAssign(contact.id, company.id)}
                        disabled={isAssigning === contact.id}
                      >
                        <span>{company.name}</span>
                        {company.domain && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {company.domain}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand to show all companies */}
              {!isExpanded ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedContact(contact.id)}
                  className="w-full"
                >
                  Search all companies...
                </Button>
              ) : (
                <div className="space-y-3 pt-2 border-t">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerms[contact.id] || ""}
                    onChange={(e) =>
                      setSearchTerms((prev) => ({
                        ...prev,
                        [contact.id]: e.target.value,
                      }))
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    autoFocus
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {filteredCompanies.map((company) => (
                      <Button
                        key={company.id}
                        size="sm"
                        variant="outline"
                        className="h-auto py-2 justify-start"
                        onClick={() => handleAssign(contact.id, company.id)}
                        disabled={isAssigning === contact.id}
                      >
                        <div className="text-left">
                          <div>{company.name}</div>
                          {company.domain && (
                            <div className="text-xs text-muted-foreground">
                              {company.domain}
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExpandedContact(null)
                      setSearchTerms((prev) => {
                        const next = { ...prev }
                        delete next[contact.id]
                        return next
                      })
                    }}
                    className="w-full"
                  >
                    Collapse
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
