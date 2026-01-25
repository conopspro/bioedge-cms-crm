"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Category Settings Component
 *
 * Allows managing company categories (add, edit, delete, reorder).
 */
export function CategorySettings() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/company-categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
      setError(null)
    } catch (err) {
      setError("Failed to load categories")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "_")
      .replace(/-+/g, "_")
  }

  // Handle name change and auto-generate slug
  const handleNameChange = (name: string) => {
    setCategoryName(name)
    if (!editingCategory) {
      // Only auto-generate slug for new categories
      setCategorySlug(generateSlug(name))
    }
  }

  // Open add dialog
  const openAddDialog = () => {
    setCategoryName("")
    setCategorySlug("")
    setCategoryDescription("")
    setIsAddDialogOpen(true)
  }

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategorySlug(category.slug)
    setCategoryDescription(category.description || "")
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (category: Category) => {
    setEditingCategory(category)
    setIsDeleteDialogOpen(true)
  }

  // Create new category
  const handleAddCategory = async () => {
    if (!categoryName.trim() || !categorySlug.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/company-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          slug: categorySlug.trim(),
          description: categoryDescription.trim() || null,
          display_order: categories.length + 1,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create category")
      }

      await fetchCategories()
      setIsAddDialogOpen(false)
      setCategoryName("")
      setCategorySlug("")
      setCategoryDescription("")
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to create category")
    } finally {
      setIsSaving(false)
    }
  }

  // Update category
  const handleEditCategory = async () => {
    if (!editingCategory || !categoryName.trim() || !categorySlug.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/company-categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          slug: categorySlug.trim(),
          description: categoryDescription.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update category")
      }

      await fetchCategories()
      setIsEditDialogOpen(false)
      setEditingCategory(null)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to update category")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete category
  const handleDeleteCategory = async () => {
    if (!editingCategory) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/company-categories/${editingCategory.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete category")
      }

      await fetchCategories()
      setIsDeleteDialogOpen(false)
      setEditingCategory(null)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to delete category")
    } finally {
      setIsSaving(false)
    }
  }

  // Move category up in order
  const moveUp = async (index: number) => {
    if (index === 0) return
    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index - 1]
    newCategories[index - 1] = temp

    // Update display orders
    await updateDisplayOrders(newCategories)
  }

  // Move category down in order
  const moveDown = async (index: number) => {
    if (index === categories.length - 1) return
    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index + 1]
    newCategories[index + 1] = temp

    // Update display orders
    await updateDisplayOrders(newCategories)
  }

  // Update display orders in database
  const updateDisplayOrders = async (newCategories: Category[]) => {
    setCategories(newCategories)

    // Update each category's display_order
    for (let i = 0; i < newCategories.length; i++) {
      try {
        await fetch(`/api/company-categories/${newCategories[i].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: i + 1 }),
        })
      } catch (err) {
        console.error("Failed to update display order:", err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Company Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage the categories used to organize companies.
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Categories list */}
      <div className="border rounded-lg divide-y">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No categories defined. Click "Add Category" to create one.
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-start gap-4 p-4 hover:bg-muted/50"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1 pt-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === categories.length - 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
              </div>

              {/* Category info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Slug: <code className="bg-muted px-1 rounded">{category.slug}</code>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(category)}
                  title="Edit category"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(category)}
                  title="Delete category"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing companies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={categoryName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Supplements & Compounds"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-slug">Slug</Label>
              <Input
                id="add-slug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                placeholder="e.g., supplements_compounds"
              />
              <p className="text-xs text-muted-foreground">
                Used as the internal identifier. Auto-generated from name.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="What types of companies belong in this category?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!categoryName.trim() || !categorySlug.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Supplements & Compounds"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                placeholder="e.g., supplements_compounds"
              />
              <p className="text-xs text-muted-foreground">
                Warning: Changing the slug may affect existing company categorizations.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="What types of companies belong in this category?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              disabled={!categoryName.trim() || !categorySlug.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{editingCategory?.name}"? Companies using this category will no longer have a category assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
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
    </div>
  )
}
