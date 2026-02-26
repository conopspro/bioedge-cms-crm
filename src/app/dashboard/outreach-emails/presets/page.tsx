"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Cpu,
  GraduationCap,
  CalendarDays,
  Youtube,
  Pen,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import type { PromotionPreset, PromotionPresetType } from "@/types/outreach"

// Map lucide icon name → component
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Cpu,
  GraduationCap,
  CalendarDays,
  Youtube,
  Pen,
}

function PresetIcon({ icon }: { icon: string | null }) {
  const Icon = icon ? (ICON_MAP[icon] ?? Pen) : Pen
  return <Icon className="h-5 w-5" />
}

const TYPE_LABELS: Record<PromotionPresetType, string> = {
  book: "Book",
  tool: "Tool",
  coaching: "Coaching",
  summit: "Summit",
  youtube: "YouTube",
  custom: "Custom",
}

const TYPE_BADGE_VARIANTS: Record<PromotionPresetType, "default" | "secondary" | "info" | "success" | "warning"> = {
  book: "info",
  tool: "default",
  coaching: "success",
  summit: "warning",
  youtube: "secondary",
  custom: "secondary",
}

const ICON_OPTIONS = [
  { value: "BookOpen", label: "Book" },
  { value: "Cpu", label: "CPU / Tool" },
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "CalendarDays", label: "Calendar" },
  { value: "Youtube", label: "YouTube" },
  { value: "Pen", label: "Pen / Custom" },
]

const EMPTY_FORM = {
  name: "",
  type: "custom" as PromotionPresetType,
  icon: "Pen",
  title: "",
  url: "",
  description: "",
  youtube_video_id: "",
  youtube_thumbnail_url: "",
  default_purpose: "",
  default_cta: "",
  sort_order: 0,
}

export default function PresetsPage() {
  const [presets, setPresets] = useState<PromotionPreset[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<PromotionPreset | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("")
  const [fetchingYoutube, setFetchingYoutube] = useState(false)

  const fetchPresets = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/promotion-presets")
      if (res.ok) {
        const data = await res.json()
        setPresets(data.presets ?? [])
      }
    } catch (err) {
      console.error("Failed to fetch presets:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPresets()
  }, [])

  const openCreate = () => {
    setEditingPreset(null)
    setForm(EMPTY_FORM)
    setYoutubeUrlInput("")
    setDialogOpen(true)
  }

  const openEdit = (preset: PromotionPreset) => {
    setEditingPreset(preset)
    setForm({
      name: preset.name,
      type: preset.type,
      icon: preset.icon ?? "Pen",
      title: preset.title ?? "",
      url: preset.url ?? "",
      description: preset.description ?? "",
      youtube_video_id: preset.youtube_video_id ?? "",
      youtube_thumbnail_url: preset.youtube_thumbnail_url ?? "",
      default_purpose: preset.default_purpose ?? "",
      default_cta: preset.default_cta ?? "",
      sort_order: preset.sort_order,
    })
    setYoutubeUrlInput(
      preset.youtube_video_id
        ? `https://www.youtube.com/watch?v=${preset.youtube_video_id}`
        : ""
    )
    setDialogOpen(true)
  }

  const handleFetchYoutube = async () => {
    if (!youtubeUrlInput) return
    setFetchingYoutube(true)
    try {
      // Extract video ID from URL
      const match = youtubeUrlInput.match(
        /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/
      )
      const videoId = match?.[1]
      if (!videoId) {
        alert("Could not extract a YouTube video ID from that URL.")
        return
      }

      const res = await fetch(`/api/youtube-search?videoId=${videoId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.video) {
          setForm((prev) => ({
            ...prev,
            title: data.video.title || prev.title,
            youtube_video_id: videoId,
            youtube_thumbnail_url: data.video.thumbnail || "",
            description: data.video.description
              ? data.video.description.slice(0, 300)
              : prev.description,
          }))
        }
      }
    } catch (err) {
      console.error("YouTube fetch failed:", err)
    } finally {
      setFetchingYoutube(false)
    }
  }

  const handleSave = async () => {
    if (!form.name || !form.type) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        youtube_video_id: form.type === "youtube" ? form.youtube_video_id || null : null,
        youtube_thumbnail_url:
          form.type === "youtube" ? form.youtube_thumbnail_url || null : null,
      }

      let res: Response
      if (editingPreset) {
        res = await fetch(`/api/promotion-presets/${editingPreset.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch("/api/promotion-presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        await fetchPresets()
        setDialogOpen(false)
      }
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (preset: PromotionPreset) => {
    try {
      await fetch(`/api/promotion-presets/${preset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !preset.is_active }),
      })
      await fetchPresets()
    } catch (err) {
      console.error("Toggle failed:", err)
    }
  }

  const handleDelete = async (preset: PromotionPreset) => {
    try {
      const res = await fetch(`/api/promotion-presets/${preset.id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchPresets()
      }
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/outreach-emails">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Promotion Presets</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pre-configured cards for what you&rsquo;re promoting — auto-fill campaigns in one click
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={fetchPresets} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                New Preset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPreset ? "Edit Preset" : "New Promotion Preset"}
                </DialogTitle>
                <DialogDescription>
                  Configure a reusable promotion card. Selecting it in a campaign auto-fills
                  the Purpose and Call to Action fields.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select
                      value={form.type}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, type: val as PromotionPresetType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TYPE_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Icon</Label>
                    <Select
                      value={form.icon}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, icon: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label>Preset Name (for internal tracking)</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Biological EDGE Book"
                  />
                </div>

                {/* YouTube URL fetch */}
                {form.type === "youtube" && (
                  <div className="space-y-1.5">
                    <Label>YouTube URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={youtubeUrlInput}
                        onChange={(e) => setYoutubeUrlInput(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFetchYoutube}
                        disabled={fetchingYoutube || !youtubeUrlInput}
                      >
                        {fetchingYoutube ? "Fetching…" : "Fetch"}
                      </Button>
                    </div>
                    {form.youtube_thumbnail_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.youtube_thumbnail_url}
                        alt="YouTube thumbnail"
                        className="rounded-md w-full max-w-xs mt-1"
                      />
                    )}
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                  <Label>Full Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Biological EDGE: A Practical Guide to Longevity"
                  />
                </div>

                {/* URL */}
                <div className="space-y-1.5">
                  <Label>Link URL</Label>
                  <Input
                    value={form.url}
                    onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label>Description (1–3 sentences for AI context)</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="What is this? Why would someone care?"
                  />
                </div>

                {/* Default purpose */}
                <div className="space-y-1.5">
                  <Label>Default Campaign Purpose</Label>
                  <Textarea
                    value={form.default_purpose}
                    onChange={(e) => setForm((prev) => ({ ...prev, default_purpose: e.target.value }))}
                    rows={2}
                    placeholder="Auto-fills the Purpose field when this preset is selected"
                  />
                </div>

                {/* Default CTA */}
                <div className="space-y-1.5">
                  <Label>Default Call to Action</Label>
                  <Input
                    value={form.default_cta}
                    onChange={(e) => setForm((prev) => ({ ...prev, default_cta: e.target.value }))}
                    placeholder="e.g. Check it out on Amazon"
                  />
                </div>

                {/* Sort order */}
                <div className="space-y-1.5">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-24"
                  />
                </div>

                <Button onClick={handleSave} disabled={saving || !form.name} className="w-full">
                  {saving ? "Saving…" : editingPreset ? "Save Changes" : "Create Preset"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Preset cards grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading presets…</div>
      ) : presets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No presets yet. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className={`rounded-lg border p-4 space-y-3 ${!preset.is_active ? "opacity-50" : ""}`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-muted p-1.5">
                    <PresetIcon icon={preset.icon} />
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-tight">{preset.name}</p>
                    <Badge
                      variant={TYPE_BADGE_VARIANTS[preset.type] ?? "secondary"}
                      className="text-xs mt-0.5"
                    >
                      {TYPE_LABELS[preset.type]}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleToggleActive(preset)}
                    title={preset.is_active ? "Deactivate" : "Activate"}
                  >
                    {preset.is_active
                      ? <ToggleRight className="h-4 w-4 text-green-600" />
                      : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEdit(preset)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete preset?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`If this preset is used by existing campaigns, it will be deactivated instead of deleted.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(preset)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Title & URL */}
              {preset.title && (
                <p className="text-xs text-muted-foreground line-clamp-1">{preset.title}</p>
              )}
              {preset.url && (
                <a
                  href={preset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline underline-offset-2 line-clamp-1"
                >
                  {preset.url}
                </a>
              )}

              {/* YouTube thumbnail */}
              {preset.type === "youtube" && preset.youtube_thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preset.youtube_thumbnail_url}
                  alt={preset.title ?? "YouTube thumbnail"}
                  className="rounded w-full object-cover"
                />
              )}

              {/* Default CTA */}
              {preset.default_cta && (
                <p className="text-xs text-muted-foreground">
                  CTA: <span className="italic">{preset.default_cta}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
