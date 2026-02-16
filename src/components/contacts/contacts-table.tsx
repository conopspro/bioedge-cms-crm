"use client"

import Link from "next/link"
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Linkedin,
  Star,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { FeaturedToggle } from "@/components/ui/featured-toggle"
import type { Contact } from "@/types/database"
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

export interface ContactWithCompany extends Contact {
  company?: { id: string; name: string; is_draft?: boolean | null } | null
}

interface ContactsTableProps {
  contacts: ContactWithCompany[]
  total: number
  page: number
  pageSize: number
  search: string
  notWithinFilter: string
  convertedFilter: string
  catchAllFilter: string
  visibilityFilter: string
  outreachFilter: string
  loading: boolean
  onSearchChange: (search: string) => void
  onNotWithinChange: (notWithin: string) => void
  onConvertedChange: (converted: string) => void
  onCatchAllChange: (catchAll: string) => void
  onVisibilityChange: (visibility: string) => void
  onOutreachChange: (outreach: string) => void
  onPageChange: (page: number) => void
  onRefresh: () => void
}

/**
 * Contacts Table Component — server-side paginated
 */
export function ContactsTable({
  contacts,
  total,
  page,
  pageSize,
  search,
  notWithinFilter,
  convertedFilter,
  catchAllFilter,
  visibilityFilter,
  outreachFilter,
  loading,
  onSearchChange,
  onNotWithinChange,
  onConvertedChange,
  onCatchAllChange,
  onVisibilityChange,
  onOutreachChange,
  onPageChange,
  onRefresh,
}: ContactsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

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
        onRefresh()
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
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={notWithinFilter}
          onChange={(e) => onNotWithinChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Not Contacted Within: Any</option>
          <option value="7d">Not Within 7 Days</option>
          <option value="30d">Not Within 30 Days</option>
          <option value="90d">Not Within 90 Days</option>
        </select>
        <select
          value={convertedFilter}
          onChange={(e) => onConvertedChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Converted: Any</option>
          <option value="only">Converted Only</option>
          <option value="exclude">Exclude Converted</option>
        </select>
        <select
          value={catchAllFilter}
          onChange={(e) => onCatchAllChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Catch-All: Any</option>
          <option value="only">Catch-All Only</option>
          <option value="exclude">Exclude Catch-All</option>
        </select>
        <select
          value={visibilityFilter}
          onChange={(e) => onVisibilityChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Visibility</option>
          <option value="published">Published</option>
          <option value="warning">Needs Attention</option>
          <option value="hidden">Hidden</option>
        </select>
        <select
          value={outreachFilter}
          onChange={(e) => onOutreachChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Last Outreach: Any</option>
          <option value="never">Never</option>
          <option value="7d">Within 7 Days</option>
          <option value="30d">Within 30 Days</option>
          <option value="90d">Within 90 Days</option>
          <option value="90d_plus">90+ Days Ago</option>
        </select>
        {loading && (
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {total === 0
          ? "No contacts found"
          : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total.toLocaleString()} contacts`}
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
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {loading ? (
                    <div className="text-muted-foreground">Loading...</div>
                  ) : total === 0 && !search && notWithinFilter === "all" && convertedFilter === "all" && visibilityFilter === "all" && outreachFilter === "all" ? (
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
              contacts.map((contact) => (
                <TableRow key={contact.id} className={loading ? "opacity-50" : ""}>
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            contact.company.is_draft === false
                              ? "bg-green-500"
                              : "bg-amber-400"
                          }`}
                          title={contact.company.is_draft === false ? "Company published" : "Company in draft"}
                        />
                        <Link
                          href={`/dashboard/companies/${contact.company.id}`}
                          className="text-sm hover:underline"
                        >
                          {contact.company.name}
                        </Link>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const isKeyPerson = contact.show_on_articles === true
                      const companyPublished = contact.company?.is_draft === false
                      const hasCompany = !!contact.company

                      // Warning: Key person but company is draft
                      if (isKeyPerson && hasCompany && !companyPublished) {
                        return (
                          <div className="flex items-center gap-1.5" title="Key Person but company is in draft mode">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-xs text-amber-600">Company Draft</span>
                          </div>
                        )
                      }

                      // Published: Key person with published company
                      if (isKeyPerson && companyPublished) {
                        return (
                          <div className="flex items-center gap-1.5 text-green-600" title="Visible on public site">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">Published</span>
                          </div>
                        )
                      }

                      // Key person but no company
                      if (isKeyPerson && !hasCompany) {
                        return (
                          <div className="flex items-center gap-1.5" title="Key Person but no company assigned">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-xs text-amber-600">No Company</span>
                          </div>
                        )
                      }

                      // Not a key person
                      return (
                        <div className="flex items-center gap-1.5 text-muted-foreground" title="Not a Key Person">
                          <EyeOff className="h-4 w-4" />
                          <span className="text-xs">Hidden</span>
                        </div>
                      )
                    })()}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
