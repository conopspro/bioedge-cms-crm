"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  List,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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

interface QueueRecipient {
  id: string
  contact_id: string
  company_id: string | null
  subject: string | null
  body: string | null
  status: string
  contact: {
    first_name: string
    last_name: string
    email: string
    title: string | null
    seniority: string | null
  } | null
  company: {
    id: string
    name: string
  } | null
}

interface CampaignInfo {
  id: string
  name: string
  sender_profile: {
    name: string
    email: string
    title: string | null
    phone: string | null
    signature: string | null
  } | null
}

export default function ReviewQueuePage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  // Queue state
  const [queue, setQueue] = useState<QueueRecipient[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editSubject, setEditSubject] = useState("")
  const [editBody, setEditBody] = useState("")
  const originalSubjectRef = useRef("")
  const originalBodyRef = useRef("")

  // Action state
  const [regenerating, setRegenerating] = useState(false)
  const [approvedCount, setApprovedCount] = useState(0)
  const [deletedCount, setDeletedCount] = useState(0)
  const initialQueueSize = useRef(0)

  // Bulk action state
  const [showDeleteList, setShowDeleteList] = useState(false)
  const [deleteSelectedIds, setDeleteSelectedIds] = useState<Set<string>>(
    new Set()
  )
  const [showApproveAllDialog, setShowApproveAllDialog] = useState(false)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [bulkApproving, setBulkApproving] = useState(false)

  // Test send state
  const [showTestSend, setShowTestSend] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [sendingTest, setSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Load campaign data and build queue
  const loadCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`)
      if (!res.ok) return

      const data = await res.json()
      setCampaign({
        id: data.id,
        name: data.name,
        sender_profile: data.sender_profile,
      })

      // Pre-fill test email with sender's email
      if (data.sender_profile?.email) {
        setTestEmail(data.sender_profile.email)
      }

      // Filter to only generated recipients, sort by company name
      const generated = (data.campaign_recipients || [])
        .filter((r: QueueRecipient) => r.status === "generated")
        .sort((a: QueueRecipient, b: QueueRecipient) => {
          const aName = a.company?.name || ""
          const bName = b.company?.name || ""
          return aName.localeCompare(bName)
        })

      setQueue(generated)
      if (initialQueueSize.current === 0) {
        initialQueueSize.current = generated.length
      }
    } catch (error) {
      console.error("Failed to load campaign:", error)
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    loadCampaign()
  }, [loadCampaign])

  // Sync edit fields when current item changes
  useEffect(() => {
    const current = queue[currentIndex]
    if (current) {
      const subject = current.subject || ""
      const body = current.body || ""
      setEditSubject(subject)
      setEditBody(body)
      originalSubjectRef.current = subject
      originalBodyRef.current = body
    }
  }, [currentIndex, queue])

  // Auto-save edits if changed
  const saveEditsIfChanged = useCallback(async () => {
    const current = queue[currentIndex]
    if (!current) return

    const subjectChanged = editSubject !== originalSubjectRef.current
    const bodyChanged = editBody !== originalBodyRef.current

    if (!subjectChanged && !bodyChanged) return

    const updateData: Record<string, unknown> = {}
    if (subjectChanged) updateData.subject = editSubject
    if (bodyChanged) {
      updateData.body = editBody
      // Regenerate HTML from plain text
      updateData.body_html = editBody
        .split("\n\n")
        .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
        .join("")
    }

    try {
      await fetch(
        `/api/campaigns/${campaignId}/recipients/${current.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      )
      // Update local state so we don't re-save
      originalSubjectRef.current = editSubject
      originalBodyRef.current = editBody
    } catch (err) {
      console.error("Auto-save failed:", err)
    }
  }, [campaignId, currentIndex, editSubject, editBody, queue])

  // Navigate
  const goTo = useCallback(
    async (newIndex: number) => {
      await saveEditsIfChanged()
      setCurrentIndex(Math.max(0, Math.min(newIndex, queue.length - 1)))
    },
    [saveEditsIfChanged, queue.length]
  )

  const goPrev = () => goTo(currentIndex - 1)
  const goNext = () => goTo(currentIndex + 1)

  // Approve current and advance
  const handleApprove = async () => {
    const current = queue[currentIndex]
    if (!current) return

    // Save any edits first
    const updateData: Record<string, unknown> = {
      status: "approved",
      approved: true,
    }
    if (editSubject !== originalSubjectRef.current) {
      updateData.subject = editSubject
    }
    if (editBody !== originalBodyRef.current) {
      updateData.body = editBody
      updateData.body_html = editBody
        .split("\n\n")
        .map((para: string) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
        .join("")
    }

    try {
      await fetch(
        `/api/campaigns/${campaignId}/recipients/${current.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      )

      setApprovedCount((prev) => prev + 1)
      // Remove from queue
      setQueue((prev) => prev.filter((_, i) => i !== currentIndex))
      // Adjust index if we were at the end
      if (currentIndex >= queue.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1))
      }
    } catch (err) {
      console.error("Approve failed:", err)
    }
  }

  // Delete current and advance
  const handleDelete = async () => {
    const current = queue[currentIndex]
    if (!current) return

    try {
      await fetch(
        `/api/campaigns/${campaignId}/recipients/${current.id}`,
        { method: "DELETE" }
      )

      setDeletedCount((prev) => prev + 1)
      setQueue((prev) => prev.filter((_, i) => i !== currentIndex))
      if (currentIndex >= queue.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1))
      }
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  // Regenerate current
  const handleRegenerate = async () => {
    const current = queue[currentIndex]
    if (!current) return

    setRegenerating(true)
    try {
      const res = await fetch(
        `/api/campaigns/${campaignId}/recipients/${current.id}/regenerate`,
        { method: "POST" }
      )

      if (res.ok) {
        const updated = await res.json()
        setQueue((prev) =>
          prev.map((r, i) =>
            i === currentIndex
              ? { ...r, subject: updated.subject, body: updated.body }
              : r
          )
        )
        setEditSubject(updated.subject || "")
        setEditBody(updated.body || "")
        originalSubjectRef.current = updated.subject || ""
        originalBodyRef.current = updated.body || ""
      }
    } catch (err) {
      console.error("Regenerate failed:", err)
    } finally {
      setRegenerating(false)
    }
  }

  // Bulk approve all remaining
  const handleApproveAll = async () => {
    setBulkApproving(true)
    try {
      const ids = queue.map((r) => r.id)
      const res = await fetch(`/api/campaigns/${campaignId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientIds: ids, approved: true }),
      })

      if (res.ok) {
        const data = await res.json()
        setApprovedCount((prev) => prev + (data.updated || 0))
        setQueue([])
        setCurrentIndex(0)
      }
    } catch (err) {
      console.error("Bulk approve failed:", err)
    } finally {
      setBulkApproving(false)
      setShowApproveAllDialog(false)
    }
  }

  // Bulk delete selected
  const handleBulkDelete = async () => {
    if (deleteSelectedIds.size === 0) return
    setBulkDeleting(true)

    try {
      const res = await fetch(
        `/api/campaigns/${campaignId}/recipients/bulk`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientIds: Array.from(deleteSelectedIds),
          }),
        }
      )

      if (res.ok) {
        setDeletedCount((prev) => prev + deleteSelectedIds.size)
        setQueue((prev) =>
          prev.filter((r) => !deleteSelectedIds.has(r.id))
        )
        setDeleteSelectedIds(new Set())
        setShowDeleteList(false)
        setCurrentIndex(0)
      }
    } catch (err) {
      console.error("Bulk delete failed:", err)
    } finally {
      setBulkDeleting(false)
      setShowBulkDeleteDialog(false)
    }
  }

  // Send test email
  const handleTestSend = async () => {
    const current = queue[currentIndex]
    if (!current || !testEmail) return

    setSendingTest(true)
    setTestResult(null)

    // Auto-save edits first so the test reflects current content
    await saveEditsIfChanged()

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/test-send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: current.id,
          sendTo: testEmail,
        }),
      })

      if (res.ok) {
        setTestResult({
          success: true,
          message: `Test sent to ${testEmail}`,
        })
      } else {
        const data = await res.json()
        setTestResult({
          success: false,
          message: data.error || "Send failed",
        })
      }
    } catch {
      setTestResult({ success: false, message: "Network error" })
    } finally {
      setSendingTest(false)
    }
  }

  // Toggle select for delete list
  const toggleDeleteSelect = (id: string) => {
    setDeleteSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDeleteList || showApproveAllDialog || showBulkDeleteDialog) return
      // Don't capture if user is typing in input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, queue.length, showDeleteList, showApproveAllDialog, showBulkDeleteDialog])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const current = queue[currentIndex]
  const remainingCount = queue.length

  // Empty state — all reviewed
  if (queue.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/campaigns/${campaignId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold">All emails reviewed!</h2>
          <p className="text-muted-foreground mt-2">
            {approvedCount > 0 && `${approvedCount} approved`}
            {approvedCount > 0 && deletedCount > 0 && " · "}
            {deletedCount > 0 && `${deletedCount} deleted`}
          </p>
          <Button asChild className="mt-6">
            <Link href={`/dashboard/campaigns/${campaignId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaign
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Multi-select delete list view
  if (showDeleteList) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowDeleteList(false)
              setDeleteSelectedIds(new Set())
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Select Emails to Delete
            </h1>
            <p className="text-muted-foreground">
              Check the emails you want to remove from this campaign.
            </p>
          </div>
        </div>

        <div className="rounded-md border divide-y">
          {queue.map((recipient) => {
            const contactName = recipient.contact
              ? `${recipient.contact.first_name} ${recipient.contact.last_name}`
              : "Unknown"

            return (
              <label
                key={recipient.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox
                  checked={deleteSelectedIds.has(recipient.id)}
                  onCheckedChange={() => toggleDeleteSelect(recipient.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{contactName}</span>
                    <span className="text-muted-foreground">—</span>
                    <span className="text-sm text-muted-foreground">
                      {recipient.company?.name || "No company"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {recipient.subject || "No subject"}
                  </p>
                </div>
              </label>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteList(false)
              setDeleteSelectedIds(new Set())
            }}
          >
            Cancel
          </Button>
          {deleteSelectedIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowBulkDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({deleteSelectedIds.size})
            </Button>
          )}
        </div>

        {/* Bulk Delete Confirmation */}
        <AlertDialog
          open={showBulkDeleteDialog}
          onOpenChange={setShowBulkDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {deleteSelectedIds.size} emails?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove {deleteSelectedIds.size} recipient
                {deleteSelectedIds.size > 1 ? "s" : ""} from this campaign.
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {bulkDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  // Main review view
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/campaigns/${campaignId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-muted-foreground">
            {campaign?.name || "Campaign"}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {currentIndex + 1} of {remainingCount}
        </Badge>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setShowApproveAllDialog(true)}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Approve All Remaining ({remainingCount})
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowDeleteList(true)}
        >
          <List className="mr-2 h-4 w-4" />
          Select & Delete...
        </Button>
      </div>

      {/* Email Card */}
      {current && (
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm">
              <span className="font-medium">
                To:{" "}
                {current.contact
                  ? `${current.contact.first_name} ${current.contact.last_name}`
                  : "Unknown"}
              </span>
              {current.contact?.email && (
                <span className="text-muted-foreground">
                  {" "}
                  &lt;{current.contact.email}&gt;
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {current.company?.name || "No company"}
              {current.contact?.title && ` · ${current.contact.title}`}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Subject
              </Label>
              <Input
                id="subject"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="font-medium"
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <Label htmlFor="body" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Body
              </Label>
              <Textarea
                id="body"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="min-h-[200px] text-sm leading-relaxed"
                rows={10}
              />
            </div>

            {/* Signature Preview */}
            {campaign?.sender_profile?.signature && (
              <div className="pt-2 border-t">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Signature
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {campaign.sender_profile.signature}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Send */}
      {showTestSend && (
        <Card className="border-dashed">
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <Send className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Send test to..."
                className="max-w-sm"
                type="email"
              />
              <Button
                size="sm"
                onClick={handleTestSend}
                disabled={sendingTest || !testEmail}
              >
                {sendingTest ? "Sending..." : "Send"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowTestSend(false)
                  setTestResult(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {testResult && (
              <p
                className={`text-sm mt-2 ml-7 ${
                  testResult.success
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                {testResult.message}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Prev
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowTestSend(true)
              setTestResult(null)
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Test
          </Button>
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${regenerating ? "animate-spin" : ""}`}
            />
            {regenerating ? "Regenerating..." : "Regenerate"}
          </Button>
          <Button onClick={handleApprove}>
            <Check className="mr-2 h-4 w-4" />
            Approve & Next
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={goNext}
          disabled={currentIndex >= queue.length - 1}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${
                  initialQueueSize.current > 0
                    ? Math.round(
                        ((approvedCount + deletedCount) /
                          initialQueueSize.current) *
                          100
                      )
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {approvedCount > 0 && (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              {approvedCount} approved
            </span>
          )}
          {deletedCount > 0 && (
            <span className="flex items-center gap-1">
              <X className="h-3 w-3 text-destructive" />
              {deletedCount} deleted
            </span>
          )}
          <span>{remainingCount} remaining</span>
        </div>
      </div>

      {/* Approve All Confirmation Dialog */}
      <AlertDialog
        open={showApproveAllDialog}
        onOpenChange={setShowApproveAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Approve all {remainingCount} remaining emails?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will approve all {remainingCount} generated emails without
              further review. You can still edit or regenerate individual emails
              from the campaign detail page afterward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveAll}
              disabled={bulkApproving}
            >
              {bulkApproving ? "Approving..." : "Approve All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
