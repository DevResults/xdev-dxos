import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { useRef, useState } from "react"
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { cx } from "~/lib/cx"
import { resizeImage } from "~/lib/resizeImage"

/** A drag-and-drop image upload field bound to a form field, with auto-save. */
export function ImageUpload<T extends FieldValues>({ form, name, label, saveOnBlur }: Props<T>) {
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
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div>
                {currentValue ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={currentValue}
                      alt="Avatar preview"
                      className="size-20 rounded-full object-cover"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-sm text-primary-600 hover:text-primary-700"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="text-sm text-neutral-500 hover:text-neutral-700"
                        onClick={handleRemove}
                      >
                        Remove
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
                    <p className="text-sm font-medium text-neutral-700">Drop an image here</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      or{" "}
                      <span className="cursor-pointer font-medium text-primary-600 hover:text-primary-700">
                        click to browse
                      </span>
                    </p>
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5 text-neutral-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    </div>
  )
}

type Props<T extends FieldValues> = {
  /** The react-hook-form instance. */
  form: UseFormReturn<T>
  /** The field name to bind to. */
  name: FieldPath<T>
  /** The visible label for the field. */
  label: string
  /** Returns a blur handler that validates and saves the given field. */
  saveOnBlur: (name: FieldPath<T>) => () => Promise<void>
}
