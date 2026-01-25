import React from "react"

// Section color types
export interface SectionColors {
  background: string | null
  title: string
  subtitle: string
  text: string
  accent?: string        // Icons, links, highlights
  button_bg?: string     // Primary button background
  button_text?: string   // Primary button text
  card_bg?: string       // Card backgrounds within section
  card_title?: string    // Title text inside cards
  card_text?: string     // Body text inside cards
}

export interface SectionColorsSettings {
  hero: SectionColors
  value_props: SectionColors
  testimonials: SectionColors
  leaders: SectionColors
  tickets: SectionColors
  venue: SectionColors
  companies: SectionColors
  faq: SectionColors
  cta: SectionColors
}

export const defaultSectionColors: SectionColorsSettings = {
  hero: { background: null, title: "#ffffff", subtitle: "#cccccc", text: "#cccccc", accent: "#c9a227", button_bg: "#c9a227", button_text: "#ffffff", card_bg: "rgba(255,255,255,0.1)" },
  value_props: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#f3f4f6" },
  testimonials: { background: "#f8f9fa", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#ffffff" },
  leaders: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#ffffff" },
  tickets: { background: "#0a2540", title: "#ffffff", subtitle: "#c9a227", text: "#cccccc", accent: "#c9a227", button_bg: "#c9a227", button_text: "#ffffff", card_bg: "#ffffff", card_title: "#0a2540", card_text: "#374151" },
  venue: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227" },
  companies: { background: "#f8f9fa", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227", card_bg: "#ffffff" },
  faq: { background: "#ffffff", title: "#0a2540", subtitle: "#c9a227", text: "#374151", accent: "#c9a227" },
  cta: { background: null, title: "#ffffff", subtitle: "#cccccc", text: "#cccccc", accent: "#c9a227", button_bg: "#c9a227", button_text: "#ffffff" },
}

export function getSectionColors(eventColors: Partial<SectionColorsSettings> | null, section: keyof SectionColorsSettings): SectionColors {
  const defaults = defaultSectionColors[section]
  if (!eventColors || !eventColors[section]) return defaults
  return { ...defaults, ...eventColors[section] }
}

// Check if a color string is a gradient
export function isGradient(color: string | null): boolean {
  if (!color) return false
  return color.includes('gradient') || color.includes('linear') || color.includes('radial')
}

// Get background style - supports solid colors and gradients
export function getBackgroundStyle(color: string | null): React.CSSProperties {
  if (!color) return {}
  if (isGradient(color)) {
    return { background: color }
  }
  return { backgroundColor: color }
}
