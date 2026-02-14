import type { EdgeCategory, AccessLevel, BiologicalSystem } from "@/types/database"

/**
 * Parsed entry from the bioEDGE Coach Resource Guide
 */
export interface ParsedEdgeEntry {
  name: string
  domain: string | null
  description: string | null
  edgeCategory: EdgeCategory
  systems: BiologicalSystem[]
  accessLevels: AccessLevel[]
  hasAffiliate: boolean
  notes: string | null
  category: string | null // company_categories slug
  sectionContext: string // original section heading for debugging
}

/**
 * Merged company after deduplication (multiple entries → single company)
 */
export interface MergedEdgeCompany {
  name: string
  domain: string | null
  description: string | null
  edgeCategories: EdgeCategory[]
  systems: BiologicalSystem[]
  accessLevels: AccessLevel[]
  hasAffiliate: boolean
  notes: string | null
  category: string | null
}

// Map system numbers/names to BiologicalSystem type
const SYSTEM_MAP: Record<string, BiologicalSystem> = {
  "breath": "Breath",
  "breath system": "Breath",
  "circulation": "Circulation",
  "circulation system": "Circulation",
  "consciousness": "Consciousness",
  "consciousness system": "Consciousness",
  "defense": "Defense",
  "defense system": "Defense",
  "detoxification": "Detoxification",
  "detoxification system": "Detoxification",
  "digestive": "Digestive",
  "digestive system": "Digestive",
  "emotional": "Emotional",
  "emotional system": "Emotional",
  "energy production": "Energy Production",
  "energy production system": "Energy Production",
  "hormonal": "Hormonal",
  "hormonal system": "Hormonal",
  "hydration": "Hydration",
  "hydration system": "Hydration",
  "nervous system": "Nervous System",
  "regeneration": "Regeneration",
  "regeneration system": "Regeneration",
  "stress response": "Stress Response",
  "stress response system": "Stress Response",
  "structure & movement": "Structure & Movement",
  "structure & movement system": "Structure & Movement",
  "temperature": "Temperature",
  "temperature system": "Temperature",
}

// Map EDGE category names to EdgeCategory type
const EDGE_MAP: Record<string, EdgeCategory> = {
  "eliminate": "eliminate",
  "decode": "decode",
  "gain": "gain",
  "execute": "execute",
}

// Map guide sections to company_categories slugs
const SECTION_TO_CATEGORY: Record<string, string> = {
  // Cross-System Eliminate sections
  "environmental testing & toxin identification": "environment",
  "emf assessment & shielding": "environment",
  "digital interference reduction": "environment",
  "food quality & ingredient analysis": "environment",
  // Cross-System Decode sections
  "comprehensive lab testing platforms": "diagnostics_testing",
  "biological age testing": "diagnostics_testing",
  "wearable health monitors": "wearables_monitoring",
  "continuous glucose monitors": "wearables_monitoring",
  "genetic & genomic testing": "diagnostics_testing",
  "multi-omic platforms": "diagnostics_testing",
  // Cross-System Gain sections
  "practitioner supplement dispensing platforms": "supplements_compounds",
  "major practitioner supplement lines": "supplements_compounds",
  "longevity-specific supplement companies": "supplements_compounds",
  "compounding pharmacies": "supplements_compounds",
  // Cross-System Execute sections
  "health data platforms & coaching software": "wearables_monitoring",
  "habit tracking & accountability tools": "wearables_monitoring",
  "business execution for coaches": "wearables_monitoring",
  "education, media & professional development": "wearables_monitoring",
  // Specialty sections
  "food & nutrition products": "supplements_compounds",
  "longevity marketplace & platforms": "supplements_compounds",
  "longevity clinics & comprehensive programs": "longevity_clinics",
  "hormone therapy clinics & networks": "longevity_clinics",
  "regenerative medicine clinics & biologics": "longevity_clinics",
  "aesthetic procedures for structural restoration": "longevity_clinics",
  "additional tools & technology": "wearables_monitoring",
}

/**
 * Extract domain from a company name entry like "**Name** (domain.com)"
 * or "**Name** (domain.com) | description | ..."
 */
function extractNameAndDomain(cell: string): { name: string; domain: string | null } {
  // Remove bold markers
  let cleaned = cell.replace(/\*\*/g, "").trim()

  // Try to extract domain from parentheses: "Company Name (domain.com)"
  const parenMatch = cleaned.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (parenMatch) {
    const name = parenMatch[1].trim()
    const possibleDomain = parenMatch[2].trim()
    // Check if it looks like a domain
    if (possibleDomain.includes(".") && !possibleDomain.includes(" ")) {
      return { name, domain: possibleDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") }
    }
    // If not a domain (e.g. "see Cross-System"), keep it as part of the name
    return { name: cleaned, domain: null }
  }

  // Try: "Company Name" followed by domain on its own
  // Some entries are just "**Name**" with no domain
  return { name: cleaned, domain: null }
}

/**
 * Parse access levels from an access cell like "🟢 💰" or "🟡"
 */
function parseAccessAndAffiliate(cell: string): { accessLevels: AccessLevel[]; hasAffiliate: boolean } {
  const accessLevels: AccessLevel[] = []
  let hasAffiliate = false

  if (cell.includes("🟢")) accessLevels.push("consumer")
  if (cell.includes("🟡")) accessLevels.push("practitioner_facilitated")
  if (cell.includes("🔴")) accessLevels.push("practitioner_only")
  if (cell.includes("💰")) hasAffiliate = true

  // Default to consumer if no access indicator found
  if (accessLevels.length === 0) accessLevels.push("consumer")

  return { accessLevels, hasAffiliate }
}

/**
 * Parse a markdown table row into cells, handling pipes within content
 */
function parseTableRow(line: string): string[] {
  // Remove leading/trailing pipe and split
  const trimmed = line.replace(/^\|/, "").replace(/\|$/, "")
  return trimmed.split("|").map(cell => cell.trim())
}

/**
 * Try to resolve a system name from context string
 */
function resolveSystem(context: string): BiologicalSystem | null {
  const lower = context.toLowerCase().trim()

  // Try numbered format: "1. Breath System" or "1. Breath"
  const numberedMatch = lower.match(/^\d+\.\s*(.+?)(?:\s+system)?$/)
  if (numberedMatch) {
    const systemKey = numberedMatch[1].trim()
    return SYSTEM_MAP[systemKey] || SYSTEM_MAP[systemKey + " system"] || null
  }

  // Direct lookup
  return SYSTEM_MAP[lower] || SYSTEM_MAP[lower.replace(/\s+system$/, "")] || null
}

/**
 * Try to determine the company category from section context
 */
function resolveCategory(sectionHeading: string, system: BiologicalSystem | null): string | null {
  const lower = sectionHeading.toLowerCase().trim()

  // Direct mapping from section heading
  if (SECTION_TO_CATEGORY[lower]) {
    return SECTION_TO_CATEGORY[lower]
  }

  // If it's a system-specific section, try to infer category from system
  // This is a rough heuristic — many will need manual review
  return null
}

/**
 * Parse the bioEDGE Coach Resource Guide markdown into structured entries
 */
export function parseEdgeGuide(markdown: string): ParsedEdgeEntry[] {
  const lines = markdown.split("\n")
  const entries: ParsedEdgeEntry[] = []

  let currentSystem: BiologicalSystem | null = null
  let currentEdge: EdgeCategory | null = null
  let currentSection: string = ""
  let isInCrossSystem = false
  let isInTable = false
  let tableFormat: "4col" | "3col-website" | "3col-notes" | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Detect cross-system sections: "## Cross-System Resources: Eliminate"
    const crossSystemMatch = line.match(/^##\s+Cross-System Resources:\s*(\w+)/i)
    if (crossSystemMatch) {
      const edgeName = crossSystemMatch[1].toLowerCase()
      currentEdge = EDGE_MAP[edgeName] || null
      currentSystem = null
      isInCrossSystem = true
      isInTable = false
      continue
    }

    // Detect system sections: "### 1. Breath System" or "### 1. Breath"
    const systemMatch = line.match(/^###\s+(\d+)\.\s+(.+?)(?:\s+System)?$/i)
    if (systemMatch) {
      const systemName = systemMatch[2].trim()
      const resolved = resolveSystem(systemName)
      if (resolved) {
        currentSystem = resolved
        isInCrossSystem = false
        currentEdge = null
        isInTable = false
        continue
      }
    }

    // Detect specialty top-level sections: "## Food & Nutrition Products", "## Longevity Clinics & Comprehensive Programs", etc.
    const topSectionMatch = line.match(/^##\s+(.+)$/)
    if (topSectionMatch && !line.includes("Cross-System") && !line.includes("System-Specific") && !line.includes("How to Use") && !line.includes("What's in This Guide") && !line.includes("Diagnostics, Tools") && !line.includes("Notes for Coaches")) {
      const sectionName = topSectionMatch[1].trim()
      currentSection = sectionName
      currentSystem = null
      isInCrossSystem = false
      // Try to determine EDGE category from section name
      if (sectionName.toLowerCase().includes("food & nutrition")) {
        currentEdge = "gain"
      } else if (sectionName.toLowerCase().includes("longevity marketplace")) {
        currentEdge = "gain"
      } else if (sectionName.toLowerCase().includes("longevity clinics") || sectionName.toLowerCase().includes("hormone therapy")) {
        currentEdge = "gain"
      } else if (sectionName.toLowerCase().includes("additional tools")) {
        currentEdge = "gain"
      }
      isInTable = false
      continue
    }

    // Detect subsection headings: "### Environmental Testing & Toxin Identification"
    // or "**Regenerative Medicine Clinics & Biologics**" (bold headings within system sections)
    const subSectionMatch = line.match(/^###\s+(.+)$/)
    if (subSectionMatch && !systemMatch) {
      currentSection = subSectionMatch[1].trim()
      isInTable = false
      continue
    }

    // Detect EDGE category: "**Eliminate**" or "**Decode**" etc.
    const edgeMatch = line.match(/^\*\*(\w+)\*\*$/)
    if (edgeMatch) {
      const edgeName = edgeMatch[1].toLowerCase()
      if (EDGE_MAP[edgeName]) {
        currentEdge = EDGE_MAP[edgeName]
        isInTable = false
        continue
      }
    }

    // Also detect bold subsection headings within a system like "**Regenerative Medicine Clinics & Biologics**"
    const boldSubSectionMatch = line.match(/^\*\*(.{10,})\*\*$/)
    if (boldSubSectionMatch && !EDGE_MAP[boldSubSectionMatch[1].toLowerCase()]) {
      currentSection = boldSubSectionMatch[1].trim()
      isInTable = false
      continue
    }

    // Detect table header
    if (line.startsWith("| Company |")) {
      isInTable = true
      if (line.includes("What It Does")) {
        tableFormat = "4col"
      } else if (line.includes("Website") && line.includes("Access")) {
        tableFormat = "3col-website"
      } else if (line.includes("Website") && line.includes("Notes")) {
        tableFormat = "3col-notes"
      } else {
        tableFormat = "4col" // default
      }
      continue
    }

    // Skip table separator row
    if (line.match(/^\|[-\s|]+\|$/)) {
      continue
    }

    // Parse table data rows
    if (isInTable && line.startsWith("|") && currentEdge) {
      const cells = parseTableRow(line)

      if (cells.length < 2) continue

      let name: string
      let domain: string | null
      let description: string | null = null
      let accessLevels: AccessLevel[] = ["consumer"]
      let hasAffiliate = false
      let notes: string | null = null

      if (tableFormat === "4col" && cells.length >= 4) {
        // | **Company** (domain) | What It Does | Access | Notes |
        const nameResult = extractNameAndDomain(cells[0])
        name = nameResult.name
        domain = nameResult.domain
        description = cells[1]?.trim() || null
        const accessResult = parseAccessAndAffiliate(cells[2] || "")
        accessLevels = accessResult.accessLevels
        hasAffiliate = accessResult.hasAffiliate
        notes = cells[3]?.trim() || null
      } else if (tableFormat === "3col-website" && cells.length >= 3) {
        // | **Company** | domain.com | Access | Notes |
        name = cells[0].replace(/\*\*/g, "").trim()
        domain = cells[1]?.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") || null
        const accessResult = parseAccessAndAffiliate(cells[2] || "")
        accessLevels = accessResult.accessLevels
        hasAffiliate = accessResult.hasAffiliate
        notes = cells[3]?.trim() || null
      } else if (tableFormat === "3col-notes" && cells.length >= 3) {
        // | **Company** | domain.com | Notes |
        name = cells[0].replace(/\*\*/g, "").trim()
        domain = cells[1]?.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") || null
        notes = cells[2]?.trim() || null
      } else {
        // Fallback: try to extract whatever we can
        const nameResult = extractNameAndDomain(cells[0])
        name = nameResult.name
        domain = nameResult.domain
        description = cells[1]?.trim() || null
        if (cells.length >= 3) {
          const accessResult = parseAccessAndAffiliate(cells[2] || "")
          accessLevels = accessResult.accessLevels
          hasAffiliate = accessResult.hasAffiliate
        }
        notes = cells.length >= 4 ? cells[3]?.trim() || null : null
      }

      // Skip generic/non-company entries (like "Resistance training", "The gym", "No company needed")
      if (!name || name.length < 2) continue
      const skipPatterns = [
        /^(resistance training|the gym|no company needed|fasting protocols)/i,
        /^(sleep tracking|daily|weekly|monthly|hourly|morning|boundary|training log|urine color|water tracking|basal body|cycle tracking|cold exposure|fear-avoidance|stress audit|caloric adequacy|caffeine)/i,
        /^(grip strength|functional movement|zero fasting|biological age retest|coach prescribes|coaching conversation)/i,
      ]
      if (skipPatterns.some(p => p.test(name))) continue

      // Build systems array
      const systems: BiologicalSystem[] = currentSystem ? [currentSystem] : []

      // Determine category from section context
      const category = resolveCategory(currentSection, currentSystem)

      entries.push({
        name,
        domain: domain && domain.length > 0 ? domain : null,
        description: description && description.length > 0 ? description : null,
        edgeCategory: currentEdge,
        systems,
        accessLevels,
        hasAffiliate,
        notes: notes && notes.length > 0 ? notes : null,
        category,
        sectionContext: currentSection || (currentSystem ? `${currentSystem} System` : "Unknown"),
      })
    }

    // Detect end of table (empty line or non-table content)
    if (isInTable && !line.startsWith("|") && line.length > 0 && !line.startsWith("*")) {
      isInTable = false
    }
  }

  return entries
}

/**
 * Merge duplicate entries (same company appearing in multiple systems/EDGE categories)
 * into single companies with arrays of systems and edge categories
 */
export function mergeEntries(entries: ParsedEdgeEntry[]): MergedEdgeCompany[] {
  const byKey = new Map<string, MergedEdgeCompany>()

  for (const entry of entries) {
    // Use domain as primary key, fall back to lowercase name
    const key = entry.domain || entry.name.toLowerCase().replace(/[^\w]/g, "")

    if (byKey.has(key)) {
      const existing = byKey.get(key)!
      // Merge edge categories
      if (!existing.edgeCategories.includes(entry.edgeCategory)) {
        existing.edgeCategories.push(entry.edgeCategory)
      }
      // Merge systems
      for (const sys of entry.systems) {
        if (!existing.systems.includes(sys)) {
          existing.systems.push(sys)
        }
      }
      // Merge access levels
      for (const level of entry.accessLevels) {
        if (!existing.accessLevels.includes(level)) {
          existing.accessLevels.push(level)
        }
      }
      // Merge affiliate (true wins)
      if (entry.hasAffiliate) existing.hasAffiliate = true
      // Keep first non-null description
      if (!existing.description && entry.description) {
        existing.description = entry.description
      }
      // Append notes
      if (entry.notes && entry.notes !== existing.notes) {
        existing.notes = existing.notes
          ? `${existing.notes} | ${entry.notes}`
          : entry.notes
      }
      // Keep first non-null category
      if (!existing.category && entry.category) {
        existing.category = entry.category
      }
    } else {
      byKey.set(key, {
        name: entry.name,
        domain: entry.domain,
        description: entry.description,
        edgeCategories: [entry.edgeCategory],
        systems: [...entry.systems],
        accessLevels: [...entry.accessLevels],
        hasAffiliate: entry.hasAffiliate,
        notes: entry.notes,
        category: entry.category,
      })
    }
  }

  return Array.from(byKey.values())
}
