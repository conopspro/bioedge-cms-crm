"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Linkedin, Building2, Presentation } from "lucide-react"
import type { ContactWithCompany, ExhibitorTier, Presentation as PresentationType } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select"

// Presentation with contact info for display
interface PresentationWithSpeaker extends PresentationType {
  contact?: {
    id: string
    first_name: string
    last_name: string
  } | null
}

// Event contact (leader) with nested contact details
interface EventContact {
  id: string
  event_id: string
  contact_id: string
  role: string
  display_order: number
  status: string
  title_override: string | null
  bio_override: string | null
  headshot_url: string | null
  is_featured: boolean
  is_debut: boolean
  notes: string | null
  speaker_fee: number | null
  payment_status: string
  linkedin_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  website_url: string | null
  created_at: string
  updated_at: string
  contact?: {
    id: string
    first_name: string
    last_name: string
    title: string | null
    avatar_url: string | null
    linkedin_url: string | null
    company_id: string | null
    company?: {
      id: string
      name: string
    } | null
  } | null
}

interface LeadersListProps {
  eventId: string
  leaders: EventContact[]
  existingCompanyIds: string[]
  existingPresentationIds: string[]
}

const sessionTypeLabels: Record<string, string> = {
  keynote: "Keynote",
  panel: "Panel",
  workshop: "Workshop",
  fireside_chat: "Fireside Chat",
  presentation: "Presentation",
  demo: "Demo",
}

const sessionTypeColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  keynote: "success",
  panel: "info",
  workshop: "warning",
  fireside_chat: "success",
  presentation: "default",
  demo: "info",
}

export function LeadersList({ eventId, leaders, existingCompanyIds, existingPresentationIds }: LeadersListProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contacts, setContacts] = useState<ContactWithCompany[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  // Form state
  const [selectedContactId, setSelectedContactId] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [companyTier, setCompanyTier] = useState<ExhibitorTier>("exhibitor")

  // Presentations state
  const [leaderPresentations, setLeaderPresentations] = useState<PresentationWithSpeaker[]>([])
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(false)
  const [selectedPresentationIds, setSelectedPresentationIds] = useState<string[]>([])

  // Get selected contact's company info
  const selectedContact = useMemo(() => {
    return contacts.find(c => c.id === selectedContactId)
  }, [contacts, selectedContactId])

  const selectedContactHasCompany = selectedContact?.company_id != null
  const companyAlreadyAdded = selectedContact?.company_id
    ? existingCompanyIds.includes(selectedContact.company_id)
    : false

  // Load published contacts when dialog opens
  useEffect(() => {
    if (isDialogOpen && contacts.length === 0) {
      setIsLoadingContacts(true)
      // Only fetch published/visible contacts
      fetch("/api/contacts?show_on_articles=true")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setContacts(data)
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingContacts(false))
    }
  }, [isDialogOpen, contacts.length])

  // Load presentations for the selected contact
  useEffect(() => {
    if (selectedContactId) {
      setIsLoadingPresentations(true)
      setSelectedPresentationIds([])
      // Fetch presentations where this contact is the primary speaker or a panelist
      fetch(`/api/presentations?contact_id=${selectedContactId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLeaderPresentations(data)
          } else {
            setLeaderPresentations([])
          }
        })
        .catch((err) => {
          console.error("Error fetching presentations:", err)
          setLeaderPresentations([])
        })
        .finally(() => setIsLoadingPresentations(false))
    } else {
      setLeaderPresentations([])
      setSelectedPresentationIds([])
    }
  }, [selectedContactId])

  // Filter presentations that aren't already linked to this event
  const availablePresentations = useMemo(() => {
    return leaderPresentations.filter(p => !existingPresentationIds.includes(p.id))
  }, [leaderPresentations, existingPresentationIds])

  const togglePresentationSelection = (presentationId: string) => {
    setSelectedPresentationIds(prev =>
      prev.includes(presentationId)
        ? prev.filter(id => id !== presentationId)
        : [...prev, presentationId]
    )
  }

  // Group leaders by featured status
  const featured = leaders.filter((l) => l.is_featured)
  const others = leaders.filter((l) => !l.is_featured)

  // Get contacts not already added and convert to searchable options
  const availableContactOptions: SearchableSelectOption[] = useMemo(() => {
    return contacts
      .filter((c) => !leaders.some((l) => l.contact_id === c.id))
      .map((contact) => ({
        value: contact.id,
        label: `${contact.first_name} ${contact.last_name}`.trim() || contact.email || "Unknown",
        sublabel: contact.title || undefined,
      }))
  }, [contacts, leaders])

  const handleAddLeader = async () => {
    if (!selectedContactId) return

    setIsSubmitting(true)
    try {
      // Add the leader (contact) to the event
      const leaderResponse = await fetch(`/api/events/${eventId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: selectedContactId,
          is_featured: isFeatured,
          display_order: leaders.length,
        }),
      })

      if (!leaderResponse.ok) {
        const errorData = await leaderResponse.json()
        console.error("Leader API error:", errorData)
        throw new Error(errorData.error || "Failed to add leader")
      }

      // If contact has a company and it's not already added, add it
      if (selectedContactHasCompany && !companyAlreadyAdded && selectedContact?.company_id) {
        await fetch(`/api/events/${eventId}/companies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: selectedContact.company_id,
            tier: companyTier,
          }),
        })
      }

      // Link selected presentations to the event
      if (selectedPresentationIds.length > 0) {
        await Promise.all(
          selectedPresentationIds.map((presentationId, index) =>
            fetch(`/api/events/${eventId}/presentations`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                presentation_id: presentationId,
                display_order: index,
              }),
            })
          )
        )
      }

      setIsDialogOpen(false)
      setSelectedContactId("")
      setIsFeatured(false)
      setCompanyTier("exhibitor")
      setSelectedPresentationIds([])
      setLeaderPresentations([])
      router.refresh()
    } catch (error) {
      console.error("Error adding leader:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (eventContactId: string) => {
    if (!confirm("Remove this leader?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/contacts/${eventContactId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error removing leader:", error)
    }
  }

  const renderLeaderCard = (leader: EventContact) => (
    <div
      key={leader.id}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
    >
      {leader.headshot_url || leader.contact?.avatar_url ? (
        <img
          src={leader.headshot_url || leader.contact?.avatar_url || ""}
          alt={leader.contact ? `${leader.contact.first_name} ${leader.contact.last_name}` : "Leader"}
          className="w-12 h-12 object-cover rounded-full"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
          {leader.contact?.first_name?.charAt(0) || "?"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">
            {leader.contact ? (`${leader.contact.first_name} ${leader.contact.last_name}`.trim() || "Unknown Contact") : "Unknown Contact"}
          </p>
          {leader.is_featured && (
            <Badge variant="success" className="text-xs">Featured</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {leader.contact?.title}
          {leader.contact?.company?.name && ` at ${leader.contact.company.name}`}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {leader.contact?.linkedin_url && (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={leader.contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(leader.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leaders</CardTitle>
            <CardDescription>
              Keynotes, panelists, and workshop leaders.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Leader
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Add Leader</DialogTitle>
                <DialogDescription>
                  Add a published leader to this event.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4 overflow-y-auto overflow-x-hidden flex-1">
                <div className="space-y-2">
                  <Label>Leader *</Label>
                  {availableContactOptions.length === 0 && !isLoadingContacts ? (
                    <p className="text-sm text-muted-foreground">
                      All published leaders are already added, or no published leaders exist.
                    </p>
                  ) : (
                    <SearchableSelect
                      options={availableContactOptions}
                      value={selectedContactId}
                      onValueChange={setSelectedContactId}
                      placeholder="Search for a leader..."
                      searchPlaceholder="Type to search leaders..."
                      emptyMessage="No leaders found."
                      isLoading={isLoadingContacts}
                    />
                  )}
                </div>

                {/* Show company info and tier selector if contact has a company */}
                {selectedContactId && selectedContactHasCompany && (
                  <div className="p-3 rounded-lg border bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {contacts.find(c => c.id === selectedContactId)?.company?.name || "Company"}
                      </span>
                      {companyAlreadyAdded ? (
                        <Badge variant="secondary" className="text-xs">Already Added</Badge>
                      ) : (
                        <Badge variant="success" className="text-xs">Will be added</Badge>
                      )}
                    </div>
                    {!companyAlreadyAdded && (
                      <div className="space-y-2">
                        <Label htmlFor="companyTier">Company Sponsorship Level</Label>
                        <Select value={companyTier} onValueChange={(v) => setCompanyTier(v as ExhibitorTier)}>
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
                        <p className="text-xs text-muted-foreground">
                          Booth number can be assigned later in the Companies tab.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show presentations for the selected leader */}
                {selectedContactId && (
                  <div className="p-3 rounded-lg border bg-muted/50 space-y-3 overflow-hidden">
                    <div className="flex items-center gap-2 text-sm">
                      <Presentation className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">Presentations</span>
                      {selectedPresentationIds.length > 0 && (
                        <Badge variant="success" className="text-xs shrink-0">
                          {selectedPresentationIds.length} selected
                        </Badge>
                      )}
                    </div>

                    {isLoadingPresentations ? (
                      <p className="text-sm text-muted-foreground">Loading presentations...</p>
                    ) : availablePresentations.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {leaderPresentations.length > 0
                          ? "All presentations are already linked to this event."
                          : "No presentations found for this leader."}
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availablePresentations.map((presentation) => (
                          <div
                            key={presentation.id}
                            className={`flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                              selectedPresentationIds.includes(presentation.id)
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => togglePresentationSelection(presentation.id)}
                          >
                            <Checkbox
                              checked={selectedPresentationIds.includes(presentation.id)}
                              onCheckedChange={() => togglePresentationSelection(presentation.id)}
                              className="mt-0.5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="mb-0.5">
                                <Badge
                                  variant={sessionTypeColors[presentation.session_type] || "default"}
                                  className="text-xs"
                                >
                                  {sessionTypeLabels[presentation.session_type] || presentation.session_type}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium line-clamp-1">
                                {presentation.title}
                              </p>
                              {presentation.short_description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {presentation.short_description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Select presentations to add to this event. You can add more later in the Presentations tab.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isFeatured">Featured Leader (keynote, headliner)</Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLeader} disabled={isSubmitting || !selectedContactId}>
                    {isSubmitting ? "Adding..." : "Add Leader"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {leaders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No leaders yet. Add your first leader above.
          </p>
        ) : (
          <div className="space-y-6">
            {featured.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Featured Leaders</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {featured.map(renderLeaderCard)}
                </div>
              </div>
            )}
            {others.length > 0 && (
              <div>
                {featured.length > 0 && <h3 className="font-semibold mb-3">Leaders</h3>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {others.map(renderLeaderCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
