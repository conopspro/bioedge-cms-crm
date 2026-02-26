"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  Mail,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Trash2,
  X,
  Eye,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { ClinicCampaign, ClinicCampaignRecipient } from "@/types/database"

interface EnrichedRecipient extends ClinicCampaignRecipient {
  clinic: {
    id: string
    name: string
    city: string | null
    state: string | null
    tags: string[]
    google_rating: number | null
    reviews_count: number
  } | null
}

interface CampaignDetail extends ClinicCampaign {
  sender_profile: {
    id: string
    name: string
    email: string
    title: string | null
    phone: string | null
    signature: string | null
  } | null
  clinic_campaign_events?: {
    id: string
    event_id: string
    events: { id: string; name: string; start_date: string | null; end_date: string | null; city: string | null; state: string | null } | null
  }[]
  clinic_campaign_recipients: EnrichedRecipient[]
}

const STATUS_BADGES: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  generating: { label: "Generating", variant: "info" },
  ready: { label: "Ready", variant: "warning" },
  sending: { label: "Sending", variant: "info" },
  paused: { label: "Paused", variant: "outline" },
  completed: { label: "Completed", variant: "success" },
}

const RECIPIENT_STATUS_BADGES: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  generated: { label: "Generated", variant: "info" },
  approved: { label: "Approved", variant: "success" },
  sent: { label: "Sent", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  opened: { label: "Opened", variant: "success" },
  clicked: { label: "Clicked", variant: "success" },
  bounced: { label: "Bounced", variant: "destructive" },
  failed: { label: "Failed", variant: "destructive" },
  error: { label: "Error", variant: "destructive" },
  suppressed: { label: "Suppressed", variant: "warning" },
}

export default function ClinicCampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [approving, setApproving] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<EnrichedRecipient | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [testEmail, setTestEmail] = useState("")
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showTestForm, setShowTestForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendProgress, setSendProgress] = useState<{ sent: number; total: number; current: string } | null>(null)
  const sendAbortRef = useRef(false)
  const [generateProgress, setGenerateProgress] = useState<{ done: number; total: number } | null>(null)
  const generateAbortRef = useRef(false)

  // Edit state for preview modal
  const [isEditing, setIsEditing] = useState(false)
  const [editSubject, setEditSubject] = useState("")
  const [editBody, setEditBody] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchCampaign = useCallback(async (retries = 3) => {
    try {
      const res = await fetch(`/api/clinic-campaigns/${campaignId}`)
      if (res.ok) {
        const data = await res.json()
        setCampaign(data)
        setLoading(false)
      } else if (res.status === 404 && retries > 0) {
        setTimeout(() => fetchCampaign(retries - 1), 1000)
        return
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch clinic campaign:", error)
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    fetchCampaign()
  }, [fetchCampaign])

  // Auto-refresh during generation
  useEffect(() => {
    if (campaign?.status === "generating") {
      const interval = setInterval(fetchCampaign, 5000)
      return () => clearInterval(interval)
    }
  }, [campaign?.status, fetchCampaign])

  const handleGenerate = async () => {
    setGenerating(true)
    generateAbortRef.current = false
    setGenerateProgress(null)

    try {
      let remaining = 1
      let prevRemaining = Infinity

      while (remaining > 0 && !generateAbortRef.current) {
        const res = await fetch(`/api/clinic-campaigns/${campaignId}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchSize: 5 }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          alert(data.error || "Failed to generate emails")
          break
        }

        const data = await res.json()
        remaining = data.remaining || 0

        // Safety: if remaining didn't decrease and nothing was generated this
        // batch, the loop is stuck (likely Anthropic errors on every recipient).
        // Break rather than spinning forever.
        if (remaining >= prevRemaining && (data.generated || 0) === 0) {
          await fetchCampaign()
          break
        }
        prevRemaining = remaining

        setGenerateProgress({
          done: (data.total || 0) - remaining,
          total: data.total || 0,
        })

        await fetchCampaign()

        if (remaining === 0 || data.status === "ready") break
      }

      if (generateAbortRef.current) {
        await fetch(`/api/clinic-campaigns/${campaignId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "draft" }),
        })
        await fetchCampaign()
      }
    } catch (error) {
      console.error("Generation failed:", error)
      alert("Failed to generate emails")
    } finally {
      setGenerating(false)
      setGenerateProgress(null)
      generateAbortRef.current = false
    }
  }

  const handleCancelGenerate = () => {
    generateAbortRef.current = true
  }

  const handleRetryErrors = async () => {
    if (!campaign) return
    const errorRecipients = campaign.clinic_campaign_recipients.filter(
      (r) => r.status === "error"
    )
    if (errorRecipients.length === 0) return

    setRetrying(true)
    try {
      // Reset each errored recipient back to pending so generation will retry them
      await Promise.all(
        errorRecipients.map((r) =>
          fetch(`/api/clinic-campaigns/${campaignId}/recipients/${r.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "pending", error: null }),
          })
        )
      )
      await fetchCampaign()
    } catch (err) {
      console.error("Retry reset failed:", err)
    } finally {
      setRetrying(false)
    }
  }

  const handleBulkDelete = async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return
    setBulkDeleting(true)
    try {
      const res = await fetch(`/api/clinic-campaigns/${campaignId}/recipients`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      })
      if (res.ok) {
        const deletedSet = new Set(idsToDelete)
        setCampaign((prev) =>
          prev ? {
            ...prev,
            clinic_campaign_recipients: prev.clinic_campaign_recipients.filter(
              (r) => !deletedSet.has(r.id)
            ),
          } : prev
        )
        setSelectedIds(new Set())
      }
    } catch (err) {
      console.error("Bulk delete failed:", err)
    } finally {
      setBulkDeleting(false)
    }
  }

  const handleApproveAll = async () => {
    if (!campaign) return
    setApproving(true)
    try {
      const generatedIds = campaign.clinic_campaign_recipients
        .filter((r) => r.status === "generated")
        .map((r) => r.id)

      if (generatedIds.length === 0) {
        alert("No generated emails to approve")
        return
      }

      const res = await fetch(`/api/clinic-campaigns/${campaignId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: generatedIds,
          approved: true,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const updatedIds = new Set((data.recipients || []).map((r: { id: string }) => r.id))
        setCampaign((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            clinic_campaign_recipients: prev.clinic_campaign_recipients.map((r) =>
              updatedIds.has(r.id) ? { ...r, status: "approved" as const, approved: true } : r
            ),
          }
        })
      }
    } catch (error) {
      console.error("Approval failed:", error)
    } finally {
      setApproving(false)
    }
  }

  const handleApproveOne = async (recipientId: string, approve: boolean) => {
    setActionLoading(recipientId)
    try {
      const newStatus = approve ? "approved" : "generated"
      const res = await fetch(
        `/api/clinic-campaigns/${campaignId}/recipients/${recipientId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approved: approve,
            status: newStatus,
          }),
        }
      )
      if (res.ok) {
        setCampaign((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            clinic_campaign_recipients: prev.clinic_campaign_recipients.map((r) =>
              r.id === recipientId ? { ...r, status: newStatus as EnrichedRecipient["status"], approved: approve } : r
            ),
          }
        })
        setSelectedRecipient((prev) =>
          prev?.id === recipientId ? { ...prev, status: newStatus as EnrichedRecipient["status"], approved: approve } : prev
        )
        setShowPreview(false)
      }
    } catch (error) {
      console.error("Approval update failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRegenerateOne = async (recipientId: string) => {
    setActionLoading(recipientId)
    try {
      const res = await fetch(
        `/api/clinic-campaigns/${campaignId}/recipients/${recipientId}/regenerate`,
        { method: "POST" }
      )
      if (res.ok) {
        const updated = await res.json()
        setCampaign((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            clinic_campaign_recipients: prev.clinic_campaign_recipients.map((r) =>
              r.id === recipientId
                ? { ...r, subject: updated.subject, body: updated.body, body_html: updated.body_html, status: "generated" as const, approved: false }
                : r
            ),
          }
        })
        setSelectedRecipient((prev) =>
          prev?.id === recipientId
            ? { ...prev, subject: updated.subject, body: updated.body, body_html: updated.body_html, status: "generated" as const, approved: false }
            : prev
        )
        setShowPreview(false)
      }
    } catch (error) {
      console.error("Regeneration failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleTestSend = async () => {
    if (!selectedRecipient || !testEmail) return
    setTestSending(true)
    setTestResult(null)
    try {
      const res = await fetch(`/api/clinic-campaigns/${campaignId}/test-send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: selectedRecipient.id,
          sendTo: testEmail,
        }),
      })
      if (res.ok) {
        setTestResult({ success: true, message: `Test sent to ${testEmail}` })
        setShowTestForm(false)
      } else {
        const data = await res.json()
        setTestResult({ success: false, message: data.error || "Send failed" })
      }
    } catch (error) {
      console.error("Test send failed:", error)
      setTestResult({ success: false, message: "Network error" })
    } finally {
      setTestSending(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/clinic-campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await fetchCampaign()
      }
    } catch (error) {
      console.error("Status update failed:", error)
    }
  }

  const handleStartSending = async () => {
    const approved = campaign?.clinic_campaign_recipients?.filter(
      (r: { status: string }) => r.status === "approved"
    ).length || 0
    if (approved === 0) return

    setSending(true)
    sendAbortRef.current = false
    setSendProgress({ sent: 0, total: approved, current: "" })

    try {
      await fetch(`/api/clinic-campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sending" }),
      })

      while (!sendAbortRef.current) {
        const res = await fetch(`/api/clinic-campaigns/${campaignId}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json()

        if (data.completed) break
        if (data.error) {
          console.error("Send error:", data.error)
          break
        }
        if (data.skipped) continue
        if (data.sent) {
          setSendProgress((prev) => ({
            sent: (prev?.sent || 0) + 1,
            total: prev?.total || approved,
            current: data.recipient_name || "",
          }))

          const delay = Math.min(data.recommended_delay_seconds || 5, 10)
          await new Promise((resolve) => setTimeout(resolve, delay * 1000))
        }
      }
    } catch (error) {
      console.error("Sending failed:", error)
    } finally {
      setSending(false)
      setSendProgress(null)
      await fetchCampaign()
    }
  }

  const handlePauseSending = async () => {
    sendAbortRef.current = true
    await handleUpdateStatus("paused")
  }

  const handleRemoveRecipient = async (recipientId: string) => {
    try {
      const res = await fetch(
        `/api/clinic-campaigns/${campaignId}/recipients/${recipientId}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        setCampaign((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            clinic_campaign_recipients: prev.clinic_campaign_recipients.filter(
              (r) => r.id !== recipientId
            ),
          }
        })
        setShowPreview(false)
      }
    } catch (error) {
      console.error("Remove failed:", error)
    }
  }

  const startEditing = () => {
    if (!selectedRecipient) return
    setEditSubject(selectedRecipient.subject || "")
    setEditBody(selectedRecipient.body || "")
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedRecipient) return
    setSaving(true)
    try {
      const bodyHtml = editBody
        .split("\n\n")
        .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
        .join("")

      const res = await fetch(
        `/api/clinic-campaigns/${campaignId}/recipients/${selectedRecipient.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: editSubject,
            body: editBody,
            body_html: bodyHtml,
          }),
        }
      )
      if (res.ok) {
        setCampaign((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            clinic_campaign_recipients: prev.clinic_campaign_recipients.map((r) =>
              r.id === selectedRecipient.id
                ? { ...r, subject: editSubject, body: editBody, body_html: bodyHtml }
                : r
            ),
          }
        })
        setSelectedRecipient((prev) =>
          prev ? { ...prev, subject: editSubject, body: editBody, body_html: bodyHtml } : prev
        )
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/clinic-emails">Back to Clinic Emails</Link>
        </Button>
      </div>
    )
  }

  const recipients = campaign.clinic_campaign_recipients || []
  const totalRecipients = recipients.length
  const pendingCount = recipients.filter((r) => r.status === "pending").length
  const generatedCount = recipients.filter((r) => r.status === "generated").length
  const approvedCount = recipients.filter((r) => r.status === "approved").length
  const sentCount = recipients.filter((r) => ["sent", "delivered", "opened", "clicked"].includes(r.status)).length
  const errorCount = recipients.filter((r) => r.status === "error").length

  const statusBadge = STATUS_BADGES[campaign.status] || { label: campaign.status, variant: "secondary" as const }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clinic-emails">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={async () => {
                if (!confirm(`Delete "${campaign.name}"? This removes all recipients and generated emails.`)) return
                try {
                  const res = await fetch(`/api/clinic-campaigns/${campaignId}`, { method: "DELETE" })
                  if (res.ok) router.push("/dashboard/clinic-emails")
                  else alert("Failed to delete campaign")
                } catch { alert("Failed to delete campaign") }
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
          {campaign.purpose && (
            <p className="text-muted-foreground mt-1">{campaign.purpose}</p>
          )}
          {campaign.clinic_campaign_events && campaign.clinic_campaign_events.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {campaign.clinic_campaign_events.map((ce) => (
                <Badge key={ce.id} variant="outline" className="text-xs">
                  {ce.events?.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Settings (visible for drafts) */}
      {campaign.status === "draft" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Campaign Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Sender:</span>{" "}
                {campaign.sender_profile
                  ? `${campaign.sender_profile.name} (${campaign.sender_profile.email})`
                  : <span className="text-orange-500 font-medium">Not set</span>}
              </div>
              <div>
                <span className="text-muted-foreground">Max Words:</span>{" "}
                {campaign.max_words}
              </div>
              {campaign.tone && (
                <div className="col-span-2 truncate">
                  <span className="text-muted-foreground">Tone:</span>{" "}
                  {campaign.tone.length > 80 ? campaign.tone.slice(0, 80) + "..." : campaign.tone}
                </div>
              )}
              {campaign.call_to_action && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">CTA:</span>{" "}
                  {campaign.call_to_action}
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Send Window:</span>{" "}
                {campaign.send_window_start}:00 – {campaign.send_window_end}:00 EST
              </div>
              <div>
                <span className="text-muted-foreground">Daily Limit:</span>{" "}
                {campaign.daily_send_limit}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="text-2xl font-bold">{totalRecipients}</div>
            <div className="text-xs text-muted-foreground">Recipients</div>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="text-2xl font-bold">{generatedCount}</div>
            <div className="text-xs text-muted-foreground">Generated</div>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="text-2xl font-bold">{approvedCount}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="text-2xl font-bold">{sentCount}</div>
            <div className="text-xs text-muted-foreground">Sent</div>
          </CardContent>
        </Card>
        {errorCount > 0 && (
          <Card className="flex-1 min-w-[150px] border-destructive/40">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="text-2xl font-bold text-destructive">{errorCount}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {pendingCount > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleGenerate} disabled={generating}>
              <Sparkles className="mr-2 h-4 w-4" />
              {generating
                ? generateProgress
                  ? `Generating ${generateProgress.done}/${generateProgress.total}...`
                  : "Generating..."
                : `Generate Emails (${pendingCount})`}
            </Button>
            {generating && (
              <Button variant="ghost" size="sm" onClick={handleCancelGenerate}>
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
            )}
          </div>
        )}

        {errorCount > 0 && !generating && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryErrors}
              disabled={retrying || bulkDeleting}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} />
              {retrying ? "Resetting…" : `Retry Failed (${errorCount})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const errorIds = recipients
                  .filter((r) => r.status === "error")
                  .map((r) => r.id)
                handleBulkDelete(errorIds)
              }}
              disabled={bulkDeleting || retrying}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              {bulkDeleting ? "Deleting…" : `Delete All Failed (${errorCount})`}
            </Button>
          </>
        )}

        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkDelete(Array.from(selectedIds))}
            disabled={bulkDeleting}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            {bulkDeleting ? "Deleting…" : `Delete Selected (${selectedIds.size})`}
          </Button>
        )}

        {generatedCount > 0 && (
          <Button asChild>
            <Link href={`/dashboard/clinic-emails/${campaignId}/review`}>
              <Eye className="mr-2 h-4 w-4" />
              Review & Approve ({generatedCount})
            </Link>
          </Button>
        )}

        {generatedCount > 0 && (
          <Button variant="outline" onClick={handleApproveAll} disabled={approving}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {approving ? "Approving..." : `Approve All (${generatedCount})`}
          </Button>
        )}

        {(campaign.status === "draft" || (campaign.status === "generating" && pendingCount === 0)) && approvedCount > 0 && (
          <Button variant="outline" onClick={() => handleUpdateStatus("ready")}>
            <Check className="mr-2 h-4 w-4" />
            Mark Ready
          </Button>
        )}

        {(campaign.status === "ready" || campaign.status === "paused") && !sending && (
          <Button onClick={handleStartSending}>
            <Play className="mr-2 h-4 w-4" />
            Start Sending
          </Button>
        )}

        {sending && (
          <Button variant="outline" onClick={handlePauseSending}>
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}

        {campaign.status === "sending" && !sending && (
          <Button variant="outline" onClick={handlePauseSending}>
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={() => fetchCampaign()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Send progress */}
      {sending && sendProgress && (
        <div className="flex items-center gap-3 rounded-md bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">
              {sendProgress.sent < sendProgress.total
                ? `Sending ${sendProgress.sent + 1} of ${sendProgress.total}…`
                : `Sent ${sendProgress.sent} of ${sendProgress.total} — finishing up…`}
            </span>
            {sendProgress.current && sendProgress.sent < sendProgress.total && (
              <span className="text-blue-600 dark:text-blue-400"> — {sendProgress.current}</span>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {totalRecipients > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.round((sentCount / totalRecipients) * 100)}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {sentCount}/{totalRecipients} sent
          </span>
        </div>
      )}

      {/* Recipients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
          <CardDescription>
            {totalRecipients} clinics in this campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No recipients added yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Create a new clinic email campaign from the new page to select clinics by location and tags.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      {/* Select-all checkbox — only targets deletable rows */}
                      {(() => {
                        const deletable = recipients.filter((r) =>
                          ["pending", "generated", "error"].includes(r.status)
                        )
                        const allSelected =
                          deletable.length > 0 &&
                          deletable.every((r) => selectedIds.has(r.id))
                        return (
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIds(
                                  new Set(deletable.map((r) => r.id))
                                )
                              } else {
                                setSelectedIds(new Set())
                              }
                            }}
                            aria-label="Select all deletable recipients"
                          />
                        )
                      })()}
                    </TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => {
                    const rStatus = RECIPIENT_STATUS_BADGES[recipient.status] || {
                      label: recipient.status,
                      variant: "secondary" as const,
                    }

                    const isDeletable = ["pending", "generated", "error"].includes(
                      recipient.status
                    )
                    const isChecked = selectedIds.has(recipient.id)

                    return (
                      <TableRow
                        key={recipient.id}
                        className={`cursor-pointer ${isChecked ? "bg-muted/40" : ""}`}
                        onClick={() => {
                          if (recipient.body) {
                            setSelectedRecipient(recipient)
                            setShowPreview(true)
                            setShowTestForm(false)
                            setTestResult(null)
                          }
                        }}
                      >
                        <TableCell
                          className="w-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isDeletable && (
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                setSelectedIds((prev) => {
                                  const next = new Set(prev)
                                  if (checked) next.add(recipient.id)
                                  else next.delete(recipient.id)
                                  return next
                                })
                              }}
                              aria-label={`Select ${recipient.recipient_name}`}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{recipient.recipient_name || "Unknown"}</div>
                          {recipient.clinic?.tags && recipient.clinic.tags.length > 0 && (
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {recipient.clinic.tags.slice(0, 3).join(", ")}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {recipient.clinic?.city && recipient.clinic?.state
                            ? `${recipient.clinic.city}, ${recipient.clinic.state}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {recipient.recipient_email || <span className="text-orange-500">No email</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={rStatus.variant}>{rStatus.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">
                          {recipient.subject || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {recipient.sent_at
                            ? new Date(recipient.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {recipient.status === "generated" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleApproveOne(recipient.id, true)}
                                  title="Approve"
                                >
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleRegenerateOne(recipient.id)}
                                  title="Regenerate"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                            {["pending", "generated", "error"].includes(recipient.status) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleRemoveRecipient(recipient.id)}
                                title="Remove"
                              >
                                <X className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={(open) => {
        setShowPreview(open)
        if (!open) setIsEditing(false)
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              {selectedRecipient?.recipient_name
                ? `To: ${selectedRecipient.recipient_name}`
                : ""}
              {selectedRecipient?.recipient_email
                ? ` <${selectedRecipient.recipient_email}>`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedRecipient && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Subject
                </div>
                {isEditing ? (
                  <Input
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="font-medium"
                  />
                ) : (
                  <div className="font-medium">
                    {selectedRecipient.subject || "No subject"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Body
                </div>
                {isEditing ? (
                  <Textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={12}
                    className="text-sm font-mono"
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm bg-muted/50 rounded-md p-4">
                    {selectedRecipient.body || "No body generated"}
                  </div>
                )}
              </div>

              {campaign.sender_profile?.signature && (
                <div className="border-t pt-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Signature (auto-appended)
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {campaign.sender_profile.signature}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveEdit} disabled={saving}>
                      {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    {selectedRecipient.status === "generated" && (
                      <>
                        <Button
                          onClick={() => handleApproveOne(selectedRecipient.id, true)}
                          disabled={actionLoading === selectedRecipient.id}
                        >
                          {actionLoading === selectedRecipient.id
                            ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            : <Check className="mr-2 h-4 w-4" />}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRegenerateOne(selectedRecipient.id)}
                          disabled={actionLoading === selectedRecipient.id}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </Button>
                      </>
                    )}

                    {selectedRecipient.body && (
                      <Button variant="outline" size="sm" onClick={startEditing}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    )}

                    {["pending", "generated", "error"].includes(selectedRecipient.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveRecipient(selectedRecipient.id)}
                        disabled={actionLoading === selectedRecipient.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}

                    {selectedRecipient.body && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setShowTestForm(!showTestForm); setTestResult(null) }}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Test
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Test Send Form */}
              {showTestForm && (
                <div className="rounded-md border bg-muted/30 p-3 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Send a test copy to:</div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleTestSend} disabled={testSending || !testEmail}>
                      {testSending ? <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
                      {testSending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Subject will be prefixed with [TEST]. No tracking, no side effects.</p>
                </div>
              )}

              {testResult && (
                <div className={`rounded-md px-3 py-2 text-sm ${testResult.success ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-destructive/10 text-destructive"}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Campaign Details (collapsible) — for non-draft campaigns */}
      {campaign.status !== "draft" && (
        <CampaignDetailsCard campaign={campaign} />
      )}
    </div>
  )
}

function CampaignDetailsCard({ campaign }: { campaign: CampaignDetail }) {
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Campaign Settings</CardTitle>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Sender:</span>{" "}
              {campaign.sender_profile ? `${campaign.sender_profile.name} (${campaign.sender_profile.email})` : "Not set"}
            </div>
            <div>
              <span className="text-muted-foreground">Max Words:</span> {campaign.max_words}
            </div>
            {campaign.tone && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Tone:</span> {campaign.tone}
              </div>
            )}
            {campaign.call_to_action && (
              <div className="col-span-2">
                <span className="text-muted-foreground">CTA:</span> {campaign.call_to_action}
              </div>
            )}
            {campaign.must_include && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Must Include:</span> {campaign.must_include}
              </div>
            )}
            {campaign.must_avoid && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Must Avoid:</span> {campaign.must_avoid}
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Send Window:</span>{" "}
              {campaign.send_window_start}:00 – {campaign.send_window_end}:00 EST
            </div>
            <div>
              <span className="text-muted-foreground">Daily Limit:</span> {campaign.daily_send_limit}
            </div>
            <div>
              <span className="text-muted-foreground">Delay:</span>{" "}
              {campaign.min_delay_seconds}–{campaign.max_delay_seconds}s
            </div>
            <div>
              <span className="text-muted-foreground">Track Opens:</span> {campaign.track_opens ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-muted-foreground">Track Clicks:</span> {campaign.track_clicks ? "Yes" : "No"}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
