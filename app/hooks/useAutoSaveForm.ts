import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { useCallback } from "react"
import {
  useForm,
  type FieldPath,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"
import type { S } from "~/schema/lib/Effect"

/**
 * Hook wrapping `useForm` with per-field blur-save behavior.
 * Each field auto-saves on blur if valid.
 */
export function useAutoSaveForm<T extends FieldValues>(
  /** Effect Schema defining the form validation rules. */
  schema: S.Schema<T>,
  /** Initial form values. */
  defaultValues: T,
  /** Called on valid blur with the field name and its new value. */
  onSaveField: (name: FieldPath<T>, value: T[FieldPath<T>]) => Promise<void>,
): UseAutoSaveFormReturn<T> {
  const form = useForm<T>({
    resolver: effectTsResolver(schema),
    defaultValues: defaultValues as any,
    mode: "onBlur",
  })

  const saveOnBlur = useCallback(
    (name: Path<T>) => async () => {
      const isValid = await form.trigger(name)
      if (isValid) {
        const value = form.getValues(name)
        await onSaveField(name as FieldPath<T>, value as T[FieldPath<T>])
      }
    },
    [form, onSaveField],
  )

  return { form, saveOnBlur }
}

type UseAutoSaveFormReturn<T extends FieldValues> = {
  form: UseFormReturn<T>
  saveOnBlur: (name: Path<T>) => () => Promise<void>
}
