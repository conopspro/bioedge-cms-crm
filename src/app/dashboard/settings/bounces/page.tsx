"use client"

import { useState, useRef } from "react"
import { RefreshCw, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface SyncResult {
  success: boolean
  processed?: number
  marked?: {
    outreach_contacts: number
    contacts: number
    clinic_contacts: number
    clinics: number
  }
  error?: string
}

interface CsvResult {
  success: boolean
  emails_in_csv?: number
  marked?: {
    outreach_contacts: number
    contacts: number
    clinic_contacts: number
    clinics: number
  }
  error?: string
}

function ResultCard({ result }: { result: SyncResult | CsvResult }) {
  if (!result.success) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800">Error</p>
          <p className="text-sm text-red-700">{result.error || "Something went wrong"}</p>
        </div>
      </div>
    )
  }

  const m = result.marked
  const total = m ? m.outreach_contacts + m.contacts + m.clinic_contacts + m.clinics : 0

  return (
    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <p className="font-semibold text-green-800">
          {"processed" in result
            ? `${result.processed} suppressed emails checked · ${total} contacts marked`
            : `${"emails_in_csv" in result ? result.emails_in_csv : 0} emails in CSV · ${total} contacts marked`}
        </p>
      </div>
      {m && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Outreach Contacts", value: m.outreach_contacts },
            { label: "Contacts", value: m.contacts },
            { label: "Clinic Contacts", value: m.clinic_contacts },
            { label: "Clinics", value: m.clinics },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-700">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BouncesPage() {
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

  const [csvLoading, setCsvLoading] = useState(false)
  const [csvResult, setCsvResult] = useState<CsvResult | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSync() {
    setSyncLoading(true)
    setSyncResult(null)
    try {
      const res = await fetch("/api/admin/sync-bounces", { method: "POST" })
      const data = await res.json()
      setSyncResult(data)
    } catch {
      setSyncResult({ success: false, error: "Network error — could not reach server" })
    } finally {
      setSyncLoading(false)
    }
  }

  async function handleCsvUpload() {
    if (!csvFile) return
    setCsvLoading(true)
    setCsvResult(null)
    try {
      const formData = new FormData()
      formData.append("file", csvFile)
      const res = await fetch("/api/admin/process-bounces-csv", { method: "POST", body: formData })
      const data = await res.json()
      setCsvResult(data)
    } catch {
      setCsvResult({ success: false, error: "Network error — could not reach server" })
    } finally {
      setCsvLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Bounce Management</h1>
      <p className="mb-8 text-sm text-gray-500">
        Mark bounced and suppressed email addresses across all contact tables so they are excluded from future campaigns.
      </p>

      {/* ── Method 1: Resend Sync ──────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Sync from Resend</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Fetches Resend&rsquo;s full suppression list (all-time hard bounces + spam complaints) and marks matching contacts.
          This is the fastest and most complete option.
        </p>
        <button
          onClick={handleSync}
          disabled={syncLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {syncLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Syncing…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </>
          )}
        </button>
        {syncResult && <ResultCard result={syncResult} />}
      </div>

      {/* ── Method 2: CSV Upload ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <Upload className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Upload Bounce CSV</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Upload a CSV file containing bounced email addresses. The email column is auto-detected. Use this for CSV
          exports from Resend or any other source.
        </p>

        <div className="mb-4">
          <label
            htmlFor="csv-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            {csvFile ? (
              <span className="text-sm font-medium text-gray-700">{csvFile.name}</span>
            ) : (
              <span className="text-sm text-gray-500">Click to select a CSV file</span>
            )}
            <input
              id="csv-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                setCsvFile(e.target.files?.[0] ?? null)
                setCsvResult(null)
              }}
            />
          </label>
        </div>

        <button
          onClick={handleCsvUpload}
          disabled={!csvFile || csvLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:opacity-40"
        >
          {csvLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Process CSV
            </>
          )}
        </button>
        {csvResult && <ResultCard result={csvResult} />}
      </div>
    </div>
  )
}
