"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ExternalLink, Pencil } from "lucide-react"
import type { ExhibitorTier, Company } from "@/types/database"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select"

// Event company with nested company details
interface EventCompany {
  id: string
  event_id: string
  company_id: string
  role: string
  tier: ExhibitorTier
  booth_number: string | null
  booth_size: string | null
  display_order: number
  status: string
  is_featured: boolean
  is_debut: boolean
  notes: string | null
  payment_status: string
  created_at: string
  updated_at: string
  company?: {
    id: string
    name: string
    logo_url: string | null
    website: string | null
    description: string | null
  } | null
}

interface CompaniesListProps {
  eventId: string
  companies: EventCompany[]
}

const tierColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  platinum: "info",
  gold: "warning",
  silver: "secondary",
  bronze: "default",
  exhibitor: "default",
  contributor: "secondary",
}

const tierLabels: Record<string, string> = {
  platinum: "Platinum Sponsor",
  gold: "Gold Sponsor",
  silver: "Silver Sponsor",
  bronze: "Bronze Sponsor",
  exhibitor: "Exhibitor",
  contributor: "Contributor",
}

const tierOrder: ExhibitorTier[] = ["platinum", "gold", "silver", "bronze", "exhibitor", "contributor"]

export function CompaniesList({ eventId, companies: eventCompanies }: CompaniesListProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allCompanies, setAllCompanies] = useState<Company[]>([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)

  // Form state for adding
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [tier, setTier] = useState<ExhibitorTier>("exhibitor")
  const [boothNumber, setBoothNumber] = useState("")

  // Form state for editing
  const [editingCompany, setEditingCompany] = useState<EventCompany | null>(null)
  const [editTier, setEditTier] = useState<ExhibitorTier>("exhibitor")
  const [editBoothNumber, setEditBoothNumber] = useState("")

  // Load companies when dialog opens
  useEffect(() => {
    if (isDialogOpen && allCompanies.length === 0) {
      setIsLoadingCompanies(true)
      fetch("/api/companies")
        .then((res) => res.json())
        .then((data) => setAllCompanies(data))
        .catch(console.error)
        .finally(() => setIsLoadingCompanies(false))
    }
  }, [isDialogOpen, allCompanies.length])

  // Group companies by tier
  const companiesByTier = eventCompanies.reduce((acc, eventCompany) => {
    const t = eventCompany.tier
    if (!acc[t]) acc[t] = []
    acc[t].push(eventCompany)
    return acc
  }, {} as Record<string, EventCompany[]>)

  // Filter to only tiers that have companies
  const activeTiers = tierOrder.filter((t) => companiesByTier[t]?.length > 0)

  // Get companies not already added and convert to searchable options
  const availableCompanyOptions: SearchableSelectOption[] = useMemo(() => {
    return allCompanies
      .filter((c) => !eventCompanies.some((ec) => ec.company_id === c.id))
      .map((company) => ({
        value: company.id,
        label: company.name,
        sublabel: company.website || undefined,
      }))
  }, [allCompanies, eventCompanies])

  const handleAddCompany = async () => {
    if (!selectedCompanyId) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/events/${eventId}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: selectedCompanyId,
          tier,
          booth_number: boothNumber.trim() || null,
          display_order: eventCompanies.length,
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setSelectedCompanyId("")
        setTier("exhibitor")
        setBoothNumber("")
        router.refresh()
      }
    } catch (error) {
      console.error("Error adding company:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (eventCompanyId: string) => {
    if (!confirm("Remove this company?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/companies/${eventCompanyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error removing company:", error)
    }
  }

  const openEditDialog = (eventCompany: EventCompany) => {
    setEditingCompany(eventCompany)
    setEditTier(eventCompany.tier)
    setEditBoothNumber(eventCompany.booth_number || "")
    setIsEditDialogOpen(true)
  }

  const handleEditCompany = async () => {
    if (!editingCompany) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/events/${eventId}/companies/${editingCompany.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: editTier,
          booth_number: editBoothNumber.trim() || null,
        }),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setEditingCompany(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating company:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Companies</CardTitle>
            <CardDescription>
              Sponsors and exhibitors at this event.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Company</DialogTitle>
                <DialogDescription>
                  Add a company as a sponsor or exhibitor at this event.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  {availableCompanyOptions.length === 0 && !isLoadingCompanies ? (
                    <p className="text-sm text-muted-foreground">
                      All companies are already added, or no companies exist.
                    </p>
                  ) : (
                    <SearchableSelect
                      options={availableCompanyOptions}
                      value={selectedCompanyId}
                      onValueChange={setSelectedCompanyId}
                      placeholder="Search for a company..."
                      searchPlaceholder="Type to search companies..."
                      emptyMessage="No companies found."
                      isLoading={isLoadingCompanies}
                    />
                  )}
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tier">Tier</Label>
                    <Select value={tier} onValueChange={(v) => setTier(v as ExhibitorTier)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platinum">Platinum Sponsor</SelectItem>
                        <SelectItem value="gold">Gold Sponsor</SelectItem>
                        <SelectItem value="silver">Silver Sponsor</SelectItem>
                        <SelectItem value="bronze">Bronze Sponsor</SelectItem>
                        <SelectItem value="exhibitor">Exhibitor</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boothNumber">Booth Number</Label>
                    <Input
                      id="boothNumber"
                      value={boothNumber}
                      onChange={(e) => setBoothNumber(e.target.value)}
                      placeholder="A-12"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCompany} disabled={isSubmitting || !selectedCompanyId}>
                    {isSubmitting ? "Adding..." : "Add Company"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {eventCompanies.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No companies yet. Add your first company above.
          </p>
        ) : (
          <div className="space-y-6">
            {activeTiers.map((tierKey) => (
              <div key={tierKey}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant={tierColors[tierKey]}>{tierLabels[tierKey]}</Badge>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {companiesByTier[tierKey].map((eventCompany) => (
                    <div
                      key={eventCompany.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {eventCompany.company?.logo_url ? (
                        <img
                          src={eventCompany.company.logo_url}
                          alt={eventCompany.company.name}
                          className="w-12 h-12 object-contain rounded bg-white p-1 border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          Logo
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {eventCompany.company?.name || "Unknown Company"}
                        </p>
                        {eventCompany.booth_number && (
                          <p className="text-xs text-muted-foreground">
                            Booth {eventCompany.booth_number}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {eventCompany.company?.website && (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={eventCompany.company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(eventCompany)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(eventCompany.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
              <DialogDescription>
                Update the tier and booth number for {editingCompany?.company?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="editTier">Tier</Label>
                  <Select value={editTier} onValueChange={(v) => setEditTier(v as ExhibitorTier)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum Sponsor</SelectItem>
                      <SelectItem value="gold">Gold Sponsor</SelectItem>
                      <SelectItem value="silver">Silver Sponsor</SelectItem>
                      <SelectItem value="bronze">Bronze Sponsor</SelectItem>
                      <SelectItem value="exhibitor">Exhibitor</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editBoothNumber">Booth Number</Label>
                  <Input
                    id="editBoothNumber"
                    value={editBoothNumber}
                    onChange={(e) => setEditBoothNumber(e.target.value)}
                    placeholder="A-12"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCompany} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
