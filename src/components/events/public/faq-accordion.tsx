"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string | null
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
  defaultOpen?: number // Index of item to open by default
}

export function FAQAccordion({ items, className = "", defaultOpen }: FAQAccordionProps) {
  // Initialize with default open item if specified
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (defaultOpen !== undefined && items[defaultOpen]) {
      return new Set([items[defaultOpen].id])
    }
    return new Set()
  })
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Group items by category if categories exist
  const hasCategories = items.some((item) => item.category)

  if (hasCategories) {
    const grouped = items.reduce((acc, item) => {
      const category = item.category || "General"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {} as Record<string, FAQItem[]>)

    // Sort categories alphabetically, but put "General" last
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      if (a === "General") return 1
      if (b === "General") return -1
      return a.localeCompare(b)
    })

    return (
      <div className={cn("space-y-4", className)}>
        {sortedCategories.map((category) => {
          const categoryItems = grouped[category]
          const isCategoryOpen = openCategories.has(category)

          return (
            <div key={category} className="border rounded-lg overflow-hidden bg-card">
              {/* Category Header - Collapsible */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors bg-muted/30"
                aria-expanded={isCategoryOpen}
              >
                <span className="font-semibold text-lg capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {categoryItems.length} {categoryItems.length === 1 ? "question" : "questions"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                      isCategoryOpen && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {/* Category Content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isCategoryOpen ? "max-h-[2000px]" : "max-h-0"
                )}
              >
                <div className="p-4 pt-2 space-y-3">
                  {categoryItems.map((item) => (
                    <FAQItemComponent
                      key={item.id}
                      item={item}
                      isOpen={openItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <FAQItemComponent
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  )
}

interface FAQItemComponentProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}

function FAQItemComponent({ item, isOpen, onToggle }: FAQItemComponentProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="p-4 pt-0 text-muted-foreground whitespace-pre-wrap">
          {item.answer}
        </div>
      </div>
    </div>
  )
}
