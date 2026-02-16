"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Linkedin,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  title: string | null
  linkedin_url: string | null
  show_on_articles: boolean
}

interface CompanyContactsManagerProps {
  companyId: string
  companyName: string
  contacts: Contact[]
}

export function CompanyContactsManager({
  companyId,
  companyName,
  contacts,
}: CompanyContactsManagerProps) {
  const router = useRouter()
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // New contact form state
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    email: "",
    title: "",
    phone: "",
    linkedin_url: "",
    show_on_articles: true,
  })

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingContact(true)

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newContact,
          company_id: companyId,
          outreach_status: "not_contacted",
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setNewContact({
          first_name: "",
          last_name: "",
          email: "",
          title: "",
          phone: "",
          linkedin_url: "",
          show_on_articles: true,
        })
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to add contact")
      }
    } catch (error) {
      console.error("Error adding contact:", error)
      alert("Failed to add contact")
    } finally {
      setIsAddingContact(false)
    }
  }

  const handleToggleVisibility = async (contactId: string, currentValue: boolean) => {
    setTogglingId(contactId)

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_on_articles: !currentValue }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to update contact")
      }
    } catch (error) {
      console.error("Error updating contact:", error)
      alert("Failed to update contact")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteContact = async (contactId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete contact")
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
      alert("Failed to delete contact")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contacts
            </CardTitle>
            <CardDescription>
              {contacts.length} contact{contacts.length !== 1 ? "s" : ""} for {companyName}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact for {companyName}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={newContact.first_name}
                      onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={newContact.last_name}
                      onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newContact.title}
                    onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                    placeholder="e.g., CEO, Marketing Director"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={newContact.linkedin_url}
                    onChange={(e) => setNewContact({ ...newContact, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Show on Articles</p>
                    <p className="text-xs text-muted-foreground">
                      Display this contact on published articles
                    </p>
                  </div>
                  <Switch
                    checked={newContact.show_on_articles}
                    onCheckedChange={(checked) =>
                      setNewContact({ ...newContact, show_on_articles: checked })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingContact}>
                    {isAddingContact ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Contact"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              No contacts yet
            </p>
            <p className="text-xs text-muted-foreground">
              Click &quot;Add&quot; to create a contact for this company
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {`${contact.first_name} ${contact.last_name}`.trim() || contact.email || "Unknown"}
                    </p>
                    {contact.show_on_articles ? (
                      <Badge variant="outline" className="text-xs gap-1 text-green-600">
                        <Eye className="h-3 w-3" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1 text-muted-foreground">
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </Badge>
                    )}
                  </div>
                  {contact.title && (
                    <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  {/* Toggle visibility */}
                  {togglingId === contact.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-2" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      title={contact.show_on_articles ? "Hide from articles" : "Show on articles"}
                      onClick={() => handleToggleVisibility(contact.id, contact.show_on_articles)}
                    >
                      {contact.show_on_articles ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {/* Edit */}
                  <Button variant="ghost" size="icon" asChild title="Edit">
                    <Link href={`/dashboard/contacts/${contact.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() =>
                      handleDeleteContact(contact.id, `${contact.first_name} ${contact.last_name}`.trim() || contact.email || "this contact")
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
