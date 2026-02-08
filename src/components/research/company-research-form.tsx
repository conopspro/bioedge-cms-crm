"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, Building2, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompanyResearchInput, CompanyResearchOutput } from "@/types/database"

/**
 * Company Research Form
 *
 * Collects company information and triggers AI research.
 * On success, navigates to the results review page.
 */
export function CompanyResearchForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CompanyResearchInput>({
    company_name: "",
    website: "",
    contact_first_name: "",
    contact_last_name: "",
    contact_title: "",
    contact_email: "",
    contact_phone: "",
    contact_linkedin_url: "",
    contact_youtube_channel_url: "",
    event: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Ensure website has protocol
      let website = formData.website
      if (website && !website.startsWith("http")) {
        website = "https://" + website
      }

      const response = await fetch("/api/research/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Research failed")
      }

      // Store results in sessionStorage for the review page
      sessionStorage.setItem("researchResults", JSON.stringify(result))

      // Navigate to review page
      router.push("/dashboard/research/review")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic details about the company you want to research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g., Function Health"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL *</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., functionhealth.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              The AI will analyze this website to research the company
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Optional: Add a contact for outreach tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_first_name">First Name</Label>
              <Input
                id="contact_first_name"
                name="contact_first_name"
                value={formData.contact_first_name}
                onChange={handleChange}
                placeholder="e.g., Meredith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_last_name">Last Name</Label>
              <Input
                id="contact_last_name"
                name="contact_last_name"
                value={formData.contact_last_name}
                onChange={handleChange}
                placeholder="e.g., Harris"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_title">Title</Label>
              <Input
                id="contact_title"
                name="contact_title"
                value={formData.contact_title}
                onChange={handleChange}
                placeholder="e.g., VP of Partnerships"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="e.g., meredith@company.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="e.g., (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_linkedin_url">LinkedIn</Label>
              <Input
                id="contact_linkedin_url"
                name="contact_linkedin_url"
                value={formData.contact_linkedin_url}
                onChange={handleChange}
                placeholder="e.g., https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_youtube_channel_url">YouTube Channel</Label>
            <Input
              id="contact_youtube_channel_url"
              name="contact_youtube_channel_url"
              value={formData.contact_youtube_channel_url}
              onChange={handleChange}
              placeholder="e.g., https://youtube.com/@..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Context
          </CardTitle>
          <CardDescription>
            Where did you notice this company? This helps personalize the pitch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="event">Event *</Label>
            <Input
              id="event"
              name="event"
              value={formData.event}
              onChange={handleChange}
              placeholder="e.g., Biohacking Conference 2024, Eudēmonia Summit"
              required
            />
            <p className="text-xs text-muted-foreground">
              The warm pitch will reference this event as the connection point
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Research Company
            </>
          )}
        </Button>
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            This may take 30-60 seconds...
          </p>
        )}
      </div>
    </form>
  )
}
