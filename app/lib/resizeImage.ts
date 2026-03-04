/**
 * Resize an image file to fit within max dimensions and return a JPEG data URL.
 * Uses an offscreen canvas for resizing.
 */
export async function resizeImage(
  /** The image file to resize. */
  file: File,
  /** Maximum width/height in pixels. */
  maxSize = 256,
  /** JPEG quality (0–1). */
  quality = 0.8,
): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality })
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read resized image"))
    reader.readAsDataURL(blob)
  })
}
