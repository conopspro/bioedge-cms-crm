/**
 * Image Utilities
 *
 * Helper functions for image processing, validation, and resizing.
 */

/** Standard image sizes for the application */
export const IMAGE_SIZES = {
  /** Article featured images for social sharing (Open Graph standard) */
  article: {
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630, // ~1.9:1
    maxFileSize: 5 * 1024 * 1024, // 5MB
    formats: ["image/jpeg", "image/png", "image/webp"],
  },
  /** Company logos (square) */
  logo: {
    width: 400,
    height: 400,
    aspectRatio: 1,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    formats: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  },
  /** Contact avatars (square) */
  avatar: {
    width: 400,
    height: 400,
    aspectRatio: 1,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    formats: ["image/jpeg", "image/png", "image/webp"],
  },
  /** Book thumbnails (portrait) */
  bookThumbnail: {
    width: 200,
    height: 300,
    aspectRatio: 200 / 300, // ~0.67:1
    maxFileSize: 1 * 1024 * 1024, // 1MB
    formats: ["image/jpeg", "image/png", "image/webp"],
  },
} as const

export type ImageType = keyof typeof IMAGE_SIZES

/**
 * Validate an image file
 */
export function validateImageFile(
  file: File,
  imageType: ImageType
): { valid: boolean; error?: string } {
  const config = IMAGE_SIZES[imageType]

  // Check file type
  if (!(config.formats as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${config.formats.join(", ")}`,
    }
  }

  // Check file size
  if (file.size > config.maxFileSize) {
    const maxMB = config.maxFileSize / (1024 * 1024)
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxMB}MB`,
    }
  }

  return { valid: true }
}

/**
 * Get image dimensions from a File object
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error("Failed to load image"))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Resize an image to fit within specified dimensions while maintaining aspect ratio
 * Uses canvas for client-side resizing
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Create canvas and draw resized image
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to create blob"))
          }
        },
        file.type === "image/png" ? "image/png" : "image/jpeg",
        quality
      )

      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error("Failed to load image"))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Crop and resize an image to exact dimensions (center crop)
 * Used for logos and avatars that need to be square
 */
export async function cropAndResizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = img

      // Calculate crop dimensions to maintain aspect ratio
      const targetRatio = targetWidth / targetHeight
      const sourceRatio = width / height

      let cropWidth = width
      let cropHeight = height
      let cropX = 0
      let cropY = 0

      if (sourceRatio > targetRatio) {
        // Image is wider - crop sides
        cropWidth = height * targetRatio
        cropX = (width - cropWidth) / 2
      } else {
        // Image is taller - crop top/bottom
        cropHeight = width / targetRatio
        cropY = (height - cropHeight) / 2
      }

      // Create canvas
      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      // Draw cropped and resized image
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, // Source rectangle
        0, 0, targetWidth, targetHeight // Destination rectangle
      )

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to create blob"))
          }
        },
        file.type === "image/png" ? "image/png" : "image/jpeg",
        quality
      )

      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error("Failed to load image"))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate a unique filename for storage
 */
export function generateStorageFilename(
  entityType: string,
  entityId: string,
  originalFilename: string
): string {
  const extension = originalFilename.split(".").pop() || "jpg"
  const timestamp = Date.now()
  return `${entityType}/${entityId}/${timestamp}.${extension}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
