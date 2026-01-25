"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchSelectOption {
  value: string
  label: string
  sublabel?: string
}

interface SearchSelectProps {
  options: SearchSelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

/**
 * SearchSelect - A searchable dropdown component
 *
 * Allows users to type to filter through options, perfect for large lists.
 */
export function SearchSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Type to search...",
  emptyMessage = "No results found",
  className,
  disabled = false,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value)

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options.slice(0, 50) // Limit initial display
    const searchLower = search.toLowerCase()
    return options
      .filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchLower) ||
          opt.sublabel?.toLowerCase().includes(searchLower)
      )
      .slice(0, 50)
  }, [options, search])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle selection
  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setOpen(false)
    setSearch("")
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange("")
    setSearch("")
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setOpen(!open)
            if (!open) {
              setTimeout(() => inputRef.current?.focus(), 0)
            }
          }
        }}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <X
              className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleClear}
            />
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-2 py-1.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              autoComplete="off"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1">
            {/* None option */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                !value && "bg-accent/50"
              )}
            >
              <Check className={cn("mr-2 h-4 w-4", value ? "opacity-0" : "opacity-100")} />
              <span className="text-muted-foreground">None</span>
            </button>

            {filteredOptions.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent/50"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col items-start min-w-0">
                    <span className="truncate">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-xs text-muted-foreground truncate">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}

            {filteredOptions.length === 50 && !search && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t mt-1">
                Type to search more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
