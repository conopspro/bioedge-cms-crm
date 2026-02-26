"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  List,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { OutreachCampaignRecipient } from "@/types/outreach"

interface CampaignInfo {
  id: string
  name: string
  status: string
}

export default function OutreachReviewQueuePage() {
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<CampaignInfo | null>(null)
  const [queue, setQueue] = useState<OutreachCampaignRecipient[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editSubject, setEditSubject] = useState("")
  const [editBody, setEditBody] = useState("")
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [approvedCount, setApprovedCount] = useState(0)
  const [deletedCount, setDeletedCount] = useState(0)
  const [showApproveAll, setShowApproveAll] = useState(false)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    try {
      const [campaignRes, recipientsRes] = await Promise.all([
        fetch(`/api/outreach-campaigns/${campaignId}`),
        fetch(`/api/outreach-campaigns/${campaignId}/recipients?status=generated&pageSize=200`),
      ])

      if (campaignRes.ok) {
        const data = await campaignRes.json()
        setCampaign({ id: data.campaign.id, name: data.campaign.name, status: data.campaign.status })
        setApprovedCount(data.campaign.approved_count ?? 0)
      }

      if (recipientsRes.ok) {
        const data = await recipientsRes.json()
        const items = data.recipients ?? []
        setQueue(items)
        if (items.length > 0) {
          setEditSubject(items[0].subject ?? "")
          setEditBody(items[0].body ?? "")
        }
      }
    } catch (err) {
      console.error("Failed to load review queue:", err)
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  // ── Load email into editor when index changes ─────────────────────────────
  useEffect(() => {
    const current = queue[currentIndex]
    if (current) {
      setEditSubject(current.subject ?? "")
      setEditBody(current.body ?? "")
      setDirty(false)
    }
  }, [currentIndex, queue])

  // ── Auto-save on edit ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!dirty) return
    const current = queue[currentIndex]
    if (!current) return

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await fetch(`/api/outreach-campaigns/${campaignId}/recipients/${current.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update", subject: editSubject, body: editBody }),
        })
        setDirty(false)
      } finally {
        setSaving(false)
      }
    }, 1200)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSubject, editBody, dirty])

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, queue.length])

  const goNext = () => setCurrentIndex((i) => Math.min(queue.length - 1, i + 1))
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1))

  // ── Actions ───────────────────────────────────────────────────────────────
  const recipientAction = async (action: string, extra?: Record<string, unknown>) => {
    const current = queue[currentIndex]
    if (!current) return

    await fetch(`/api/outreach-campaigns/${campaignId}/recipients/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    })
  }

  const handleApprove = async () => {
    // Save any pending edits first
    const current = queue[currentIndex]
    if (!current) return

    if (dirty) {
      await fetch(`/api/outreach-campaigns/${campaignId}/recipients/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", subject: editSubject, body: editBody }),
      })
      setDirty(false)
    }

    await recipientAction("approve")
    setApprovedCount((n) => n + 1)

    // Remove from queue and advance
    const newQueue = queue.filter((_, i) => i !== currentIndex)
    setQueue(newQueue)
    setCurrentIndex((i) => Math.min(newQueue.length - 1, i))
  }

  const handleDelete = async () => {
    await recipientAction("delete")
    setDeletedCount((n) => n + 1)

    const newQueue = queue.filter((_, i) => i !== currentIndex)
    setQueue(newQueue)
    setCurrentIndex((i) => Math.min(newQueue.length - 1, i))
  }

  const handleRegenerate = async () => {
    await recipientAction("regenerate")
    // Refresh queue to get the new content
    await fetchQueue()
  }

  const handleApproveAll = async () => {
    await fetch(`/api/outreach-campaigns/${campaignId}/recipients`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve_all" }),
    })
    await fetchQueue()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading review queue…
      </div>
    )
  }

  const current = queue[currentIndex]
  const totalInQueue = queue.length
  const progressPercent = totalInQueue > 0
    ? Math.round((currentIndex / totalInQueue) * 100)
    : 100

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b px-6 py-3 bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/outreach-emails/${campaignId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <p className="text-sm font-medium">{campaign?.name}</p>
            <p className="text-xs text-muted-foreground">
              Review queue — {totalInQueue} remaining · {approvedCount} approved · {deletedCount} deleted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchQueue}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link href={`/dashboard/outreach-emails/${campaignId}`}>
              <List className="h-3.5 w-3.5 mr-1" />
              Back to campaign
            </Link>
          </Button>

          <AlertDialog open={showApproveAll} onOpenChange={setShowApproveAll}>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowApproveAll(true)}
              disabled={totalInQueue === 0}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Approve All Remaining ({totalInQueue})
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve all {totalInQueue} remaining emails?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will approve all generated emails in the queue without individual review.
                  You can still edit or delete emails from the campaign detail page before sending.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleApproveAll}>
                  Approve All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-1 rounded-none" />

      {/* Main content */}
      {totalInQueue === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-8">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div>
            <p className="text-lg font-semibold">Queue complete!</p>
            <p className="text-muted-foreground text-sm mt-1">
              {approvedCount} email{approvedCount !== 1 ? "s" : ""} approved · {deletedCount} deleted
            </p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/outreach-emails/${campaignId}`}>
              Back to campaign
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation sidebar */}
          <div className="w-16 border-r flex flex-col items-center justify-center gap-4 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="h-12 w-12"
              title="Previous (←)"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="text-center">
              <p className="text-xs font-medium">{currentIndex + 1}</p>
              <p className="text-xs text-muted-foreground">of {totalInQueue}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              disabled={currentIndex === totalInQueue - 1}
              className="h-12 w-12"
              title="Next (→)"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Email editor */}
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
            {/* Recipient info */}
            {current && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="font-mono text-sm text-muted-foreground">{current.recipient_email}</div>
                {current.recipient_business_type && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {current.recipient_business_type}
                  </Badge>
                )}
                {current.recipient_practice_name && (
                  <span className="text-xs text-muted-foreground">{current.recipient_practice_name}</span>
                )}
                {current.recipient_city && current.recipient_state && (
                  <span className="text-xs text-muted-foreground">
                    {current.recipient_city}, {current.recipient_state}
                  </span>
                )}
                {saving && (
                  <span className="text-xs text-muted-foreground ml-auto">Saving…</span>
                )}
              </div>
            )}

            {/* Subject line */}
            <div className="shrink-0 space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Subject
              </label>
              <Input
                value={editSubject}
                onChange={(e) => { setEditSubject(e.target.value); setDirty(true) }}
                className="font-medium"
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col gap-1 min-h-0">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                Email Body
              </label>
              <Textarea
                value={editBody}
                onChange={(e) => { setEditBody(e.target.value); setDirty(true) }}
                className="flex-1 resize-none font-mono text-sm min-h-0"
              />
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 shrink-0 border-t pt-4">
              <Button onClick={handleApprove} className="gap-2">
                <Check className="h-4 w-4" />
                Approve & Next
              </Button>
              <Button variant="ghost" onClick={handleRegenerate} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Regenerate
              </Button>
              <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div className="ml-auto text-xs text-muted-foreground">
                ← → to navigate · edits auto-save
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
