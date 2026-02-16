"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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

export default function EditCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [campaignStatus, setCampaignStatus] = useState<string>("draft")
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([])
  const [myProfileId, setMyProfileId] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({ ...DEFAULT_FORM_DATA })

  // Collapsible section states
  const [contextOpen, setContextOpen] = useState(false)
  const [pacingOpen, setPacingOpen] = useState(false)
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

  // Events data
  const [events, setEvents] = useState<EventOption[]>([])

  // Determine if only pacing fields are editable (post-generation campaigns)
  const pacingOnly = ["ready", "paused", "sending"].includes(campaignStatus)

  // Fetch campaign data and populate form
  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`)
        if (!res.ok) {
          router.push(`/dashboard/campaigns/${campaignId}`)
          return
        }
        const campaign = await res.json()

        // Redirect if campaign can't be edited
        if (["generating", "completed"].includes(campaign.status)) {
          router.push(`/dashboard/campaigns/${campaignId}`)
          return
        }

        setCampaignStatus(campaign.status)
        setForm({
          name: campaign.name || "",
          purpose: campaign.purpose || "",
          call_to_action: campaign.call_to_action || "",
          tone: campaign.tone || "",
          must_include: campaign.must_include || "",
          must_avoid: campaign.must_avoid || "",
          max_words: campaign.max_words || 100,
          sender_profile_id: campaign.sender_profile_id || "",
          reply_to: campaign.reply_to || "",
          subject_prompt: campaign.subject_prompt || "",
          context: campaign.context || "",
          reference_email: campaign.reference_email || "",
          send_window_start: campaign.send_window_start ?? 9,
          send_window_end: campaign.send_window_end ?? 17,
          min_delay_seconds: campaign.min_delay_seconds ?? 120,
          max_delay_seconds: campaign.max_delay_seconds ?? 300,
          daily_send_limit: campaign.daily_send_limit ?? 50,
        })

        // Populate event selections
        if (campaign.campaign_events) {
          const eventIds = campaign.campaign_events.map(
            (ce: { event_id: string }) => ce.event_id
          )
          setSelectedEventIds(new Set(eventIds))
        }

        // Detect tone preset
        if (campaign.tone) {
          const matchingPreset = TONE_PRESETS.find((p) => p.prompt === campaign.tone)
          if (matchingPreset) {
            setSelectedTonePreset(matchingPreset.id)
          } else {
            setSelectedTonePreset("custom")
          }
        }
      } catch (err) {
        console.error("Failed to load campaign:", err)
        router.push(`/dashboard/campaigns/${campaignId}`)
      } finally {
        setLoading(false)
      }
    }
    loadCampaign()
  }, [campaignId, router])

  // Fetch sender profiles
  useEffect(() => {
    async function loadProfiles() {
      try {
        const res = await fetch("/api/sender-profiles/me")
        if (res.ok) {
          const data = await res.json()
          setSenderProfiles(data.all_profiles || [])
          if (data.my_profile) {
            setMyProfileId(data.my_profile.id)
          }
        }
      } catch (err) {
        console.error("Failed to load sender profiles:", err)
      }
    }
    loadProfiles()
  }, [])

  // Fetch events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events")
        if (res.ok) {
          const data = await res.json()
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
        console.error("Failed to load events:", err)
      }
    }
    loadEvents()
  }, [])

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Create sender profile inline
  const handleCreateSender = async () => {
    if (!newSenderForm.name || !newSenderForm.email) return
    setCreatingSender(true)

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
      const body: Record<string, unknown> = pacingOnly
        ? {
            send_window_start: form.send_window_start,
            send_window_end: form.send_window_end,
            min_delay_seconds: form.min_delay_seconds,
            max_delay_seconds: form.max_delay_seconds,
            daily_send_limit: form.daily_send_limit,
          }
        : {
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

      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save campaign")
      }

      router.push(`/dashboard/campaigns/${campaignId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/campaigns/${campaignId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {pacingOnly ? "Edit Send Pacing" : "Edit Campaign"}
          </h1>
          <p className="text-muted-foreground">
            {pacingOnly
              ? "Emails have been generated. Only send pacing can be changed."
              : "Update campaign settings. Recipients are managed from the campaign page."}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Only show content cards for draft campaigns */}
        {!pacingOnly && (
          <>
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
                    placeholder="What is this campaign about? What's the goal?"
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
                    Optional. Adds tone guidance on top of the bioEDGE voice. Click the <Eye className="inline h-3 w-3 mx-0.5" /> icon to see the exact AI instructions.
                  </p>
                </div>

                {selectedTonePreset === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="tone">Custom Tone Instructions</Label>
                    <Textarea
                      id="tone"
                      placeholder={"Describe the tone you want. Examples:\n• \"Like texting a colleague you respect\"\n• \"Formal but warm, for hospital executives\""}
                      value={form.tone}
                      onChange={(e) => updateField("tone", e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="must_include">Must Include</Label>
                  <Textarea
                    id="must_include"
                    placeholder='Exact phrases, dates, URLs, or facts that MUST appear in every email.'
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
              </CardContent>
            </Card>

            {/* Card 3: Never Say */}
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Never Say the Following</CardTitle>
                <CardDescription>
                  Words and phrases the AI must never use in any email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md bg-destructive/5 border border-destructive/20 px-4 py-3 text-xs text-muted-foreground">
                  <p>
                    One word or phrase per line. The AI treats these as absolute
                    blacklist items.
                  </p>
                </div>
                <Textarea
                  id="must_avoid"
                  placeholder={"unlock\ngroundbreaking\nunleash\nrevolutionary"}
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
              </CardContent>
            </Card>

            {/* Card 5: Subject Line */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Line</CardTitle>
                <CardDescription>
                  Add extra guidance for subject lines, or leave blank to use defaults.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted/50 px-4 py-3 text-sm space-y-2">
                  <p className="font-medium">Default AI behavior (always active):</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-xs">
                    <li>Short (3-6 words), lowercase okay, no punctuation tricks</li>
                    <li>References their company name or role when natural</li>
                    <li>Each recipient gets a unique subject line</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject_prompt">Additional Subject Line Guidance</Label>
                  <Textarea
                    id="subject_prompt"
                    placeholder="Leave blank to use defaults only."
                    value={form.subject_prompt}
                    onChange={(e) =>
                      updateField("subject_prompt", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 6: AI Guardrails (collapsed by default) */}
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
                    <Textarea
                      id="context"
                      placeholder={"Examples:\n\u2022 \"We met several of these companies at Biohacking Conference 2025\"\n\u2022 \"Don't reference pricing or discounts in the first email\""}
                      value={form.context}
                      onChange={(e) => updateField("context", e.target.value)}
                      rows={4}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </>
        )}

        {/* Card 7: Send Pacing (always shown) */}
        {pacingOnly ? (
          <Card>
            <CardHeader>
              <CardTitle>Send Pacing</CardTitle>
              <CardDescription>
                Control when and how fast emails are sent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SendPacingFields form={form} updateField={updateField} />
            </CardContent>
          </Card>
        ) : (
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
                  <SendPacingFields form={form} updateField={updateField} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" type="button" asChild>
            <Link href={`/dashboard/campaigns/${campaignId}`}>Cancel</Link>
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

// Extracted Send Pacing fields to avoid duplication between collapsed/non-collapsed views
function SendPacingFields({
  form,
  updateField,
}: {
  form: FormData
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}) {
  return (
    <>
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
    </>
  )
}
