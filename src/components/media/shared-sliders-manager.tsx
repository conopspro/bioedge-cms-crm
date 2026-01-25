"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Image, Loader2, Copy, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { MediaLibrary, MediaLibraryInline } from "@/components/media/media-library"

interface SliderImage {
  id: string
  slider_id: string
  image_url: string
  thumbnail_url: string | null
  alt_text: string | null
  caption: string | null
  link_url: string | null
  display_order: number
  is_visible: boolean
}

interface SharedSlider {
  id: string
  name: string
  slug: string
  description: string | null
  section_title: string | null
  section_subtitle: string | null
  section_background: string
  auto_play: boolean
  auto_play_interval: number
  show_navigation: boolean
  show_dots: boolean
  show_captions: boolean
  is_active: boolean
  images: SliderImage[]
}

interface SharedSlidersManagerProps {
  initialSliders: SharedSlider[]
}

/**
 * Shared Sliders Manager
 *
 * Manages shared photo sliders that can be used across the site.
 */
export function SharedSlidersManager({ initialSliders }: SharedSlidersManagerProps) {
  const [sliders, setSliders] = useState<SharedSlider[]>(initialSliders)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Slider dialog states
  const [isSliderDialogOpen, setIsSliderDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<SharedSlider | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Image dialog states
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [activeSliderForImage, setActiveSliderForImage] = useState<SharedSlider | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  // Slider form state
  const [sliderForm, setSliderForm] = useState({
    name: "",
    slug: "",
    description: "",
    section_title: "",
    section_subtitle: "",
    section_background: "white",
    show_captions: true,
    is_active: true,
  })

  // Image form state
  const [imageForm, setImageForm] = useState({
    image_url: "",
    alt_text: "",
    caption: "",
    link_url: "",
  })

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
  }

  // Open create slider dialog
  const openCreateSliderDialog = () => {
    setEditingSlider(null)
    setSliderForm({
      name: "",
      slug: "",
      description: "",
      section_title: "",
      section_subtitle: "",
      section_background: "white",
      show_captions: true,
      is_active: true,
    })
    setIsSliderDialogOpen(true)
  }

  // Open edit slider dialog
  const openEditSliderDialog = (slider: SharedSlider) => {
    setEditingSlider(slider)
    setSliderForm({
      name: slider.name,
      slug: slider.slug,
      description: slider.description || "",
      section_title: slider.section_title || "",
      section_subtitle: slider.section_subtitle || "",
      section_background: slider.section_background || "white",
      show_captions: slider.show_captions,
      is_active: slider.is_active,
    })
    setIsSliderDialogOpen(true)
  }

  // Open delete slider dialog
  const openDeleteSliderDialog = (slider: SharedSlider) => {
    setEditingSlider(slider)
    setIsDeleteDialogOpen(true)
  }

  // Create or update slider
  const handleSaveSlider = async () => {
    if (!sliderForm.name.trim()) return

    setIsSaving(true)
    setError(null)

    try {
      const slug = sliderForm.slug.trim() || generateSlug(sliderForm.name)
      const payload = {
        name: sliderForm.name.trim(),
        slug,
        description: sliderForm.description.trim() || null,
        section_title: sliderForm.section_title.trim() || null,
        section_subtitle: sliderForm.section_subtitle.trim() || null,
        section_background: sliderForm.section_background,
        show_captions: sliderForm.show_captions,
        is_active: sliderForm.is_active,
      }

      if (editingSlider) {
        // Update existing slider
        const response = await fetch(`/api/shared-sliders/${editingSlider.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error("Failed to update slider")

        const updated = await response.json()
        setSliders(sliders.map((s) => (s.id === editingSlider.id ? { ...s, ...updated } : s)))
      } else {
        // Create new slider
        const response = await fetch("/api/shared-sliders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error("Failed to create slider")

        const created = await response.json()
        setSliders([...sliders, created])
      }

      setIsSliderDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete slider
  const handleDeleteSlider = async () => {
    if (!editingSlider) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/shared-sliders/${editingSlider.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete slider")

      setSliders(sliders.filter((s) => s.id !== editingSlider.id))
      setIsDeleteDialogOpen(false)
      setEditingSlider(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Open add image dialog
  const openAddImageDialog = (slider: SharedSlider) => {
    setActiveSliderForImage(slider)
    setEditingImage(null)
    setImageForm({
      image_url: "",
      alt_text: "",
      caption: "",
      link_url: "",
    })
    setIsImageDialogOpen(true)
  }

  // Open edit image dialog
  const openEditImageDialog = (slider: SharedSlider, image: SliderImage) => {
    setActiveSliderForImage(slider)
    setEditingImage(image)
    setImageForm({
      image_url: image.image_url,
      alt_text: image.alt_text || "",
      caption: image.caption || "",
      link_url: image.link_url || "",
    })
    setIsImageDialogOpen(true)
  }

  // Save image (create or update)
  const handleSaveImage = async () => {
    if (!activeSliderForImage || !imageForm.image_url.trim()) return

    setIsSaving(true)
    setError(null)

    try {
      const payload = {
        image_url: imageForm.image_url.trim(),
        alt_text: imageForm.alt_text.trim() || null,
        caption: imageForm.caption.trim() || null,
        link_url: imageForm.link_url.trim() || null,
      }

      if (editingImage) {
        // Update existing image
        const response = await fetch(
          `/api/shared-sliders/${activeSliderForImage.id}/images/${editingImage.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )

        if (!response.ok) throw new Error("Failed to update image")

        const updated = await response.json()
        setSliders(
          sliders.map((s) =>
            s.id === activeSliderForImage.id
              ? { ...s, images: s.images.map((img) => (img.id === editingImage.id ? updated : img)) }
              : s
          )
        )
      } else {
        // Add new image
        const response = await fetch(`/api/shared-sliders/${activeSliderForImage.id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error("Failed to add image")

        const created = await response.json()
        setSliders(
          sliders.map((s) =>
            s.id === activeSliderForImage.id ? { ...s, images: [...s.images, created] } : s
          )
        )
      }

      setIsImageDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete image
  const handleDeleteImage = async (slider: SharedSlider, image: SliderImage) => {
    try {
      const response = await fetch(`/api/shared-sliders/${slider.id}/images/${image.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete image")

      setSliders(
        sliders.map((s) =>
          s.id === slider.id ? { ...s, images: s.images.filter((img) => img.id !== image.id) } : s
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Copy slug to clipboard
  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(slug)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Photo Sliders</h2>
          <p className="text-sm text-muted-foreground">
            Create reusable photo sliders for the homepage and other pages.
          </p>
        </div>
        <Button onClick={openCreateSliderDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Slider
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">{error}</div>
      )}

      {/* Sliders List */}
      {sliders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No sliders yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a photo slider to use on the homepage or other pages.
          </p>
          <Button onClick={openCreateSliderDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Slider
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sliders.map((slider) => (
            <Collapsible key={slider.id} className="border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{slider.name}</span>
                      {!slider.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{slider.slug}</code>
                      <span>·</span>
                      <span>{slider.images.length} images</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {/* Slider info and actions */}
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1 text-sm">
                      {slider.section_title && (
                        <p>
                          <span className="text-muted-foreground">Title:</span> {slider.section_title}
                        </p>
                      )}
                      {slider.description && (
                        <p>
                          <span className="text-muted-foreground">Description:</span>{" "}
                          {slider.description}
                        </p>
                      )}
                      <p>
                        <span className="text-muted-foreground">Background:</span>{" "}
                        {slider.section_background}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-muted-foreground">Usage:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          sliderSlug="{slider.slug}"
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            copySlug(slider.slug)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditSliderDialog(slider)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteSliderDialog(slider)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Images grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Images</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveSliderForImage(slider)
                            setIsMediaLibraryOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add from Library
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openAddImageDialog(slider)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add by URL
                        </Button>
                      </div>
                    </div>

                    {slider.images.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-lg">
                        <Image className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No images in this slider</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {slider.images.map((image) => (
                          <div
                            key={image.id}
                            className="group relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted"
                          >
                            <img
                              src={image.image_url}
                              alt={image.alt_text || "Slider image"}
                              className="w-full h-full object-cover"
                            />
                            {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                <p className="text-white text-xs truncate">{image.caption}</p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditImageDialog(slider, image)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteImage(slider, image)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Create/Edit Slider Dialog */}
      <Dialog open={isSliderDialogOpen} onOpenChange={setIsSliderDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSlider ? "Edit Slider" : "Create Slider"}</DialogTitle>
            <DialogDescription>
              {editingSlider
                ? "Update the slider settings."
                : "Create a new photo slider that can be used on any page."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slider-name">Name *</Label>
                <Input
                  id="slider-name"
                  value={sliderForm.name}
                  onChange={(e) => {
                    setSliderForm({
                      ...sliderForm,
                      name: e.target.value,
                      slug: editingSlider ? sliderForm.slug : generateSlug(e.target.value),
                    })
                  }}
                  placeholder="Homepage Gallery"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slider-slug">Slug *</Label>
                <Input
                  id="slider-slug"
                  value={sliderForm.slug}
                  onChange={(e) => setSliderForm({ ...sliderForm, slug: e.target.value })}
                  placeholder="homepage-gallery"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slider-description">Description</Label>
              <Textarea
                id="slider-description"
                value={sliderForm.description}
                onChange={(e) => setSliderForm({ ...sliderForm, description: e.target.value })}
                placeholder="Internal description for this slider"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  value={sliderForm.section_title}
                  onChange={(e) => setSliderForm({ ...sliderForm, section_title: e.target.value })}
                  placeholder="Gallery"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-background">Background</Label>
                <Select
                  value={sliderForm.section_background}
                  onValueChange={(value) =>
                    setSliderForm({ ...sliderForm, section_background: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                    <SelectItem value="navy">Navy</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section-subtitle">Section Subtitle</Label>
              <Input
                id="section-subtitle"
                value={sliderForm.section_subtitle}
                onChange={(e) => setSliderForm({ ...sliderForm, section_subtitle: e.target.value })}
                placeholder="Photos from our events"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-captions"
                  checked={sliderForm.show_captions}
                  onCheckedChange={(checked) =>
                    setSliderForm({ ...sliderForm, show_captions: checked })
                  }
                />
                <Label htmlFor="show-captions">Show captions</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is-active"
                  checked={sliderForm.is_active}
                  onCheckedChange={(checked) => setSliderForm({ ...sliderForm, is_active: checked })}
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSliderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSlider} disabled={!sliderForm.name.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingSlider ? (
                "Save Changes"
              ) : (
                "Create Slider"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Slider Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slider</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{editingSlider?.name}"? This will also delete all
              images in this slider. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlider}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Image" : "Add Image"}</DialogTitle>
            <DialogDescription>
              {editingImage ? "Update the image details." : "Add a new image to this slider."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image *</Label>
              <div className="flex gap-2">
                <Input
                  value={imageForm.image_url}
                  onChange={(e) => setImageForm({ ...imageForm, image_url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsImageDialogOpen(false)
                    setTimeout(() => setIsMediaLibraryOpen(true), 100)
                  }}
                >
                  Browse
                </Button>
              </div>
              {imageForm.image_url && (
                <div className="mt-2 rounded-lg overflow-hidden border aspect-video max-w-[200px]">
                  <img
                    src={imageForm.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={imageForm.alt_text}
                onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })}
                placeholder="Describe the image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-caption">Caption</Label>
              <Input
                id="image-caption"
                value={imageForm.caption}
                onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                placeholder="Caption displayed on the image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-link">Link URL (optional)</Label>
              <Input
                id="image-link"
                value={imageForm.link_url}
                onChange={(e) => setImageForm({ ...imageForm, link_url: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                If set, clicking the image will open this link in a new tab.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveImage} disabled={!imageForm.image_url.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingImage ? (
                "Save Changes"
              ) : (
                "Add Image"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Library Dialog - for adding images from library */}
      <MediaLibrary
        open={isMediaLibraryOpen}
        onOpenChange={(open) => {
          setIsMediaLibraryOpen(open)
          if (!open) {
            // Clear the active slider when closing from "Add from Library"
            // But check if we were in single-image edit mode first
            if (activeSliderForImage && !isImageDialogOpen) {
              // We were in multi-select mode, just clear the state
              setActiveSliderForImage(null)
            }
          }
        }}
        onSelect={async (media) => {
          if (activeSliderForImage && !isImageDialogOpen) {
            // Multi-select mode from "Add from Library" button
            // Add image directly to slider
            try {
              const response = await fetch(`/api/shared-sliders/${activeSliderForImage.id}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  image_url: media.file_url,
                  alt_text: media.alt_text || null,
                  caption: media.caption || null,
                }),
              })

              if (response.ok) {
                const created = await response.json()
                // Use functional update to ensure we always have the latest state
                setSliders((prevSliders) =>
                  prevSliders.map((s) =>
                    s.id === activeSliderForImage.id ? { ...s, images: [...s.images, created] } : s
                  )
                )
              }
            } catch (err) {
              console.error("Failed to add image:", err)
            }
            // Don't close - user can select multiple images with "Add Selected" button
          } else {
            // Single select mode from "Browse" button in image dialog
            setImageForm({ ...imageForm, image_url: media.file_url })
            setIsMediaLibraryOpen(false)
            setTimeout(() => setIsImageDialogOpen(true), 100)
          }
        }}
        selectionMode={activeSliderForImage && !isImageDialogOpen ? "multiple" : "single"}
        folder="sliders"
        title={activeSliderForImage && !isImageDialogOpen ? "Add Images to Slider" : "Select Image"}
      />
    </div>
  )
}
