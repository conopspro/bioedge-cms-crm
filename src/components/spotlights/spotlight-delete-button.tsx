"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface SpotlightDeleteButtonProps {
  id: string
  title: string
}

export function SpotlightDeleteButton({ id, title }: SpotlightDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("spotlights")
      .delete()
      .eq("id", id)

    if (!error) {
      router.refresh()
    } else {
      console.error("Failed to delete:", error)
      alert("Failed to delete spotlight")
    }
    setIsDeleting(false)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
