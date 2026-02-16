"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Mail, Pencil, RefreshCw } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CampaignListItem {
  id: string
  name: string
  status: string
  purpose: string
  sender_profile: { id: string; name: string; email: string } | null
  recipient_counts: {
    total: number
    sent: number
    generated: number
    approved: number
  }
  created_at: string
  updated_at: string
}

const STATUS_BADGES: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  generating: { label: "Generating", variant: "info" },
  ready: { label: "Ready", variant: "warning" },
  sending: { label: "Sending", variant: "info" },
  paused: { label: "Paused", variant: "outline" },
  completed: { label: "Completed", variant: "success" },
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== "all") {
        params.set("status", statusFilter)
      }
      const res = await fetch(`/api/campaigns?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage personalized email outreach campaigns.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="generating">Generating</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchCampaigns}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Campaign Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No campaigns yet</h3>
          <p className="text-muted-foreground mt-1">
            Create your first campaign to start personalized outreach.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead className="text-center">Recipients</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const statusBadge = STATUS_BADGES[campaign.status] || {
                  label: campaign.status,
                  variant: "secondary" as const,
                }
                const { total, sent } = campaign.recipient_counts
                const progress =
                  total > 0 ? Math.round((sent / total) * 100) : 0

                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/campaigns/${campaign.id}`}
                          className="font-medium hover:underline"
                        >
                          {campaign.name}
                        </Link>
                        {campaign.status === "draft" && (
                          <Link
                            href={`/dashboard/campaigns/${campaign.id}/edit`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit campaign"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {campaign.purpose}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {campaign.sender_profile?.name || "—"}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {total}
                    </TableCell>
                    <TableCell className="text-center">
                      {total > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-14 text-right">
                            {sent}/{total}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(campaign.created_at)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
