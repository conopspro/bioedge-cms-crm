"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Trash2,
  GripVertical,
  DollarSign,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TicketFeature {
  id: string
  feature_text: string
  is_included: boolean
  display_order: number
  dollar_value?: number | null
  is_highlighted?: boolean
}

interface TicketTier {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  currency: string
  max_quantity: number | null
  sold_count: number
  is_sold_out: boolean
  waitlist_url: string | null
  registration_url: string
  display_order: number
  is_highlighted: boolean
  is_visible: boolean
  highlight_text: string | null
  features: TicketFeature[]
}

interface TicketTiersListProps {
  eventId: string
}

export function TicketTiersList({ eventId }: TicketTiersListProps) {
  const router = useRouter()
  const [tiers, setTiers] = useState<TicketTier[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingTier, setEditingTier] = useState<TicketTier | null>(null)
  const [saving, setSaving] = useState(false)

  // New tier form state
  const [newTier, setNewTier] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    registration_url: "",
    is_highlighted: false,
    highlight_text: "",
  })

  // Edit tier form state
  const [editTier, setEditTier] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    registration_url: "",
    is_highlighted: false,
    highlight_text: "",
  })

  useEffect(() => {
    fetchTiers()
  }, [eventId])

  const fetchTiers = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-tiers`)
      if (response.ok) {
        const data = await response.json()
        setTiers(data)
      }
    } catch (error) {
      console.error("Error fetching ticket tiers:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTier = (tierId: string) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev)
      if (next.has(tierId)) {
        next.delete(tierId)
      } else {
        next.add(tierId)
      }
      return next
    })
  }

  const createTier = async () => {
    if (!newTier.name || !newTier.price || !newTier.registration_url) return

    setSaving(true)
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-tiers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTier.name,
          description: newTier.description || null,
          price: parseFloat(newTier.price),
          original_price: newTier.original_price ? parseFloat(newTier.original_price) : null,
          registration_url: newTier.registration_url,
          is_highlighted: newTier.is_highlighted,
          highlight_text: newTier.highlight_text || null,
        }),
      })

      if (response.ok) {
        const created = await response.json()
        setTiers((prev) => [...prev, { ...created, features: [] }])
        setNewTier({
          name: "",
          description: "",
          price: "",
          original_price: "",
          registration_url: "",
          is_highlighted: false,
          highlight_text: "",
        })
        setShowAddDialog(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating tier:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateTier = async (tierId: string, updates: Partial<TicketTier>) => {
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-tiers/${tierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updated = await response.json()
        setTiers((prev) => prev.map((t) => (t.id === tierId ? { ...t, ...updated } : t)))
      }
    } catch (error) {
      console.error("Error updating tier:", error)
    }
  }

  const openEditDialog = (tier: TicketTier) => {
    setEditingTier(tier)
    setEditTier({
      name: tier.name,
      description: tier.description || "",
      price: tier.price.toString(),
      original_price: tier.original_price?.toString() || "",
      registration_url: tier.registration_url,
      is_highlighted: tier.is_highlighted,
      highlight_text: tier.highlight_text || "",
    })
    setShowEditDialog(true)
  }

  const saveEditTier = async () => {
    if (!editingTier || !editTier.name || !editTier.price || !editTier.registration_url) return

    setSaving(true)
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-tiers/${editingTier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTier.name,
          description: editTier.description || null,
          price: parseFloat(editTier.price),
          original_price: editTier.original_price ? parseFloat(editTier.original_price) : null,
          registration_url: editTier.registration_url,
          is_highlighted: editTier.is_highlighted,
          highlight_text: editTier.highlight_text || null,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setTiers((prev) =>
          prev.map((t) => (t.id === editingTier.id ? { ...t, ...updated } : t))
        )
        setShowEditDialog(false)
        setEditingTier(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating tier:", error)
    } finally {
      setSaving(false)
    }
  }

  const deleteTier = async (tierId: string) => {
    if (!confirm("Are you sure you want to delete this ticket tier?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/ticket-tiers/${tierId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTiers((prev) => prev.filter((t) => t.id !== tierId))
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting tier:", error)
    }
  }

  const addFeature = async (tierId: string, featureText: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-tiers/${tierId}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature_text: featureText, is_included: true }),
      })

      if (response.ok) {
        const feature = await response.json()
        setTiers((prev) =>
          prev.map((t) =>
            t.id === tierId ? { ...t, features: [...t.features, feature] } : t
          )
        )
      }
    } catch (error) {
      console.error("Error adding feature:", error)
    }
  }

  const deleteFeature = async (tierId: string, featureId: string) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/ticket-tiers/${tierId}/features/${featureId}`,
        { method: "DELETE" }
      )

      if (response.ok) {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === tierId
              ? { ...t, features: t.features.filter((f) => f.id !== featureId) }
              : t
          )
        )
      }
    } catch (error) {
      console.error("Error deleting feature:", error)
    }
  }

  const updateFeature = async (tierId: string, featureId: string, updates: Partial<TicketFeature>) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/ticket-tiers/${tierId}/features/${featureId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      )

      if (response.ok) {
        const updated = await response.json()
        setTiers((prev) =>
          prev.map((t) =>
            t.id === tierId
              ? { ...t, features: t.features.map((f) => (f.id === featureId ? { ...f, ...updated } : f)) }
              : t
          )
        )
      }
    } catch (error) {
      console.error("Error updating feature:", error)
    }
  }

  const reorderFeatures = async (tierId: string, fromIndex: number, toIndex: number) => {
    const tier = tiers.find((t) => t.id === tierId)
    if (!tier) return

    const sorted = [...tier.features].sort((a, b) => a.display_order - b.display_order)
    const [moved] = sorted.splice(fromIndex, 1)
    sorted.splice(toIndex, 0, moved)

    // Optimistically update local state
    const updatedFeatures = sorted.map((f, i) => ({ ...f, display_order: i }))
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, features: updatedFeatures } : t))
    )

    // Persist each changed feature
    for (const [i, feature] of updatedFeatures.entries()) {
      if (feature.display_order !== tier.features.find((f) => f.id === feature.id)?.display_order) {
        await updateFeature(tierId, feature.id, { display_order: i })
      }
    }
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ticket Tiers</CardTitle>
            <CardDescription>
              Configure ticket options and pricing for this event
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Ticket Tier</DialogTitle>
                <DialogDescription>
                  Create a new ticket tier for this event
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="tier-name">Tier Name *</Label>
                  <Input
                    id="tier-name"
                    value={newTier.name}
                    onChange={(e) => setNewTier((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., General Admission, VIP Pass"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tier-description">Description</Label>
                  <Textarea
                    id="tier-description"
                    value={newTier.description}
                    onChange={(e) => setNewTier((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what's included"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="tier-price">Price *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="tier-price"
                        type="number"
                        value={newTier.price}
                        onChange={(e) => setNewTier((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tier-original-price">Original Price</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="tier-original-price"
                        type="number"
                        value={newTier.original_price}
                        onChange={(e) => setNewTier((prev) => ({ ...prev, original_price: e.target.value }))}
                        placeholder="For showing discount"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tier-url">Registration URL *</Label>
                  <Input
                    id="tier-url"
                    value={newTier.registration_url}
                    onChange={(e) => setNewTier((prev) => ({ ...prev, registration_url: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Highlight this tier</Label>
                    <p className="text-xs text-muted-foreground">Show as "Most Popular" or similar</p>
                  </div>
                  <Switch
                    checked={newTier.is_highlighted}
                    onCheckedChange={(checked) => setNewTier((prev) => ({ ...prev, is_highlighted: checked }))}
                  />
                </div>
                {newTier.is_highlighted && (
                  <div>
                    <Label htmlFor="tier-highlight">Highlight Text</Label>
                    <Input
                      id="tier-highlight"
                      value={newTier.highlight_text}
                      onChange={(e) => setNewTier((prev) => ({ ...prev, highlight_text: e.target.value }))}
                      placeholder="e.g., Most Popular, Best Value"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createTier} disabled={saving || !newTier.name || !newTier.price || !newTier.registration_url}>
                  {saving ? "Creating..." : "Create Tier"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Tier Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Ticket Tier</DialogTitle>
                <DialogDescription>
                  Update the details for this ticket tier
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="edit-tier-name">Tier Name *</Label>
                  <Input
                    id="edit-tier-name"
                    value={editTier.name}
                    onChange={(e) => setEditTier((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., General Admission, VIP Pass"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tier-description">Description</Label>
                  <Textarea
                    id="edit-tier-description"
                    value={editTier.description}
                    onChange={(e) => setEditTier((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what's included"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-tier-price">Price *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="edit-tier-price"
                        type="number"
                        value={editTier.price}
                        onChange={(e) => setEditTier((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-tier-original-price">Original Price</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="edit-tier-original-price"
                        type="number"
                        value={editTier.original_price}
                        onChange={(e) => setEditTier((prev) => ({ ...prev, original_price: e.target.value }))}
                        placeholder="For showing discount"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-tier-url">Registration URL *</Label>
                  <Input
                    id="edit-tier-url"
                    value={editTier.registration_url}
                    onChange={(e) => setEditTier((prev) => ({ ...prev, registration_url: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Highlight this tier</Label>
                    <p className="text-xs text-muted-foreground">Show as "Most Popular" or similar</p>
                  </div>
                  <Switch
                    checked={editTier.is_highlighted}
                    onCheckedChange={(checked) => setEditTier((prev) => ({ ...prev, is_highlighted: checked }))}
                  />
                </div>
                {editTier.is_highlighted && (
                  <div>
                    <Label htmlFor="edit-tier-highlight">Highlight Text</Label>
                    <Input
                      id="edit-tier-highlight"
                      value={editTier.highlight_text}
                      onChange={(e) => setEditTier((prev) => ({ ...prev, highlight_text: e.target.value }))}
                      placeholder="e.g., Most Popular, Best Value"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEditTier} disabled={saving || !editTier.name || !editTier.price || !editTier.registration_url}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {tiers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No ticket tiers yet</p>
            <p className="text-sm">Add ticket tiers to show pricing on your landing page</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tiers.map((tier) => {
              const isExpanded = expandedTiers.has(tier.id)

              return (
                <Collapsible key={tier.id} open={isExpanded} onOpenChange={() => toggleTier(tier.id)}>
                  <div
                    className={cn(
                      "border rounded-lg transition-colors",
                      tier.is_visible ? "bg-white" : "bg-muted/50",
                      tier.is_highlighted && "ring-2 ring-gold"
                    )}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

                      <Switch
                        checked={tier.is_visible}
                        onCheckedChange={(checked) => updateTier(tier.id, { is_visible: checked })}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tier.name}</span>
                          {tier.is_highlighted && (
                            <Badge variant="default" className="bg-gold">
                              <Star className="h-3 w-3 mr-1" />
                              {tier.highlight_text || "Featured"}
                            </Badge>
                          )}
                          {tier.is_sold_out && (
                            <Badge variant="destructive">Sold Out</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-primary">
                            {formatCurrency(tier.price, tier.currency)}
                          </span>
                          {tier.original_price && (
                            <span className="text-muted-foreground line-through">
                              {formatCurrency(tier.original_price, tier.currency)}
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            • {tier.features.length} features
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={tier.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(tier)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTier(tier.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-0 border-t space-y-4">
                        {/* Features */}
                        <div className="pt-3">
                          <Label className="text-sm font-medium">Features</Label>
                          <div className="mt-2 space-y-2">
                            {[...tier.features]
                              .sort((a, b) => a.display_order - b.display_order)
                              .map((feature, index) => (
                              <FeatureRow
                                key={feature.id}
                                feature={feature}
                                index={index}
                                totalCount={tier.features.length}
                                onUpdate={(updates) => updateFeature(tier.id, feature.id, updates)}
                                onDelete={() => deleteFeature(tier.id, feature.id)}
                                onMoveUp={() => reorderFeatures(tier.id, index, index - 1)}
                                onMoveDown={() => reorderFeatures(tier.id, index, index + 1)}
                              />
                            ))}
                            <AddFeatureInput
                              onAdd={(text) => addFeature(tier.id, text)}
                            />
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureRowProps {
  feature: TicketFeature
  index: number
  totalCount: number
  onUpdate: (updates: Partial<TicketFeature>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function FeatureRow({ feature, index, totalCount, onUpdate, onDelete, onMoveUp, onMoveDown }: FeatureRowProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(feature.feature_text)
  const [editDollarValue, setEditDollarValue] = useState(feature.dollar_value?.toString() || "")

  const handleSave = () => {
    const updates: Partial<TicketFeature> = {}
    if (editText.trim() !== feature.feature_text) {
      updates.feature_text = editText.trim()
    }
    const newDollarValue = editDollarValue ? parseFloat(editDollarValue) : null
    if (newDollarValue !== (feature.dollar_value || null)) {
      updates.dollar_value = newDollarValue
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(updates)
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setEditText(feature.feature_text)
    setEditDollarValue(feature.dollar_value?.toString() || "")
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="text-sm h-8 flex-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
        />
        <div className="relative w-24">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            type="number"
            value={editDollarValue}
            onChange={(e) => setEditDollarValue(e.target.value)}
            placeholder="Value"
            className="text-sm h-8 pl-6"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
          />
        </div>
        <button onClick={handleSave} className="text-green-600 hover:text-green-700">
          <Check className="h-4 w-4" />
        </button>
        <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm group">
      <div className="flex flex-col">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className={cn("text-muted-foreground hover:text-foreground", index === 0 && "opacity-30 cursor-not-allowed")}
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === totalCount - 1}
          className={cn("text-muted-foreground hover:text-foreground", index === totalCount - 1 && "opacity-30 cursor-not-allowed")}
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      {feature.is_included ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={cn("flex-1", !feature.is_included && "text-muted-foreground")}>
        {feature.feature_text}
      </span>
      {feature.dollar_value && (
        <Badge variant="secondary" className="text-xs">
          ${feature.dollar_value} value
        </Badge>
      )}
      <button
        onClick={() => setEditing(true)}
        className="ml-auto text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-3 w-3" />
      </button>
      <button
        onClick={onDelete}
        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

function AddFeatureInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("")

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim())
      setText("")
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a feature..."
        className="text-sm h-8"
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <Button size="sm" variant="outline" className="h-8" onClick={handleAdd}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
