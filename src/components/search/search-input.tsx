"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

interface SearchInputProps {
  defaultValue?: string
}

export function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length >= 2) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("q", query.trim())
      startTransition(() => {
        router.push(`/search?${params.toString()}`)
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search articles, leaders, companies, events..."
        className="w-full rounded-lg border-0 bg-white py-4 pl-12 pr-4 text-navy shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
        autoFocus
      />
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      {isPending && (
        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-electric-blue border-t-transparent" />
        </div>
      )}
    </form>
  )
}
