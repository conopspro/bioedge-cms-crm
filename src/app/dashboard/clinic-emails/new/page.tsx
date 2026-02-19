"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
// Slider not available — using Input for word count
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { METRO_AREAS } from "@/lib/metro-areas"

// Same tag presets used in clinic discover page (alphabetical)
const TAG_PRESETS = [
  "Anti-Aging Clinic",
  "Biohacking",
  "Cryotherapy",
  "EBO2",
  "Exosome Therapy",
  "Functional Medicine",
  "Functional Neurology",
  "Hormone Therapy",
  "Hyperbaric Oxygen Therapy",
  "Integrative Medicine",
  "IV Therapy",
  "Longevity Clinic",
  "Med Spa",
  "Methylene Blue Therapy",
  "Microcurrent Therapy",
  "NAD+ Therapy",
  "Ozone Therapy",
  "PEMF Therapy",
  "Peptide Therapy",
  "PRP Therapy",
  "Red Light Therapy",
  "Regenerative Medicine",
  "Shockwave Therapy",
  "Stem Cell Therapy",
  "Structural Therapy",
  "Vibroacoustic Therapy",
  "VO2 Max Testing",
  "Wellness Spa",
]

const COMMON_SLOP_WORDS = [
  "revolutionary",
  "groundbreaking",
  "game-changing",
  "game changer",
  "transform",
  "transformative",
  "cutting-edge",
  "cutting edge",
  "supercharge",
  "turbocharge",
  "synergy",
  "synergistic",
  "leverage",
  "unlock",
  "unleash",
  "empower",
  "elevate",
  "paradigm",
  "disrupt",
  "disruptive",
  "seamless",
  "seamlessly",
  "holistic",
  "robust",
  "scalable",
  "world-class",
  "best-in-class",
  "state-of-the-art",
  "next-gen",
  "next generation",
  "innovative",
  "innovation",
  "pioneering",
  "trailblazing",
  "thought leader",
  "thought leadership",
  "mission-driven",
  "forward-thinking",
  "biohacker",
  "biohacking",
  "hacking",
  "hack",
]

interface ClinicRow {
  id: string
  name: string
  city: string | null
  state: string | null
  tags: string[]
  email: string | null
  google_rating: number | null
  reviews_count: number
}

interface SenderProfile {
  id: string
  name: string
  email: string
  title: string | null
}

interface EventOption {
  id: string
  name: string
  start_date: string | null
  city: string | null
  state: string | null
}

export default function NewClinicEmailPage() {
  const router = useRouter()

  // ── Step 1: Location filtering ──
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())
  const [allCitiesSelected, setAllCitiesSelected] = useState(true)

  const [excludeRecentlyEmailed, setExcludeRecentlyEmailed] = useState(true)
  const [excludeDays, setExcludeDays] = useState(7)

  // ── Step 2: Tag filtering ──
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  // ── Step 3: Clinic preview / selection ──
  const [matchingClinics, setMatchingClinics] = useState<ClinicRow[]>([])
  const [selectedClinicIds, setSelectedClinicIds] = useState<Set<string>>(new Set())
  const [loadingClinics, setLoadingClinics] = useState(false)
  const [clinicSearch, setClinicSearch] = useState("")

  // ── Step 4: Event to promote ──
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set())

  // ── Step 5: Purpose ──
  const [name, setName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [callToAction, setCallToAction] = useState("")

  // ── Step 6: Tone & Style ──
  const [tone, setTone] = useState("")
  const [referenceEmail, setReferenceEmail] = useState("")
  const [mustInclude, setMustInclude] = useState("")
  const [subjectPrompt, setSubjectPrompt] = useState("")

  // ── Step 7: Banned words ──
  const [mustAvoid, setMustAvoid] = useState("")

  // ── Step 8: Background context ──
  const [context, setContext] = useState("")

  // ── Step 9: Send pacing ──
  const [maxWords, setMaxWords] = useState(100)
  const [sendWindowStart, setSendWindowStart] = useState(9)
  const [sendWindowEnd, setSendWindowEnd] = useState(17)
  const [minDelay, setMinDelay] = useState(120)
  const [maxDelay, setMaxDelay] = useState(300)
  const [dailyLimit, setDailyLimit] = useState(50)

  // ── Step 10: Sender profile ──
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([])
  const [selectedSenderId, setSelectedSenderId] = useState<string>("")
  const [replyTo, setReplyTo] = useState("")

  // Section collapse state
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPacing, setShowPacing] = useState(false)

  // Submit state
  const [submitting, setSubmitting] = useState(false)

  // ── Load initial data ──
  useEffect(() => {
    // Fetch distinct states from clinics
    fetchStates()
    // Fetch events
    fetchEvents()
    // Fetch sender profiles
    fetchSenderProfiles()
  }, [])

  const fetchStates = async () => {
    try {
      const res = await fetch("/api/clinics?distinct=states")
      if (res.ok) {
        const data = await res.json()
        // API returns a flat array of state strings
        const states: string[] = (data || []).filter(Boolean).sort()
        setAvailableStates(states)
      }
    } catch {
      // Fallback: try fetching all clinics and extracting states
      try {
        const res = await fetch("/api/clinics?limit=10000&fields=state")
        if (res.ok) {
          const data = await res.json()
          const clinics = data.clinics || data || []
          const states: string[] = [...new Set(
            clinics.map((c: { state: string | null }) => c.state).filter(Boolean)
          )].sort() as string[]
          setAvailableStates(states)
        }
      } catch (err) {
        console.error("Failed to fetch states:", err)
      }
    }
  }

  // Fetch cities when states change
  useEffect(() => {
    if (selectedStates.size > 0) {
      fetchCities()
    } else {
      setAvailableCities([])
      setSelectedCities(new Set())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStates])

  const fetchCities = async () => {
    try {
      const stateParams = Array.from(selectedStates).map(s => `state=${encodeURIComponent(s)}`).join("&")
      const res = await fetch(`/api/clinics?distinct=cities&${stateParams}`)
      if (res.ok) {
        const data = await res.json()
        // API returns a flat array of city strings
        const cities: string[] = (data || []).filter(Boolean).sort()
        setAvailableCities(cities)
      }
    } catch {
      // Fallback
      try {
        const stateFilter = Array.from(selectedStates).join(",")
        const res = await fetch(`/api/clinics?limit=10000&fields=city&states=${encodeURIComponent(stateFilter)}`)
        if (res.ok) {
          const data = await res.json()
          const clinics = data.clinics || data || []
          const cities: string[] = [...new Set(
            clinics.map((c: { city: string | null }) => c.city).filter(Boolean)
          )].sort() as string[]
          setAvailableCities(cities)
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err)
      }
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch events:", err)
    }
  }

  const fetchSenderProfiles = async () => {
    try {
      const res = await fetch("/api/sender-profiles")
      if (res.ok) {
        const data = await res.json()
        setSenderProfiles(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch sender profiles:", err)
    }
  }

  // ── Fetch matching clinics when filters change ──
  const fetchMatchingClinics = useCallback(async () => {
    if (selectedStates.size === 0 && selectedTags.size === 0) {
      setMatchingClinics([])
      return
    }

    setLoadingClinics(true)
    try {
      const params = new URLSearchParams()
      if (selectedStates.size > 0) {
        params.set("states", Array.from(selectedStates).join(","))
      }
      if (!allCitiesSelected && selectedCities.size > 0) {
        params.set("cities", Array.from(selectedCities).join(","))
      }
      if (selectedTags.size > 0) {
        params.set("tags", Array.from(selectedTags).join(","))
      }
      params.set("has_email", "true")
      params.set("limit", "5000")

      const res = await fetch(`/api/clinics?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        const clinics = data.clinics || data || []
        setMatchingClinics(clinics)
        // Auto-select all
        setSelectedClinicIds(new Set(clinics.map((c: ClinicRow) => c.id)))
      }
    } catch (err) {
      console.error("Failed to fetch matching clinics:", err)
    } finally {
      setLoadingClinics(false)
    }
  }, [selectedStates, selectedCities, selectedTags, allCitiesSelected])

  // Toggle helpers
  const toggleState = (state: string) => {
    setSelectedStates(prev => {
      const next = new Set(prev)
      if (next.has(state)) next.delete(state)
      else next.add(state)
      return next
    })
  }

  const toggleCity = (city: string) => {
    setSelectedCities(prev => {
      const next = new Set(prev)
      if (next.has(city)) next.delete(city)
      else next.add(city)
      return next
    })
    setAllCitiesSelected(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const toggleClinic = (id: string) => {
    setSelectedClinicIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllClinics = () => {
    if (selectedClinicIds.size === matchingClinics.length) {
      setSelectedClinicIds(new Set())
    } else {
      setSelectedClinicIds(new Set(matchingClinics.map(c => c.id)))
    }
  }

  const toggleEvent = (id: string) => {
    setSelectedEventIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addSlopWords = () => {
    const existing = mustAvoid.split("\n").map(w => w.trim().toLowerCase()).filter(Boolean)
    const newWords = COMMON_SLOP_WORDS.filter(w => !existing.includes(w.toLowerCase()))
    setMustAvoid(prev => {
      const lines = prev.trim() ? prev.trim().split("\n") : []
      return [...lines, ...newWords].join("\n")
    })
  }

  // Filter displayed clinics by search
  const displayedClinics = clinicSearch
    ? matchingClinics.filter(c =>
        c.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
        (c.city && c.city.toLowerCase().includes(clinicSearch.toLowerCase()))
      )
    : matchingClinics

  // ── Submit ──
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a campaign name")
      return
    }
    if (!purpose.trim()) {
      alert("Please enter a campaign purpose")
      return
    }
    if (selectedClinicIds.size === 0) {
      alert("Please select at least one clinic")
      return
    }
    if (!selectedSenderId) {
      alert("Please select a sender profile")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/clinic-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          purpose: purpose.trim(),
          sender_profile_id: selectedSenderId,
          reply_to: replyTo.trim() || null,
          tone: tone.trim() || null,
          context: context.trim() || null,
          reference_email: referenceEmail.trim() || null,
          must_include: mustInclude.trim() || null,
          must_avoid: mustAvoid.trim() || null,
          call_to_action: callToAction.trim() || null,
          max_words: maxWords,
          subject_prompt: subjectPrompt.trim() || null,
          target_states: Array.from(selectedStates),
          target_cities: allCitiesSelected ? [] : Array.from(selectedCities),
          target_tags: Array.from(selectedTags),
          send_window_start: sendWindowStart,
          send_window_end: sendWindowEnd,
          min_delay_seconds: minDelay,
          max_delay_seconds: maxDelay,
          daily_send_limit: dailyLimit,
          track_opens: false,
          track_clicks: false,
          exclude_recently_emailed_days: excludeRecentlyEmailed ? excludeDays : null,
          event_ids: Array.from(selectedEventIds),
          clinic_ids: Array.from(selectedClinicIds),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.excluded_recently_emailed > 0) {
          alert(`Campaign created. ${data.excluded_recently_emailed} clinic(s) excluded because they were emailed in the last ${excludeDays} day(s).`)
        }
        router.push(`/dashboard/clinic-emails/${data.id}`)
      } else {
        const data = await res.json()
        alert(data.error || "Failed to create campaign")
      }
    } catch (err) {
      console.error("Submit failed:", err)
      alert("Failed to create campaign")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clinic-emails">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Clinic Email</h1>
          <p className="text-muted-foreground">
            Create a personalized outreach campaign to invite clinics to attend an event.
          </p>
        </div>
      </div>

      {/* ── Card 1: Recipients — Location ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            1. Recipients — Location
          </CardTitle>
          <CardDescription>
            Select the states and optionally narrow by cities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">States</Label>
            <div className="flex flex-wrap gap-2">
              {availableStates.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading states...</p>
              ) : (
                availableStates.map(state => (
                  <Button
                    key={state}
                    variant={selectedStates.has(state) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleState(state)}
                    className="h-8"
                  >
                    {state}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Metro area quick-select — show metros whose states overlap with selected states */}
          {selectedStates.size > 0 && (() => {
            const relevantMetros = Object.entries(METRO_AREAS).filter(([, metro]) =>
              metro.states.some(s => selectedStates.has(s))
            )
            if (relevantMetros.length === 0) return null
            return (
              <div>
                <Label className="text-sm font-medium mb-2 block">Metro Areas</Label>
                <div className="flex flex-wrap gap-1.5">
                  {relevantMetros.map(([metroName, metro]) => {
                    // Find which of this metro's cities exist in availableCities
                    const matchingCities = metro.cities.filter(c =>
                      availableCities.some(ac => ac.toLowerCase() === c.toLowerCase())
                    )
                    // Check if all matching cities are already selected
                    const allSelected = matchingCities.length > 0 && matchingCities.every(c =>
                      Array.from(selectedCities).some(sc => sc.toLowerCase() === c.toLowerCase())
                    )
                    return (
                      <Button
                        key={metroName}
                        variant={allSelected ? "default" : "secondary"}
                        size="sm"
                        className="h-7 text-xs"
                        disabled={matchingCities.length === 0}
                        onClick={() => {
                          setAllCitiesSelected(false)
                          if (allSelected) {
                            // Deselect all metro cities
                            setSelectedCities(prev => {
                              const next = new Set(prev)
                              matchingCities.forEach(c => {
                                const match = availableCities.find(ac => ac.toLowerCase() === c.toLowerCase())
                                if (match) next.delete(match)
                              })
                              return next
                            })
                          } else {
                            // Select all metro cities
                            setSelectedCities(prev => {
                              const next = new Set(prev)
                              matchingCities.forEach(c => {
                                const match = availableCities.find(ac => ac.toLowerCase() === c.toLowerCase())
                                if (match) next.add(match)
                              })
                              return next
                            })
                          }
                        }}
                      >
                        {metroName} ({matchingCities.length})
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Click a metro to select all its cities</p>
              </div>
            )
          })()}

          {availableCities.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Cities</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAllCitiesSelected(!allCitiesSelected)
                    if (!allCitiesSelected) {
                      setSelectedCities(new Set())
                    }
                  }}
                >
                  {allCitiesSelected ? "Select Specific Cities" : "All Cities"}
                </Button>
              </div>
              {!allCitiesSelected && (
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded-md border">
                  {availableCities.map(city => (
                    <Button
                      key={city}
                      variant={selectedCities.has(city) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCity(city)}
                      className="h-7 text-xs"
                    >
                      {city}
                    </Button>
                  ))}
                </div>
              )}
              {allCitiesSelected && (
                <p className="text-sm text-muted-foreground">All cities in selected state{selectedStates.size > 1 ? "s" : ""} will be included.</p>
              )}
            </div>
          )}

          {/* Exclude recently emailed */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <Checkbox
              id="exclude-recent"
              checked={excludeRecentlyEmailed}
              onCheckedChange={(checked) => setExcludeRecentlyEmailed(!!checked)}
            />
            <Label htmlFor="exclude-recent" className="text-sm font-normal cursor-pointer">
              Exclude clinics emailed in the last
            </Label>
            <Input
              type="number"
              value={excludeDays}
              onChange={(e) => setExcludeDays(Math.max(1, Number(e.target.value) || 7))}
              className="w-16 h-8 text-sm"
              min={1}
              max={90}
              disabled={!excludeRecentlyEmailed}
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Card 2: Recipients — Tags/Categories ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            2. Recipients — Tags/Categories
          </CardTitle>
          <CardDescription>
            Filter clinics by their specialties. Leave empty to include all.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedTags.size === TAG_PRESETS.length) setSelectedTags(new Set())
                else setSelectedTags(new Set(TAG_PRESETS))
              }}
            >
              {selectedTags.size === TAG_PRESETS.length ? "Deselect All" : "Select All"}
            </Button>
            {selectedTags.size > 0 && (
              <span className="text-sm text-muted-foreground">{selectedTags.size} selected</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAG_PRESETS.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.has(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="h-7 text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Preview count */}
          <div className="pt-3 border-t">
            <Button onClick={fetchMatchingClinics} disabled={loadingClinics}>
              {loadingClinics ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Preview Matching Clinics
            </Button>
            {matchingClinics.length > 0 && (
              <span className="ml-3 text-sm text-muted-foreground">
                {matchingClinics.length} clinics found, {selectedClinicIds.size} selected
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Card 3: Preview & Select Recipients ── */}
      {matchingClinics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>3. Preview & Select Recipients</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search clinics..."
                  value={clinicSearch}
                  onChange={(e) => setClinicSearch(e.target.value)}
                  className="w-60 h-8"
                />
                <Button variant="outline" size="sm" onClick={toggleAllClinics}>
                  {selectedClinicIds.size === matchingClinics.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </div>
            <CardDescription>
              {selectedClinicIds.size} of {matchingClinics.length} clinics selected.
              Only clinics with email addresses are shown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedClinicIds.size === matchingClinics.length}
                        onCheckedChange={toggleAllClinics}
                      />
                    </TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedClinics.slice(0, 200).map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedClinicIds.has(clinic.id)}
                          onCheckedChange={() => toggleClinic(clinic.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{clinic.name}</TableCell>
                      <TableCell className="text-sm">
                        {clinic.city && clinic.state ? `${clinic.city}, ${clinic.state}` : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(clinic.tags || []).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                          ))}
                          {(clinic.tags || []).length > 2 && (
                            <Badge variant="outline" className="text-[10px]">+{clinic.tags.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {clinic.email || <span className="text-orange-500">None</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {clinic.google_rating ? `${clinic.google_rating}/5` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {displayedClinics.length > 200 && (
              <p className="text-xs text-muted-foreground mt-2">
                Showing first 200 of {displayedClinics.length} clinics. All selected clinics will be included.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Card 4: Event to Promote ── */}
      <Card>
        <CardHeader>
          <CardTitle>4. Event to Promote</CardTitle>
          <CardDescription>
            Select the event(s) to promote in this outreach.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <label
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedEventIds.has(event.id)}
                    onCheckedChange={() => toggleEvent(event.id)}
                  />
                  <div>
                    <span className="font-medium">{event.name}</span>
                    {event.start_date && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </span>
                    )}
                    {event.city && (
                      <span className="text-sm text-muted-foreground ml-2">
                        — {event.city}{event.state ? `, ${event.state}` : ""}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Card 5: Campaign Name & Purpose ── */}
      <Card>
        <CardHeader>
          <CardTitle>5. Campaign Name & Purpose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Austin Clinic Outreach - March 2025"
            />
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What is the goal of this outreach? This helps the AI understand the context for writing each email."
              rows={3}
            />
            <Collapsible>
              <CollapsibleTrigger className="text-xs text-amber-600 mt-1 flex items-center gap-1 hover:underline">
                <Sparkles className="h-3 w-3" /> How the AI uses this
              </CollapsibleTrigger>
              <CollapsibleContent className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-md p-2 mt-1">
                The purpose is included in the system prompt under &quot;Campaign Purpose&quot;. The AI uses it to understand what to write about and how to frame the invitation.
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <Label htmlFor="cta">Call to Action</Label>
            <Input
              id="cta"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g., Visit the event page or register today"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Every email will naturally include this ask.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Card 6: Tone & Style ── */}
      <Card>
        <CardHeader>
          <CardTitle>6. Tone & Style</CardTitle>
          <CardDescription>
            Shape the voice of your emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tone">Tone Instructions</Label>
            <Textarea
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g., Warm and conversational, like one wellness professional reaching out to another. Keep it short and genuine."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="must-include">Must Include (verbatim)</Label>
            <Textarea
              id="must-include"
              value={mustInclude}
              onChange={(e) => setMustInclude(e.target.value)}
              placeholder="Text that must appear exactly as written somewhere in the email"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="subject-prompt">Subject Line Guidance</Label>
            <Textarea
              id="subject-prompt"
              value={subjectPrompt}
              onChange={(e) => setSubjectPrompt(e.target.value)}
              placeholder="Additional style instructions for subject lines"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="reference-email">Reference Email (optional)</Label>
            <Textarea
              id="reference-email"
              value={referenceEmail}
              onChange={(e) => setReferenceEmail(e.target.value)}
              placeholder="Paste a sample email here to guide the tone and style. The AI will study it but won't copy phrases."
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="max-words">Word Limit: {maxWords} words</Label>
            <Input
              id="max-words"
              type="number"
              value={maxWords}
              onChange={(e) => setMaxWords(Math.min(300, Math.max(50, Number(e.target.value) || 100)))}
              min={50}
              max={300}
              step={10}
              className="mt-2 w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Card 7: Banned Words ── */}
      <Card>
        <CardHeader>
          <CardTitle>7. Never Say</CardTitle>
          <CardDescription>Words and phrases that are absolutely forbidden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={mustAvoid}
            onChange={(e) => setMustAvoid(e.target.value)}
            placeholder="One word or phrase per line"
            rows={4}
          />
          <Button variant="outline" size="sm" onClick={addSlopWords}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add common slop words
          </Button>
        </CardContent>
      </Card>

      {/* ── Card 8: Background Context (collapsed) ── */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <div className="flex items-center justify-between">
                <CardTitle>8. Background Context</CardTitle>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Context for the AI that should NOT appear in the email.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Background information to help the AI understand the situation, but none of this should appear in the email."
                rows={4}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* ── Card 9: Send Pacing (collapsed) ── */}
      <Collapsible open={showPacing} onOpenChange={setShowPacing}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <div className="flex items-center justify-between">
                <CardTitle>9. Send Pacing</CardTitle>
                {showPacing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription>Control timing between sends.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Send Window Start (hour)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={sendWindowStart}
                    onChange={(e) => setSendWindowStart(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Send Window End (hour)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={sendWindowEnd}
                    onChange={(e) => setSendWindowEnd(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Min Delay (seconds)</Label>
                  <Input
                    type="number"
                    min={30}
                    value={minDelay}
                    onChange={(e) => setMinDelay(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Delay (seconds)</Label>
                  <Input
                    type="number"
                    min={30}
                    value={maxDelay}
                    onChange={(e) => setMaxDelay(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Daily Send Limit</Label>
                  <Input
                    type="number"
                    min={1}
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* ── Card 10: Sender Profile ── */}
      <Card>
        <CardHeader>
          <CardTitle>10. Sender Profile</CardTitle>
          <CardDescription>Who is sending these emails?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sender</Label>
            <Select value={selectedSenderId} onValueChange={setSelectedSenderId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sender profile" />
              </SelectTrigger>
              <SelectContent>
                {senderProfiles.map((sp) => (
                  <SelectItem key={sp.id} value={sp.id}>
                    {sp.name} ({sp.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="reply-to">Reply-To Override (optional)</Label>
            <Input
              id="reply-to"
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="Leave blank to use sender's email"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Submit ── */}
      <div className="flex items-center gap-4 py-4">
        <Button onClick={handleSubmit} disabled={submitting} size="lg">
          {submitting ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          {submitting ? "Creating..." : "Create Campaign"}
        </Button>
        <div className="text-sm text-muted-foreground">
          {selectedClinicIds.size} clinics selected
          {selectedEventIds.size > 0 && ` · ${selectedEventIds.size} event${selectedEventIds.size > 1 ? "s" : ""}`}
        </div>
      </div>
    </div>
  )
}
