import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

interface LookupResult {
  id: string
  name: string
  email: string | null
  status: "found" | "not_found" | "error" | "skipped"
}

/**
 * POST /api/clinic-queue/lookup-email
 *
 * Look up contact emails for clinic queue items via Perplexity AI.
 * Body: { ids: string[] } - queue item IDs (max 10)
 */
export async function POST(request: NextRequest) {
  if (!process.env.PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: "PERPLEXITY_API_KEY is not configured" },
      { status: 500 }
    )
  }

  try {
    const supabase = await createClient()
    const body = await request.json()
    const { ids } = body as { ids: string[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      )
    }

    if (ids.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 ids at a time" },
        { status: 400 }
      )
    }

    let processed = 0
    let found = 0
    let notFound = 0
    let errors = 0
    const results: LookupResult[] = []

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]

      // Add 1-second delay between items (skip first)
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      try {
        // Fetch the queue item
        const { data: item, error: fetchError } = await supabase
          .from("clinic_queue")
          .select("*")
          .eq("id", id)
          .single()

        if (fetchError || !item) {
          errors++
          results.push({ id, name: "Unknown", email: null, status: "error" })
          continue
        }

        // Skip if no website or already found
        if (!item.website || item.perplexity_status === "found") {
          results.push({
            id,
            name: item.name || "Unknown",
            email: item.email || null,
            status: "skipped",
          })
          continue
        }

        processed++

        // Update status to searching
        await supabase
          .from("clinic_queue")
          .update({ perplexity_status: "searching" })
          .eq("id", id)

        // Call Perplexity API
        const response = await fetch(
          "https://api.perplexity.ai/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "sonar",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a research assistant. Find the primary contact email for the given business by checking their website. Return ONLY a JSON object with one field: email (string or null). No other text.",
                },
                {
                  role: "user",
                  content: `Find the contact email address for "${item.name}" by checking their website: ${item.website}\n\nLook for: contact page emails, info@ or hello@ addresses, footer emails, or any general business email.\n\nReturn as JSON: {"email": "found@example.com"} or {"email": null}`,
                },
              ],
              temperature: 0.1,
              max_tokens: 200,
            }),
          }
        )

        if (!response.ok) {
          console.error(
            `Perplexity API error for ${item.name}:`,
            response.status,
            await response.text()
          )
          await supabase
            .from("clinic_queue")
            .update({
              perplexity_status: "error",
              perplexity_searched_at: new Date().toISOString(),
            })
            .eq("id", id)
          errors++
          results.push({
            id,
            name: item.name || "Unknown",
            email: null,
            status: "error",
          })
          continue
        }

        const data = await response.json()
        const content =
          data?.choices?.[0]?.message?.content || ""

        // Try to extract email from the response
        let extractedEmail: string | null = null

        // First, try to parse as JSON
        try {
          const jsonMatch = content.match(/\{[^}]*"email"[^}]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.email && typeof parsed.email === "string") {
              extractedEmail = parsed.email
            }
          }
        } catch {
          // JSON parsing failed, try regex
        }

        // Fallback: use regex to find email addresses
        if (!extractedEmail) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
          const emailMatch = content.match(emailRegex)
          if (emailMatch) {
            extractedEmail = emailMatch[0]
          }
        }

        const status = extractedEmail ? "found" : "not_found"

        // Update queue item with results
        const updateData: Record<string, unknown> = {
          perplexity_status: status,
          perplexity_searched_at: new Date().toISOString(),
        }
        if (extractedEmail) {
          updateData.email = extractedEmail
        }

        await supabase.from("clinic_queue").update(updateData).eq("id", id)

        if (extractedEmail) {
          found++
        } else {
          notFound++
        }

        results.push({
          id,
          name: item.name || "Unknown",
          email: extractedEmail,
          status,
        })
      } catch (itemError) {
        console.error(`Error processing queue item ${id}:`, itemError)
        errors++
        results.push({ id, name: "Unknown", email: null, status: "error" })
      }
    }

    return NextResponse.json({
      processed,
      found,
      notFound,
      errors,
      results,
    })
  } catch (error) {
    console.error("Lookup email error:", error)
    return NextResponse.json(
      { error: "Failed to process email lookups" },
      { status: 500 }
    )
  }
}
