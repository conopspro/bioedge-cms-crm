import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

/**
 * POST /api/clinic-queue/lookup-email-all
 *
 * Fetch ALL pending queue items that have a website but haven't been
 * searched yet, and process them in one server-side batch.
 *
 * The frontend calls this repeatedly; each call processes up to `batchSize`
 * items and returns how many remain. The frontend loops until remaining === 0.
 *
 * Body (optional): { batchSize?: number } — default 10, max 20
 *
 * Response: { processed, found, notFound, errors, remaining, total }
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

    // Parse optional batch size
    let batchSize = 10
    try {
      const body = await request.json()
      if (body?.batchSize && typeof body.batchSize === "number" && body.batchSize > 0) {
        batchSize = Math.min(body.batchSize, 20)
      }
    } catch {
      // No body — use default
    }

    // Count total eligible items (pending status, has website, perplexity_status = pending)
    const { count: totalEligible } = await supabase
      .from("clinic_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("perplexity_status", "pending")
      .not("website", "is", null)

    const total = totalEligible || 0

    if (total === 0) {
      return NextResponse.json({
        processed: 0,
        found: 0,
        notFound: 0,
        errors: 0,
        remaining: 0,
        total: 0,
      })
    }

    // Fetch this batch
    const { data: items, error: fetchError } = await supabase
      .from("clinic_queue")
      .select("id, name, website, email, perplexity_status")
      .eq("status", "pending")
      .eq("perplexity_status", "pending")
      .not("website", "is", null)
      .order("created_at", { ascending: true })
      .limit(batchSize)

    if (fetchError || !items || items.length === 0) {
      return NextResponse.json({
        processed: 0,
        found: 0,
        notFound: 0,
        errors: 0,
        remaining: 0,
        total,
      })
    }

    let processed = 0
    let found = 0
    let notFound = 0
    let errors = 0

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // 1-second delay between items (skip first)
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      try {
        // Mark as searching
        await supabase
          .from("clinic_queue")
          .update({ perplexity_status: "searching" })
          .eq("id", item.id)

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
            response.status
          )
          await supabase
            .from("clinic_queue")
            .update({
              perplexity_status: "error",
              perplexity_searched_at: new Date().toISOString(),
            })
            .eq("id", item.id)
          errors++
          processed++
          continue
        }

        const data = await response.json()
        const content = data?.choices?.[0]?.message?.content || ""

        // Extract email
        let extractedEmail: string | null = null

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

        if (!extractedEmail) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
          const emailMatch = content.match(emailRegex)
          if (emailMatch) {
            extractedEmail = emailMatch[0]
          }
        }

        const status = extractedEmail ? "found" : "not_found"

        const updateData: Record<string, unknown> = {
          perplexity_status: status,
          perplexity_searched_at: new Date().toISOString(),
        }
        if (extractedEmail) {
          updateData.email = extractedEmail
        }

        await supabase.from("clinic_queue").update(updateData).eq("id", item.id)

        if (extractedEmail) {
          found++
        } else {
          notFound++
        }
        processed++
      } catch (err) {
        console.error(`Error processing queue item ${item.id}:`, err)
        errors++
        processed++
      }
    }

    // Count remaining
    const { count: remainingCount } = await supabase
      .from("clinic_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("perplexity_status", "pending")
      .not("website", "is", null)

    return NextResponse.json({
      processed,
      found,
      notFound,
      errors,
      remaining: remainingCount || 0,
      total,
    })
  } catch (error) {
    console.error("Lookup email all error:", error)
    return NextResponse.json(
      { error: "Failed to process email lookups" },
      { status: 500 }
    )
  }
}
