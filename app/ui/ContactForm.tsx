import { Link } from "react-router"
import { Button } from "@ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import type { FieldPath } from "react-hook-form"
import { useAutoSaveForm } from "~/hooks/useAutoSaveForm"
import { S } from "~/schema/lib/Effect"

/** Unified form for creating and editing contacts, with per-field auto-save on blur. */
export function ContactForm({
  defaultValues,
  onSaveField,
  onDone,
  onCancel,
  title,
  description,
}: Props) {
  const { form, saveOnBlur } = useAutoSaveForm(contactFormSchema, defaultValues, onSaveField)

  const handleDone = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      onDone(form.getValues())
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <Link to="/team/members" className="text-sm text-neutral-500 hover:text-neutral-700">
          &larr; Back to members
        </Link>
      </div>

      <h2 className="mb-1">{title}</h2>
      {description && <p className="mb-6 text-sm text-neutral-500">{description}</p>}

      <Form {...form}>
        <form
          data-testid="contact-form"
          className="grid gap-4"
          onSubmit={event => {
            event.preventDefault()
            void handleDone()
          }}
        >
          {FIELDS.map(({ name, label, autoFocus }) => (
            <FormField
              key={name}
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
          ))}

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" intent="neutral" size="md" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" intent="primary" size="md">
              Done
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

const FIELDS: FieldConfig[] = [
  { name: "firstName", label: "First name", autoFocus: true },
  { name: "lastName", label: "Last name" },
  { name: "userName", label: "Username" },
  { name: "avatarUrl", label: "Avatar URL" },
]

export const contactFormSchema = S.Struct({
  firstName: S.Trim.pipe(S.minLength(1, { message: () => "First name is required." })),
  lastName: S.Trim,
  userName: S.Trim.pipe(S.minLength(1, { message: () => "Username is required." })),
  avatarUrl: S.Trim,
})

export type ContactFormValues = S.Schema.Type<typeof contactFormSchema>

type FieldConfig = {
  name: FieldPath<ContactFormValues>
  label: string
  autoFocus?: boolean
}

export type Props = {
  /** Initial form values. */
  defaultValues: ContactFormValues
  /** Called on valid blur with the field name and its new value. */
  onSaveField: (name: FieldPath<ContactFormValues>, value: string) => Promise<void>
  /** Called when the user clicks Done (after validation passes). Receives the final form values. */
  onDone: (values: ContactFormValues) => void
  /** Optional cancel handler (used in add flow). */
  onCancel?: () => void
  /** Form heading text. */
  title: string
  /** Form description text. */
  description?: string
}
