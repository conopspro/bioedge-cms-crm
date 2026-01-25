"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Pencil,
  Link,
  FileText,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface FaqTemplate {
  id: string
  question: string
  answer: string
  category: string | null
  display_order: number
  is_active: boolean
}

interface EventFaq {
  id: string
  question: string
  answer: string
  category: string | null
  display_order: number
  is_visible: boolean
  is_from_template: boolean
}

interface EventFaqLink {
  id: string
  faq_template_id: string
  question_override: string | null
  answer_override: string | null
  display_order: number
  is_visible: boolean
  template: FaqTemplate
}

interface FaqManagerProps {
  eventId: string
}

export function FaqManager({ eventId }: FaqManagerProps) {
  const router = useRouter()
  const [customFaqs, setCustomFaqs] = useState<EventFaq[]>([])
  const [linkedFaqs, setLinkedFaqs] = useState<EventFaqLink[]>([])
  const [templates, setTemplates] = useState<FaqTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set())

  // Dialog states
  const [showAddCustomDialog, setShowAddCustomDialog] = useState(false)
  const [showLinkTemplateDialog, setShowLinkTemplateDialog] = useState(false)
  const [showTemplateManagerDialog, setShowTemplateManagerDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  // New custom FAQ form
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "",
  })

  // New template form
  const [newTemplate, setNewTemplate] = useState({
    question: "",
    answer: "",
    category: "",
  })

  // Edit template state
  const [editingTemplate, setEditingTemplate] = useState<FaqTemplate | null>(null)
  const [editTemplate, setEditTemplate] = useState({
    question: "",
    answer: "",
    category: "",
  })

  useEffect(() => {
    fetchData()
  }, [eventId])

  const fetchData = async () => {
    try {
      const [faqsRes, templatesRes] = await Promise.all([
        fetch(`/api/events/${eventId}/faqs`),
        fetch(`/api/faq-templates`),
      ])

      if (faqsRes.ok) {
        const faqData = await faqsRes.json()
        setCustomFaqs(faqData.custom || [])
        setLinkedFaqs(faqData.linked || [])
      }

      if (templatesRes.ok) {
        const templateData = await templatesRes.json()
        setTemplates(templateData)
      }
    } catch (error) {
      console.error("Error fetching FAQ data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs((prev) => {
      const next = new Set(prev)
      if (next.has(faqId)) {
        next.delete(faqId)
      } else {
        next.add(faqId)
      }
      return next
    })
  }

  // Create custom FAQ
  const createCustomFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return

    setSaving(true)
    try {
      const response = await fetch(`/api/events/${eventId}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newFaq.question,
          answer: newFaq.answer,
          category: newFaq.category || null,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCustomFaqs((prev) => [...prev, result.data])
        setNewFaq({ question: "", answer: "", category: "" })
        setShowAddCustomDialog(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating custom FAQ:", error)
    } finally {
      setSaving(false)
    }
  }

  // Link template to event
  const linkTemplate = async (templateId: string) => {
    // Check if already linked
    if (linkedFaqs.some((l) => l.faq_template_id === templateId)) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faq_template_id: templateId }),
      })

      if (response.ok) {
        const result = await response.json()
        setLinkedFaqs((prev) => [...prev, result.data])
        router.refresh()
      }
    } catch (error) {
      console.error("Error linking template:", error)
    }
  }

  // Unlink template
  const unlinkTemplate = async (linkId: string) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/faq-links/${linkId}`,
        { method: "DELETE" }
      )

      if (response.ok) {
        setLinkedFaqs((prev) => prev.filter((l) => l.id !== linkId))
        router.refresh()
      }
    } catch (error) {
      console.error("Error unlinking template:", error)
    }
  }

  // Delete custom FAQ
  const deleteCustomFaq = async (faqId: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return

    try {
      const response = await fetch(`/api/events/${eventId}/faqs/${faqId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCustomFaqs((prev) => prev.filter((f) => f.id !== faqId))
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error)
    }
  }

  // Create new template
  const createTemplate = async () => {
    if (!newTemplate.question || !newTemplate.answer) return

    setSaving(true)
    try {
      const response = await fetch(`/api/faq-templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newTemplate.question,
          answer: newTemplate.answer,
          category: newTemplate.category || null,
        }),
      })

      if (response.ok) {
        const created = await response.json()
        setTemplates((prev) => [...prev, created])
        setNewTemplate({ question: "", answer: "", category: "" })
      }
    } catch (error) {
      console.error("Error creating template:", error)
    } finally {
      setSaving(false)
    }
  }

  // Delete template
  const deleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template? It will be unlinked from all events.")) return

    try {
      const response = await fetch(`/api/faq-templates/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== id))
        setLinkedFaqs((prev) => prev.filter((l) => l.faq_template_id !== id))
      }
    } catch (error) {
      console.error("Error deleting template:", error)
    }
  }

  // Open edit template dialog
  const openEditTemplate = (template: FaqTemplate) => {
    setEditingTemplate(template)
    setEditTemplate({
      question: template.question,
      answer: template.answer,
      category: template.category || "",
    })
  }

  // Save edited template
  const saveEditTemplate = async () => {
    if (!editingTemplate || !editTemplate.question || !editTemplate.answer) return

    setSaving(true)
    try {
      const response = await fetch(`/api/faq-templates/${editingTemplate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editTemplate.question,
          answer: editTemplate.answer,
          category: editTemplate.category || null,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setTemplates((prev) =>
          prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...updated } : t))
        )
        // Also update any linked FAQs that use this template
        setLinkedFaqs((prev) =>
          prev.map((l) =>
            l.faq_template_id === editingTemplate.id
              ? { ...l, template: { ...l.template, ...updated } }
              : l
          )
        )
        setEditingTemplate(null)
      }
    } catch (error) {
      console.error("Error updating template:", error)
    } finally {
      setSaving(false)
    }
  }

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const cat = template.category || "General"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(template)
    return acc
  }, {} as Record<string, FaqTemplate[]>)

  // Get linked template IDs
  const linkedTemplateIds = new Set(linkedFaqs.map((l) => l.faq_template_id))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>FAQ Management</CardTitle>
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
            <CardTitle>FAQ Management</CardTitle>
            <CardDescription>
              Add FAQs from templates or create custom ones for this event
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={showTemplateManagerDialog} onOpenChange={setShowTemplateManagerDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Manage Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>FAQ Templates</DialogTitle>
                  <DialogDescription>
                    Create reusable FAQ templates that can be linked to any event
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  {/* Add new template form */}
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-3">Add New Template</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="template-question">Question</Label>
                        <Input
                          id="template-question"
                          value={newTemplate.question}
                          onChange={(e) => setNewTemplate((prev) => ({ ...prev, question: e.target.value }))}
                          placeholder="e.g., What is included in my ticket?"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-answer">Answer</Label>
                        <Textarea
                          id="template-answer"
                          value={newTemplate.answer}
                          onChange={(e) => setNewTemplate((prev) => ({ ...prev, answer: e.target.value }))}
                          placeholder="The answer to the question..."
                          className="mt-1"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Use placeholders: {"{{event_name}}"}, {"{{event_date}}"}, {"{{venue_name}}"} for dynamic content
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="template-category">Category</Label>
                        <Input
                          id="template-category"
                          value={newTemplate.category}
                          onChange={(e) => setNewTemplate((prev) => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Registration, Venue, General"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        onClick={createTemplate}
                        disabled={saving || !newTemplate.question || !newTemplate.answer}
                      >
                        {saving ? "Creating..." : "Add Template"}
                      </Button>
                    </div>
                  </div>

                  {/* Existing templates */}
                  <div className="space-y-3">
                    {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">{category}</h5>
                        <div className="space-y-2">
                          {categoryTemplates.map((template) => (
                            <div key={template.id} className="flex items-start gap-3 p-3 border rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{template.question}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {template.answer}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditTemplate(template)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTemplate(template.id)}
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
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Template Dialog */}
            <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit FAQ Template</DialogTitle>
                  <DialogDescription>
                    Update this FAQ template. Changes will apply to all events using this template.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="edit-template-question">Question *</Label>
                    <Input
                      id="edit-template-question"
                      value={editTemplate.question}
                      onChange={(e) => setEditTemplate((prev) => ({ ...prev, question: e.target.value }))}
                      placeholder="e.g., What is included in my ticket?"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-template-answer">Answer *</Label>
                    <Textarea
                      id="edit-template-answer"
                      value={editTemplate.answer}
                      onChange={(e) => setEditTemplate((prev) => ({ ...prev, answer: e.target.value }))}
                      placeholder="The answer to the question..."
                      className="mt-1"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use placeholders: {"{{event_name}}"}, {"{{event_date}}"}, {"{{venue_name}}"} for dynamic content
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="edit-template-category">Category</Label>
                    <Input
                      id="edit-template-category"
                      value={editTemplate.category}
                      onChange={(e) => setEditTemplate((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Registration, Venue, General"
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={saveEditTemplate}
                    disabled={saving || !editTemplate.question || !editTemplate.answer}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showLinkTemplateDialog} onOpenChange={setShowLinkTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link className="h-4 w-4 mr-1" />
                  Link Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Link FAQ Template</DialogTitle>
                  <DialogDescription>
                    Select templates to add to this event's FAQ section
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                    <div key={category}>
                      <h5 className="text-sm font-medium text-muted-foreground mb-2">{category}</h5>
                      <div className="space-y-2">
                        {categoryTemplates.map((template) => {
                          const isLinked = linkedTemplateIds.has(template.id)
                          return (
                            <div
                              key={template.id}
                              className={cn(
                                "flex items-start gap-3 p-3 border rounded-lg transition-colors",
                                isLinked ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50 cursor-pointer"
                              )}
                              onClick={() => !isLinked && linkTemplate(template.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{template.question}</p>
                                  {isLinked && (
                                    <Badge variant="secondary" className="text-xs">Linked</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {template.answer}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {templates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No templates available</p>
                      <p className="text-sm">Create templates in the "Manage Templates" dialog</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddCustomDialog} onOpenChange={setShowAddCustomDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Custom
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Custom FAQ</DialogTitle>
                  <DialogDescription>
                    Create a FAQ specific to this event
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="faq-question">Question *</Label>
                    <Input
                      id="faq-question"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq((prev) => ({ ...prev, question: e.target.value }))}
                      placeholder="e.g., What time does registration open?"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faq-answer">Answer *</Label>
                    <Textarea
                      id="faq-answer"
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq((prev) => ({ ...prev, answer: e.target.value }))}
                      placeholder="The answer to the question..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="faq-category">Category</Label>
                    <Input
                      id="faq-category"
                      value={newFaq.category}
                      onChange={(e) => setNewFaq((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Registration, Logistics"
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddCustomDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createCustomFaq}
                    disabled={saving || !newFaq.question || !newFaq.answer}
                  >
                    {saving ? "Creating..." : "Add FAQ"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {customFaqs.length === 0 && linkedFaqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No FAQs yet</p>
            <p className="text-sm">Link templates or add custom FAQs for this event</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                All ({customFaqs.length + linkedFaqs.length})
              </TabsTrigger>
              <TabsTrigger value="linked">
                From Templates ({linkedFaqs.length})
              </TabsTrigger>
              <TabsTrigger value="custom">
                Custom ({customFaqs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2">
              {/* Linked FAQs */}
              {linkedFaqs.map((link) => (
                <FaqItem
                  key={`link-${link.id}`}
                  id={link.id}
                  question={link.question_override || link.template.question}
                  answer={link.answer_override || link.template.answer}
                  category={link.template.category}
                  isTemplate={true}
                  isExpanded={expandedFaqs.has(`link-${link.id}`)}
                  onToggle={() => toggleFaq(`link-${link.id}`)}
                  onDelete={() => unlinkTemplate(link.id)}
                />
              ))}
              {/* Custom FAQs */}
              {customFaqs.map((faq) => (
                <FaqItem
                  key={`custom-${faq.id}`}
                  id={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  category={faq.category}
                  isTemplate={false}
                  isExpanded={expandedFaqs.has(`custom-${faq.id}`)}
                  onToggle={() => toggleFaq(`custom-${faq.id}`)}
                  onDelete={() => deleteCustomFaq(faq.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="linked" className="space-y-2">
              {linkedFaqs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No linked templates</p>
              ) : (
                linkedFaqs.map((link) => (
                  <FaqItem
                    key={`link-${link.id}`}
                    id={link.id}
                    question={link.question_override || link.template.question}
                    answer={link.answer_override || link.template.answer}
                    category={link.template.category}
                    isTemplate={true}
                    isExpanded={expandedFaqs.has(`link-${link.id}`)}
                    onToggle={() => toggleFaq(`link-${link.id}`)}
                    onDelete={() => unlinkTemplate(link.id)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-2">
              {customFaqs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No custom FAQs</p>
              ) : (
                customFaqs.map((faq) => (
                  <FaqItem
                    key={`custom-${faq.id}`}
                    id={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    category={faq.category}
                    isTemplate={false}
                    isExpanded={expandedFaqs.has(`custom-${faq.id}`)}
                    onToggle={() => toggleFaq(`custom-${faq.id}`)}
                    onDelete={() => deleteCustomFaq(faq.id)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

interface FaqItemProps {
  id: string
  question: string
  answer: string
  category: string | null
  isTemplate: boolean
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
}

function FaqItem({
  id,
  question,
  answer,
  category,
  isTemplate,
  isExpanded,
  onToggle,
  onDelete,
}: FaqItemProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="border rounded-lg">
        <div className="flex items-center gap-3 p-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{question}</span>
              {isTemplate && (
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Template
                </Badge>
              )}
              {category && (
                <Badge variant="secondary" className="text-xs">{category}</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onDelete}>
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
          <div className="px-3 pb-3 pt-0 border-t">
            <p className="text-sm text-muted-foreground pt-3 whitespace-pre-wrap">
              {answer}
            </p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
