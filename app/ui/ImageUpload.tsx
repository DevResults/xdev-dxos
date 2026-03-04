import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { useRef, useState } from "react"
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { cx } from "~/lib/cx"
import { resizeImage } from "~/lib/resizeImage"

/** A drag-and-drop image upload field bound to a form field, with auto-save. */
export function ImageUpload<T extends FieldValues>({
  form,
  name,
  label,
  saveOnBlur,
  imageClassName,
}: Props<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const currentValue = field.value as string | undefined

        const handleFile = async (file: File) => {
          const dataUrl = await resizeImage(file)
          field.onChange(dataUrl)
          void saveOnBlur(name)()
        }

        const handleFileSelect = (files: FileList | null) => {
          const file = files?.[0]
          if (file) void handleFile(file)
        }

        const handleRemove = () => {
          field.onChange("")
          void saveOnBlur(name)()
        }

        const handleDragOver = (e: React.DragEvent) => {
          e.preventDefault()
          setIsDragging(true)
        }

        const handleDragLeave = (e: React.DragEvent) => {
          e.preventDefault()
          setIsDragging(false)
        }

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault()
          setIsDragging(false)
          handleFileSelect(e.dataTransfer.files)
        }

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div>
                {currentValue ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={currentValue}
                      alt="Image preview"
                      className={cx("size-20 object-cover", imageClassName ?? "rounded-full")}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-sm text-primary-600 hover:text-primary-700"
                        onClick={() => fileInputRef.current?.click()}
                        title="Change"
                      >
                        <IconPencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="text-sm text-neutral-500 hover:text-neutral-700"
                        onClick={handleRemove}
                        title="Remove"
                      >
                        <IconTrash className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cx(
                      "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center",
                      isDragging
                        ? "border-primary-400 bg-primary-50"
                        : "border-neutral-300 hover:border-neutral-400",
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadIcon />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    handleFileSelect(e.target.files)
                    e.target.value = ""
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

/** Upload arrow icon. */
function UploadIcon() {
  return (
    <div className="mb-2 rounded-full bg-neutral-100 p-3">
      <IconUpload className="size-5 text-neutral-500" />
    </div>
  )
}

type Props<T extends FieldValues> = {
  /** The react-hook-form instance. */
  form: UseFormReturn<T>
  /** The field name to bind to. */
  name: FieldPath<T>
  /** The visible label for the field. */
  label?: string
  /** Returns a blur handler that validates and saves the given field. */
  saveOnBlur: (name: FieldPath<T>) => () => Promise<void>
  /** Custom classes for the image preview (defaults to `rounded-full`). */
  imageClassName?: string
}
