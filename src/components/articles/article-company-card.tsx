"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Pencil, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ArticleCompanyCardProps {
  articleId: string
  company: { id: string; name: string; website?: string | null } | null
  companies: { id: string; name: string }[]
}

export function ArticleCompanyCard({ articleId, company, companies }: ArticleCompanyCardProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(company?.id || "")
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: selectedCompanyId || null }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save")
      }

      setIsEditing(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setSelectedCompanyId(company?.id || "")
    setIsEditing(false)
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company
          </CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit company</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={isSaving}
            >
              <option value="">No company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : company ? (
          <Link
            href={`/dashboard/companies/${company.id}`}
            className="block rounded-md p-2 hover:bg-muted -m-2"
          >
            <p className="font-medium">{company.name}</p>
            {company.website && (
              <p className="text-sm text-muted-foreground">
                {company.website}
              </p>
            )}
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">No company linked</p>
        )}
      </CardContent>
    </Card>
  )
}
