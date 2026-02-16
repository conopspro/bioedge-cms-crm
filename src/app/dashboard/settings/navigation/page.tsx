"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Trash2,
  Pencil,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Check,
  X,
  GripVertical,
} from "lucide-react"

interface NavItem {
  id: string
  location: string
  label: string
  href: string
  is_external: boolean
  display_order: number
  is_visible: boolean
  event_id: string | null
}

interface EventOption {
  id: string
  name: string
  slug: string
}

type NavLocation = "main_header" | "main_footer" | "event_header" | "event_footer"

export default function NavigationSettingsPage() {
  const [items, setItems] = useState<NavItem[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [activeTab, setActiveTab] = useState<NavLocation>("main_header")
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editHref, setEditHref] = useState("")
  const [addingNew, setAddingNew] = useState(false)
  const [newLabel, setNewLabel] = useState("")
  const [newHref, setNewHref] = useState("")
  const [newIsExternal, setNewIsExternal] = useState(false)

  const isEventTab = activeTab === "event_header" || activeTab === "event_footer"

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ location: activeTab })
    if (isEventTab && selectedEventId) {
      params.set("event_id", selectedEventId)
    }
    // For main site tabs, don't pass event_id (API defaults to null)
    const res = await fetch(`/api/navigation?${params}`)
    if (res.ok) {
      const data = await res.json()
      setItems(data)
    }
    setLoading(false)
  }, [activeTab, selectedEventId, isEventTab])

  // Fetch events for the event tab dropdown
  useEffect(() => {
    async function loadEvents() {
      const res = await fetch("/api/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
        if (data.length > 0 && !selectedEventId) {
          setSelectedEventId(data[0].id)
        }
      }
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (isEventTab && !selectedEventId) return
    fetchItems()
  }, [activeTab, selectedEventId, fetchItems, isEventTab])

  const updateItem = async (id: string, updates: Partial<NavItem>) => {
    const res = await fetch(`/api/navigation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    }
  }

  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/navigation/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const addItem = async () => {
    if (!newLabel.trim() || !newHref.trim()) return
    const maxOrder = items.reduce((max, item) => Math.max(max, item.display_order), 0)
    const res = await fetch("/api/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: activeTab,
        label: newLabel.trim(),
        href: newHref.trim(),
        is_external: newIsExternal,
        display_order: maxOrder + 1,
        event_id: isEventTab ? selectedEventId : null,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setItems((prev) => [...prev, created])
      setNewLabel("")
      setNewHref("")
      setNewIsExternal(false)
      setAddingNew(false)
    }
  }

  const reorder = async (id: string, direction: "up" | "down") => {
    const sorted = [...items].sort((a, b) => a.display_order - b.display_order)
    const idx = sorted.findIndex((item) => item.id === id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const orderA = sorted[idx].display_order
    const orderB = sorted[swapIdx].display_order

    // Optimistic update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === sorted[idx].id) return { ...item, display_order: orderB }
        if (item.id === sorted[swapIdx].id) return { ...item, display_order: orderA }
        return item
      })
    )

    await Promise.all([
      updateItem(sorted[idx].id, { display_order: orderB }),
      updateItem(sorted[swapIdx].id, { display_order: orderA }),
    ])
  }

  const startEdit = (item: NavItem) => {
    setEditingId(item.id)
    setEditLabel(item.label)
    setEditHref(item.href)
  }

  const saveEdit = async () => {
    if (!editingId || !editLabel.trim() || !editHref.trim()) return
    await updateItem(editingId, { label: editLabel.trim(), href: editHref.trim() })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order)

  const tabLabels: Record<NavLocation, string> = {
    main_header: "Main Header",
    main_footer: "Main Footer",
    event_header: "Event Header",
    event_footer: "Event Footer",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Navigation</h1>
        <p className="text-muted-foreground">
          Manage navigation links for the site header, footer, and event pages.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as NavLocation); setAddingNew(false); setEditingId(null) }}>
        <TabsList>
          {(Object.keys(tabLabels) as NavLocation[]).map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {tabLabels[loc]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(tabLabels) as NavLocation[]).map((loc) => (
          <TabsContent key={loc} value={loc} className="space-y-4">
            {/* Event selector for event tabs */}
            {(loc === "event_header" || loc === "event_footer") && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Event:</label>
                <select
                  className="border rounded-md px-3 py-1.5 text-sm bg-background"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {loading ? (
              <p className="text-muted-foreground text-sm py-4">Loading...</p>
            ) : sorted.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                No navigation items yet. Add one below.
              </p>
            ) : (
              <div className="space-y-1">
                {sorted.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 rounded-lg border px-3 py-2 bg-background hover:bg-muted/50 transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />

                    {/* Reorder arrows */}
                    <div className="flex flex-col -space-y-1">
                      <button
                        onClick={() => reorder(item.id, "up")}
                        disabled={idx === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => reorder(item.id, "down")}
                        disabled={idx === sorted.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {editingId === item.id ? (
                      <>
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="h-8 w-32"
                          placeholder="Label"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit()
                            if (e.key === "Escape") cancelEdit()
                          }}
                          autoFocus
                        />
                        <Input
                          value={editHref}
                          onChange={(e) => setEditHref(e.target.value)}
                          className="h-8 flex-1"
                          placeholder="URL or path"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit()
                            if (e.key === "Escape") cancelEdit()
                          }}
                        />
                        <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-sm min-w-[80px]">{item.label}</span>
                        <span className="text-sm text-muted-foreground truncate flex-1">{item.href}</span>

                        {item.is_external && (
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        )}

                        {/* External toggle */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="text-xs text-muted-foreground">External</label>
                          <Switch
                            checked={item.is_external}
                            onCheckedChange={(checked) => updateItem(item.id, { is_external: checked })}
                            className="scale-75"
                          />
                        </div>

                        {/* Visibility toggle */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="text-xs text-muted-foreground">Visible</label>
                          <Switch
                            checked={item.is_visible}
                            onCheckedChange={(checked) => updateItem(item.id, { is_visible: checked })}
                            className="scale-75"
                          />
                        </div>

                        <button
                          onClick={() => startEdit(item)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1 transition-opacity"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add new item */}
            {addingNew ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="h-8 w-32"
                  placeholder="Label"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem()
                    if (e.key === "Escape") setAddingNew(false)
                  }}
                  autoFocus
                />
                <Input
                  value={newHref}
                  onChange={(e) => setNewHref(e.target.value)}
                  className="h-8 flex-1"
                  placeholder="URL or path (e.g., /articles or https://...)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem()
                    if (e.key === "Escape") setAddingNew(false)
                  }}
                />
                <div className="flex items-center gap-1">
                  <label className="text-xs text-muted-foreground">External</label>
                  <Switch
                    checked={newIsExternal}
                    onCheckedChange={setNewIsExternal}
                    className="scale-75"
                  />
                </div>
                <Button size="sm" onClick={addItem}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAddingNew(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddingNew(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
