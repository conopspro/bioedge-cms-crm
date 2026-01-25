"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface InlineEditFieldProps {
  value: string
  onSave: (value: string) => Promise<void>
  type?: "text" | "textarea"
  placeholder?: string
  className?: string
  displayClassName?: string
  rows?: number
}

/**
 * Inline Edit Field Component
 *
 * Allows inline editing of text fields with save/cancel functionality.
 */
export function InlineEditField({
  value,
  onSave,
  type = "text",
  placeholder = "Click to edit...",
  className,
  displayClassName,
  rows = 3,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // For textarea, move cursor to end
      if (type === "textarea") {
        const length = inputRef.current.value.length
        inputRef.current.setSelectionRange(length, length)
      }
    }
  }, [isEditing, type])

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (e) {
      console.error("Failed to save:", e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel()
    }
    if (e.key === "Enter" && type === "text") {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Enter" && e.metaKey && type === "textarea") {
      e.preventDefault()
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <div className={cn("flex gap-2", className)}>
        {type === "textarea" ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={rows}
            className="flex-1"
            disabled={isSaving}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isSaving}
          />
        )}
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-8 w-8"
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group cursor-pointer rounded-md px-2 py-1 -mx-2 -my-1 hover:bg-muted/50 transition-colors",
        displayClassName
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn(!value && "text-muted-foreground italic")}>
          {value || placeholder}
        </span>
        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
      </div>
    </div>
  )
}
