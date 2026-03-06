import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import * as chrono from "chrono-node"
import { format, parse } from "date-fns"
import { useRef, useState } from "react"
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { cx } from "~/lib/cx"
import { Calendar } from "~/ui/shadcn/calendar"
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/ui/shadcn/input-group"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "~/ui/shadcn/popover"

/** A labeled date input that accepts typed dates in any format, with a calendar picker. */
export function DateInput<T extends FieldValues>({ form, name, label, saveOnBlur }: Props<T>) {
  const [open, setOpen] = useState(false)
  const [textValue, setTextValue] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const dateValue = parseStoredDate(field.value as string | undefined)
        const displayValue = isEditing
          ? textValue
          : dateValue
            ? format(dateValue, "MMM d, yyyy")
            : ""

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverAnchor>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      ref={inputRef}
                      placeholder="Pick a date"
                      value={displayValue}
                      className={cx(!dateValue && !isEditing && "text-neutral-400")}
                      onFocus={() => {
                        setIsEditing(true)
                        setTextValue(dateValue ? format(dateValue, "MMM d, yyyy") : "")
                      }}
                      onChange={e => {
                        setTextValue(e.target.value)
                      }}
                      onBlur={() => {
                        commitTextValue(textValue, field.onChange)
                        setIsEditing(false)
                        void saveOnBlur(name)()
                      }}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          commitTextValue(textValue, field.onChange)
                          setIsEditing(false)
                          inputRef.current?.blur()
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="rounded p-1 text-neutral-400 hover:text-neutral-600"
                          tabIndex={-1}
                        >
                          <IconCalendar className="size-4" />
                        </button>
                      </PopoverTrigger>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
              </PopoverAnchor>
              <PopoverContent
                className="w-auto rounded-md border bg-white p-0 shadow-md"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dateValue ?? undefined}
                  {...(dateValue ? { defaultMonth: dateValue } : {})}
                  onSelect={date => {
                    const formatted = date ? format(date, "yyyy-MM-dd") : ""
                    field.onChange(formatted)
                    setOpen(false)
                    void saveOnBlur(name)()
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

/** Parse user-typed text into a YYYY-MM-DD string using chrono-node. */
function commitTextValue(text: string, onChange: (value: string) => void) {
  const trimmed = text.trim()
  if (!trimmed) {
    onChange("")
    return
  }
  const parsed = chrono.parseDate(trimmed)
  if (parsed) {
    onChange(format(parsed, "yyyy-MM-dd"))
  }
  // If chrono can't parse it, leave the field value unchanged
}

/** Parse a stored YYYY-MM-DD string into a Date, returning null if invalid or empty. */
function parseStoredDate(value: string | undefined): Date | null {
  if (!value) return null
  const parsed = parse(value, "yyyy-MM-dd", new Date())
  return isNaN(parsed.getTime()) ? null : parsed
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
