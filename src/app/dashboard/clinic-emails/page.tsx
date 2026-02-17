"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Mail, Pencil, RefreshCw, Trash2 } from "lucide-react"
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

interface ClinicCampaignListItem {
  id: string
  name: string
  status: string
  purpose: string | null
  sender_profile: { id: string; name: string; email: string } | null
  recipient_counts: {
    total: number
    sent: number
    generated: number
    approved: number
  }
  target_states: string[]
  target_cities: string[]
  target_tags: string[]
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

export default function ClinicEmailsPage() {
  const [campaigns, setCampaigns] = useState<ClinicCampaignListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== "all") {
        params.set("status", statusFilter)
      }
      const res = await fetch(`/api/clinic-campaigns?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error("Failed to fetch clinic campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all recipients and generated emails.`)) {
      return
    }
    try {
      const res = await fetch(`/api/clinic-campaigns/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id))
      } else {
        alert("Failed to delete campaign")
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete campaign")
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Clinic Emails</h1>
          <p className="text-muted-foreground">
            Invite health and wellness clinics to attend bioEDGE events.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clinic-emails/new">
            <Plus className="mr-2 h-4 w-4" />
            New Clinic Email
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
          <h3 className="text-lg font-medium">No clinic email campaigns yet</h3>
          <p className="text-muted-foreground mt-1">
            Create your first clinic email campaign to invite practitioners to your events.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/clinic-emails/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Clinic Email
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
                <TableHead className="w-[80px]"></TableHead>
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
                      <Link
                        href={`/dashboard/clinic-emails/${campaign.id}`}
                        className="font-medium hover:underline"
                      >
                        {campaign.name}
                      </Link>
                      {campaign.purpose && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {campaign.purpose}
                        </p>
                      )}
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View"
                          asChild
                        >
                          <Link href={`/dashboard/clinic-emails/${campaign.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Delete"
                          onClick={() => handleDelete(campaign.id, campaign.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
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
