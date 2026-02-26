"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import type { OutreachContact } from "@/types/outreach"

interface BusinessTypeCount {
  business_type: string | null
  count: number
}

interface ImportResult {
  total: number
  imported: number
  updated: number
  skipped: number
  errors: string[]
}

// Sentinel value used by the "Skip this column" SelectItem.
// Radix UI Select throws if SelectItem value is an empty string, so we use a
// non-empty sentinel instead and treat it as "no mapping" in handleImport.
const SKIP_VALUE = "__skip__"

// CSV column → our field mapping
const CSV_FIELD_OPTIONS = [
  { value: SKIP_VALUE, label: "— Skip —" },
  { value: "email", label: "Email" },
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "practice_name", label: "Practice / Company Name" },
  { value: "title", label: "Title / Role" },
  { value: "business_type", label: "Business Type (tag)" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "website", label: "Website" },
  { value: "phone", label: "Phone" },
  { value: "notes", label: "Notes" },
  { value: "total_opens", label: "Opens (number)" },
  { value: "total_clicks", label: "Clicks (number)" },
]

// Best-guess auto-mapping from common CSV header names
function autoMapHeader(header: string): string {
  const h = header.toLowerCase().trim()
  // Email — exact names only; avoid false-positives like "EmailType"
  if (h === "email" || h === "email address" || h === "emailaddress" ||
      h === "e-mail" || h === "subscriber" || h === "email_address") return "email"
  if (h === "name" || h === "first name" || h === "first" || h === "firstname") return "first_name"
  if (h === "last name" || h === "last" || h === "lastname") return "last_name"
  if (h.includes("company") || h.includes("practice") || h.includes("organization") || h.includes("business name")) return "practice_name"
  if (h.includes("title") || h.includes("position") || h.includes("role")) return "title"
  if (h.includes("business type") || h === "type" || h === "tag") return "business_type"
  if (h === "city") return "city"
  if (h === "state" || h === "province" || h === "region") return "state"
  if (h === "website" || h === "url" || h.includes("web")) return "website"
  if (h === "phone" || h === "telephone" || h === "mobile") return "phone"
  if (h === "notes" || h === "comments") return "notes"
  // Opens/Clicks — exact names only to avoid vague includes matches
  if (h === "opens" || h === "total_opens" || h === "total opens" || h === "open count") return "total_opens"
  if (h === "clicks" || h === "total_clicks" || h === "total clicks" || h === "click count") return "total_clicks"
  return SKIP_VALUE
}

export default function OutreachContactsPage() {
  const [contacts, setContacts] = useState<OutreachContact[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 50
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("")
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeCount[]>([])

  // Import state
  const [importOpen, setImportOpen] = useState(false)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importProgress, setImportProgress] = useState(0)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      })
      if (search) params.set("search", search)
      if (businessTypeFilter) params.set("businessType", businessTypeFilter)

      const res = await fetch(`/api/outreach-contacts?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts ?? [])
        setTotal(data.total ?? 0)
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err)
    } finally {
      setLoading(false)
    }
  }, [page, search, businessTypeFilter])

  const fetchBusinessTypes = useCallback(async () => {
    try {
      const res = await fetch("/api/outreach-contacts/business-types")
      if (res.ok) {
        const data = await res.json()
        setBusinessTypes(data.business_types ?? [])
      }
    } catch (err) {
      console.error("Failed to fetch business types:", err)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  useEffect(() => {
    fetchBusinessTypes()
  }, [fetchBusinessTypes])

  // ── CSV parsing ────────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split("\n").filter((l) => l.trim())
      if (lines.length < 2) return

      // Parse CSV (basic: handles quoted fields)
      const parseRow = (line: string): string[] => {
        const fields: string[] = []
        let current = ""
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          const ch = line[i]
          if (ch === '"') {
            inQuotes = !inQuotes
          } else if (ch === "," && !inQuotes) {
            fields.push(current.trim())
            current = ""
          } else {
            current += ch
          }
        }
        fields.push(current.trim())
        return fields
      }

      const headers = parseRow(lines[0])
      const rows = lines.slice(1).map((line) => {
        const values = parseRow(line)
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]))
      })

      setCsvHeaders(headers)
      setCsvRows(rows)

      // Auto-map columns
      const mapping: Record<string, string> = {}
      for (const h of headers) {
        mapping[h] = autoMapHeader(h)
      }
      setColumnMapping(mapping)
      setImportResult(null)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!csvRows.length) return

    setImporting(true)
    setImportProgress(10)

    try {
      // Transform rows using the column mapping
      const mappedRows = csvRows.map((row) => {
        const mapped: Record<string, string | number | null> = {}
        for (const [csvCol, ourField] of Object.entries(columnMapping)) {
          if (!ourField || ourField === SKIP_VALUE) continue
          mapped[ourField] = row[csvCol] ?? null
        }
        return mapped
      })

      setImportProgress(30)

      const res = await fetch("/api/outreach-contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: mappedRows,
          source_file: (document.querySelector<HTMLInputElement>("#csv-file-input"))?.files?.[0]?.name ?? "import.csv",
        }),
      })

      setImportProgress(90)

      if (res.ok) {
        const result = await res.json()
        setImportResult(result)
        setImportProgress(100)
        // Refresh contacts and business types
        await fetchContacts()
        await fetchBusinessTypes()
      }
    } catch (err) {
      console.error("Import failed:", err)
    } finally {
      setImporting(false)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const getEngagementLabel = (opens: number, clicks: number) => {
    if (clicks > 0) return { label: "Clicked", color: "text-green-600" }
    if (opens >= 5) return { label: `${opens} opens`, color: "text-blue-600" }
    if (opens >= 1) return { label: `${opens} open${opens > 1 ? "s" : ""}`, color: "text-muted-foreground" }
    return { label: "No opens", color: "text-muted-foreground/50" }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/outreach-emails">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Outreach Contacts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {total.toLocaleString()} contacts total
            </p>
          </div>
        </div>
        <Dialog open={importOpen} onOpenChange={setImportOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Contacts from CSV</DialogTitle>
              <DialogDescription>
                Map your CSV columns to contact fields. Only email is required.
                Existing contacts (matched by email) will be updated.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="csv-file-input">Select CSV file</Label>
                <Input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>

              {csvHeaders.length > 0 && !importResult && (
                <>
                  <div className="text-sm text-muted-foreground">
                    {csvRows.length.toLocaleString()} rows detected. Map columns below:
                  </div>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto rounded border p-3">
                    {csvHeaders.map((header) => (
                      <div key={header} className="flex items-center gap-3">
                        <span className="text-sm font-mono w-48 shrink-0 truncate text-muted-foreground">
                          {header}
                        </span>
                        <Select
                          value={columnMapping[header] ?? SKIP_VALUE}
                          onValueChange={(val) =>
                            setColumnMapping((prev) => ({ ...prev, [header]: val }))
                          }
                        >
                          <SelectTrigger className="flex-1 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CSV_FIELD_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  {importing && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Importing…</div>
                      <Progress value={importProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={handleImport}
                    disabled={importing || !Object.values(columnMapping).some((v) => v === "email")}
                    className="w-full"
                  >
                    {importing ? "Importing…" : `Import ${csvRows.length.toLocaleString()} rows`}
                  </Button>

                  {!Object.values(columnMapping).some((v) => v === "email") && (
                    <p className="text-xs text-destructive">
                      You must map at least one column to &ldquo;Email&rdquo; before importing.
                    </p>
                  )}
                </>
              )}

              {importResult && (
                <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                  <p className="font-semibold text-sm">Import complete</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total rows processed: <strong>{importResult.total.toLocaleString()}</strong></div>
                    <div>Imported / updated: <strong className="text-green-600">{importResult.imported.toLocaleString()}</strong></div>
                    <div>Skipped: <strong>{importResult.skipped.toLocaleString()}</strong></div>
                    <div>Errors: <strong className={importResult.errors.length > 0 ? "text-destructive" : ""}>{importResult.errors.length}</strong></div>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="text-xs text-muted-foreground max-h-24 overflow-y-auto">
                      {importResult.errors.map((e, i) => (
                        <div key={i}>{e}</div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-2" onClick={() => {
                    setImportResult(null)
                    setCsvHeaders([])
                    setCsvRows([])
                    setColumnMapping({})
                    setImportOpen(false)
                  }}>
                    Done
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Business type summary */}
      {businessTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {businessTypes.slice(0, 12).map((bt) => (
            <button
              key={bt.business_type ?? "__null__"}
              onClick={() => {
                setBusinessTypeFilter(
                  businessTypeFilter === (bt.business_type ?? "")
                    ? ""
                    : bt.business_type ?? ""
                )
                setPage(1)
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                ${businessTypeFilter === (bt.business_type ?? "")
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
                }`}
            >
              {bt.business_type ?? "Untagged"}
              <span className="text-muted-foreground font-normal">{bt.count.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search + filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search email or practice name…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput)
                setPage(1)
              }
            }}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={fetchContacts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
        {(search || businessTypeFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("")
              setSearchInput("")
              setBusinessTypeFilter("")
              setPage(1)
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Contacts table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Practice Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Engagement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading contacts…
                </TableCell>
              </TableRow>
            )}
            {!loading && contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {total === 0
                    ? "No contacts yet. Import a CSV to get started."
                    : "No contacts match your filters."}
                </TableCell>
              </TableRow>
            )}
            {!loading && contacts.map((contact) => {
              const eng = getEngagementLabel(contact.total_opens, contact.total_clicks)
              return (
                <TableRow key={contact.id}>
                  <TableCell className="font-mono text-sm">{contact.email}</TableCell>
                  <TableCell>
                    {contact.business_type ? (
                      <Badge variant="outline" className="text-xs font-normal">
                        {contact.business_type}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {contact.practice_name ?? (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {[contact.city, contact.state].filter(Boolean).join(", ") || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs ${eng.color}`}>{eng.label}</span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total.toLocaleString()} contacts)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
