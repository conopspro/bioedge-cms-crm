"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  IMAGE_SIZES,
  type ImageType,
  validateImageFile,
  cropAndResizeImage,
  resizeImage,
  generateStorageFilename,
  formatFileSize,
} from "@/lib/image-utils"

interface ImageUploadProps {
  /** Type of image (determines size constraints) */
  imageType: ImageType
  /** Current image URL (for preview) */
  value?: string | null
  /** Called when image is uploaded successfully */
  onUpload: (url: string, storagePath: string) => void
  /** Called when image is removed */
  onRemove?: () => void
  /** Entity type for storage path */
  entityType: "article" | "company" | "contact" | "event"
  /** Entity ID for storage path */
  entityId: string
  /** Whether to crop to exact dimensions (true) or resize to fit (false) */
  cropToFit?: boolean
  /** Additional class names */
  className?: string
  /** Disabled state */
  disabled?: boolean
}

/**
 * Image Upload Component
 *
 * Handles image selection, validation, resizing/cropping, and upload to Supabase.
 * Provides drag-and-drop support and preview functionality.
 */
export function ImageUpload({
  imageType,
  value,
  onUpload,
  onRemove,
  entityType,
  entityId,
  cropToFit = true,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = IMAGE_SIZES[imageType]
  const bucketMap: Record<string, string> = {
    article: "article-images",
    company: "company-logos",
    contact: "contact-avatars",
    event: "event-images",
  }

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null)
      setUploadSuccess(false)

      // Validate file
      const validation = validateImageFile(file, imageType)
      if (!validation.valid) {
        setError(validation.error || "Invalid file")
        return
      }

      setIsUploading(true)

      try {
        // Resize/crop the image
        let processedBlob: Blob
        if (cropToFit) {
          processedBlob = await cropAndResizeImage(
            file,
            config.width,
            config.height
          )
        } else {
          processedBlob = await resizeImage(file, config.width, config.height)
        }

        // Generate storage path
        const storagePath = generateStorageFilename(
          entityType,
          entityId,
          file.name
        )

        // Create FormData for upload
        const formData = new FormData()
        formData.append("file", processedBlob, file.name)
        formData.append("bucket", bucketMap[entityType])
        formData.append("path", storagePath)

        // Upload to API
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Upload failed")
        }

        onUpload(data.url, data.path)
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 2000)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed")
      } finally {
        setIsUploading(false)
      }
    },
    [imageType, entityType, entityId, cropToFit, config, onUpload, bucketMap]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (disabled || isUploading) return

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [disabled, isUploading, handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset input so same file can be selected again
    e.target.value = ""
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.()
    setError(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Drop zone / Preview */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors cursor-pointer",
          isDragOver && "border-primary bg-primary/5",
          !isDragOver && !value && "border-muted-foreground/25 hover:border-muted-foreground/50",
          value && "border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "cursor-wait"
        )}
        style={{
          aspectRatio: `${config.width} / ${config.height}`,
          maxWidth: imageType === "article" ? "100%" : `${config.width}px`,
        }}
      >
        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          </div>
        )}

        {/* Success overlay */}
        {uploadSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg z-10">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        )}

        {/* Image preview */}
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover rounded-lg"
            />
            {/* Remove button */}
            {onRemove && !disabled && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragOver ? "Drop image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs">
                {config.width}x{config.height}px, max {formatFileSize(config.maxFileSize)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={config.formats.join(",")}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Upload button (alternative to click/drag) */}
      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full gap-2"
        >
          <Upload className="h-4 w-4" />
          Choose Image
        </Button>
      )}
    </div>
  )
}
