import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/upload
 *
 * Handles image uploads to Supabase Storage.
 * Expects multipart form data with:
 * - file: The image file
 * - bucket: Storage bucket name (article-images, company-logos, contact-avatars)
 * - path: Storage path within the bucket
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const path = formData.get("path") as string

    if (!file || !bucket || !path) {
      return NextResponse.json(
        { error: "Missing required fields: file, bucket, path" },
        { status: 400 }
      )
    }

    // Validate bucket name
    const allowedBuckets = ["article-images", "company-logos", "contact-avatars"]
    if (!allowedBuckets.includes(bucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Allowed: ${allowedBuckets.join(", ")}` },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 5MB" },
        { status: 400 }
      )
    }

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true, // Overwrite if exists
      })

    if (error) {
      console.error("Supabase storage error:", error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}
