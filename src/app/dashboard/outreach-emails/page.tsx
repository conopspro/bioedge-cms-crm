"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Users, Settings2, RefreshCw, Trash2, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OutreachCampaignListItem {
  id: string
  name: string
  status: string
  purpose: string | null
  promotion_title: string | null
  promotion_type: string | null
  target_business_types: string[]
  recipient_count: number
  pending_count: number
  generated_count: number
  approved_count: number
  sent_count: number
  sender_profiles: { name: string; email: string } | null
  created_at: string
}

const STATUS_BADGES: Record<string, {
  label: string
  variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline"
}> = {
  draft: { label: "Draft", variant: "secondary" },
  generating: { label: "Generating", variant: "info" },
  ready: { label: "Ready", variant: "warning" },
  sending: { label: "Sending", variant: "info" },
  paused: { label: "Paused", variant: "outline" },
  completed: { label: "Completed", variant: "success" },
}

export default function OutreachEmailsPage() {
  const [campaigns, setCampaigns] = useState<OutreachCampaignListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/outreach-campaigns")
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data.campaigns ?? [])
      }
    } catch (error) {
      console.error("Failed to fetch outreach campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/outreach-campaigns/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error)
    }
  }

  const filtered = statusFilter === "all"
    ? campaigns
    : campaigns.filter((c) => c.status === statusFilter)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">General Outreach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Persona-based email campaigns for your broader health and wellness contact list
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/outreach-contacts">
              <Users className="mr-2 h-4 w-4" />
              Contacts
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/outreach-emails/presets">
              <Settings2 className="mr-2 h-4 w-4" />
              Presets
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/outreach-emails/new">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="generating">Generating</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" onClick={fetchCampaigns} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
        <span className="text-sm text-muted-foreground">
          {filtered.length} campaign{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Campaign table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Promoting</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Loading campaigns…
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No campaigns yet.{" "}
                  <Link
                    href="/dashboard/outreach-emails/new"
                    className="underline underline-offset-2"
                  >
                    Create your first one.
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((campaign) => {
              const statusBadge = STATUS_BADGES[campaign.status] ?? {
                label: campaign.status,
                variant: "secondary" as const,
              }
              const sentPercent = campaign.recipient_count > 0
                ? Math.round((campaign.sent_count / campaign.recipient_count) * 100)
                : 0

              return (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/outreach-emails/${campaign.id}`}
                      className="font-medium hover:underline underline-offset-2"
                    >
                      {campaign.name}
                    </Link>
                    {campaign.purpose && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {campaign.purpose}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.promotion_title ? (
                      <span className="text-sm">{campaign.promotion_title}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[140px]">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{campaign.sent_count} sent</span>
                        <span>{campaign.recipient_count} total</span>
                      </div>
                      <Progress value={sentPercent} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {campaign.sender_profiles?.name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(campaign.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/outreach-emails/${campaign.id}`}>
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      {campaign.status === "draft" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &ldquo;{campaign.name}&rdquo; and all
                                its generated emails. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(campaign.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
