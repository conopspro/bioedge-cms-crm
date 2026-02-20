"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Loader2,
  Upload,
  X,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedRow {
  name: string
  website: string
  event?: string
}

interface QueueItem {
  id: string
  name: string
  website: string | null
  domain: string | null
  category: string | null
  systems_supported: string[] | null
  edge_categories: string[] | null
  description: string | null
  differentiators: string | null
  discovered_contacts: { name: string; title?: string; email?: string; linkedin_url?: string }[] | null
  hunter_contacts: { email: string; first_name?: string; last_name?: string; title?: string; confidence?: number }[] | null
  enrich_status: "pending" | "enriching" | "enriched" | "error"
  enrich_error: string | null
  hunter_status: "pending" | "searching" | "found" | "not_found" | "error"
  hunter_error: string | null
  status: "pending" | "approved" | "rejected"
  imported_company_id: string | null
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────

function parseCSV(text: string): { rows: ParsedRow[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return { rows: [], errors: ["CSV must have a header row and at least one data row"] }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""))
  const nameIdx = headers.findIndex((h) => h === "name" || h === "company" || h === "company name")
  const websiteIdx = headers.findIndex((h) => h === "website" || h === "url" || h === "domain")
  const eventIdx = headers.findIndex((h) => h === "event" || h === "conference" || h === "found at" || h === "source event" || h === "source_event")

  if (nameIdx === -1) return { rows: [], errors: ["CSV must have a 'name' column"] }
  if (websiteIdx === -1) return { rows: [], errors: ["CSV must have a 'website' column"] }

  const rows: ParsedRow[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle quoted fields
    const cols: string[] = []
    let current = ""
    let inQuotes = false
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue }
      if (char === "," && !inQuotes) { cols.push(current.trim()); current = ""; continue }
      current += char
    }
    cols.push(current.trim())

    const name = cols[nameIdx]?.trim()
    const website = cols[websiteIdx]?.trim()
    const event = eventIdx !== -1 ? cols[eventIdx]?.trim() || undefined : undefined

    if (!name) { errors.push(`Row ${i + 1}: missing name`); continue }
    if (!website) { errors.push(`Row ${i + 1}: missing website`); continue }

    rows.push({ name, website, event })
  }

  return { rows, errors }
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{done} / {total}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-electric-blue transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Contact count helper ─────────────────────────────────────────────────────

function contactCount(item: QueueItem): number {
  return (item.discovered_contacts?.length ?? 0) + (item.hunter_contacts?.length ?? 0)
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3

export default function CompanyImportPage() {
  const [step, setStep] = useState<Step>(1)

  // Step 1 state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sourceEvent, setSourceEvent] = useState("")
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    inserted: number
    ids: string[]
    duplicates: { name: string; website: string; reason: string }[]
  } | null>(null)

  // Step 2 state
  const abortRef = useRef(false)
  const [perplexityProgress, setPerplexityProgress] = useState<{ done: number; total: number } | null>(null)
  const [perplexityDone, setPerplexityDone] = useState(false)
  const [perplexityErrors, setPerplexityErrors] = useState(0)
  const [hunterRunning, setHunterRunning] = useState(false)
  const [hunterProgress, setHunterProgress] = useState<{ done: number; total: number } | null>(null)
  const [hunterDone, setHunterDone] = useState(false)
  const [hunterErrors, setHunterErrors] = useState(0)

  // Step 3 state
  const [items, setItems] = useState<QueueItem[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [actionResult, setActionResult] = useState<string | null>(null)
  const [actionErrors, setActionErrors] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [retryingId, setRetryingId] = useState<string | null>(null)

  // Batch scope IDs from import
  const batchIds = importResult?.ids ?? []

  // ── Step 1: File handling ──────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const { rows, errors } = parseCSV(text)
      setParsedRows(rows)
      setParseErrors(errors)
      setImportResult(null)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (parsedRows.length === 0) return
    setImporting(true)
    try {
      const res = await fetch("/api/company-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companies: parsedRows.map((row) => ({
            ...row,
            // Per-row event takes priority; fall back to the global field
            event: row.event || sourceEvent.trim() || undefined,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || "Import failed"); return }
      setImportResult(data)
    } catch {
      alert("Import failed unexpectedly")
    } finally {
      setImporting(false)
    }
  }

  const handleContinueToEnrich = () => {
    setStep(2)
    runPerplexity()
  }

  // ── Step 2: Enrichment ────────────────────────────────────────────────────

  const runPerplexity = useCallback(async () => {
    if (!importResult) return
    abortRef.current = false
    let done = 0
    let total = importResult.inserted
    let errCount = 0
    setPerplexityProgress({ done: 0, total })

    while (!abortRef.current) {
      const res = await fetch("/api/company-queue/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize: 3, ids: batchIds }),
      })
      if (!res.ok) { alert("Enrichment error"); break }
      const data = await res.json()
      done += data.processed
      errCount += data.errors
      total = done + data.remaining
      setPerplexityProgress({ done, total })
      setPerplexityErrors(errCount)
      if (data.remaining === 0) break
    }

    setPerplexityDone(true)
  }, [importResult, batchIds])

  const runHunter = useCallback(async () => {
    if (!importResult) return
    abortRef.current = false
    setHunterRunning(true)
    let done = 0
    let total = importResult.inserted
    let errCount = 0
    setHunterProgress({ done: 0, total })

    while (!abortRef.current) {
      const res = await fetch("/api/company-queue/hunter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize: 10, ids: batchIds }),
      })
      if (!res.ok) { alert("Hunter error"); break }
      const data = await res.json()
      done += data.processed
      errCount += data.errors
      total = done + data.remaining
      setHunterProgress({ done, total })
      setHunterErrors(errCount)
      if (data.remaining === 0) break
    }

    setHunterDone(true)
    setHunterRunning(false)
  }, [importResult, batchIds])

  const handleContinueToReview = async () => {
    setStep(3)
    setLoadingItems(true)
    try {
      const res = await fetch(
        `/api/company-queue?ids=${batchIds.join(",")}&pageSize=200`
      )
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      alert("Failed to load queue items")
    } finally {
      setLoadingItems(false)
    }
  }

  // ── Step 3: Review & Approve ──────────────────────────────────────────────

  const refreshItems = async () => {
    if (batchIds.length === 0) return
    const res = await fetch(`/api/company-queue?ids=${batchIds.join(",")}&pageSize=200`)
    const data = await res.json()
    setItems(data.items || [])
  }

  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true
    return item.status === statusFilter || item.enrich_status === statusFilter
  })

  const pendingEnrichedItems = items.filter(
    (i) => i.status === "pending" && i.enrich_status === "enriched"
  )

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAllEnriched = () => {
    setSelected(new Set(pendingEnrichedItems.map((i) => i.id)))
  }

  const clearSelection = () => setSelected(new Set())

  const handleApprove = async (ids: string[]) => {
    if (ids.length === 0) return
    setApproving(true)
    setActionResult(null)
    setActionErrors([])
    try {
      const res = await fetch("/api/company-queue/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || "Approve failed"); return }
      setActionResult(
        `Approved ${data.companiesCreated} companies, created ${data.contactsCreated} contacts.` +
        (data.skipped?.length ? ` Skipped ${data.skipped.length} duplicates.` : "")
      )
      if (data.errors?.length) setActionErrors(data.errors)
      clearSelection()
      await refreshItems()
    } catch {
      alert("Approve failed unexpectedly")
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async (ids: string[]) => {
    if (ids.length === 0) return
    setRejecting(true)
    setActionResult(null)
    try {
      const res = await fetch("/api/company-queue/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || "Reject failed"); return }
      setActionResult(`Rejected ${data.processed} companies.`)
      clearSelection()
      await refreshItems()
    } catch {
      alert("Reject failed unexpectedly")
    } finally {
      setRejecting(false)
    }
  }

  const handleRetryEnrich = async (id: string) => {
    setRetryingId(id)
    // Reset to pending so enrich route picks it up
    await fetch("/api/company-queue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enrich_status: "pending" }),
    }).catch(() => {})
    // Call enrich with just this ID
    await fetch("/api/company-queue/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchSize: 1, ids: [id] }),
    })
    setRetryingId(null)
    await refreshItems()
  }

  const handleReprocessContacts = async () => {
    setActionResult(null)
    setActionErrors([])
    try {
      const res = await fetch("/api/company-queue/reprocess-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: batchIds }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || "Reprocess failed"); return }
      setActionResult(
        `Recovered ${data.contactsCreated} contacts across ${data.processed} companies.` +
        (data.skipped ? ` ${data.skipped} already had contacts or no data.` : "")
      )
      if (data.errors?.length) setActionErrors(data.errors)
      await refreshItems()
    } catch {
      alert("Reprocess failed unexpectedly")
    }
  }

  const handleRemove = async (ids: string[]) => {
    if (ids.length === 0) return
    try {
      const res = await fetch("/api/company-queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || "Remove failed"); return }
      setSelected((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
      await refreshItems()
    } catch {
      alert("Remove failed unexpectedly")
    }
  }

  // ─── Status badge helpers ─────────────────────────────────────────────────

  const enrichBadge = (item: QueueItem) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending", variant: "secondary" },
      enriching: { label: "Enriching…", variant: "outline" },
      enriched: { label: "Enriched", variant: "default" },
      error: { label: "Error", variant: "destructive" },
    }
    const s = map[item.enrich_status] ?? { label: item.enrich_status, variant: "secondary" }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  const hunterBadge = (item: QueueItem) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending", variant: "secondary" },
      searching: { label: "Searching…", variant: "outline" },
      found: { label: `Found (${item.hunter_contacts?.length ?? 0})`, variant: "default" },
      not_found: { label: "None found", variant: "secondary" },
      error: { label: "Error", variant: "destructive" },
    }
    const s = map[item.hunter_status] ?? { label: item.hunter_status, variant: "secondary" }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  const queueBadge = (item: QueueItem) => {
    if (item.status === "approved") return <Badge className="bg-green-100 text-green-800">Approved</Badge>
    if (item.status === "rejected") return <Badge variant="destructive">Rejected</Badge>
    return null
  }

  // ─── Step indicators ──────────────────────────────────────────────────────

  const StepIndicator = ({ n, label }: { n: number; label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
        step === n ? "bg-navy text-white" : step > n ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
      }`}>
        {step > n ? <CheckCircle2 className="h-4 w-4" /> : n}
      </div>
      <span className={`text-sm ${step === n ? "font-semibold text-navy" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/companies">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Companies
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Import Companies</h1>
          <p className="text-muted-foreground text-sm">
            Upload a CSV, enrich with Perplexity + Hunter, then approve into your database.
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-6 border-b pb-4">
        <StepIndicator n={1} label="Upload CSV" />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <StepIndicator n={2} label="Enrich" />
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <StepIndicator n={3} label="Review & Approve" />
      </div>

      {/* ── Step 1: Upload ───────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Required: <code className="bg-muted px-1 rounded">name</code> and{" "}
              <code className="bg-muted px-1 rounded">website</code> columns.{" "}
              Optional: <code className="bg-muted px-1 rounded">event</code> column for per-row event source.
            </p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Choose CSV file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="source-event">
              Event / Conference <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="source-event"
              type="text"
              placeholder="e.g., Biohacking Conference 2025"
              value={sourceEvent}
              onChange={(e) => setSourceEvent(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Applied to all rows that don't have their own <code className="bg-muted px-1 rounded">event</code> column value.
            </p>
          </div>

          {parseErrors.length > 0 && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 space-y-1">
              {parseErrors.map((e, i) => (
                <p key={i} className="text-sm text-red-700">{e}</p>
              ))}
            </div>
          )}

          {parsedRows.length > 0 && !importResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{parsedRows.length} companies ready to import</p>
                <Button onClick={handleImport} disabled={importing}>
                  {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Import {parsedRows.length} Companies
                </Button>
              </div>
              <div className="rounded-md border overflow-hidden max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Website</TableHead>
                      {parsedRows.some((r) => r.event) && <TableHead>Event</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{row.website}</TableCell>
                        {parsedRows.some((r) => r.event) && (
                          <TableCell className="text-muted-foreground text-sm">{row.event || sourceEvent || "—"}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {importResult && (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 border border-green-200 p-4">
                <p className="font-semibold text-green-800">
                  {importResult.inserted} companies added to queue
                  {importResult.duplicates.length > 0 && `, ${importResult.duplicates.length} skipped`}
                </p>
              </div>

              {importResult.duplicates.length > 0 && (
                <details className="rounded-md border p-3">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                    {importResult.duplicates.length} skipped (duplicates)
                  </summary>
                  <div className="mt-2 space-y-1">
                    {importResult.duplicates.map((d, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{d.name}</span> — {d.reason}
                      </p>
                    ))}
                  </div>
                </details>
              )}

              {importResult.inserted > 0 && (
                <Button onClick={handleContinueToEnrich}>
                  Continue to Enrich
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Enrich ───────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Sub-phase A: Perplexity */}
          <div className="rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">Perplexity Research</h2>
                <p className="text-sm text-muted-foreground">
                  Generating descriptions, categories, systems, and key contacts
                </p>
              </div>
              {!perplexityDone && (
                <Button variant="outline" size="sm" onClick={() => { abortRef.current = true }}>
                  Stop
                </Button>
              )}
              {perplexityDone && (
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Done
                </div>
              )}
            </div>

            {perplexityProgress && (
              <ProgressBar
                done={perplexityProgress.done}
                total={perplexityProgress.total}
                label={perplexityDone
                  ? `Complete — ${perplexityProgress.done} enriched, ${perplexityErrors} errors`
                  : "Enriching with Perplexity…"
                }
              />
            )}
          </div>

          {/* Sub-phase B: Hunter */}
          <div className={`rounded-lg border p-6 space-y-4 ${!perplexityDone ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">Hunter.io Contact Search</h2>
                <p className="text-sm text-muted-foreground">
                  Finding verified email contacts by company domain
                </p>
              </div>
              {hunterRunning && (
                <Button variant="outline" size="sm" onClick={() => { abortRef.current = true }}>
                  Stop
                </Button>
              )}
              {hunterDone && (
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Done
                </div>
              )}
            </div>

            {!hunterRunning && !hunterDone && perplexityDone && (
              <Button onClick={runHunter}>
                Run Hunter →
              </Button>
            )}

            {hunterProgress && (
              <ProgressBar
                done={hunterProgress.done}
                total={hunterProgress.total}
                label={hunterDone
                  ? `Complete — ${hunterProgress.done} searched, ${hunterErrors} errors`
                  : "Searching with Hunter.io…"
                }
              />
            )}
          </div>

          {hunterDone && (
            <Button onClick={handleContinueToReview} size="lg">
              Continue to Review
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {/* Allow skipping Hunter if not configured or user wants to proceed */}
          {perplexityDone && !hunterDone && (
            <Button variant="ghost" onClick={handleContinueToReview}>
              Skip Hunter and review now
            </Button>
          )}
        </div>
      )}

      {/* ── Step 3: Review & Approve ─────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          {actionResult && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 flex items-center justify-between">
              <p className="text-sm text-green-800 font-medium">{actionResult}</p>
              <button onClick={() => { setActionResult(null); setActionErrors([]) }}><X className="h-4 w-4 text-green-700" /></button>
            </div>
          )}

          {/* Recover contacts button — shown when errors occurred during approval */}
          {actionErrors.length > 0 && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex items-center justify-between gap-4">
              <p className="text-sm text-amber-800">
                Some contact inserts failed. Click to retry contact creation for approved companies that have no contacts yet.
              </p>
              <Button size="sm" variant="outline" onClick={handleReprocessContacts} className="shrink-0">
                Recover Contacts
              </Button>
            </div>
          )}

          {actionErrors.length > 0 && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-1">
              <p className="text-sm font-medium text-amber-800">{actionErrors.length} error{actionErrors.length !== 1 ? "s" : ""} during approval:</p>
              {actionErrors.map((e, i) => (
                <p key={i} className="text-sm text-amber-700">{e}</p>
              ))}
            </div>
          )}

          {/* Filters + actions bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {["all", "enriched", "pending", "error", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-md px-3 py-1 text-sm capitalize ${
                    statusFilter === f
                      ? "bg-navy text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={selectAllEnriched}>
                Select all enriched ({pendingEnrichedItems.length})
              </Button>
              {selected.size > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear ({selected.size})
                </Button>
              )}
            </div>
          </div>

          {/* Sticky bulk action bar */}
          {selected.size > 0 && (
            <div className="sticky top-0 z-10 rounded-lg border bg-background/95 backdrop-blur p-3 flex items-center gap-3 shadow-sm">
              <span className="text-sm font-medium">{selected.size} selected</span>
              <Button
                size="sm"
                onClick={() => handleApprove(Array.from(selected))}
                disabled={approving || rejecting}
              >
                {approving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Approve Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(Array.from(selected))}
                disabled={approving || rejecting}
              >
                {rejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reject Selected
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(Array.from(selected))}
                disabled={approving || rejecting}
              >
                Remove Selected
              </Button>
              <div className="ml-auto">
                <Button
                  size="sm"
                  onClick={() => handleApprove(pendingEnrichedItems.map((i) => i.id))}
                  disabled={approving || rejecting}
                >
                  Approve All Enriched ({pendingEnrichedItems.length})
                </Button>
              </div>
            </div>
          )}

          {loadingItems ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <input
                        type="checkbox"
                        checked={selected.size === pendingEnrichedItems.length && pendingEnrichedItems.length > 0}
                        onChange={(e) => e.target.checked ? selectAllEnriched() : clearSelection()}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead>Perplexity</TableHead>
                    <TableHead>Hunter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No items to show
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredItems.map((item) => (
                    <>
                      <TableRow
                        key={item.id}
                        className={selected.has(item.id) ? "bg-blue-50" : undefined}
                      >
                        <TableCell>
                          {item.status === "pending" && item.enrich_status === "enriched" && (
                            <input
                              type="checkbox"
                              checked={selected.has(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="rounded"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          {item.website && (
                            <a
                              href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-electric-blue hover:underline flex items-center gap-1"
                            >
                              {item.domain || item.website}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {item.category || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{contactCount(item)}</span>
                        </TableCell>
                        <TableCell>{enrichBadge(item)}</TableCell>
                        <TableCell>{hunterBadge(item)}</TableCell>
                        <TableCell>
                          {queueBadge(item)}
                          {item.status === "approved" && item.imported_company_id && (
                            <Link
                              href={`/dashboard/companies/${item.imported_company_id}`}
                              className="ml-2 text-xs text-electric-blue hover:underline"
                            >
                              View →
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {expandedId === item.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded detail row */}
                      {expandedId === item.id && (
                        <TableRow key={`${item.id}-expanded`} className="bg-muted/30">
                          <TableCell colSpan={8} className="py-4 px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              {/* Description */}
                              {item.description && (
                                <div className="col-span-2">
                                  <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                                  <p className="text-foreground line-clamp-4">{item.description}</p>
                                </div>
                              )}

                              {/* Differentiators */}
                              {item.differentiators && (
                                <div>
                                  <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Differentiators</p>
                                  <p className="text-foreground whitespace-pre-line text-xs">{item.differentiators}</p>
                                </div>
                              )}

                              {/* Systems */}
                              {item.systems_supported && item.systems_supported.length > 0 && (
                                <div>
                                  <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">Systems</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.systems_supported.map((s) => (
                                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Contacts */}
                              <div className="col-span-2">
                                <p className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                                  Contacts ({contactCount(item)})
                                </p>
                                <div className="space-y-1">
                                  {(item.discovered_contacts || []).map((c, i) => (
                                    <div key={`p-${i}`} className="flex items-center gap-3 text-xs">
                                      <Badge variant="outline" className="text-xs shrink-0">Perplexity</Badge>
                                      <span className="font-medium">{c.name}</span>
                                      {c.title && <span className="text-muted-foreground">{c.title}</span>}
                                      {c.email && <span className="text-electric-blue">{c.email}</span>}
                                    </div>
                                  ))}
                                  {(item.hunter_contacts || []).map((c, i) => (
                                    <div key={`h-${i}`} className="flex items-center gap-3 text-xs">
                                      <Badge variant="outline" className="text-xs shrink-0">Hunter {c.confidence}%</Badge>
                                      <span className="font-medium">{c.first_name} {c.last_name}</span>
                                      {c.title && <span className="text-muted-foreground">{c.title}</span>}
                                      <span className="text-electric-blue">{c.email}</span>
                                    </div>
                                  ))}
                                  {contactCount(item) === 0 && (
                                    <span className="text-muted-foreground italic">No contacts found</span>
                                  )}
                                </div>
                              </div>

                              {/* Error + retry */}
                              {item.enrich_status === "error" && (
                                <div className="col-span-2 flex items-center gap-3">
                                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                                  <span className="text-red-700 text-xs">{item.enrich_error}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={retryingId === item.id}
                                    onClick={() => handleRetryEnrich(item.id)}
                                  >
                                    {retryingId === item.id && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                    Retry Enrich
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemove([item.id])}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
