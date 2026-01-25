"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Trash2, Eye, Mail, Linkedin, Star } from "lucide-react"
import { FeaturedToggle } from "@/components/ui/featured-toggle"
import type { Contact, Company } from "@/types/database"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

/**
 * Outreach status colors
 */
const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  not_contacted: "secondary",
  contacted: "warning",
  responded: "info",
  converted: "success",
}

const statusLabels: Record<string, string> = {
  not_contacted: "Not Contacted",
  contacted: "Contacted",
  responded: "Responded",
  converted: "Converted",
}

interface ContactWithCompany extends Contact {
  company?: { id: string; name: string } | null
}

interface ContactsTableProps {
  contacts: ContactWithCompany[]
}

/**
 * Contacts Table Component
 */
export function ContactsTable({ contacts }: ContactsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = search.toLowerCase()
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchLower) ||
      contact.first_name?.toLowerCase().includes(searchLower) ||
      contact.last_name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.company?.name?.toLowerCase().includes(searchLower)
    const matchesStatus =
      statusFilter === "all" || contact.outreach_status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${id}`, {
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="not_contacted">Not Contacted</option>
          <option value="contacted">Contacted</option>
          <option value="responded">Responded</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </p>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Star className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {contacts.length === 0 ? (
                    <div className="text-muted-foreground">
                      No contacts yet.{" "}
                      <Link
                        href="/dashboard/contacts/new"
                        className="text-primary underline"
                      >
                        Add your first contact
                      </Link>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No contacts match your filters.
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <FeaturedToggle
                      entityType="contacts"
                      entityId={contact.id}
                      isFeatured={contact.is_featured || false}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/contacts/${contact.id}`}
                      className="font-medium hover:underline"
                    >
                      {`${contact.first_name} ${contact.last_name}`.trim() || "Unknown"}
                    </Link>
                    {contact.title && (
                      <p className="text-sm text-muted-foreground">
                        {contact.title}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.company ? (
                      <Link
                        href={`/dashboard/companies/${contact.company.id}`}
                        className="text-sm hover:underline"
                      >
                        {contact.company.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1 text-sm hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[contact.outreach_status || "not_contacted"]}>
                      {statusLabels[contact.outreach_status || "not_contacted"]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {contact.linkedin_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="LinkedIn"
                        >
                          <a
                            href={contact.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Edit"
                      >
                        <Link href={`/dashboard/contacts/${contact.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() =>
                          handleDelete(
                            contact.id,
                            `${contact.first_name} ${contact.last_name}`
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
