"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactsTable, type ContactWithCompany } from "@/components/contacts/contacts-table"

/**
 * Contacts List Page
 *
 * Server-side paginated contacts with search and filtering.
 */
export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactWithCompany[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)
  const [search, setSearch] = useState("")
  const [notWithinFilter, setNotWithinFilter] = useState("all")
  const [convertedFilter, setConvertedFilter] = useState("all")
  const [catchAllFilter, setCatchAllFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [outreachFilter, setOutreachFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      })
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (notWithinFilter !== "all") params.set("not_within", notWithinFilter)
      if (convertedFilter !== "all") params.set("converted", convertedFilter)
      if (catchAllFilter !== "all") params.set("catch_all", catchAllFilter)
      if (visibilityFilter !== "all") params.set("visibility", visibilityFilter)
      if (outreachFilter !== "all") params.set("outreach", outreachFilter)

      const res = await fetch(`/api/contacts?${params}`)
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, notWithinFilter, convertedFilter, catchAllFilter, visibilityFilter, outreachFilter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [notWithinFilter, convertedFilter, catchAllFilter, visibilityFilter, outreachFilter])

  // Fetch when debounced search or other params change
  useEffect(() => {
    fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch, notWithinFilter, convertedFilter, catchAllFilter, visibilityFilter, outreachFilter])

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
      <ContactsTable
        contacts={contacts}
        total={total}
        page={page}
        pageSize={pageSize}
        search={search}
        notWithinFilter={notWithinFilter}
        convertedFilter={convertedFilter}
        catchAllFilter={catchAllFilter}
        visibilityFilter={visibilityFilter}
        outreachFilter={outreachFilter}
        loading={loading}
        onSearchChange={setSearch}
        onNotWithinChange={setNotWithinFilter}
        onConvertedChange={setConvertedFilter}
        onCatchAllChange={setCatchAllFilter}
        onVisibilityChange={setVisibilityFilter}
        onOutreachChange={setOutreachFilter}
        onPageChange={setPage}
        onRefresh={fetchContacts}
      />
    </div>
  )
}
