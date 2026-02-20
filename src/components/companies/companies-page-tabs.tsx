"use client"

import Link from "next/link"
import { Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompaniesTable } from "@/components/companies/companies-table"
import { CategorySettings } from "@/components/companies/category-settings"

interface Company {
  id: string
  name: string
  slug: string | null
  domain: string | null
  logo_url: string | null
  website: string | null
  description: string | null
  category: string | null
  linkedin_url: string | null
  twitter_url: string | null
  email: string | null
  phone: string | null
  address: string | null
  founded_year: number | null
  employee_count: string | null
  funding_stage: string | null
  total_funding: number | null
  headquarters: string | null
  status: string | null
  notes: string | null
  is_featured?: boolean
  created_at: string
  updated_at: string
}

interface CompaniesPageTabsProps {
  companies: Company[]
}

/**
 * Companies Page Tabs
 *
 * Provides tabbed navigation between Companies list and Settings.
 */
export function CompaniesPageTabs({ companies }: CompaniesPageTabsProps) {
  return (
    <Tabs defaultValue="companies" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">
            Manage your company database and research.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="companies" className="space-y-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/companies/import">
              <Upload className="mr-2 h-4 w-4" />
              Import Companies
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/companies/new/edit">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Link>
          </Button>
        </div>
        <CompaniesTable companies={companies as any} />
      </TabsContent>

      <TabsContent value="settings">
        <CategorySettings />
      </TabsContent>
    </Tabs>
  )
}
