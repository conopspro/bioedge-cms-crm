"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Newspaper,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
} from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  url: string
  source_name: string
  published_at: string | null
  status: string
  edge_categories: string[]
  biological_systems: string[]
  analyzed_at: string | null
}

interface NewsTableProps {
  articles: NewsArticle[]
}

interface ProgressEvent {
  type: string
  message?: string
  current?: number
  total?: number
  title?: string
  source?: string
  reason?: string
  ingested?: number
  skipped?: number
  remaining?: number
  total_feed_items?: number
  errors?: string[]
  error?: string
}

interface TestPreview {
  title: string
  url: string
  source_name: string
  published_at: string | null
  author: string | null
  content_preview: string
  summary: string
  key_points: string[]
  edge_significance: string
  edge_categories: string[]
  biological_systems: string[]
}

export function NewsTable({ articles }: NewsTableProps) {
  const router = useRouter()
  const [isIngesting, setIsIngesting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Streaming progress state
  const [progressLog, setProgressLog] = useState<ProgressEvent[]>([])
  const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number; title: string } | null>(null)
  const [finalResult, setFinalResult] = useState<ProgressEvent | null>(null)

  // Test preview state
  const [testPreview, setTestPreview] = useState<TestPreview | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [testStats, setTestStats] = useState<{ total_feed_items: number; already_ingested: number; new_available: number } | null>(null)

  const logRef = useRef<HTMLDivElement>(null)

  const handleTest = async () => {
    setIsTesting(true)
    setTestPreview(null)
    setTestError(null)
    setTestStats(null)
    try {
      const res = await fetch("/api/news/test", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setTestPreview(data.preview)
        setTestStats(data.stats)
      } else {
        setTestError(data.error || "Unknown error")
      }
    } catch (err) {
      setTestError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsTesting(false)
    }
  }

  const handleClear = async () => {
    if (!confirm("Delete ALL news articles? This cannot be undone.")) return
    setIsClearing(true)
    try {
      const res = await fetch("/api/news/clear", { method: "DELETE" })
      const data = await res.json()
      if (res.ok) {
        setRemaining(0)
        setProgressLog([])
        setFinalResult(null)
        setTestPreview(null)
        router.refresh()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown"}`)
    } finally {
      setIsClearing(false)
    }
  }

  const handleIngest = async () => {
    setIsIngesting(true)
    setProgressLog([])
    setCurrentProgress(null)
    setFinalResult(null)
    setTestPreview(null)
    setTestError(null)

    try {
      const res = await fetch("/api/news/ingest", { method: "POST" })

      if (!res.ok) {
        // Non-streaming error (401, 500, etc.)
        const data = await res.json()
        setFinalResult({ type: "error", message: data.error || "Unknown error" })
        setIsIngesting(false)
        return
      }

      if (!res.body) {
        setFinalResult({ type: "error", message: "No response stream" })
        setIsIngesting(false)
        return
      }

      // Read the NDJSON stream
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete lines
        const lines = buffer.split("\n")
        buffer = lines.pop() || "" // Keep incomplete last line in buffer

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const event: ProgressEvent = JSON.parse(line)

            if (event.type === "progress") {
              setCurrentProgress({
                current: event.current || 0,
                total: event.total || 0,
                title: event.title || "",
              })
            } else if (event.type === "done") {
              setFinalResult(event)
              setRemaining(event.remaining || 0)
              setCurrentProgress(null)
              router.refresh()
            } else if (event.type === "fatal") {
              setFinalResult(event)
              setCurrentProgress(null)
            }

            setProgressLog((prev) => [...prev, event])

            // Auto-scroll log
            setTimeout(() => {
              logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" })
            }, 50)
          } catch {
            // Skip unparseable lines
          }
        }
      }
    } catch (err) {
      setFinalResult({ type: "error", message: err instanceof Error ? err.message : "Unknown error" })
    } finally {
      setIsIngesting(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id)
    const newStatus = currentStatus === "published" ? "hidden" : "published"
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error("Failed to toggle status:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—"
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "—"
    }
  }

  function getEventIcon(type: string) {
    switch (type) {
      case "ingested":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
      case "error":
        return <XCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
      case "skip":
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0" />
      default:
        return <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin flex-shrink-0" />
    }
  }

  function getEventText(event: ProgressEvent) {
    switch (event.type) {
      case "status":
        return event.message
      case "progress":
        return `[${event.current}/${event.total}] Analyzing: ${event.title}`
      case "ingested":
        return `✓ ${event.title} (${event.source})`
      case "skip":
        return `Skipped: ${event.title} (${event.reason})`
      case "error":
        return `✗ ${event.title}: ${event.message}`
      case "done":
        return `Done! Ingested ${event.ingested}, skipped ${event.skipped}${event.remaining ? `, ${event.remaining} remaining` : ""}`
      case "fatal":
        return `Fatal error: ${event.error}`
      default:
        return JSON.stringify(event)
    }
  }

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleTest}
          disabled={isTesting || isIngesting}
          className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-50 transition"
        >
          {isTesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FlaskConical className="h-4 w-4" />
          )}
          {isTesting ? "Testing..." : "Test One Article"}
        </button>

        <button
          onClick={handleIngest}
          disabled={isIngesting || isTesting}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {isIngesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isIngesting
            ? "Ingesting..."
            : remaining > 0
              ? `Continue Ingesting (${remaining} remaining)`
              : "Ingest Now"}
        </button>

        <span className="text-sm text-muted-foreground">
          {articles.length} articles total
        </span>

        {articles.length > 0 && (
          <button
            onClick={handleClear}
            disabled={isClearing || isIngesting || isTesting}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isClearing ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {/* Test Preview */}
      {testError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Test error:</strong> {testError}
        </div>
      )}
      {testPreview && (
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              AI Analysis Preview (Not Saved)
            </h3>
            {testStats && (
              <span className="text-xs text-muted-foreground">
                {testStats.new_available} new articles available from {testStats.total_feed_items} total feed items
              </span>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {testPreview.source_name} • {formatDate(testPreview.published_at)}
              {testPreview.author && ` • ${testPreview.author}`}
            </p>
            <h4 className="text-lg font-bold text-navy">{testPreview.title}</h4>
            <a
              href={testPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-electric-blue hover:underline"
            >
              {testPreview.url.slice(0, 80)}...
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Summary */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</p>
              <p className="text-sm text-foreground">{testPreview.summary || "(empty)"}</p>
            </div>

            {/* Longevity Significance */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Longevity Significance</p>
              <p className="text-sm text-foreground italic">{testPreview.edge_significance || "(empty)"}</p>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Points</p>
            {testPreview.key_points.length > 0 ? (
              <ul className="text-sm space-y-1">
                {testPreview.key_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">(none)</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {testPreview.edge_categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-gold"
              >
                {cat}
              </span>
            ))}
            {testPreview.biological_systems.map((sys) => (
              <span
                key={sys}
                className="rounded-full border border-electric-blue/30 bg-electric-blue/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-electric-blue"
              >
                {sys}
              </span>
            ))}
          </div>

          {/* Raw content preview */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition">
              Show raw content sent to AI (first 500 chars)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap rounded bg-muted p-3 text-xs">
              {testPreview.content_preview}
            </pre>
          </details>
        </div>
      )}

      {/* Streaming Progress */}
      {(isIngesting || progressLog.length > 0) && (
        <div className="rounded-lg border bg-muted/30 overflow-hidden">
          {/* Progress bar */}
          {currentProgress && (
            <div className="px-4 py-3 border-b bg-white">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">
                  Analyzing {currentProgress.current} of {currentProgress.total}
                </span>
                <span className="text-muted-foreground">
                  {Math.round((currentProgress.current / currentProgress.total) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground truncate">
                {currentProgress.title}
              </p>
            </div>
          )}

          {/* Final result banner */}
          {finalResult && finalResult.type === "done" && (
            <div className="px-4 py-3 border-b bg-green-50 text-green-800 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Ingested {finalResult.ingested} articles.
              {(finalResult.errors?.length || 0) > 0 && ` ${finalResult.errors?.length} errors.`}
              {(finalResult.remaining || 0) > 0 && ` ${finalResult.remaining} more waiting.`}
            </div>
          )}
          {finalResult && finalResult.type === "fatal" && (
            <div className="px-4 py-3 border-b bg-red-50 text-red-800 text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Fatal error: {finalResult.error}
            </div>
          )}

          {/* Scrollable log */}
          <div
            ref={logRef}
            className="max-h-48 overflow-y-auto px-4 py-2 space-y-1 text-xs font-mono"
          >
            {progressLog.map((event, i) => (
              <div key={i} className="flex items-start gap-2 py-0.5">
                {getEventIcon(event.type)}
                <span className={
                  event.type === "error" || event.type === "fatal"
                    ? "text-red-700"
                    : event.type === "ingested"
                      ? "text-green-700"
                      : "text-muted-foreground"
                }>
                  {getEventText(event)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {articles.length === 0 ? (
        <div className="py-16 text-center">
          <Newspaper className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="mb-2 text-xl font-semibold">No news articles yet</h2>
          <p className="text-muted-foreground">
            Click &quot;Test One Article&quot; to preview AI analysis, then &quot;Ingest Now&quot; to fetch articles from RSS feeds.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Source
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Published
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  EDGE
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Systems
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-navy hover:text-electric-blue transition-colors"
                    >
                      <span className="line-clamp-1 max-w-[300px]">
                        {article.title}
                      </span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {article.source_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(article.published_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700"
                          : article.status === "hidden"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {article.edge_categories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-full border border-gold/30 bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gold"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {article.biological_systems.length > 0
                      ? `${article.biological_systems.length} systems`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleStatus(article.id, article.status)}
                        disabled={updatingId === article.id}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition disabled:opacity-50"
                        title={
                          article.status === "published"
                            ? "Hide article"
                            : "Publish article"
                        }
                      >
                        {updatingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : article.status === "published" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
