"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  Save,
  Search,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SenderProfile } from "@/types/database"
import {
  type CampaignFormData as FormData,
  type EventOption,
  DEFAULT_FORM_DATA,
  HOURS,
  TONE_PRESETS,
  COMMON_SLOP,
  formatEventDateRange,
} from "@/components/campaigns/campaign-form-shared"

interface ContactResult {
  id: string
  first_name: string
  last_name: string
  email: string | null
  title: string | null
  seniority: string | null
  outreach_status: string
  company_id: string | null
  company: { id: string; name: string } | null
}

interface CompanyOption {
  id: string
  name: string
  category: string | null
  edge_categories: string[]
}

interface CategoryOption {
  slug: string
  name: string
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([])
  const [myProfileId, setMyProfileId] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({ ...DEFAULT_FORM_DATA })

  // Collapsible section states
  const [contextOpen, setContextOpen] = useState(false)
  const [pacingOpen, setPacingOpen] = useState(false)
  const [recipientsOpen, setRecipientsOpen] = useState(false)
  const [selectedTonePreset, setSelectedTonePreset] = useState<string | null>(null)
  const [expandedToneId, setExpandedToneId] = useState<string | null>(null)
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set())

  // Create sender dialog state
  const [showCreateSender, setShowCreateSender] = useState(false)
  const [newSenderForm, setNewSenderForm] = useState({
    name: "",
    email: "",
    title: "",
    phone: "",
    signature: "",
  })
  const [creatingSender, setCreatingSender] = useState(false)

  // Step 1: Company filter state
  const [companyCategory, setCompanyCategory] = useState("all")
  const [companyEdge, setCompanyEdge] = useState("all")
  const [companyEvent, setCompanyEvent] = useState("all")
  const [companySearch, setCompanySearch] = useState("")
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<Set<string>>(
    new Set()
  )

  // Step 2: Contact filter state
  const [contactSearch, setContactSearch] = useState("")
  const [contactNotWithin, setContactNotWithin] = useState("all")
  const [contactConverted, setContactConverted] = useState("all")
  const [contactCatchAll, setContactCatchAll] = useState("all")
  const [contactSeniority, setContactSeniority] = useState("all")
  const [contactTitleSearch, setContactTitleSearch] = useState("")
  const [contactHasEmail, setContactHasEmail] = useState(true)
  const [contactOutreachTimeRange, setContactOutreachTimeRange] = useState("all")
  const [contactAddedWithin, setContactAddedWithin] = useState("all")

  const [searchResults, setSearchResults] = useState<ContactResult[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set()
  )
  const [searchLoading, setSearchLoading] = useState(false)

  // Event company IDs for event filter
  const [eventCompanyIds, setEventCompanyIds] = useState<Set<string> | null>(
    null
  )

  // Filter option data
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [events, setEvents] = useState<EventOption[]>([])

  // Fetch sender profiles and auto-select logged-in user's profile
  useEffect(() => {
    async function loadProfiles() {
      try {
        const res = await fetch("/api/sender-profiles/me")
        if (res.ok) {
          const data = await res.json()
          setSenderProfiles(data.all_profiles || [])
          if (data.my_profile) {
            setMyProfileId(data.my_profile.id)
            setForm((prev) => ({
              ...prev,
              sender_profile_id: data.my_profile.id,
            }))
          } else if (data.all_profiles?.length > 0) {
            // Default to first profile if no match
            setForm((prev) => ({
              ...prev,
              sender_profile_id: data.all_profiles[0].id,
            }))
          }
        }
      } catch (err) {
        console.error("Failed to load sender profiles:", err)
      }
    }
    loadProfiles()
  }, [])

  // Load filter options for recipients card
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [companiesRes, categoriesRes, eventsRes] = await Promise.all([
          fetch("/api/companies?sort=name&order=asc"),
          fetch("/api/company-categories"),
          fetch("/api/events"),
        ])

        if (companiesRes.ok) {
          const data = await companiesRes.json()
          setCompanies(
            data.map(
              (c: {
                id: string
                name: string
                category: string | null
                edge_categories: string[] | null
              }) => ({
                id: c.id,
                name: c.name,
                category: c.category || null,
                edge_categories: c.edge_categories || [],
              })
            )
          )
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data)
        }
        if (eventsRes.ok) {
          const data = await eventsRes.json()
          setEvents(
            data.map((e: { id: string; name: string; start_date: string | null; end_date: string | null; city: string | null; state: string | null; slug: string | null; registration_url: string | null }) => ({
              id: e.id,
              name: e.name,
              start_date: e.start_date || null,
              end_date: e.end_date || null,
              city: e.city || null,
              state: e.state || null,
              slug: e.slug || null,
              registration_url: e.registration_url || null,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to load filter options:", err)
      }
    }
    loadFilterOptions()
  }, [])

  // Load event company IDs when event filter changes
  useEffect(() => {
    if (companyEvent === "all") {
      setEventCompanyIds(null)
      return
    }
    async function loadEventCompanies() {
      try {
        const res = await fetch(`/api/events/${companyEvent}/companies`)
        if (res.ok) {
          const data = await res.json()
          const ids = (data || []).map(
            (ec: { company_id: string }) => ec.company_id
          )
          setEventCompanyIds(new Set(ids))
        }
      } catch {
        setEventCompanyIds(null)
      }
    }
    loadEventCompanies()
  }, [companyEvent])

  // Step 1: Filter companies client-side
  const filteredCompanies = companies.filter((c) => {
    if (companySearch) {
      const q = companySearch.toLowerCase()
      if (!c.name.toLowerCase().includes(q)) return false
    }
    if (companyCategory !== "all" && c.category !== companyCategory) return false
    if (
      companyEdge !== "all" &&
      !c.edge_categories.includes(companyEdge)
    )
      return false
    if (eventCompanyIds && !eventCompanyIds.has(c.id)) return false
    return true
  })

  // Toggle company selection
  const toggleCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) => {
      const next = new Set(prev)
      if (next.has(companyId)) {
        next.delete(companyId)
      } else {
        next.add(companyId)
      }
      return next
    })
  }

  const toggleSelectAllCompanies = () => {
    if (selectedCompanyIds.size === filteredCompanies.length && filteredCompanies.length > 0) {
      setSelectedCompanyIds(new Set())
    } else {
      setSelectedCompanyIds(new Set(filteredCompanies.map((c) => c.id)))
    }
  }

  // Step 2: Search contacts for selected companies
  const searchContacts = useCallback(async () => {
    if (!recipientsOpen || selectedCompanyIds.size === 0) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      // Use POST to avoid HTTP 431 when many company IDs are selected
      const body: Record<string, unknown> = {
        company_ids: Array.from(selectedCompanyIds),
      }
      if (contactSearch) body.search = contactSearch
      if (contactNotWithin !== "all") body.not_within = contactNotWithin
      if (contactConverted !== "all") body.converted = contactConverted
      if (contactCatchAll !== "all") body.catch_all = contactCatchAll
      if (contactSeniority !== "all") body.seniority = contactSeniority
      if (contactTitleSearch) body.title_search = contactTitleSearch
      if (contactHasEmail) body.has_email = true
      if (contactOutreachTimeRange !== "all") body.outreach = contactOutreachTimeRange
      if (contactAddedWithin !== "all") body.added_within = contactAddedWithin

      const res = await fetch("/api/contacts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.contacts || [])
      } else {
        console.error("Contact search error:", res.status, await res.text())
        setSearchResults([])
      }
    } catch (err) {
      console.error("Contact search failed:", err)
    } finally {
      setSearchLoading(false)
    }
  }, [
    recipientsOpen,
    selectedCompanyIds,
    contactSearch,
    contactNotWithin,
    contactConverted,
    contactCatchAll,
    contactSeniority,
    contactTitleSearch,
    contactHasEmail,
    contactOutreachTimeRange,
    contactAddedWithin,
  ])

  useEffect(() => {
    const timeout = setTimeout(searchContacts, 300)
    return () => clearTimeout(timeout)
  }, [searchContacts])

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Toggle contact selection
  const toggleContact = (contactId: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev)
      if (next.has(contactId)) {
        next.delete(contactId)
      } else {
        next.add(contactId)
      }
      return next
    })
  }

  const availableContacts = searchResults.filter((c) => c.email)

  const toggleSelectAllContacts = () => {
    if (selectedContactIds.size === availableContacts.length) {
      setSelectedContactIds(new Set())
    } else {
      setSelectedContactIds(new Set(availableContacts.map((c) => c.id)))
    }
  }

  // Create sender profile inline
  const handleCreateSender = async () => {
    if (!newSenderForm.name || !newSenderForm.email) return
    setCreatingSender(true)

    // Auto-generate signature if blank
    let signature = newSenderForm.signature
    if (!signature) {
      const lines = [newSenderForm.name]
      if (newSenderForm.title) lines.push(newSenderForm.title)
      if (newSenderForm.phone) lines.push(newSenderForm.phone)
      lines.push("bioedgelongevity.com")
      signature = lines.join("\n")
    }

    try {
      const res = await fetch("/api/sender-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSenderForm.name,
          email: newSenderForm.email,
          title: newSenderForm.title || null,
          phone: newSenderForm.phone || null,
          signature,
        }),
      })

      if (res.ok) {
        const profile = await res.json()
        setSenderProfiles((prev) => [...prev, profile])
        updateField("sender_profile_id", profile.id)
        setShowCreateSender(false)
        setNewSenderForm({
          name: "",
          email: "",
          title: "",
          phone: "",
          signature: "",
        })
      }
    } catch (err) {
      console.error("Failed to create sender:", err)
    } finally {
      setCreatingSender(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const body = {
        ...form,
        event_ids: Array.from(selectedEventIds),
        tone: form.tone || null,
        must_include: form.must_include || null,
        must_avoid: form.must_avoid || null,
        call_to_action: form.call_to_action || null,
        reply_to: form.reply_to || null,
        subject_prompt: form.subject_prompt || null,
        context: form.context || null,
        reference_email: form.reference_email || null,
        sender_profile_id: form.sender_profile_id || null,
      }

      // Step 1: Create campaign
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create campaign")
      }

      const campaign = await res.json()

      // Step 2: Add selected recipients (if any)
      if (selectedContactIds.size > 0) {
        await fetch(`/api/campaigns/${campaign.id}/recipients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact_ids: Array.from(selectedContactIds),
          }),
        })
      }

      // Step 3: Redirect to campaign detail
      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
          <p className="text-muted-foreground">
            Configure your email campaign and AI content generation settings.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Card 1: Campaign Basics */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Basics</CardTitle>
            <CardDescription>
              Define the core purpose and ask for this campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder='e.g. "Longevity Summit 2026 Outreach"'
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>

            {/* Event Selector */}
            <div className="space-y-2">
              <Label>Events</Label>
              <p className="text-xs text-muted-foreground">
                Which event(s) is this campaign promoting? The AI will reference these naturally in emails.
              </p>
              {events.length > 0 ? (
                <div className="rounded-md border max-h-[200px] overflow-y-auto">
                  {events.map((event) => {
                    const isChecked = selectedEventIds.has(event.id)
                    return (
                      <label
                        key={event.id}
                        className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer border-b last:border-b-0 transition-colors ${
                          isChecked ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => {
                            setSelectedEventIds((prev) => {
                              const next = new Set(prev)
                              if (next.has(event.id)) {
                                next.delete(event.id)
                              } else {
                                next.add(event.id)
                              }
                              return next
                            })
                          }}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{event.name}</div>
                          {(event.start_date || event.city) && (
                            <div className="text-xs text-muted-foreground">
                              {formatEventDateRange(event.start_date, event.end_date)}
                              {event.city && (
                                <span>
                                  {event.start_date ? " · " : ""}
                                  {event.city}{event.state ? `, ${event.state}` : ""}
                                </span>
                              )}
                            </div>
                          )}
                          {event.slug && (
                            <div className="text-xs text-muted-foreground truncate">
                              bioedgelongevity.com/{event.slug}
                            </div>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No events found.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="What is this campaign about? What's the goal? e.g. 'Invite supplement companies to exhibit at Longevity Summit 2026'"
                value={form.purpose}
                onChange={(e) => updateField("purpose", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="call_to_action">Call to Action</Label>
              <Input
                id="call_to_action"
                placeholder='e.g. "Book a 15-min call" or "Visit our exhibitor page at [URL]"'
                value={form.call_to_action}
                onChange={(e) => updateField("call_to_action", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                What should each email ask the recipient to do?
              </p>
            </div>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="h-3 w-3" />
                How the AI uses this
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-3 font-mono">
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Purpose becomes:</p>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Campaign Purpose{"\n\n"}{form.purpose || "(your purpose text)"}</p>
                  </div>
                  {form.call_to_action && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Call to Action becomes:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Call to Action{"\n\n"}Every email must end with or naturally include this ask: {form.call_to_action}</p>
                    </div>
                  )}
                  {selectedEventIds.size > 0 && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Selected events become:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Campaign Events{"\n\n"}This campaign is promoting the following event(s). Reference them naturally in the email when relevant:{"\n"}{events
                        .filter((e) => selectedEventIds.has(e.id))
                        .map((e) => {
                          const parts = [e.name]
                          const dateStr = formatEventDateRange(e.start_date, e.end_date)
                          if (dateStr) parts.push(dateStr)
                          if (e.city) parts.push(e.city + (e.state ? `, ${e.state}` : ""))
                          const url = e.slug ? `https://bioedgelongevity.com/${e.slug}` : e.registration_url
                          if (url) parts.push(url)
                          return `- ${parts.join(" | ")}`
                        })
                        .join("\n")}</p>
                    </div>
                  )}
                  <p className="text-amber-600 dark:text-amber-400 italic">These are injected into the AI system prompt for every email in this campaign.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Card 2: Voice & Tone */}
        <Card>
          <CardHeader>
            <CardTitle>Voice & Tone</CardTitle>
            <CardDescription>
              The AI writes in the bioEDGE voice by default. Pick an email
              type below to layer on additional tone guidance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted/50 px-4 py-3 text-sm space-y-2">
              <p className="font-medium">Default bioEDGE voice (always active):</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-xs">
                <li><strong>Grounded, not breathless</strong> — skeptical of hype, evidence-informed</li>
                <li><strong>Direct, not clinical</strong> — write for smart people, no jargon</li>
                <li><strong>Aspirational, not fear-based</strong> — sell vision, not problems</li>
                <li><strong>No fake familiarity</strong> — never pretend to know them or &ldquo;follow their work&rdquo;</li>
                <li>No em dashes, no emojis, no superlatives, no hype words</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label>Email Type <span className="font-normal text-muted-foreground">(supplements the defaults above)</span></Label>
              <div className="space-y-2">
                {TONE_PRESETS.map((preset) => {
                  const isSelected = selectedTonePreset === preset.id
                  const isExpanded = expandedToneId === preset.id
                  return (
                    <div
                      key={preset.id}
                      className={`rounded-md border transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTonePreset(null)
                              setExpandedToneId(null)
                              updateField("tone", "")
                            } else {
                              setSelectedTonePreset(preset.id)
                              setExpandedToneId(preset.id)
                              updateField("tone", preset.prompt)
                            }
                          }}
                          className="flex-1 px-3 py-2.5 text-left"
                        >
                          <div className="font-medium text-xs">{preset.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {preset.description}
                          </div>
                        </button>
                        {preset.id !== "custom" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedToneId(isExpanded ? null : preset.id)
                            }}
                            className="px-2 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            title="Show AI instructions"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {preset.id !== "custom" && isExpanded && (
                        <div className="px-3 pb-3 border-t border-border/50 mt-0">
                          <div className="mt-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2 text-xs">
                            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">AI instructions for this email type:</p>
                            <p className="text-amber-700 dark:text-amber-300 leading-relaxed">{preset.prompt}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Optional. Adds tone guidance on top of the bioEDGE voice. Click the <Eye className="inline h-3 w-3 mx-0.5" /> icon to see the exact AI instructions. Leave unselected to use defaults only.
              </p>
            </div>

            {selectedTonePreset === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="tone">Custom Tone Instructions</Label>
                <Textarea
                  id="tone"
                  placeholder={"Describe the tone you want. Examples:\n• \"Like texting a colleague you respect\"\n• \"Formal but warm, for hospital executives\"\n• \"Matter-of-fact, no small talk\""}
                  value={form.tone}
                  onChange={(e) => updateField("tone", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Whatever you write here is sent directly to the AI as tone guidance.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="must_include">Must Include</Label>
              <Textarea
                id="must_include"
                placeholder='Exact phrases, dates, URLs, or facts that MUST appear in every email. e.g. "June 12-14, 2026 in Austin, TX"'
                value={form.must_include}
                onChange={(e) => updateField("must_include", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_words">Target Word Count</Label>
              <Input
                id="max_words"
                type="number"
                min={50}
                max={500}
                value={form.max_words}
                onChange={(e) =>
                  updateField("max_words", parseInt(e.target.value) || 100)
                }
                className="w-32"
              />
              <p className="text-xs text-muted-foreground">
                Shorter is more personal. Default: 100 words.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_email">Reference Email</Label>
              <Textarea
                id="reference_email"
                placeholder="Paste a sample email that represents the style and tone you want. The AI will use it as a guide — matching the cadence, structure, and feel — without copying it."
                value={form.reference_email}
                onChange={(e) => updateField("reference_email", e.target.value)}
                rows={6}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Optional. The AI studies this for voice and structure, then writes something original.
                It won&apos;t copy sentences — it learns the rhythm.
              </p>
            </div>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="h-3 w-3" />
                How the AI uses this
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-3 font-mono">
                  {form.tone && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Tone becomes:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Writing Tone{"\n\n"}{form.tone}</p>
                      <p className="text-amber-600 dark:text-amber-400 mt-1 italic font-sans">Then the bioEDGE voice guidelines follow as &quot;Background Voice Reference (adapt to the tone above)&quot;</p>
                    </div>
                  )}
                  {!form.tone && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">No tone override:</p>
                      <p className="text-amber-600 dark:text-amber-400 italic font-sans">The AI uses the default bioEDGE voice guidelines as its primary writing style.</p>
                    </div>
                  )}
                  {form.must_include && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Must Include becomes:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## MUST Include (verbatim){"\n\n"}The following must appear exactly as written somewhere in the email:{"\n"}{form.must_include}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Word limit becomes:</p>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Word Limit{"\n\n"}Keep the email body under {form.max_words} words. Shorter is better. This should feel like a quick personal note, not a marketing email.</p>
                  </div>
                  {form.reference_email && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Reference email becomes:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Reference Email (style guide — do NOT copy){"\n\n"}Study this email for voice, cadence, structure, and tone. Match its feel but write something completely original. Do NOT reuse sentences, phrases, or the same opening/closing patterns:{"\n\n"}{form.reference_email}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Card 3: Never Say */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Never Say the Following</CardTitle>
            <CardDescription>
              Words and phrases the AI must never use in any email. These are
              hard-banned — the AI will not include them regardless of context.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-destructive/5 border border-destructive/20 px-4 py-3 text-xs text-muted-foreground">
              <p>
                One word or phrase per line. The AI treats these as absolute
                blacklist items — they won&apos;t appear in subject lines or body
                text.
              </p>
            </div>
            <Textarea
              id="must_avoid"
              placeholder={"unlock\ngroundbreaking\nunleash\nrevolutionary\ncutting-edge\ngame-changing\nsynergy\nleverage\nDon't mention pricing\nDon't reference competitors"}
              value={form.must_avoid}
              onChange={(e) => updateField("must_avoid", e.target.value)}
              rows={5}
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const existing = form.must_avoid.toLowerCase().split("\n").map(l => l.trim()).filter(Boolean)
                const toAdd = COMMON_SLOP.filter(w => !existing.includes(w.toLowerCase()))
                if (toAdd.length === 0) return
                const separator = form.must_avoid.trim() ? "\n" : ""
                updateField("must_avoid", form.must_avoid.trim() + separator + toAdd.join("\n"))
              }}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add common slop words
            </Button>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="h-3 w-3" />
                How the AI uses this
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-2 font-mono">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">Your banned words become:</p>
                  <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## BANNED Words &amp; Phrases (Hard Blacklist){"\n\n"}The following words and phrases are ABSOLUTELY FORBIDDEN. Do not use them in the subject line or email body under any circumstances — not even paraphrased or as part of a longer phrase:{"\n\n"}{form.must_avoid || "(your banned words)"}{"\n\n"}If you catch yourself writing any of these, rewrite the sentence completely.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Card 4: Sender */}
        <Card>
          <CardHeader>
            <CardTitle>Sender</CardTitle>
            <CardDescription>
              Who the email comes from. Replies go to their real inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sender_profile_id">Sender Profile</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    value={form.sender_profile_id}
                    onValueChange={(value) =>
                      updateField("sender_profile_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender..." />
                    </SelectTrigger>
                    <SelectContent>
                      {senderProfiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name} ({profile.email})
                          {profile.id === myProfileId ? " — You" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCreateSender(true)}
                  title="Create new sender profile"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply_to">Reply-To Override</Label>
              <Input
                id="reply_to"
                type="email"
                placeholder="Leave blank to use sender profile email"
                value={form.reply_to}
                onChange={(e) => updateField("reply_to", e.target.value)}
              />
            </div>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="h-3 w-3" />
                How the AI uses this
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-2 font-mono">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">The sender profile becomes:</p>
                  <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## You Are Writing As{"\n\n"}Name: {(() => { const p = senderProfiles.find(s => s.id === form.sender_profile_id); return p?.name || "(selected sender)"; })()}{"\n"}Title: {(() => { const p = senderProfiles.find(s => s.id === form.sender_profile_id); return p?.title || "bioEDGE Longevity team"; })()}{"\n\n"}Write the email body only. Do NOT include a signature block (that gets appended separately). You may use the sender&apos;s first name for a casual sign-off.</p>
                  <p className="text-amber-600 dark:text-amber-400 italic font-sans">The sender&apos;s signature is appended to every email after the AI writes the body. The &quot;from&quot; address and reply-to are set on the email envelope, not in the AI prompt.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Card 5: Subject Line */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Line</CardTitle>
            <CardDescription>
              The subject line decides whether the email gets opened. The
              AI defaults to short, casual, personalized subjects. Add
              extra guidance below if needed — it gets merged with the defaults.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted/50 px-4 py-3 text-sm space-y-2">
              <p className="font-medium">Default AI behavior (always active):</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-xs">
                <li>Short (3–6 words), lowercase okay, no punctuation tricks, no emojis</li>
                <li>References their company name or role when natural</li>
                <li>Feels like a real person wrote it — not a template</li>
                <li>Avoids generic patterns like &ldquo;Partnership opportunity&rdquo; or &ldquo;Quick question&rdquo;</li>
                <li>Each recipient gets a unique subject — no batch feel</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject_prompt">Additional Subject Line Guidance</Label>
              <Textarea
                id="subject_prompt"
                placeholder="Leave blank to use defaults only. Examples:&#10;• &quot;Mention NYC July 10-11 when natural&quot;&#10;• &quot;Always mention their company name&quot;&#10;• &quot;Reference the Longevity Summit by name&quot;&#10;• &quot;Ask a question in the subject line&quot;"
                value={form.subject_prompt}
                onChange={(e) =>
                  updateField("subject_prompt", e.target.value)
                }
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                These get added on top of the defaults above, not instead of them.
              </p>
            </div>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="h-3 w-3" />
                How the AI uses this
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-2 font-mono">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">The AI always receives these subject line rules:</p>
                  <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Subject Line Style{"\n\n"}{form.subject_prompt ? "Core rules (always apply):" : ""}{"\n"}- 3-6 words ideal. Shorter subjects get higher open rates.{"\n"}- Lowercase is fine, it feels more personal and less like marketing.{"\n"}- Reference their company name, role, or something specific to them when natural.{"\n"}- Must feel like one human writing to another, not a campaign.{"\n"}- NEVER use: &quot;Quick question&quot;, &quot;Partnership opportunity&quot;, &quot;Exciting news&quot;, &quot;Touching base&quot;, or any pattern that screams mass email.{"\n"}- NEVER use clickbait, ALL CAPS words, exclamation marks, or emojis. Zero emojis, ever.{"\n"}- Each recipient MUST get a unique subject line. No two should follow the same template.{"\n"}- Good examples: &quot;your work on NAD+&quot;, &quot;re: longevity summit&quot;, &quot;CompanyName + bioedge&quot;{"\n"}- Bad examples: &quot;Quick question for you&quot;, &quot;Exciting opportunity&quot;, &quot;Let&apos;s connect!&quot;</p>
                  {form.subject_prompt && (
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200 mt-2 mb-1">Your additional guidance is appended:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">Additional style instructions from campaign creator:{"\n"}{form.subject_prompt}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Card 6: Recipients — Two-Step Flow */}
        <Collapsible open={recipientsOpen} onOpenChange={setRecipientsOpen}>
          <Card>
            <CollapsibleTrigger className="w-full text-left">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Recipients
                    {selectedCompanyIds.size > 0 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {selectedCompanyIds.size} {selectedCompanyIds.size === 1 ? "company" : "companies"}
                      </Badge>
                    )}
                    {selectedContactIds.size > 0 && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {selectedContactIds.size} {selectedContactIds.size === 1 ? "contact" : "contacts"}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedContactIds.size > 0
                      ? `${selectedContactIds.size} contacts from ${selectedCompanyIds.size} companies will be added.`
                      : "Filter companies first, then select contacts to include."}
                  </CardDescription>
                </div>
                {recipientsOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="h-3 w-3" />
                    How the AI uses recipient data
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-2">
                      <p className="font-semibold text-amber-800 dark:text-amber-200">Each recipient gets a separate AI call with their personal context:</p>
                      <div className="text-amber-700 dark:text-amber-300 leading-relaxed font-mono whitespace-pre-wrap">Write a personalized email to this person:{"\n\n"}**Contact:**{"\n"}- Name: (first + last){"\n"}- Title: (if known){"\n"}- Seniority: (if known){"\n"}- Known expertise: (from AI research){"\n"}- Outreach suggestions: (from AI research){"\n\n"}**Their Company:**{"\n"}- Category, description, differentiators{"\n"}- Why they fit bioEDGE{"\n"}- Events attended{"\n"}- Biological systems served{"\n"}- Previous warm pitch draft (for reference, NOT copied)</div>
                      <p className="text-amber-600 dark:text-amber-400 italic">50 recipients = 50 separate Claude API calls. Every email is written fresh, not templated.</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* ── Step 1: Filter & Select Companies ── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-4 w-4" />
                    Step 1: Select Companies
                  </div>

                  {/* Company filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Search Companies</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Company name..."
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Category</Label>
                      <Select
                        value={companyCategory}
                        onValueChange={setCompanyCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.slug} value={c.slug}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">EDGE Includes</Label>
                      <Select
                        value={companyEdge}
                        onValueChange={setCompanyEdge}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="eliminate">Eliminate</SelectItem>
                          <SelectItem value="decode">Decode</SelectItem>
                          <SelectItem value="gain">Gain</SelectItem>
                          <SelectItem value="execute">Execute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Event</Label>
                      <Select
                        value={companyEvent}
                        onValueChange={setCompanyEvent}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Events" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Events</SelectItem>
                          {events.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company results */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {filteredCompanies.length} companies match
                      {selectedCompanyIds.size > 0 &&
                        ` · ${selectedCompanyIds.size} selected`}
                    </div>
                    {filteredCompanies.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleSelectAllCompanies}
                      >
                        <Building2 className="mr-1 h-3 w-3" />
                        {selectedCompanyIds.size === filteredCompanies.length
                          ? "Deselect All"
                          : `Select All (${filteredCompanies.length})`}
                      </Button>
                    )}
                  </div>

                  {filteredCompanies.length > 0 ? (
                    <div className="rounded-md border max-h-[250px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40px]">
                              <Checkbox
                                checked={
                                  filteredCompanies.length > 0 &&
                                  selectedCompanyIds.size ===
                                    filteredCompanies.length
                                }
                                onCheckedChange={toggleSelectAllCompanies}
                              />
                            </TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>EDGE</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCompanies.map((company) => (
                            <TableRow key={company.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedCompanyIds.has(company.id)}
                                  onCheckedChange={() =>
                                    toggleCompany(company.id)
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-medium text-sm">
                                {company.name}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {company.category || "—"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {company.edge_categories.length > 0 ? (
                                  <div className="flex gap-1 flex-wrap">
                                    {company.edge_categories.map((ec) => (
                                      <Badge
                                        key={ec}
                                        variant="outline"
                                        className="text-xs capitalize"
                                      >
                                        {ec}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No companies match your filters.
                    </div>
                  )}
                </div>

                {/* ── Step 2: Filter & Select Contacts ── */}
                {selectedCompanyIds.size > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Users className="h-4 w-4" />
                      Step 2: Select Contacts
                    </div>

                    {/* Contact filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="space-y-1 lg:col-span-2">
                        <Label className="text-xs">Search Contacts</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Name or email..."
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Not Contacted Within</Label>
                        <Select
                          value={contactNotWithin}
                          onValueChange={setContactNotWithin}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="7d">7 Days</SelectItem>
                            <SelectItem value="30d">30 Days</SelectItem>
                            <SelectItem value="90d">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Converted</Label>
                        <Select
                          value={contactConverted}
                          onValueChange={setContactConverted}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="only">Converted Only</SelectItem>
                            <SelectItem value="exclude">Exclude Converted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Catch-All</Label>
                        <Select
                          value={contactCatchAll}
                          onValueChange={setContactCatchAll}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="only">Catch-All Only</SelectItem>
                            <SelectItem value="exclude">Exclude Catch-All</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Last Outreach</Label>
                        <Select
                          value={contactOutreachTimeRange}
                          onValueChange={setContactOutreachTimeRange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Time</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="7d">Within 7 Days</SelectItem>
                            <SelectItem value="30d">Within 30 Days</SelectItem>
                            <SelectItem value="90d">Within 90 Days</SelectItem>
                            <SelectItem value="90d_plus">90+ Days Ago</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Seniority</Label>
                        <Select
                          value={contactSeniority}
                          onValueChange={setContactSeniority}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="c_level">C-Level</SelectItem>
                            <SelectItem value="executive">
                              Executive / VP
                            </SelectItem>
                            <SelectItem value="director">Director</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Title Contains</Label>
                        <Input
                          placeholder='"CEO", "Marketing"'
                          value={contactTitleSearch}
                          onChange={(e) =>
                            setContactTitleSearch(e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Added Within</Label>
                        <Select
                          value={contactAddedWithin}
                          onValueChange={setContactAddedWithin}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Time</SelectItem>
                            <SelectItem value="1d">Last 1 Day</SelectItem>
                            <SelectItem value="2d">Last 2 Days</SelectItem>
                            <SelectItem value="3d">Last 3 Days</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end pb-1 gap-2">
                        <Switch
                          checked={contactHasEmail}
                          onCheckedChange={setContactHasEmail}
                          id="has-email-new"
                        />
                        <Label htmlFor="has-email-new" className="text-xs">
                          Has email only
                        </Label>
                      </div>
                    </div>

                    {/* Contact results header */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {searchLoading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Searching...
                          </span>
                        ) : (
                          <>
                            {searchResults.length} contacts found
                            {availableContacts.length !==
                              searchResults.length &&
                              ` (${availableContacts.length} with email)`}
                          </>
                        )}
                      </div>
                      {availableContacts.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={toggleSelectAllContacts}
                        >
                          <Users className="mr-1 h-3 w-3" />
                          {selectedContactIds.size ===
                          availableContacts.length
                            ? "Deselect All"
                            : `Select All (${availableContacts.length})`}
                        </Button>
                      )}
                    </div>

                    {/* Contact results table */}
                    {searchResults.length > 0 ? (
                      <div className="rounded-md border max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[40px]">
                                <Checkbox
                                  checked={
                                    availableContacts.length > 0 &&
                                    selectedContactIds.size ===
                                      availableContacts.length
                                  }
                                  onCheckedChange={toggleSelectAllContacts}
                                />
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Company</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {searchResults.map((contact) => {
                              const noEmail = !contact.email
                              return (
                                <TableRow
                                  key={contact.id}
                                  className={noEmail ? "opacity-40" : ""}
                                >
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedContactIds.has(
                                        contact.id
                                      )}
                                      onCheckedChange={() =>
                                        toggleContact(contact.id)
                                      }
                                      disabled={noEmail}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium text-sm">
                                    {contact.first_name} {contact.last_name}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {contact.company?.name || "—"}
                                  </TableCell>
                                  <TableCell className="text-sm max-w-[150px] truncate">
                                    {contact.title || "—"}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {contact.email || (
                                      <span className="text-destructive text-xs">
                                        No email
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      !searchLoading && (
                        <div className="text-center py-4">
                          <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No contacts found at the selected companies.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                {selectedCompanyIds.size === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground border-t pt-4">
                    Select companies above to see their contacts.
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Card 7: AI Guardrails (collapsed by default) */}
        <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
          <Card>
            <CollapsibleTrigger className="w-full text-left">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>AI Guardrails</CardTitle>
                  <CardDescription>
                    Context the AI needs to write well — but must NEVER say
                    in the email.
                  </CardDescription>
                </div>
                {contextOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="rounded-md bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
                  <p>
                    Everything here is invisible to the recipient. Use it to
                    give the AI situational awareness so emails feel informed
                    without leaking strategy.
                  </p>
                </div>
                <Textarea
                  id="context"
                  placeholder={"Examples of what to put here:\n\u2022 \"We met several of these companies at Biohacking Conference 2025\"\n\u2022 \"We're trying to grow our exhibitor base \u2014 don't mention this\"\n\u2022 \"Some contacts were warm leads from Peter's network\"\n\u2022 \"Don't reference pricing or discounts in the first email\""}
                  value={form.context}
                  onChange={(e) => updateField("context", e.target.value)}
                  rows={4}
                />

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="h-3 w-3" />
                    How the AI uses this
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-2 font-mono">
                      <p className="font-semibold text-amber-800 dark:text-amber-200">Your guardrails become:</p>
                      <p className="text-amber-700 dark:text-amber-300 leading-relaxed whitespace-pre-wrap">## Background Context (DO NOT say any of this in the email){"\n\n"}This is context for you to understand the situation, but none of this should appear in the email:{"\n"}{form.context || "(your guardrails text)"}</p>
                      <p className="text-amber-600 dark:text-amber-400 italic font-sans">The AI reads this for situational awareness but is explicitly told never to mention any of it in the email.</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Card 8: Send Pacing (collapsed by default) */}
        <Collapsible open={pacingOpen} onOpenChange={setPacingOpen}>
          <Card>
            <CollapsibleTrigger className="w-full text-left">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Send Pacing</CardTitle>
                  <CardDescription>
                    Control when and how fast emails are sent.
                  </CardDescription>
                </div>
                {pacingOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Send Window Start (EST)</Label>
                    <Select
                      value={form.send_window_start.toString()}
                      onValueChange={(v) =>
                        updateField("send_window_start", parseInt(v))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((h) => (
                          <SelectItem key={h.value} value={h.value}>
                            {h.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Send Window End (EST)</Label>
                    <Select
                      value={form.send_window_end.toString()}
                      onValueChange={(v) =>
                        updateField("send_window_end", parseInt(v))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((h) => (
                          <SelectItem key={h.value} value={h.value}>
                            {h.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Delay (seconds)</Label>
                    <Input
                      type="number"
                      min={30}
                      max={600}
                      value={form.min_delay_seconds}
                      onChange={(e) =>
                        updateField(
                          "min_delay_seconds",
                          parseInt(e.target.value) || 120
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum gap between sends. Default: 120s (2 min)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Delay (seconds)</Label>
                    <Input
                      type="number"
                      min={60}
                      max={1800}
                      value={form.max_delay_seconds}
                      onChange={(e) =>
                        updateField(
                          "max_delay_seconds",
                          parseInt(e.target.value) || 300
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum gap between sends. Default: 300s (5 min)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Daily Send Limit</Label>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    value={form.daily_send_limit}
                    onChange={(e) =>
                      updateField(
                        "daily_send_limit",
                        parseInt(e.target.value) || 50
                      )
                    }
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max emails per day. Default: 50.
                  </p>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="h-3 w-3" />
                    How this works
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 px-4 py-3 text-xs space-y-2">
                      <p className="font-semibold text-amber-800 dark:text-amber-200">These settings control the send engine, not the AI:</p>
                      <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1">
                        <li>Emails are sent one at a time with a random delay between <strong>{form.min_delay_seconds}s</strong> and <strong>{form.max_delay_seconds}s</strong></li>
                        <li>Sending only happens between <strong>{form.send_window_start === 0 ? 12 : form.send_window_start > 12 ? form.send_window_start - 12 : form.send_window_start}:00 {form.send_window_start < 12 ? "AM" : "PM"}</strong> and <strong>{form.send_window_end === 0 ? 12 : form.send_window_end > 12 ? form.send_window_end - 12 : form.send_window_end}:00 {form.send_window_end < 12 ? "AM" : "PM"}</strong> EST</li>
                        <li>Maximum <strong>{form.daily_send_limit}</strong> emails per day. If there are more recipients, sending continues the next day.</li>
                        <li>This mimics human sending patterns to avoid spam filters</li>
                      </ul>
                      <p className="text-amber-600 dark:text-amber-400 italic">None of these settings affect the AI or email content. They only control delivery timing.</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving
              ? "Creating..."
              : selectedContactIds.size > 0
                ? `Create Campaign with ${selectedContactIds.size} Recipients`
                : "Create Campaign"}
          </Button>
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/campaigns">Cancel</Link>
          </Button>
        </div>
      </form>

      {/* Create Sender Profile Dialog */}
      <Dialog open={showCreateSender} onOpenChange={setShowCreateSender}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sender Profile</DialogTitle>
            <DialogDescription>
              Add a new email sender identity for this campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-sender-name">Name *</Label>
                <Input
                  id="new-sender-name"
                  value={newSenderForm.name}
                  onChange={(e) =>
                    setNewSenderForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Sandy Martin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sender-email">Email *</Label>
                <Input
                  id="new-sender-email"
                  type="email"
                  value={newSenderForm.email}
                  onChange={(e) =>
                    setNewSenderForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="sandy@bioedgelongevity.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-sender-title">Title</Label>
                <Input
                  id="new-sender-title"
                  value={newSenderForm.title}
                  onChange={(e) =>
                    setNewSenderForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Founder, bioEDGE Longevity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sender-phone">Phone</Label>
                <Input
                  id="new-sender-phone"
                  value={newSenderForm.phone}
                  onChange={(e) =>
                    setNewSenderForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="321-276-4752"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-sender-signature">Email Signature</Label>
              <Textarea
                id="new-sender-signature"
                value={newSenderForm.signature}
                onChange={(e) =>
                  setNewSenderForm((prev) => ({
                    ...prev,
                    signature: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Leave blank to auto-generate from name, title, and phone"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateSender(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSender}
              disabled={
                creatingSender ||
                !newSenderForm.name ||
                !newSenderForm.email
              }
            >
              {creatingSender ? "Creating..." : "Create Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
