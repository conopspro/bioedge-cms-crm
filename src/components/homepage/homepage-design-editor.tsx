"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Video,
  Code,
  Megaphone,
  Sparkles,
  Users,
  Building2,
  FileText,
  Play,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface HomepageSection {
  id: string
  section_key: string
  section_type: string
  is_visible: boolean
  display_order: number
  label: string | null
  title: string | null
  subtitle: string | null
  description: string | null
  background: string
  settings: Record<string, any>
}

interface Event {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  start_date: string | null
  status: string
  featured_image_url: string | null
}

interface FeaturedEvent {
  id: string
  event_id: string
  display_order: number
  is_visible: boolean
  custom_title: string | null
  custom_tagline: string | null
  custom_image_url: string | null
  event: Event
}

interface SharedSlider {
  id: string
  name: string
  slug: string
}

interface HeroSettings {
  hero_label?: string | null
  hero_title?: string | null
  hero_subtitle?: string | null
  hero_description?: string | null
  hero_video_url?: string | null
  hero_image_url?: string | null
  hero_cta_text?: string | null
  hero_cta_url?: string | null
  hero_secondary_cta_text?: string | null
  hero_secondary_cta_url?: string | null
}

interface HomepageDesignEditorProps {
  initialSections: HomepageSection[]
  initialFeaturedEvents: FeaturedEvent[]
  initialHeroSettings: HeroSettings | null
  allEvents: Event[]
  sharedSliders: SharedSlider[]
}

const sectionIcons: Record<string, any> = {
  events: Calendar,
  edge_framework: Sparkles,
  slider: ImageIcon,
  video: Video,
  html: Code,
  cta: Megaphone,
  featured_leaders: Users,
  featured_companies: Building2,
  featured_presentations: Play,
  featured_articles: FileText,
}

// Preset color options for quick selection - bioEDGE brand colors
const presetColors = [
  { value: "#ffffff", label: "White" },
  { value: "#f8f9fa", label: "Off-White" },
  { value: "#0d2840", label: "Navy" },
  { value: "#0d598a", label: "Deep Blue" },
  { value: "#017ab2", label: "Electric Blue" },
  { value: "#ff914d", label: "Gold/Orange" },
]

export function HomepageDesignEditor({
  initialSections,
  initialFeaturedEvents,
  initialHeroSettings,
  allEvents,
  sharedSliders,
}: HomepageDesignEditorProps) {
  const router = useRouter()
  const [sections, setSections] = useState<HomepageSection[]>(initialSections)
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>(initialFeaturedEvents)
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(initialHeroSettings || {})
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingHero, setIsSavingHero] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [heroExpanded, setHeroExpanded] = useState(false)

  // Dialog states
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string>("")

  // Update hero settings
  const updateHeroSetting = (key: keyof HeroSettings, value: string | null) => {
    setHeroSettings({ ...heroSettings, [key]: value })
  }

  // Save hero settings
  const saveHeroSettings = async () => {
    setIsSavingHero(true)
    try {
      await fetch("/api/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroSettings),
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving hero settings:", error)
    } finally {
      setIsSavingHero(false)
    }
  }

  // Toggle section visibility
  const toggleVisibility = async (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    const newVisibility = !section.is_visible
    setSections(sections.map((s) =>
      s.id === sectionId ? { ...s, is_visible: newVisibility } : s
    ))

    await fetch(`/api/homepage/sections/${sectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: newVisibility }),
    })
  }

  // Move section up/down
  const moveSection = async (sectionId: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === sectionId)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === sections.length - 1) return

    const newSections = [...sections]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]]

    // Update display_order
    newSections.forEach((s, i) => {
      s.display_order = i
    })

    setSections(newSections)

    // Save to database
    await fetch("/api/homepage/sections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        newSections.map((s) => ({ id: s.id, display_order: s.display_order }))
      ),
    })
  }

  // Update section
  const updateSection = async (sectionId: string, updates: Partial<HomepageSection>) => {
    setSections(sections.map((s) =>
      s.id === sectionId ? { ...s, ...updates } : s
    ))

    await fetch(`/api/homepage/sections/${sectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
  }

  // Add featured event
  const addFeaturedEvent = async () => {
    if (!selectedEventId) return

    try {
      const response = await fetch("/api/homepage/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: selectedEventId }),
      })

      if (response.ok) {
        const newEvent = await response.json()
        setFeaturedEvents([...featuredEvents, newEvent])
        setShowAddEventDialog(false)
        setSelectedEventId("")
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to add event")
      }
    } catch (error) {
      console.error("Error adding event:", error)
    }
  }

  // Remove featured event
  const removeFeaturedEvent = async (eventId: string) => {
    if (!confirm("Remove this event from the homepage?")) return

    try {
      const response = await fetch(`/api/homepage/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFeaturedEvents(featuredEvents.filter((e) => e.id !== eventId))
      }
    } catch (error) {
      console.error("Error removing event:", error)
    }
  }

  // Toggle featured event visibility
  const toggleEventVisibility = async (eventId: string) => {
    const event = featuredEvents.find((e) => e.id === eventId)
    if (!event) return

    const newVisibility = !event.is_visible
    setFeaturedEvents(featuredEvents.map((e) =>
      e.id === eventId ? { ...e, is_visible: newVisibility } : e
    ))

    await fetch(`/api/homepage/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: newVisibility }),
    })
  }

  // Move event up/down
  const moveEvent = async (eventId: string, direction: "up" | "down") => {
    const index = featuredEvents.findIndex((e) => e.id === eventId)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === featuredEvents.length - 1) return

    const newEvents = [...featuredEvents]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newEvents[index], newEvents[swapIndex]] = [newEvents[swapIndex], newEvents[index]]

    newEvents.forEach((e, i) => {
      e.display_order = i
    })

    setFeaturedEvents(newEvents)

    await fetch("/api/homepage/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        newEvents.map((e) => ({ id: e.id, display_order: e.display_order }))
      ),
    })
  }

  // Get available events (not already featured)
  const availableEvents = allEvents.filter(
    (e) => !featuredEvents.some((fe) => fe.event_id === e.id)
  )

  // Toggle expanded section
  const toggleExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD"
    // Parse as local date to avoid UTC conversion issues
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <Collapsible open={heroExpanded} onOpenChange={setHeroExpanded}>
          <CardHeader className="cursor-pointer" onClick={() => setHeroExpanded(!heroExpanded)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>
                    Customize the main hero area at the top of the homepage
                  </CardDescription>
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    heroExpanded && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-6 pt-0">
              {/* Label & Titles */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Content</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Label Badge</Label>
                    <Input
                      value={heroSettings.hero_label || ""}
                      onChange={(e) => updateHeroSetting("hero_label", e.target.value || null)}
                      placeholder="National Tour 2026"
                    />
                    <p className="text-xs text-muted-foreground">Appears above the title</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={heroSettings.hero_title || ""}
                      onChange={(e) => updateHeroSetting("hero_title", e.target.value || null)}
                      placeholder="bioEDGE Longevity Summit"
                    />
                    <p className="text-xs text-muted-foreground">Main heading text</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={heroSettings.hero_subtitle || ""}
                      onChange={(e) => updateHeroSetting("hero_subtitle", e.target.value || null)}
                      placeholder="Where Biohacking Starts with NO"
                    />
                    <p className="text-xs text-muted-foreground">Bold text below title</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={heroSettings.hero_description || ""}
                      onChange={(e) => updateHeroSetting("hero_description", e.target.value || null)}
                      placeholder="A transformational live experience..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Media</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input
                      value={heroSettings.hero_video_url || ""}
                      onChange={(e) => updateHeroSetting("hero_video_url", e.target.value || null)}
                      placeholder="https://youtube.com/shorts/..."
                    />
                    <p className="text-xs text-muted-foreground">Any YouTube URL works (Shorts, watch, embed, youtu.be)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={heroSettings.hero_image_url || ""}
                      onChange={(e) => updateHeroSetting("hero_image_url", e.target.value || null)}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">Fallback image if no video</p>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Call to Actions</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <Label className="text-sm font-medium">Primary Button</Label>
                    <div className="space-y-2">
                      <Label className="text-xs">Button Text</Label>
                      <Input
                        value={heroSettings.hero_cta_text || ""}
                        onChange={(e) => updateHeroSetting("hero_cta_text", e.target.value || null)}
                        placeholder="Get Notified"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Button URL</Label>
                      <Input
                        value={heroSettings.hero_cta_url || ""}
                        onChange={(e) => updateHeroSetting("hero_cta_url", e.target.value || null)}
                        placeholder="#notify"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 p-4 border rounded-lg">
                    <Label className="text-sm font-medium">Secondary Button</Label>
                    <div className="space-y-2">
                      <Label className="text-xs">Button Text</Label>
                      <Input
                        value={heroSettings.hero_secondary_cta_text || ""}
                        onChange={(e) => updateHeroSetting("hero_secondary_cta_text", e.target.value || null)}
                        placeholder="Get the Book"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Button URL</Label>
                      <Input
                        value={heroSettings.hero_secondary_cta_url || ""}
                        onChange={(e) => updateHeroSetting("hero_secondary_cta_url", e.target.value || null)}
                        placeholder="https://biohackingstartswithno.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={saveHeroSettings} disabled={isSavingHero}>
                  {isSavingHero ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Hero Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Page Sections</CardTitle>
          <CardDescription>
            Drag to reorder, toggle visibility, and customize each section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.section_type] || Sparkles
            const isExpanded = expandedSections.has(section.id)

            return (
              <Collapsible
                key={section.id}
                open={isExpanded}
                onOpenChange={() => toggleExpanded(section.id)}
              >
                <div
                  className={cn(
                    "border rounded-lg transition-colors",
                    section.is_visible ? "bg-white" : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3 p-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

                    <div className="flex items-center gap-2 flex-1">
                      <div className={cn(
                        "p-1.5 rounded",
                        section.is_visible ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "h-4 w-4",
                          section.is_visible ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <span className={cn(
                          "font-medium",
                          !section.is_visible && "text-muted-foreground"
                        )}>
                          {section.title || section.section_key.replace(/_/g, " ")}
                        </span>
                        {section.label && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {section.label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveSection(section.id, "up")}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveSection(section.id, "down")}
                        disabled={index === sections.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleVisibility(section.id)}
                      >
                        {section.is_visible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "rotate-180"
                          )} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t space-y-4">
                      {/* Common fields */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Label (Badge)</Label>
                          <Input
                            value={section.label || ""}
                            onChange={(e) => updateSection(section.id, { label: e.target.value || null })}
                            placeholder="UPCOMING EVENTS"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={section.title || ""}
                            onChange={(e) => updateSection(section.id, { title: e.target.value || null })}
                            placeholder="Section Title"
                          />
                        </div>
                      </div>

                      {/* Color Settings */}
                      <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-medium">Colors</h4>

                        {/* Background Color */}
                        <div className="space-y-2">
                          <Label className="text-xs">Background</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={section.settings?.bg_color || "#ffffff"}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, bg_color: e.target.value }
                              })}
                              className="w-10 h-9 rounded border cursor-pointer"
                            />
                            <Input
                              value={section.settings?.bg_color || ""}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, bg_color: e.target.value || null }
                              })}
                              placeholder="#ffffff"
                              className="w-28 font-mono text-xs"
                            />
                            <div className="flex gap-1">
                              {presetColors.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => updateSection(section.id, {
                                    settings: { ...section.settings, bg_color: color.value }
                                  })}
                                  className="w-5 h-5 rounded border shadow-sm hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color.value }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Title Color */}
                        <div className="space-y-2">
                          <Label className="text-xs">Title Color</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={section.settings?.title_color || "#0d2840"}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, title_color: e.target.value }
                              })}
                              className="w-10 h-9 rounded border cursor-pointer"
                            />
                            <Input
                              value={section.settings?.title_color || ""}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, title_color: e.target.value || null }
                              })}
                              placeholder="#0d2840"
                              className="w-28 font-mono text-xs"
                            />
                            <div className="flex gap-1">
                              {presetColors.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => updateSection(section.id, {
                                    settings: { ...section.settings, title_color: color.value }
                                  })}
                                  className="w-5 h-5 rounded border shadow-sm hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color.value }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Label/Badge Color */}
                        <div className="space-y-2">
                          <Label className="text-xs">Label Badge Background</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={section.settings?.label_bg_color || "#0d598a"}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, label_bg_color: e.target.value }
                              })}
                              className="w-10 h-9 rounded border cursor-pointer"
                            />
                            <Input
                              value={section.settings?.label_bg_color || ""}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, label_bg_color: e.target.value || null }
                              })}
                              placeholder="#0d598a"
                              className="w-28 font-mono text-xs"
                            />
                            <div className="flex gap-1">
                              {presetColors.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => updateSection(section.id, {
                                    settings: { ...section.settings, label_bg_color: color.value }
                                  })}
                                  className="w-5 h-5 rounded border shadow-sm hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color.value }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Text Color */}
                        <div className="space-y-2">
                          <Label className="text-xs">Text Color</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={section.settings?.text_color || "#374151"}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, text_color: e.target.value }
                              })}
                              className="w-10 h-9 rounded border cursor-pointer"
                            />
                            <Input
                              value={section.settings?.text_color || ""}
                              onChange={(e) => updateSection(section.id, {
                                settings: { ...section.settings, text_color: e.target.value || null }
                              })}
                              placeholder="#374151"
                              className="w-28 font-mono text-xs"
                            />
                            <div className="flex gap-1">
                              {presetColors.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => updateSection(section.id, {
                                    settings: { ...section.settings, text_color: color.value }
                                  })}
                                  className="w-5 h-5 rounded border shadow-sm hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color.value }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section-specific settings */}
                      {section.section_type === "events" && (
                        <div className="space-y-2">
                          <Label>Columns Layout</Label>
                          <Select
                            value={String(section.settings?.columns || 1)}
                            onValueChange={(value) => updateSection(section.id, {
                              settings: { ...section.settings, columns: parseInt(value) }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Column (Single Card)</SelectItem>
                              <SelectItem value="2">2 Columns</SelectItem>
                              <SelectItem value="3">3 Columns</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {section.section_type === "slider" && (
                        <div className="space-y-2">
                          <Label>Photo Slider</Label>
                          <Select
                            value={section.settings?.slider_id || "none"}
                            onValueChange={(value) => updateSection(section.id, {
                              settings: { ...section.settings, slider_id: value === "none" ? null : value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a slider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No slider selected</SelectItem>
                              {sharedSliders.map((slider) => (
                                <SelectItem key={slider.id} value={slider.id}>
                                  {slider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {section.section_type === "video" && (
                        <div className="space-y-2">
                          <Label>Video URL (YouTube/Vimeo Embed)</Label>
                          <Input
                            value={section.settings?.video_url || ""}
                            onChange={(e) => updateSection(section.id, {
                              settings: { ...section.settings, video_url: e.target.value || null }
                            })}
                            placeholder="https://www.youtube.com/embed/..."
                          />
                        </div>
                      )}

                      {section.section_type === "html" && (
                        <div className="space-y-2">
                          <Label>Custom HTML</Label>
                          <Textarea
                            value={section.settings?.html_content || ""}
                            onChange={(e) => updateSection(section.id, {
                              settings: { ...section.settings, html_content: e.target.value }
                            })}
                            placeholder="<div>...</div>"
                            rows={6}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}

                      {section.section_type === "cta" && (
                        <>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={section.description || ""}
                              onChange={(e) => updateSection(section.id, { description: e.target.value || null })}
                              placeholder="Add a description to display below the title..."
                              rows={2}
                            />
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Button Text</Label>
                              <Input
                                value={section.settings?.button_text || ""}
                                onChange={(e) => updateSection(section.id, {
                                  settings: { ...section.settings, button_text: e.target.value }
                                })}
                                placeholder="Get Notified"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Button URL</Label>
                              <Input
                                value={section.settings?.button_url || ""}
                                onChange={(e) => updateSection(section.id, {
                                  settings: { ...section.settings, button_url: e.target.value }
                                })}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2 pt-2">
                            <div className="space-y-2">
                              <Label className="text-xs">Button Background</Label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={section.settings?.button_bg || "#c9a227"}
                                  onChange={(e) => updateSection(section.id, {
                                    settings: { ...section.settings, button_bg: e.target.value }
                                  })}
                                  className="w-10 h-9 rounded border cursor-pointer"
                                />
                                <Input
                                  value={section.settings?.button_bg || ""}
                                  onChange={(e) => updateSection(section.id, {
                                    settings: { ...section.settings, button_bg: e.target.value || null }
                                  })}
                                  placeholder="#c9a227"
                                  className="flex-1 font-mono text-xs"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Button Text Color</Label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={section.settings?.button_text_color || "#0a2540"}
                                  onChange={(e) => updateSection(section.id, {
                                    settings: { ...section.settings, button_text_color: e.target.value }
                                  })}
                                  className="w-10 h-9 rounded border cursor-pointer"
                                />
                                <Input
                                  value={section.settings?.button_text_color || ""}
                                  onChange={(e) => updateSection(section.id, {
                                    settings: { ...section.settings, button_text_color: e.target.value || null }
                                  })}
                                  placeholder="#0a2540"
                                  className="flex-1 font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </CardContent>
      </Card>

      {/* Featured Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Events</CardTitle>
              <CardDescription>
                Select which events appear in the "Upcoming Events" section
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddEventDialog(true)} disabled={availableEvents.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {featuredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No events featured yet</p>
              <p className="text-sm">Add events to display them on the homepage</p>
            </div>
          ) : (
            <div className="space-y-2">
              {featuredEvents.map((fe, index) => (
                <div
                  key={fe.id}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg",
                    fe.is_visible ? "bg-white" : "bg-muted/50"
                  )}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

                  {fe.event?.featured_image_url ? (
                    <img
                      src={fe.event.featured_image_url}
                      alt={fe.event.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gradient-to-br from-navy via-deep-blue to-electric-blue rounded" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      !fe.is_visible && "text-muted-foreground"
                    )}>
                      {fe.event?.name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(fe.event?.start_date)}
                      </span>
                      {(fe.event?.city || fe.event?.state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {[fe.event.city, fe.event.state].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge variant={fe.event?.status === "published" ? "success" : "secondary"}>
                    {fe.event?.status}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveEvent(fe.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveEvent(fe.id, "down")}
                      disabled={index === featuredEvents.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleEventVisibility(fe.id)}
                    >
                      {fe.is_visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFeaturedEvent(fe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event to Homepage</DialogTitle>
            <DialogDescription>
              Select an event to feature on the homepage
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {availableEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex items-center gap-2">
                      <span>{event.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {event.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addFeaturedEvent} disabled={!selectedEventId}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
