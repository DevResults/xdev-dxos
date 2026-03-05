import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { format, parse } from "date-fns"
import { useState } from "react"
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { cx } from "~/lib/cx"
import { Calendar } from "~/ui/shadcn/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/shadcn/popover"

/** A labeled date picker input bound to a form field, with auto-save on blur. */
export function DateInput<T extends FieldValues>({ form, name, label, saveOnBlur }: Props<T>) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const dateValue = parseDate(field.value as string | undefined)

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    type="button"
                    className={cx(
                      "flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1",
                      "shadow-xs text-left text-sm",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      !dateValue && "text-neutral-400",
                    )}
                  >
                    {dateValue ? format(dateValue, "MMM d, yyyy") : "Pick a date"}
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto rounded-md border bg-white p-0 shadow-md"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dateValue ?? undefined}
                  defaultMonth={dateValue ?? undefined}
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

/** Parse a YYYY-MM-DD string into a Date, returning null if invalid or empty. */
function parseDate(value: string | undefined): Date | null {
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
