import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"

/** A labeled text input bound to a form field, with auto-save on blur. */
export function TextInput<T extends FieldValues>({
  form,
  name,
  label,
  autoFocus,
  saveOnBlur,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoFocus={autoFocus}
              onBlur={() => {
                field.onBlur()
                void saveOnBlur(name)()
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type Props<T extends FieldValues> = {
  /** The react-hook-form instance. */
  form: UseFormReturn<T>
  /** The field name to bind to. */
  name: FieldPath<T>
  /** The visible label for the field. */
  label: string
  /** Whether to auto-focus this field on mount. */
  autoFocus?: boolean
  /** Returns a blur handler that validates and saves the given field. */
  saveOnBlur: (name: FieldPath<T>) => () => Promise<void>
}
