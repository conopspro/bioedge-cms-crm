"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import { createClient } from "@/lib/supabase/client"

interface FAQ {
  id: string
  event_id: string
  question: string
  answer: string
  category?: string | null
  display_order: number
  is_visible: boolean
}

interface FAQsListProps {
  eventId: string
}

export function FAQsList({ eventId }: FAQsListProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [category, setCategory] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadFaqs()
  }, [eventId])

  async function loadFaqs() {
    setLoading(true)
    const { data, error } = await supabase
      .from("event_faqs")
      .select("*")
      .eq("event_id", eventId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Failed to load FAQs")
      console.error(error)
    } else {
      setFaqs(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setEditingFaq(null)
    setQuestion("")
    setAnswer("")
    setCategory("")
    setIsVisible(true)
    setDialogOpen(true)
  }

  function openEditDialog(faq: FAQ) {
    setEditingFaq(faq)
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setCategory(faq.category || "")
    setIsVisible(faq.is_visible)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!question.trim() || !answer.trim()) {
      console.error("Question and answer are required")
      return
    }

    setSaving(true)

    if (editingFaq) {
      // Update existing
      const { error } = await supabase
        .from("event_faqs")
        .update({
          question: question.trim(),
          answer: answer.trim(),
          category: category.trim() || null,
          is_visible: isVisible,
        })
        .eq("id", editingFaq.id)

      if (error) {
        console.error("Failed to update FAQ")
        console.error(error)
      } else {
        console.log("FAQ updated")
        setDialogOpen(false)
        loadFaqs()
      }
    } else {
      // Create new
      const maxOrder = Math.max(0, ...faqs.map(f => f.display_order))
      const { error } = await supabase
        .from("event_faqs")
        .insert({
          event_id: eventId,
          question: question.trim(),
          answer: answer.trim(),
          category: category.trim() || null,
          display_order: maxOrder + 1,
          is_visible: isVisible,
        })

      if (error) {
        console.error("Failed to create FAQ")
        console.error(error)
      } else {
        console.log("FAQ added")
        setDialogOpen(false)
        loadFaqs()
      }
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!faqToDelete) return

    const { error } = await supabase
      .from("event_faqs")
      .delete()
      .eq("id", faqToDelete.id)

    if (error) {
      console.error("Failed to delete FAQ")
      console.error(error)
    } else {
      console.log("FAQ deleted")
      loadFaqs()
    }

    setDeleteDialogOpen(false)
    setFaqToDelete(null)
  }

  async function toggleVisibility(faq: FAQ) {
    const { error } = await supabase
      .from("event_faqs")
      .update({ is_visible: !faq.is_visible })
      .eq("id", faq.id)

    if (error) {
      console.error("Failed to update FAQ")
      console.error(error)
    } else {
      loadFaqs()
    }
  }

  async function moveUp(index: number) {
    if (index === 0) return
    const newFaqs = [...faqs]
    const temp = newFaqs[index].display_order
    newFaqs[index].display_order = newFaqs[index - 1].display_order
    newFaqs[index - 1].display_order = temp

    // Update both in database
    await Promise.all([
      supabase.from("event_faqs").update({ display_order: newFaqs[index].display_order }).eq("id", newFaqs[index].id),
      supabase.from("event_faqs").update({ display_order: newFaqs[index - 1].display_order }).eq("id", newFaqs[index - 1].id),
    ])

    loadFaqs()
  }

  async function moveDown(index: number) {
    if (index === faqs.length - 1) return
    const newFaqs = [...faqs]
    const temp = newFaqs[index].display_order
    newFaqs[index].display_order = newFaqs[index + 1].display_order
    newFaqs[index + 1].display_order = temp

    // Update both in database
    await Promise.all([
      supabase.from("event_faqs").update({ display_order: newFaqs[index].display_order }).eq("id", newFaqs[index].id),
      supabase.from("event_faqs").update({ display_order: newFaqs[index + 1].display_order }).eq("id", newFaqs[index + 1].id),
    ])

    loadFaqs()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>FAQs</CardTitle>
            <CardDescription>
              Manage frequently asked questions for this event
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : faqs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No FAQs yet. Click "Add FAQ" to create one.
          </p>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  !faq.is_visible ? "opacity-50 bg-muted" : "bg-card"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveDown(index)}
                    disabled={index === faqs.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {faq.answer}
                  </p>
                  {faq.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-muted rounded">
                      {faq.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={faq.is_visible}
                    onCheckedChange={() => toggleVisibility(faq)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(faq)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFaqToDelete(faq)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              {editingFaq
                ? "Update this frequently asked question."
                : "Add a new frequently asked question."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is the refund policy?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Full refunds are available up to 30 days before the event..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Registration, Venue, Schedule"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="visible"
                checked={isVisible}
                onCheckedChange={setIsVisible}
              />
              <Label htmlFor="visible">Visible on public page</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingFaq ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this FAQ. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
