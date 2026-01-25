import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/media/[id]
 * Get a single media item
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: media, error } = await supabase
      .from("media_library")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching media:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error in GET /api/media/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/media/[id]
 * Update media metadata
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const allowedFields = [
      "alt_text",
      "caption",
      "folder",
      "tags",
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: media, error } = await supabase
      .from("media_library")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating media:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error in PATCH /api/media/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/media/[id]
 * Delete a media item and its file
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get the media record first to get the file path
    const { data: media, error: fetchError } = await supabase
      .from("media_library")
      .select("file_path")
      .eq("id", id)
      .single()

    if (fetchError || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("media")
      .remove([media.file_path])

    if (storageError) {
      console.error("Error deleting file from storage:", storageError)
      // Continue anyway to delete the database record
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("media_library")
      .delete()
      .eq("id", id)

    if (dbError) {
      console.error("Error deleting media record:", dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/media/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
