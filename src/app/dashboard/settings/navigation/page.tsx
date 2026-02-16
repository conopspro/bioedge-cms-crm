"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
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
  FolderPlus,
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
  parent_id: string | null
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
  const [editParentId, setEditParentId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [addingGroup, setAddingGroup] = useState(false)
  const [newLabel, setNewLabel] = useState("")
  const [newHref, setNewHref] = useState("")
  const [newIsExternal, setNewIsExternal] = useState(false)
  const [newParentId, setNewParentId] = useState<string | null>(null)

  const isEventTab = activeTab === "event_header" || activeTab === "event_footer"

  // Top-level items (can be parents for dropdown groups)
  const topLevelItems = useMemo(
    () =>
      items
        .filter((i) => i.parent_id === null)
        .sort((a, b) => a.display_order - b.display_order),
    [items]
  )

  // Group items: top-level with their children
  const groupedItems = useMemo(() => {
    const childrenMap = new Map<string, NavItem[]>()
    for (const item of items) {
      if (item.parent_id) {
        const existing = childrenMap.get(item.parent_id) || []
        existing.push(item)
        childrenMap.set(item.parent_id, existing)
      }
    }
    for (const [key, children] of childrenMap) {
      childrenMap.set(
        key,
        children.sort((a, b) => a.display_order - b.display_order)
      )
    }
    return topLevelItems.map((parent) => ({
      ...parent,
      children: childrenMap.get(parent.id) || [],
    }))
  }, [items, topLevelItems])

  // Parent options: items that are dropdown groups (href="#")
  const parentOptions = useMemo(
    () => topLevelItems.filter((i) => i.href === "#"),
    [topLevelItems]
  )

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ location: activeTab })
    if (isEventTab && selectedEventId) {
      params.set("event_id", selectedEventId)
    }
    const res = await fetch(`/api/navigation?${params}`)
    if (res.ok) {
      const data = await res.json()
      setItems(data)
    }
    setLoading(false)
  }, [activeTab, selectedEventId, isEventTab])

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
      setItems((prev) => prev.filter((item) => item.id !== id && item.parent_id !== id))
    }
  }

  const addItem = async () => {
    if (!newLabel.trim() || !newHref.trim()) return
    const siblings = items.filter((i) => i.parent_id === newParentId)
    const maxOrder = siblings.reduce((max, item) => Math.max(max, item.display_order), 0)
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
        parent_id: newParentId,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setItems((prev) => [...prev, created])
      resetAddForm()
    }
  }

  const addGroup = async () => {
    if (!newLabel.trim()) return
    const maxOrder = topLevelItems.reduce((max, item) => Math.max(max, item.display_order), 0)
    const res = await fetch("/api/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: activeTab,
        label: newLabel.trim(),
        href: "#",
        is_external: false,
        display_order: maxOrder + 1,
        event_id: isEventTab ? selectedEventId : null,
        parent_id: null,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setItems((prev) => [...prev, created])
      resetAddForm()
    }
  }

  const resetAddForm = () => {
    setNewLabel("")
    setNewHref("")
    setNewIsExternal(false)
    setNewParentId(null)
    setAddingNew(false)
    setAddingGroup(false)
  }

  const reorder = async (id: string, direction: "up" | "down") => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const siblings = items
      .filter((i) => i.parent_id === item.parent_id)
      .sort((a, b) => a.display_order - b.display_order)
    const idx = siblings.findIndex((i) => i.id === id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= siblings.length) return

    const orderA = siblings[idx].display_order
    const orderB = siblings[swapIdx].display_order

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === siblings[idx].id) return { ...i, display_order: orderB }
        if (i.id === siblings[swapIdx].id) return { ...i, display_order: orderA }
        return i
      })
    )

    await Promise.all([
      updateItem(siblings[idx].id, { display_order: orderB }),
      updateItem(siblings[swapIdx].id, { display_order: orderA }),
    ])
  }

  const startEdit = (item: NavItem) => {
    setEditingId(item.id)
    setEditLabel(item.label)
    setEditHref(item.href)
    setEditParentId(item.parent_id)
  }

  const saveEdit = async () => {
    if (!editingId || !editLabel.trim()) return
    const editItem = items.find((i) => i.id === editingId)
    const isGroup = editItem?.href === "#"
    const updates: Partial<NavItem> = {
      label: editLabel.trim(),
      parent_id: editParentId,
    }
    if (!isGroup) {
      updates.href = editHref.trim()
    }
    await updateItem(editingId, updates)
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

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
          Create groups for dropdown menus.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as NavLocation); resetAddForm(); setEditingId(null) }}>
        <TabsList>
          {(Object.keys(tabLabels) as NavLocation[]).map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {tabLabels[loc]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(tabLabels) as NavLocation[]).map((loc) => (
          <TabsContent key={loc} value={loc} className="space-y-4">
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
            ) : groupedItems.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                No navigation items yet. Add a link or group below.
              </p>
            ) : (
              <div className="space-y-2">
                {groupedItems.map((item, idx) => (
                  <div key={item.id}>
                    <NavItemRow
                      item={item}
                      isFirst={idx === 0}
                      isLast={idx === groupedItems.length - 1}
                      isGroup={item.href === "#"}
                      editingId={editingId}
                      editLabel={editLabel}
                      editHref={editHref}
                      editParentId={editParentId}
                      parentOptions={[]}
                      onEditLabel={setEditLabel}
                      onEditHref={setEditHref}
                      onEditParentId={setEditParentId}
                      onStartEdit={startEdit}
                      onSaveEdit={saveEdit}
                      onCancelEdit={cancelEdit}
                      onReorder={reorder}
                      onDelete={deleteItem}
                      onUpdateItem={updateItem}
                    />

                    {item.children.length > 0 && (
                      <div className="ml-8 mt-1 space-y-1 border-l-2 border-muted pl-3">
                        {item.children.map((child, childIdx) => (
                          <NavItemRow
                            key={child.id}
                            item={child}
                            isFirst={childIdx === 0}
                            isLast={childIdx === item.children.length - 1}
                            isGroup={false}
                            editingId={editingId}
                            editLabel={editLabel}
                            editHref={editHref}
                            editParentId={editParentId}
                            parentOptions={parentOptions}
                            onEditLabel={setEditLabel}
                            onEditHref={setEditHref}
                            onEditParentId={setEditParentId}
                            onStartEdit={startEdit}
                            onSaveEdit={saveEdit}
                            onCancelEdit={cancelEdit}
                            onReorder={reorder}
                            onDelete={deleteItem}
                            onUpdateItem={updateItem}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add new item / group */}
            {addingNew ? (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="h-8 w-32"
                  placeholder="Label"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem()
                    if (e.key === "Escape") resetAddForm()
                  }}
                  autoFocus
                />
                <Input
                  value={newHref}
                  onChange={(e) => setNewHref(e.target.value)}
                  className="h-8 w-48"
                  placeholder="URL or path"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem()
                    if (e.key === "Escape") resetAddForm()
                  }}
                />
                {parentOptions.length > 0 && (
                  <select
                    value={newParentId || ""}
                    onChange={(e) => setNewParentId(e.target.value || null)}
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                  >
                    <option value="">Top-level</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        ↳ {p.label}
                      </option>
                    ))}
                  </select>
                )}
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
                <Button size="sm" variant="ghost" onClick={resetAddForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : addingGroup ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-gold/50 px-3 py-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="h-8 w-48"
                  placeholder="Group name (e.g., Longevity News)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addGroup()
                    if (e.key === "Escape") resetAddForm()
                  }}
                  autoFocus
                />
                <span className="text-xs text-muted-foreground">
                  Creates a dropdown menu header
                </span>
                <Button size="sm" onClick={addGroup}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={resetAddForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingNew(true)}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingGroup(true)}
                  className="gap-1 border-gold/50 text-gold hover:text-gold hover:bg-gold/5"
                >
                  <FolderPlus className="h-4 w-4" />
                  Add Group
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function NavItemRow({
  item,
  isFirst,
  isLast,
  isGroup,
  editingId,
  editLabel,
  editHref,
  editParentId,
  parentOptions,
  onEditLabel,
  onEditHref,
  onEditParentId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onReorder,
  onDelete,
  onUpdateItem,
}: {
  item: NavItem
  isFirst: boolean
  isLast: boolean
  isGroup: boolean
  editingId: string | null
  editLabel: string
  editHref: string
  editParentId: string | null
  parentOptions: NavItem[]
  onEditLabel: (v: string) => void
  onEditHref: (v: string) => void
  onEditParentId: (v: string | null) => void
  onStartEdit: (item: NavItem) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onReorder: (id: string, direction: "up" | "down") => void
  onDelete: (id: string) => void
  onUpdateItem: (id: string, updates: Partial<NavItem>) => void
}) {
  const isEditing = editingId === item.id

  return (
    <div
      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
        isGroup
          ? "bg-muted/30 border-gold/20 hover:bg-muted/50"
          : "bg-background hover:bg-muted/50"
      }`}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />

      <div className="flex flex-col -space-y-1">
        <button
          onClick={() => onReorder(item.id, "up")}
          disabled={isFirst}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onReorder(item.id, "down")}
          disabled={isLast}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {isEditing ? (
        <>
          <Input
            value={editLabel}
            onChange={(e) => onEditLabel(e.target.value)}
            className="h-8 w-32"
            placeholder="Label"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEdit()
              if (e.key === "Escape") onCancelEdit()
            }}
            autoFocus
          />
          {!isGroup && (
            <Input
              value={editHref}
              onChange={(e) => onEditHref(e.target.value)}
              className="h-8 flex-1"
              placeholder="URL or path"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEdit()
                if (e.key === "Escape") onCancelEdit()
              }}
            />
          )}
          {parentOptions.length > 0 && !isGroup && (
            <select
              value={editParentId || ""}
              onChange={(e) => onEditParentId(e.target.value || null)}
              className="h-8 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Top-level</option>
              {parentOptions
                .filter((p) => p.id !== item.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    ↳ {p.label}
                  </option>
                ))}
            </select>
          )}
          <button onClick={onSaveEdit} className="text-green-600 hover:text-green-700 p-1">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={onCancelEdit} className="text-muted-foreground hover:text-foreground p-1">
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          {isGroup && (
            <span className="text-xs font-medium text-gold bg-gold/10 px-1.5 py-0.5 rounded">
              Group
            </span>
          )}
          <span className={`font-medium text-sm min-w-[80px] ${isGroup ? "text-gold" : ""}`}>
            {item.label}
          </span>
          {!isGroup && (
            <span className="text-sm text-muted-foreground truncate flex-1">{item.href}</span>
          )}
          {isGroup && <span className="flex-1" />}

          {item.is_external && (
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          )}

          {!isGroup && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="text-xs text-muted-foreground">External</label>
              <Switch
                checked={item.is_external}
                onCheckedChange={(checked) => onUpdateItem(item.id, { is_external: checked })}
                className="scale-75"
              />
            </div>
          )}

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="text-xs text-muted-foreground">Visible</label>
            <Switch
              checked={item.is_visible}
              onCheckedChange={(checked) => onUpdateItem(item.id, { is_visible: checked })}
              className="scale-75"
            />
          </div>

          <button
            onClick={() => onStartEdit(item)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1 transition-opacity"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1 transition-opacity"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  )
}
