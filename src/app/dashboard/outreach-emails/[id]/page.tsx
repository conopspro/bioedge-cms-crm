"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Eye,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
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
import type { OutreachCampaign, OutreachCampaignRecipient } from "@/types/outreach"

interface CampaignDetail extends OutreachCampaign {
  sender_profiles: {
    name: string
    email: string
    title: string | null
    signature: string | null
  } | null
  recipient_count: number
  pending_count: number
  generated_count: number
  approved_count: number
  sent_count: number
  bounced_count: number
  failed_count: number
}

const STATUS_BADGES: Record<string, {
  label: string
  variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline"
}> = {
  draft: { label: "Draft", variant: "secondary" },
  generating: { label: "Generating…", variant: "info" },
  ready: { label: "Ready", variant: "warning" },
  sending: { label: "Sending", variant: "info" },
  paused: { label: "Paused", variant: "outline" },
  completed: { label: "Completed", variant: "success" },
}

const RECIPIENT_BADGES: Record<string, {
  label: string
  variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline"
}> = {
  pending: { label: "Pending", variant: "secondary" },
  generated: { label: "Generated", variant: "info" },
  approved: { label: "Approved", variant: "success" },
  sent: { label: "Sent", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  opened: { label: "Opened", variant: "success" },
  clicked: { label: "Clicked", variant: "success" },
  bounced: { label: "Bounced", variant: "destructive" },
  failed: { label: "Failed", variant: "destructive" },
  suppressed: { label: "Suppressed", variant: "outline" },
}

export default function OutreachCampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [recipients, setRecipients] = useState<OutreachCampaignRecipient[]>([])
  const [recipientsTotal, setRecipientsTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState<{ generated: number; remaining: number } | null>(null)
  const [sending, setSending] = useState(false)
  const [sendDelay, setSendDelay] = useState(0)
  const [previewRecipient, setPreviewRecipient] = useState<OutreachCampaignRecipient | null>(null)
  const [editSubject, setEditSubject] = useState("")
  const [editBody, setEditBody] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)

  const sendTimerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/outreach-campaigns/${id}`)
      if (res.ok) {
        const data = await res.json()
        setCampaign(data.campaign)
      }
    } catch (err) {
      console.error("Failed to fetch campaign:", err)
    }
  }, [id])

  const fetchRecipients = useCallback(async () => {
    try {
      const res = await fetch(`/api/outreach-campaigns/${id}/recipients?pageSize=100`)
      if (res.ok) {
        const data = await res.json()
        setRecipients(data.recipients ?? [])
        setRecipientsTotal(data.total ?? 0)
      }
    } catch (err) {
      console.error("Failed to fetch recipients:", err)
    }
  }, [id])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchCampaign(), fetchRecipients()])
      setLoading(false)
    }
    load()
  }, [fetchCampaign, fetchRecipients])

  // ── Generate emails ──────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true)
    setGenerateProgress({ generated: 0, remaining: campaign?.recipient_count ?? 0 })

    const runBatch = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/outreach-campaigns/${id}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchSize: 5 }),
        })
        if (!res.ok) {
          setGenerating(false)
          return
        }
        const data = await res.json()
        setGenerateProgress({ generated: data.generated ?? 0, remaining: data.remaining ?? 0 })

        if (data.remaining > 0) {
          setTimeout(runBatch, 500)
        } else {
          setGenerating(false)
          await fetchCampaign()
          await fetchRecipients()
        }
      } catch {
        setGenerating(false)
      }
    }

    await runBatch()
  }

  // ── Approve all ──────────────────────────────────────────────────────────
  const handleApproveAll = async () => {
    try {
      await fetch(`/api/outreach-campaigns/${id}/recipients`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_all" }),
      })
      await fetchCampaign()
      await fetchRecipients()
    } catch (err) {
      console.error("Approve all failed:", err)
    }
  }

  // ── Send one email ────────────────────────────────────────────────────────
  const handleSendOne = useCallback(async () => {
    if (sendTimerRef.current) return
    setSending(true)
    try {
      const res = await fetch(`/api/outreach-campaigns/${id}/send`, { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429 && data.retry_after_seconds) {
          alert(data.error)
        }
        setSending(false)
        return
      }

      await fetchCampaign()
      await fetchRecipients()

      if (data.remaining_approved > 0) {
        const delay = (data.recommended_delay_seconds ?? 120) * 1000
        setSendDelay(data.recommended_delay_seconds ?? 120)
        sendTimerRef.current = setTimeout(() => {
          sendTimerRef.current = null
          setSendDelay(0)
          setSending(false)
          handleSendOne()
        }, delay)
      } else {
        setSending(false)
        setSendDelay(0)
        await fetchCampaign()
        await fetchRecipients()
      }
    } catch {
      setSending(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleDeleteCampaign = async () => {
    if (!confirm("Delete this entire campaign and all its emails? This cannot be undone.")) return
    const res = await fetch(`/api/outreach-campaigns/${id}`, { method: "DELETE" })
    if (res.ok) {
      window.location.href = "/dashboard/outreach-emails"
    } else {
      alert("Failed to delete campaign.")
    }
  }

  const handlePauseSend = () => {
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current)
      sendTimerRef.current = null
    }
    setSending(false)
    setSendDelay(0)
    fetch(`/api/outreach-campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paused" }),
    }).then(() => fetchCampaign())
  }

  // ── Individual recipient actions ─────────────────────────────────────────
  const recipientAction = async (
    recipientId: string,
    action: string,
    extra?: Record<string, unknown>
  ) => {
    await fetch(`/api/outreach-campaigns/${id}/recipients/${recipientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    })
    await fetchCampaign()
    await fetchRecipients()
  }

  const openPreview = (r: OutreachCampaignRecipient) => {
    setPreviewRecipient(r)
    setEditSubject(r.subject ?? "")
    setEditBody(r.body ?? "")
  }

  const saveEdit = async () => {
    if (!previewRecipient) return
    setSavingEdit(true)
    await recipientAction(previewRecipient.id, "update", {
      subject: editSubject,
      body: editBody,
    })
    setSavingEdit(false)
    setPreviewRecipient(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading campaign…
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/outreach-emails">Back to campaigns</Link>
        </Button>
      </div>
    )
  }

  const statusBadge = STATUS_BADGES[campaign.status] ?? { label: campaign.status, variant: "secondary" as const }
  const sentPercent = campaign.recipient_count > 0
    ? Math.round((campaign.sent_count / campaign.recipient_count) * 100)
    : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/outreach-emails">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{campaign.name}</h1>
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>
            {campaign.promotion_title && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Promoting: {campaign.promotion_title}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {(campaign.status === "draft" || campaign.status === "generating") && (
            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generating
                ? `Generating… (${generateProgress?.remaining ?? "?"} left)`
                : "Generate Emails"}
            </Button>
          )}

          {(campaign.status === "ready" || campaign.status === "generating") && campaign.generated_count > 0 && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/outreach-emails/${id}/review`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Review Queue ({campaign.generated_count})
                </Link>
              </Button>
              <Button variant="outline" onClick={handleApproveAll}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve All
              </Button>
            </>
          )}

          {campaign.status === "ready" && campaign.approved_count > 0 && (
            <Button onClick={handleSendOne} disabled={sending}>
              <Send className="mr-2 h-4 w-4" />
              Start Sending ({campaign.approved_count} approved)
            </Button>
          )}

          {(campaign.status === "sending" || sending) && (
            <Button variant="destructive" onClick={handlePauseSend}>
              <Pause className="mr-2 h-4 w-4" />
              Pause{sendDelay > 0 ? ` (next in ${sendDelay}s)` : ""}
            </Button>
          )}

          {campaign.status === "paused" && (
            <Button onClick={handleSendOne}>
              <Play className="mr-2 h-4 w-4" />
              Resume Sending
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteCampaign}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete campaign"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.recipient_count.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.generated_count.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.approved_count.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.sent_count.toLocaleString()}</div>
            <Progress value={sentPercent} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{sentPercent}% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Generation progress bar */}
      {generating && generateProgress && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Generating emails…</span>
            <span className="text-sm text-muted-foreground ml-auto">
              {generateProgress.remaining} remaining
            </span>
          </div>
          {campaign.recipient_count > 0 && (
            <Progress
              value={((campaign.recipient_count - generateProgress.remaining) / campaign.recipient_count) * 100}
              className="h-2"
            />
          )}
        </div>
      )}

      {/* Recipients table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recipients{" "}
            <span className="text-muted-foreground text-base font-normal">
              ({recipientsTotal.toLocaleString()})
            </span>
          </h2>
          <Button variant="ghost" size="sm" onClick={() => { fetchCampaign(); fetchRecipients() }}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Practice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[120px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No recipients yet.
                  </TableCell>
                </TableRow>
              )}
              {recipients.map((r) => {
                const badge = RECIPIENT_BADGES[r.status] ?? { label: r.status, variant: "secondary" as const }
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.recipient_email}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {r.recipient_business_type ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{r.recipient_practice_name ?? "—"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                        {r.subject ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {r.body && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openPreview(r)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {r.status === "generated" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => recipientAction(r.id, "approve")}
                          >
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          </Button>
                        )}
                        {(r.status === "generated" || r.status === "approved") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => recipientAction(r.id, "delete")}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
        {recipientsTotal > 100 && (
          <p className="text-xs text-muted-foreground">
            Showing first 100 of {recipientsTotal.toLocaleString()} recipients. Use the review queue to process all.
          </p>
        )}
      </div>

      {/* Email preview/edit dialog */}
      <Dialog
        open={!!previewRecipient}
        onOpenChange={(open) => !open && setPreviewRecipient(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Email Preview — {previewRecipient?.recipient_email}
            </DialogTitle>
            <DialogDescription>
              {previewRecipient?.recipient_business_type && (
                <span className="text-xs">
                  Business type: {previewRecipient.recipient_business_type}
                  {previewRecipient.recipient_practice_name && ` · ${previewRecipient.recipient_practice_name}`}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Body</label>
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveEdit} disabled={savingEdit}>
                {savingEdit ? "Saving…" : "Save Changes"}
              </Button>
              {previewRecipient?.status === "generated" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    recipientAction(previewRecipient.id, "approve")
                    setPreviewRecipient(null)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  if (previewRecipient) recipientAction(previewRecipient.id, "regenerate")
                  setPreviewRecipient(null)
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button
                variant="ghost"
                className="ml-auto"
                onClick={() => setPreviewRecipient(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
