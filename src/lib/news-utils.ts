/**
 * News Utilities
 *
 * Shared helpers for month-based news archive URLs and labels.
 */

export const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const

/**
 * Parse a month slug like "february-2026" into a date range and label.
 * Returns null if the slug is invalid.
 */
export function parseMonthSlug(
  slug: string
): { start: string; end: string; label: string } | null {
  const parts = slug.split("-")
  const yearStr = parts[parts.length - 1]
  const monthName = parts.slice(0, -1).join("-")
  const monthIndex = MONTH_NAMES.indexOf(
    monthName.toLowerCase() as (typeof MONTH_NAMES)[number]
  )
  const year = parseInt(yearStr, 10)

  if (monthIndex === -1 || isNaN(year) || year < 2000 || year > 2100)
    return null

  const start = new Date(Date.UTC(year, monthIndex, 1)).toISOString()
  const end = new Date(
    Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)
  ).toISOString()
  const label = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`

  return { start, end, label }
}

/**
 * Get the month slug for a date, e.g. "february-2026"
 */
export function getMonthSlug(date: Date): string {
  return `${MONTH_NAMES[date.getUTCMonth()]}-${date.getUTCFullYear()}`
}

/**
 * Get the display label for a date's month, e.g. "February 2026"
 */
export function getMonthLabel(date: Date): string {
  const name = MONTH_NAMES[date.getUTCMonth()]
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${date.getUTCFullYear()}`
}
