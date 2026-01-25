"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, Sparkles, ExternalLink, Loader2, Star } from "lucide-react"
import { FeaturedToggle } from "@/components/ui/featured-toggle"
import type { Article } from "@/types/database"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "info"> = {
  draft: "secondary",
  review: "warning",
  published: "success",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
}

interface ArticleWithCompany extends Article {
  company?: { id: string; name: string } | null
}

interface ArticlesTableProps {
  articles: ArticleWithCompany[]
}

/**
 * Articles Table Component
 */
export function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const searchLower = search.toLowerCase()
    const matchesSearch =
      article.title.toLowerCase().includes(searchLower) ||
      article.company?.name?.toLowerCase().includes(searchLower)
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle publish toggle
  const handleTogglePublish = async (id: string, currentStatus: string) => {
    setTogglingId(id)
    const newStatus = currentStatus === "published" ? "draft" : "published"

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating article:", error)
      alert("Failed to update status")
    } finally {
      setTogglingId(null)
    }
  }

  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Failed to delete article")
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">In Review</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredArticles.length} of {articles.length} articles
      </p>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Star className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead className="w-[350px]">Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Enhanced</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {articles.length === 0 ? (
                    <div className="text-muted-foreground">
                      No articles yet.{" "}
                      <Link
                        href="/dashboard/articles/new"
                        className="text-primary underline"
                      >
                        Create your first article
                      </Link>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No articles match your filters.
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <FeaturedToggle
                      entityType="articles"
                      entityId={article.id}
                      isFeatured={article.is_featured || false}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/articles/${article.id}`}
                      className="font-medium hover:underline"
                    >
                      {article.title}
                    </Link>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {article.company ? (
                      <Link
                        href={`/dashboard/companies/${article.company.id}`}
                        className="text-sm hover:underline"
                      >
                        {article.company.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {togglingId === article.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Switch
                          checked={article.status === "published"}
                          onCheckedChange={() => handleTogglePublish(article.id, article.status)}
                          title={article.status === "published" ? "Unpublish" : "Publish"}
                        />
                      )}
                      <Badge variant={statusColors[article.status]}>
                        {statusLabels[article.status]}
                      </Badge>
                      {article.status === "published" && (
                        <a
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                          title="View live"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {article.ai_enhanced ? (
                      <Badge variant="info" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Enhanced
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Preview"
                      >
                        <a
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Edit"
                      >
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDelete(article.id, article.title)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
