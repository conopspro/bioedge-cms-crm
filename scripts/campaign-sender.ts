/**
 * Campaign Sender Script
 *
 * Slow-drip email sending for campaigns.
 * Sends one email at a time with randomized delays to feel like a human.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/campaign-sender.ts --campaign <id> [--dry-run] [--limit 25]
 *
 * Options:
 *   --campaign <id>  Required. The campaign UUID to send.
 *   --dry-run        Print what would be sent without actually sending.
 *   --limit <n>      Stop after sending N emails this session (default: no limit).
 */

const args = process.argv.slice(2)
const campaignId = args[args.indexOf("--campaign") + 1]
const dryRun = args.includes("--dry-run")
const limitIdx = args.indexOf("--limit")
const sendLimit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : Infinity

if (!campaignId) {
  console.error("Usage: npx tsx --env-file=.env.local scripts/campaign-sender.ts --campaign <id> [--dry-run] [--limit 25]")
  process.exit(1)
}

const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

function log(msg: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
  console.log(`[${timestamp}] ${msg}`)
}

function isWithinSendWindow(startHour: number, endHour: number): boolean {
  const now = new Date()
  // Convert to EST
  const estOffset = -5
  const utcHour = now.getUTCHours()
  const estHour = ((utcHour + estOffset) % 24 + 24) % 24
  return estHour >= startHour && estHour < endHour
}

function getEstHour(): number {
  const now = new Date()
  const estOffset = -5
  const utcHour = now.getUTCHours()
  return ((utcHour + estOffset) % 24 + 24) % 24
}

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

async function main() {
  log(`Campaign Sender starting`)
  log(`Campaign: ${campaignId}`)
  log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`)
  if (sendLimit !== Infinity) log(`Limit: ${sendLimit} emails`)
  log(`Base URL: ${baseUrl}`)
  log("")

  // Fetch campaign to get send window config
  const campaignRes = await fetch(`${baseUrl}/api/campaigns/${campaignId}`)
  if (!campaignRes.ok) {
    log(`ERROR: Failed to fetch campaign: ${campaignRes.status}`)
    process.exit(1)
  }

  const campaign = await campaignRes.json()
  log(`Campaign: "${campaign.name}" (${campaign.status})`)
  log(`Send window: ${campaign.send_window_start}:00 - ${campaign.send_window_end}:00 EST`)
  log(`Delay: ${campaign.min_delay_seconds}-${campaign.max_delay_seconds}s`)
  log(`Daily limit: ${campaign.daily_send_limit}`)
  log("")

  const totalApproved = (campaign.campaign_recipients || []).filter(
    (r: { status: string }) => r.status === "approved"
  ).length

  log(`${totalApproved} approved emails waiting to send`)

  if (totalApproved === 0) {
    log("Nothing to send. Exiting.")
    process.exit(0)
  }

  let sentThisSession = 0
  let sentToday = 0

  // Count emails already sent today
  const today = new Date().toISOString().split("T")[0]
  const sentTodayList = (campaign.campaign_recipients || []).filter(
    (r: { status: string; sent_at: string | null }) =>
      ["sent", "delivered", "opened", "clicked"].includes(r.status) &&
      r.sent_at &&
      r.sent_at.startsWith(today)
  )
  sentToday = sentTodayList.length
  log(`Already sent today: ${sentToday}/${campaign.daily_send_limit}`)
  log("")

  while (true) {
    // Check daily limit
    if (sentToday >= campaign.daily_send_limit) {
      log(`Daily limit reached (${sentToday}/${campaign.daily_send_limit}). Stopping.`)
      break
    }

    // Check session limit
    if (sentThisSession >= sendLimit) {
      log(`Session limit reached (${sentThisSession}/${sendLimit}). Stopping.`)
      break
    }

    // Check send window
    if (!isWithinSendWindow(campaign.send_window_start, campaign.send_window_end)) {
      const currentHour = getEstHour()
      if (currentHour >= campaign.send_window_end) {
        log(`Past send window (${currentHour}:00 EST). Stopping for the day.`)
        break
      } else {
        log(`Before send window (${currentHour}:00 EST). Waiting...`)
        await sleep(60) // Check again in a minute
        continue
      }
    }

    // Check campaign status (might have been paused from UI)
    const statusRes = await fetch(`${baseUrl}/api/campaigns/${campaignId}`)
    if (statusRes.ok) {
      const statusData = await statusRes.json()
      if (statusData.status === "paused") {
        log("Campaign paused. Stopping.")
        break
      }
    }

    if (dryRun) {
      log(`[DRY RUN] Would send email #${sentThisSession + 1}`)
      sentThisSession++
      sentToday++

      const minDelay = campaign.min_delay_seconds || 120
      const maxDelay = campaign.max_delay_seconds || 300
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
      log(`[DRY RUN] Would wait ${delay}s before next send`)

      if (sentThisSession >= totalApproved) {
        log("[DRY RUN] All emails would be sent. Done.")
        break
      }

      await sleep(1) // Brief pause in dry run
      continue
    }

    // Send one email
    log(`Sending email #${sentThisSession + 1}...`)
    try {
      const sendRes = await fetch(`${baseUrl}/api/campaigns/${campaignId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const sendData = await sendRes.json()

      if (sendData.completed) {
        log("All approved emails sent. Campaign complete!")
        break
      }

      if (sendData.skipped) {
        log(`  Skipped: ${sendData.reason}`)
        continue
      }

      if (sendData.error) {
        log(`  ERROR: ${sendData.error}`)
        await sleep(10) // Brief pause on error
        continue
      }

      if (sendData.sent) {
        sentThisSession++
        sentToday++
        log(`  ✓ Sent to ${sendData.contact_name} <${sendData.contact_email}>`)
        log(`    Subject: "${sendData.subject}"`)
        log(`    Resend ID: ${sendData.resend_id}`)
        log(`    Progress: ${sentThisSession} sent this session, ${sentToday} today`)

        // Wait the recommended delay
        const delay = sendData.recommended_delay_seconds || 120
        log(`  Waiting ${delay}s before next send...`)
        log("")
        await sleep(delay)
      }
    } catch (err) {
      log(`  NETWORK ERROR: ${err instanceof Error ? err.message : "Unknown error"}`)
      await sleep(30) // Longer pause on network error
    }
  }

  log("")
  log(`Session complete. Sent ${sentThisSession} emails.`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
