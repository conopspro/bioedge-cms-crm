"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Cpu,
  GraduationCap,
  CalendarDays,
  Youtube,
  Pen,
  RefreshCw,
  Users,
  ExternalLink,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { PromotionPreset } from "@/types/outreach"

// ── Slop words (same list as clinic-emails) ──────────────────────────────────
const COMMON_SLOP_WORDS = [
  "revolutionary", "groundbreaking", "game-changing", "game changer",
  "transform", "transformative", "cutting-edge", "cutting edge",
  "supercharge", "turbocharge", "synergy", "synergistic",
  "leverage", "unlock", "unleash", "empower", "elevate",
  "paradigm", "disrupt", "disruptive", "seamless", "seamlessly",
  "holistic", "robust", "scalable", "world-class", "best-in-class",
  "state-of-the-art", "next-gen", "next generation", "innovative",
  "innovation", "pioneering", "trailblazing", "thought leader",
  "thought leadership", "mission-driven", "forward-thinking",
]

// ── Icon map for preset cards ─────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Cpu, GraduationCap, CalendarDays, Youtube, Pen,
}

function PresetIcon({ icon }: { icon: string | null }) {
  const Icon = icon ? (ICON_MAP[icon] ?? Pen) : Pen
  return <Icon className="h-5 w-5" />
}

const TYPE_COLORS: Record<string, string> = {
  book: "border-blue-200 bg-blue-50/40",
  tool: "border-violet-200 bg-violet-50/40",
  coaching: "border-green-200 bg-green-50/40",
  summit: "border-amber-200 bg-amber-50/40",
  youtube: "border-red-200 bg-red-50/40",
  custom: "border-gray-200 bg-gray-50/40",
}

interface SenderProfile {
  id: string
  name: string
  email: string
  title: string | null
  signature: string | null
}

interface BusinessTypeCount {
  business_type: string | null
  count: number
}

interface PersonaGroupCount {
  group: string
  display_name: string
  count: number
}

// ── US State abbreviations for the state filter ──────────────────────────────
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
]

export default function NewOutreachCampaignPage() {
  const router = useRouter()

  // ── Contact filters ─────────────────────────────────────────────────────────
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [engagement, setEngagement] = useState<"any" | "opened" | "clicked">("any")
  const [excludeDays, setExcludeDays] = useState<string>("")

  // ── Contact count preview ───────────────────────────────────────────────────
  const [contactCount, setContactCount] = useState<number | null>(null)
  const [personaBreakdown, setPersonaBreakdown] = useState<PersonaGroupCount[]>([])
  const [contactLimit, setContactLimit] = useState<string>("")
  const [countLoading, setCountLoading] = useState(false)

  // ── Available business types ────────────────────────────────────────────────
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeCount[]>([])

  // ── Preset selection ────────────────────────────────────────────────────────
  const [presets, setPresets] = useState<PromotionPreset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<PromotionPreset | null>(null)

  // ── Campaign fields ─────────────────────────────────────────────────────────
  const [name, setName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [callToAction, setCallToAction] = useState("")
  const [tone, setTone] = useState("")
  const [mustInclude, setMustInclude] = useState("")
  const [subjectPrompt, setSubjectPrompt] = useState("")
  const [referenceEmail, setReferenceEmail] = useState("")
  const [maxWords, setMaxWords] = useState("100")
  const [mustAvoid, setMustAvoid] = useState("")
  const [context, setContext] = useState("")

  // ── Send pacing ──────────────────────────────────────────────────────────────
  const [sendWindowStart, setSendWindowStart] = useState("9")
  const [sendWindowEnd, setSendWindowEnd] = useState("17")
  const [minDelay, setMinDelay] = useState("120")
  const [maxDelay, setMaxDelay] = useState("300")
  const [dailyLimit, setDailyLimit] = useState("50")

  // ── Sender profile ────────────────────────────────────────────────────────
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([])
  const [senderProfileId, setSenderProfileId] = useState<string>("")
  const [replyTo, setReplyTo] = useState("")
  const [signatureOverride, setSignatureOverride] = useState<string>("")

  // ── UI state ──────────────────────────────────────────────────────────────
  const [contextOpen, setContextOpen] = useState(false)
  const [pacingOpen, setPacingOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch initial data ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      const [btRes, presetsRes, sendersRes] = await Promise.all([
        fetch("/api/outreach-contacts/business-types"),
        fetch("/api/promotion-presets"),
        fetch("/api/sender-profiles").catch(() => null),
      ])

      if (btRes.ok) {
        const data = await btRes.json()
        setBusinessTypes(data.business_types ?? [])
      }

      if (presetsRes.ok) {
        const data = await presetsRes.json()
        setPresets(data.presets ?? [])
      }

      if (sendersRes?.ok) {
        const data = await sendersRes.json()
        const profiles: SenderProfile[] = data.profiles ?? data ?? []
        setSenderProfiles(profiles)
        // Auto-select the first profile and pre-populate signature
        const first = profiles[0]
        if (first) {
          setSenderProfileId(first.id)
          setSignatureOverride(first.signature ?? "")
        }
      }
    }
    fetchAll()
  }, [])

  // ── Fetch contact count when filters change ────────────────────────────────
  const fetchCount = useCallback(async () => {
    setCountLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedBusinessTypes.length > 0) {
        params.set("businessTypes", selectedBusinessTypes.join(","))
      }
      if (selectedStates.length > 0) {
        params.set("states", selectedStates.join(","))
      }
      if (engagement !== "any") {
        params.set("engagement", engagement)
      }
      const parsedExclude = parseInt(excludeDays, 10)
      if (parsedExclude > 0) {
        params.set("excludeDays", String(parsedExclude))
      }

      const res = await fetch(`/api/outreach-contacts/count?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setContactCount(data.total)
        setPersonaBreakdown(data.by_persona_group ?? [])
      }
    } catch (err) {
      console.error("Failed to fetch count:", err)
    } finally {
      setCountLoading(false)
    }
  }, [selectedBusinessTypes, selectedStates, engagement, excludeDays])

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  // When sender selection changes, pre-populate signature from that profile
  useEffect(() => {
    const profile = senderProfiles.find((p) => p.id === senderProfileId)
    if (profile) {
      setSignatureOverride(profile.signature ?? "")
    }
  }, [senderProfileId, senderProfiles])

  // ── Toggle business type selection ─────────────────────────────────────────
  const toggleBusinessType = (bt: string) => {
    setSelectedBusinessTypes((prev) =>
      prev.includes(bt) ? prev.filter((t) => t !== bt) : [...prev, bt]
    )
  }

  // ── Select a promotion preset ──────────────────────────────────────────────
  const selectPreset = (preset: PromotionPreset) => {
    if (selectedPreset?.id === preset.id) {
      setSelectedPreset(null)
    } else {
      setSelectedPreset(preset)
      // Auto-fill purpose and CTA from preset defaults (only if fields are empty)
      if (!purpose && preset.default_purpose) setPurpose(preset.default_purpose)
      if (!callToAction && preset.default_cta) setCallToAction(preset.default_cta)
      // Auto-fill name if empty
      if (!name) setName(`${preset.name} Outreach`)
    }
  }

  // ── Add slop words ─────────────────────────────────────────────────────────
  const addSlopWords = () => {
    const existing = mustAvoid
      .split(/[,\n]/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean)

    const toAdd = COMMON_SLOP_WORDS.filter(
      (w) => !existing.includes(w.toLowerCase())
    )

    setMustAvoid(
      mustAvoid
        ? mustAvoid + (mustAvoid.endsWith("\n") ? "" : "\n") + toAdd.join("\n")
        : toAdd.join("\n")
    )
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Campaign name is required.")
      return
    }
    if (!senderProfileId) {
      setError("Please select a sender profile.")
      return
    }
    if (contactCount === 0) {
      setError("No contacts match your filters. Adjust the filter settings.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        name: name.trim(),
        sender_profile_id: senderProfileId,
        reply_to: replyTo || null,
        // Promotion
        promotion_preset_id: selectedPreset?.id ?? null,
        promotion_type: selectedPreset?.type ?? null,
        promotion_title: selectedPreset?.title ?? null,
        promotion_url: selectedPreset?.url ?? null,
        promotion_description: selectedPreset?.description ?? null,
        // Filters
        target_business_types: selectedBusinessTypes,
        target_states: selectedStates,
        target_engagement: engagement,
        exclude_emailed_within_days: excludeDays ? parseInt(excludeDays, 10) : null,
        contact_limit: contactLimit ? parseInt(contactLimit, 10) : null,
        // AI
        purpose: purpose.trim() || null,
        tone: tone.trim() || null,
        context: context.trim() || null,
        must_include: mustInclude.trim() || null,
        must_avoid: mustAvoid.trim() || null,
        call_to_action: callToAction.trim() || null,
        reference_email: referenceEmail.trim() || null,
        max_words: parseInt(maxWords, 10) || 100,
        subject_prompt: subjectPrompt.trim() || null,
        // Send pacing
        send_window_start: parseInt(sendWindowStart, 10) || 9,
        send_window_end: parseInt(sendWindowEnd, 10) || 17,
        min_delay_seconds: parseInt(minDelay, 10) || 120,
        max_delay_seconds: parseInt(maxDelay, 10) || 300,
        daily_send_limit: parseInt(dailyLimit, 10) || 50,
        signature_override: signatureOverride.trim() || null,
      }

      const res = await fetch("/api/outreach-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/dashboard/outreach-emails/${data.campaign.id}`)
      } else {
        const data = await res.json()
        setError(data.error ?? "Failed to create campaign.")
      }
    } catch (err) {
      console.error("Submit failed:", err)
      setError("An unexpected error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/outreach-emails">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New General Outreach Campaign</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Persona-first email generation — no name personalization
          </p>
        </div>
      </div>

      {/* ── Card 1: Filter Contacts ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Filter Contacts
          </CardTitle>
          <CardDescription>
            Choose which contacts from your outreach list to include.
            Leave all filters blank to include everyone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Business Type multi-select */}
          <div className="space-y-2">
            <Label>Business Type</Label>
            <p className="text-xs text-muted-foreground">
              Click to toggle. Leave blank to include all types (including untagged).
            </p>
            <div className="flex flex-wrap gap-2">
              {businessTypes
                .filter((bt) => bt.business_type)
                .map((bt) => (
                  <button
                    key={bt.business_type}
                    type="button"
                    onClick={() => toggleBusinessType(bt.business_type!)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                      ${selectedBusinessTypes.includes(bt.business_type!)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                      }`}
                  >
                    {selectedBusinessTypes.includes(bt.business_type!) && (
                      <Check className="h-3 w-3" />
                    )}
                    {bt.business_type}
                    <span className="text-[10px] opacity-70">{bt.count}</span>
                  </button>
                ))}
              {businessTypes.some((bt) => !bt.business_type) && (
                <button
                  type="button"
                  onClick={() => toggleBusinessType("")}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                    ${selectedBusinessTypes.includes("")
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                    }`}
                >
                  Untagged
                  <span className="text-[10px] opacity-70">
                    {businessTypes.find((bt) => !bt.business_type)?.count ?? 0}
                  </span>
                </button>
              )}
            </div>
            {selectedBusinessTypes.length > 0 && (
              <button
                className="text-xs text-muted-foreground underline underline-offset-2"
                onClick={() => setSelectedBusinessTypes([])}
              >
                Clear selection (use all types)
              </button>
            )}
          </div>

          {/* State filter */}
          <div className="space-y-2">
            <Label>State (optional)</Label>
            <div className="flex flex-wrap gap-1.5">
              {US_STATES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setSelectedStates((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )
                  }
                  className={`rounded px-2 py-0.5 text-xs font-mono border transition-colors
                    ${selectedStates.includes(s)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {selectedStates.length > 0 && (
              <button
                className="text-xs text-muted-foreground underline underline-offset-2"
                onClick={() => setSelectedStates([])}
              >
                Clear states
              </button>
            )}
          </div>

          {/* Engagement filter */}
          <div className="space-y-1.5">
            <Label>Engagement History</Label>
            <Select
              value={engagement}
              onValueChange={(v) => setEngagement(v as "any" | "opened" | "clicked")}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any (all contacts)</SelectItem>
                <SelectItem value="opened">Has opened at least one email</SelectItem>
                <SelectItem value="clicked">Has clicked a link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exclude recently emailed */}
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap">Exclude emailed within</Label>
            <Input
              type="number"
              min={1}
              className="w-20"
              placeholder="—"
              value={excludeDays}
              onChange={(e) => setExcludeDays(e.target.value)}
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Card 2: Contact Preview ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contact Preview</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchCount}
              disabled={countLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${countLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            How many contacts match your current filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {countLoading ? (
            <p className="text-muted-foreground text-sm">Counting…</p>
          ) : contactCount !== null ? (
            <>
              <div className="text-3xl font-bold">
                {contactCount.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground ml-2">
                  contacts match
                </span>
              </div>

              {personaBreakdown.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Persona breakdown
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {personaBreakdown.map((item) => (
                      <div
                        key={item.group}
                        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs"
                      >
                        <span className="font-medium">{item.display_name}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {item.count.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Each persona group gets a tailored AI briefing for their professional world.
                  </p>
                </div>
              )}
            </>
          ) : null}

          {/* Optional contact cap */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <Label className="whitespace-nowrap text-sm">Limit to first</Label>
            <Input
              type="number"
              min={1}
              className="w-28"
              placeholder="no limit"
              value={contactLimit}
              onChange={(e) => setContactLimit(e.target.value)}
            />
            <span className="text-sm text-muted-foreground">contacts (optional cap)</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Card 3: What You're Promoting ──────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>What You&rsquo;re Promoting</CardTitle>
          <CardDescription>
            Select a preset to auto-fill Purpose and Call to Action.
            <Link
              href="/dashboard/outreach-emails/presets"
              target="_blank"
              className="inline-flex items-center gap-1 ml-2 text-primary underline underline-offset-2"
            >
              Manage presets
              <ExternalLink className="h-3 w-3" />
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {presets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active presets.{" "}
              <Link
                href="/dashboard/outreach-emails/presets"
                target="_blank"
                className="underline underline-offset-2"
              >
                Create one first.
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presets.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`relative rounded-lg border-2 p-3 text-left transition-all
                      ${isSelected
                        ? "border-primary bg-primary/5"
                        : `${TYPE_COLORS[preset.type] ?? "border-gray-200"} hover:border-primary/50`
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <PresetIcon icon={preset.icon} />
                      <span className="text-xs font-medium leading-tight">{preset.name}</span>
                    </div>
                    {preset.title && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                        {preset.title}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {selectedPreset && (
            <div className="mt-4 rounded-lg bg-muted/40 border p-3 text-sm space-y-1">
              <p className="font-medium">{selectedPreset.name}</p>
              {selectedPreset.url && (
                <a
                  href={selectedPreset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline underline-offset-2 flex items-center gap-1"
                >
                  {selectedPreset.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {selectedPreset.description && (
                <p className="text-xs text-muted-foreground">{selectedPreset.description}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Card 4: Campaign Name & Purpose ────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Name & Purpose</CardTitle>
          <CardDescription>
            Internal name for tracking, plus the AI context for what this campaign is trying to do.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Campaign Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Book launch — chiropractors, Jan 2025"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Campaign Purpose</Label>
            <p className="text-xs text-muted-foreground">
              What are you trying to accomplish? The AI uses this to frame each email — but it
              won&rsquo;t appear verbatim.
            </p>
            <Textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              placeholder="e.g. Introduce my book Biological EDGE to Florida-based chiropractors who haven't heard of it yet."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Call to Action</Label>
            <p className="text-xs text-muted-foreground">
              The one specific ask you want the recipient to take.
            </p>
            <Input
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g. Check it out on Amazon"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Card 5: Tone & Style ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Tone & Style</CardTitle>
          <CardDescription>
            Guide the AI&rsquo;s voice and what must be in every email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tone Instructions (optional)</Label>
            <Textarea
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              rows={2}
              placeholder="e.g. Conversational but credible. Like a colleague, not a brand."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Must Include (verbatim)</Label>
            <p className="text-xs text-muted-foreground">
              Text that must appear word-for-word in every email (e.g. a disclaimer, a specific URL).
            </p>
            <Textarea
              value={mustInclude}
              onChange={(e) => setMustInclude(e.target.value)}
              rows={2}
              placeholder="Leave blank if not needed"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Additional Subject Line Guidance (optional)</Label>
            <Input
              value={subjectPrompt}
              onChange={(e) => setSubjectPrompt(e.target.value)}
              placeholder="e.g. Reference the state when known"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Reference Email (style guide only — not copied)</Label>
            <p className="text-xs text-muted-foreground">
              Paste an email you love the tone of. The AI studies the feel — it won&rsquo;t copy any phrases.
            </p>
            <Textarea
              value={referenceEmail}
              onChange={(e) => setReferenceEmail(e.target.value)}
              rows={4}
              placeholder="Paste a reference email here…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Max Words</Label>
            <Input
              type="number"
              value={maxWords}
              onChange={(e) => setMaxWords(e.target.value)}
              className="w-28"
              min={30}
              max={400}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Card 6: Never Say ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Never Say</CardTitle>
              <CardDescription className="mt-1">
                Hard blacklist — the AI will never use these words or phrases.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addSlopWords}>
              Add common slop words
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={mustAvoid}
            onChange={(e) => setMustAvoid(e.target.value)}
            rows={5}
            placeholder="One word or phrase per line, or comma-separated"
          />
        </CardContent>
      </Card>

      {/* ── Card 7: Background Context (collapsible) ───────────────────────── */}
      <Card>
        <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 rounded-t-lg transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Background Context</CardTitle>
                  <CardDescription className="mt-1">
                    Context the AI should know but NEVER put in the email.
                  </CardDescription>
                </div>
                {contextOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                placeholder="e.g. This list includes people who attended the Biohacker Expo in 2023. They've received 3 previous emails. Don't reference the expo directly."
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* ── Card 8: Send Pacing (collapsible) ──────────────────────────────── */}
      <Card>
        <Collapsible open={pacingOpen} onOpenChange={setPacingOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 rounded-t-lg transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Send Pacing</CardTitle>
                  <CardDescription className="mt-1">
                    Controls timing between sends to avoid spam filters.
                  </CardDescription>
                </div>
                {pacingOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Send Window Start (EST hour, 0–23)</Label>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={sendWindowStart}
                  onChange={(e) => setSendWindowStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Send Window End (EST hour, 0–23)</Label>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={sendWindowEnd}
                  onChange={(e) => setSendWindowEnd(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Min Delay Between Sends (seconds)</Label>
                <Input
                  type="number"
                  min={30}
                  value={minDelay}
                  onChange={(e) => setMinDelay(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Delay Between Sends (seconds)</Label>
                <Input
                  type="number"
                  min={60}
                  value={maxDelay}
                  onChange={(e) => setMaxDelay(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Daily Send Limit</Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="w-32"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* ── Card 9: Sender Profile ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Sender Profile</CardTitle>
          <CardDescription>
            Who is sending these emails? The sender&rsquo;s name and email are used in the From address.
            You can customize the signature for this campaign below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Sender</Label>
            {senderProfiles.length === 0 ? (
              <p className="text-sm text-destructive">
                No sender profiles found.{" "}
                <a href="/dashboard/settings/sender-profiles" target="_blank" className="underline underline-offset-2">
                  Create one in Settings.
                </a>
              </p>
            ) : (
              <Select value={senderProfileId} onValueChange={setSenderProfileId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sender…" />
                </SelectTrigger>
                <SelectContent>
                  {senderProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name} &lt;{profile.email}&gt;
                      {profile.title ? ` — ${profile.title}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Email Signature</Label>
            <p className="text-xs text-muted-foreground">
              Pre-filled from your sender profile. Edit here to use a different signature for this campaign only.
            </p>
            <Textarea
              value={signatureOverride}
              onChange={(e) => setSignatureOverride(e.target.value)}
              rows={4}
              placeholder={"Sandy Martin\nFounder, bioEDGE Longevity\nbioedgelongevity.com"}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Reply-To Override (optional)</Label>
            <Input
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="Leave blank to use sender email"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Error + Submit ──────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pb-8">
        <Button variant="outline" asChild>
          <Link href="/dashboard/outreach-emails">Cancel</Link>
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !name.trim() || !senderProfileId}
          size="lg"
        >
          {submitting
            ? "Creating…"
            : `Create Campaign${contactCount !== null ? ` (${(contactLimit ? Math.min(parseInt(contactLimit), contactCount) : contactCount).toLocaleString()} recipients)` : ""}`
          }
        </Button>
      </div>
    </div>
  )
}
