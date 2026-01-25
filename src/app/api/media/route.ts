import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Route segment config for App Router
export const maxDuration = 60 // seconds
export const dynamic = "force-dynamic"

/**
 * GET /api/media
 * List all media items with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const folder = searchParams.get("folder")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("media_library")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (folder && folder !== "all") {
      query = query.eq("folder", folder)
    }

    if (search) {
      query = query.or(`filename.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`)
    }

    const { data: media, error, count } = await query

    if (error) {
      console.error("Error fetching media:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      items: media,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error in GET /api/media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/media
 * Upload a new media item
 */
export async function POST(request: NextRequest) {
  console.log("=== POST /api/media called ===")
  try {
    const supabase = await createClient()
    console.log("Supabase client created")

    const formData = await request.formData()
    console.log("FormData received")

    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"
    const altText = formData.get("alt_text") as string
    const caption = formData.get("caption") as string

    console.log("File:", file?.name, "Size:", file?.size, "Type:", file?.type, "Folder:", folder)

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log("Auth check - user:", user?.id, "error:", authError?.message)
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Authentication required", authError: authError?.message }, { status: 401 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${sanitizedName}`
    const filePath = `${folder}/${filename}`

    // Convert File to ArrayBuffer for Supabase storage
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    console.log("Uploading to storage:", filePath)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    console.log("Storage upload result - data:", uploadData, "error:", uploadError)

    if (uploadError) {
      console.error("Error uploading file to storage:", JSON.stringify(uploadError, null, 2))
      return NextResponse.json({
        error: uploadError.message || "Storage upload failed",
        code: (uploadError as any).statusCode || (uploadError as any).status || "unknown",
        name: (uploadError as any).name || "StorageError"
      }, { status: 500 })
    }

    console.log("Storage upload successful")

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("media")
      .getPublicUrl(filePath)

    const fileUrl = urlData.publicUrl

    // Create thumbnail URL (Supabase image transformations)
    const thumbnailUrl = `${fileUrl}?width=200&height=200&resize=contain`

    // Save to media_library table
    const { data: mediaRecord, error: dbError } = await supabase
      .from("media_library")
      .insert({
        filename,
        original_filename: file.name,
        file_path: filePath,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl,
        file_size: file.size,
        mime_type: file.type,
        folder,
        alt_text: altText || null,
        caption: caption || null,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Error saving media record to database:", dbError)
      // Try to clean up uploaded file
      await supabase.storage.from("media").remove([filePath])
      return NextResponse.json({
        error: dbError.message || "Database insert failed",
        details: dbError
      }, { status: 500 })
    }

    return NextResponse.json(mediaRecord)
  } catch (error) {
    console.error("Error in POST /api/media:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 })
  }
}
