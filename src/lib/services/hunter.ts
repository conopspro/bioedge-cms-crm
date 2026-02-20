/**
 * Hunter.io API Integration
 *
 * Provides email finder and domain search capabilities for enriching
 * contacts and companies with verified professional data.
 *
 * API Docs: https://hunter.io/api-documentation
 */

const HUNTER_API_BASE = "https://api.hunter.io/v2"

interface HunterEmail {
  value: string
  type: string | null
  confidence: number
  first_name: string | null
  last_name: string | null
  position: string | null
  seniority: string | null
  department: string | null
  linkedin: string | null
  twitter: string | null
  phone_number: string | null
  verification: {
    date: string | null
    status: string
  }
}

interface HunterDomainSearchResponse {
  data: {
    domain: string
    disposable: boolean
    webmail: boolean
    accept_all: boolean
    pattern: string | null
    organization: string | null
    description: string | null
    industry: string | null
    twitter: string | null
    facebook: string | null
    linkedin: string | null
    instagram: string | null
    youtube: string | null
    technologies: string[]
    country: string | null
    state: string | null
    city: string | null
    postal_code: string | null
    street: string | null
    headcount: string | null
    company_type: string | null
    emails: HunterEmail[]
  }
  meta: {
    results: number
    limit: number
    offset: number
    params: {
      domain: string
      company: string | null
      type: string | null
      seniority: string | null
      department: string | null
    }
  }
}

interface HunterEmailFinderResponse {
  data: {
    first_name: string
    last_name: string
    email: string
    score: number
    domain: string
    accept_all: boolean
    position: string | null
    twitter: string | null
    linkedin_url: string | null
    phone_number: string | null
    company: string | null
    sources: Array<{
      domain: string
      uri: string
      extracted_on: string
      last_seen_on: string
      still_on_page: boolean
    }>
    verification: {
      date: string | null
      status: string
    }
  }
  meta: {
    params: {
      first_name: string
      last_name: string
      full_name: string | null
      domain: string
      company: string | null
      max_duration: number | null
    }
  }
}

interface HunterEmailVerifyResponse {
  data: {
    status: "valid" | "invalid" | "accept_all" | "webmail" | "disposable" | "unknown"
    result: "deliverable" | "undeliverable" | "risky" | "unknown"
    score: number
    email: string
    regexp: boolean
    gibberish: boolean
    disposable: boolean
    webmail: boolean
    mx_records: boolean
    smtp_server: boolean
    smtp_check: boolean
    accept_all: boolean
    block: boolean
    sources: Array<{
      domain: string
      uri: string
      extracted_on: string
      last_seen_on: string
      still_on_page: boolean
    }>
  }
}

interface HunterAccountResponse {
  data: {
    first_name: string
    last_name: string
    email: string
    plan_name: string
    plan_level: number
    reset_date: string
    team_id: number | null
    calls: {
      used: number
      available: number
    }
    requests: {
      searches: {
        used: number
        available: number
      }
      verifications: {
        used: number
        available: number
      }
    }
  }
}

export interface DomainSearchResult {
  organization: string | null
  description: string | null
  industry: string | null
  technologies: string[]
  headcount: string | null
  companyType: string | null
  country: string | null
  acceptAll: boolean
  socialProfiles: {
    linkedin: string | null
    twitter: string | null
    facebook: string | null
    instagram: string | null
  }
  emails: Array<{
    email: string
    firstName: string | null
    lastName: string | null
    position: string | null
    seniority: string | null
    department: string | null
    confidence: number
    linkedin: string | null
    twitter: string | null
    phone: string | null
    verified: boolean
  }>
  totalResults: number
}

export interface EmailFinderResult {
  email: string
  score: number
  position: string | null
  linkedin: string | null
  twitter: string | null
  phone: string | null
  company: string | null
  verified: boolean
  verificationStatus: string
}

export interface EmailVerifyResult {
  email: string
  status: string
  result: string
  score: number
  isDeliverable: boolean
  isRisky: boolean
}

export interface HunterAccountInfo {
  planName: string
  callsUsed: number
  callsAvailable: number
  searchesUsed: number
  searchesAvailable: number
  verificationsUsed: number
  verificationsAvailable: number
  resetDate: string
}

class HunterService {
  private apiKey: string | null

  constructor() {
    this.apiKey = process.env.HUNTER_API_KEY || null
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error("Hunter.io API key not configured. Set HUNTER_API_KEY environment variable.")
    }

    const url = new URL(`${HUNTER_API_BASE}${endpoint}`)
    url.searchParams.set("api_key", this.apiKey)
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ details: "Unknown error" }] }))
      throw new Error(error.errors?.[0]?.details || `Hunter API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Search for email addresses and company info by domain
   */
  async domainSearch(domain: string, options?: {
    type?: "personal" | "generic"
    seniority?: string
    department?: string
    limit?: number
  }): Promise<DomainSearchResult> {
    const params: Record<string, string> = { domain }
    if (options?.type) params.type = options.type
    if (options?.seniority) params.seniority = options.seniority
    if (options?.department) params.department = options.department
    if (options?.limit) params.limit = options.limit.toString()

    const response = await this.fetch<HunterDomainSearchResponse>("/domain-search", params)
    const data = response.data

    return {
      organization: data.organization,
      description: data.description,
      industry: data.industry,
      technologies: data.technologies || [],
      headcount: data.headcount,
      companyType: data.company_type,
      country: data.country,
      acceptAll: data.accept_all,
      socialProfiles: {
        linkedin: data.linkedin,
        twitter: data.twitter,
        facebook: data.facebook,
        instagram: data.instagram,
      },
      emails: data.emails.map(email => ({
        email: email.value,
        firstName: email.first_name,
        lastName: email.last_name,
        position: email.position,
        seniority: email.seniority,
        department: email.department,
        confidence: email.confidence,
        linkedin: email.linkedin,
        twitter: email.twitter,
        phone: email.phone_number,
        verified: email.verification?.status === "valid",
      })),
      totalResults: response.meta.results,
    }
  }

  /**
   * Find a specific person's email by name and domain
   */
  async emailFinder(
    domain: string,
    firstName: string,
    lastName: string
  ): Promise<EmailFinderResult> {
    const response = await this.fetch<HunterEmailFinderResponse>("/email-finder", {
      domain,
      first_name: firstName,
      last_name: lastName,
    })
    const data = response.data

    return {
      email: data.email,
      score: data.score,
      position: data.position,
      linkedin: data.linkedin_url,
      twitter: data.twitter,
      phone: data.phone_number,
      company: data.company,
      verified: data.verification?.status === "valid",
      verificationStatus: data.verification?.status || "unknown",
    }
  }

  /**
   * Verify if an email address is valid
   */
  async verifyEmail(email: string): Promise<EmailVerifyResult> {
    const response = await this.fetch<HunterEmailVerifyResponse>("/email-verifier", { email })
    const data = response.data

    return {
      email: data.email,
      status: data.status,
      result: data.result,
      score: data.score,
      isDeliverable: data.result === "deliverable",
      isRisky: data.result === "risky",
    }
  }

  /**
   * Get account info and remaining credits
   */
  async getAccountInfo(): Promise<HunterAccountInfo> {
    const response = await this.fetch<HunterAccountResponse>("/account")
    const data = response.data

    return {
      planName: data.plan_name,
      callsUsed: data.calls.used,
      callsAvailable: data.calls.available,
      searchesUsed: data.requests.searches.used,
      searchesAvailable: data.requests.searches.available,
      verificationsUsed: data.requests.verifications.used,
      verificationsAvailable: data.requests.verifications.available,
      resetDate: data.reset_date,
    }
  }
}

// Export singleton instance
export const hunterService = new HunterService()
