"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Plus, Trash2, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Contact {
  id: string
  first_name: string
  last_name: string
  title: string | null
  avatar_url: string | null
}

interface KeyPeopleCardProps {
  articleId: string
  companyId: string | null
  keyPeopleContactIds: string[]
}

/**
 * Key People Card Component
 *
 * Select existing contacts to associate with an article as key people.
 * These contacts will be displayed on the public article page.
 */
export function KeyPeopleCard({ articleId, companyId, keyPeopleContactIds: initialIds }: KeyPeopleCardProps) {
  const router = useRouter()
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(initialIds || [])
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true)
      try {
        // Fetch all contacts (or company contacts if companyId is set)
        const url = companyId
          ? `/api/contacts?company_id=${companyId}`
          : "/api/contacts"

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          const contacts = data.contacts || data || []
          setAvailableContacts(contacts)

          // Set initially selected contacts
          const selected = contacts.filter((c: Contact) => initialIds?.includes(c.id))
          setSelectedContacts(selected)
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContacts()
  }, [companyId, initialIds])

  const handleAddContact = async (contact: Contact) => {
    if (selectedContactIds.includes(contact.id)) return

    setIsSaving(true)
    setError(null)

    try {
      const updatedIds = [...selectedContactIds, contact.id]

      const response = await fetch(`/api/articles/${articleId}/key-people`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyPeopleContactIds: updatedIds }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add contact")
      }

      setSelectedContactIds(updatedIds)
      setSelectedContacts([...selectedContacts, contact])
      setShowSearch(false)
      setSearchQuery("")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveContact = async (contactId: string) => {
    setIsSaving(true)
    setError(null)

    try {
      const updatedIds = selectedContactIds.filter(id => id !== contactId)

      const response = await fetch(`/api/articles/${articleId}/key-people`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyPeopleContactIds: updatedIds }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to remove contact")
      }

      setSelectedContactIds(updatedIds)
      setSelectedContacts(selectedContacts.filter(c => c.id !== contactId))
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Filter available contacts for search
  const filteredContacts = availableContacts.filter(contact => {
    // Don't show already selected contacts
    if (selectedContactIds.includes(contact.id)) return false

    // Filter by search query
    if (searchQuery) {
      const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase()
      return fullName.includes(searchQuery.toLowerCase())
    }
    return true
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Key People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Key People
            </CardTitle>
            <CardDescription>
              Select contacts to feature on this article.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search/Add form */}
        {showSearch && (
          <div className="rounded-lg border border-primary/50 bg-muted/50 p-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2 text-center">
                  {searchQuery ? "No contacts found" : "No more contacts available"}
                </p>
              ) : (
                filteredContacts.slice(0, 10).map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleAddContact(contact)}
                    disabled={isSaving}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-background text-left transition-colors"
                  >
                    {contact.avatar_url ? (
                      <img
                        src={contact.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {contact.first_name?.[0]}{contact.last_name?.[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {contact.first_name} {contact.last_name}
                      </p>
                      {contact.title && (
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.title}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
              {filteredContacts.length > 10 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Type to search for more...
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearch(false)
                setSearchQuery("")
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Selected contacts list */}
        {selectedContacts.length > 0 ? (
          <div className="space-y-2">
            {selectedContacts.map(contact => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-2 rounded-md border"
              >
                <Link
                  href={`/dashboard/contacts/${contact.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80"
                >
                  {contact.avatar_url ? (
                    <img
                      src={contact.avatar_url}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {contact.first_name?.[0]}{contact.last_name?.[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {contact.first_name} {contact.last_name}
                    </p>
                    {contact.title && (
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.title}
                      </p>
                    )}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => handleRemoveContact(contact.id)}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : !showSearch && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No key people selected. Click "Add" to select contacts.
          </p>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
