import { Button } from "@ui/button"
import { Form } from "@ui/form"
import type { FieldPath } from "react-hook-form"
import { ImageUpload } from "./ImageUpload"
import { TextInput } from "./TextInput"
import { useAutoSaveForm } from "~/hooks/useAutoSaveForm"
import { Contact } from "~/schema/Contact"
import { S } from "~/schema/lib/Effect"
import { Heading } from "~/ui/Heading"

/** Unified form for creating and editing contacts, with per-field auto-save on blur. */
export function ContactForm({
  defaultValues,
  onSaveField,
  onDone,
  onCancel,
  title,
  description,
}: Props) {
  const { form, saveOnBlur } = useAutoSaveForm(ContactFormSchema, onSaveField, defaultValues)

  const handleDone = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      onDone(form.getValues())
    }
  }

  return (
    <div className="max-w-xl">
      <Form {...form}>
        <Heading level={2} className="mb-1">
          {title}
        </Heading>
        {description && <p className="mb-6 text-sm text-neutral-500">{description}</p>}

        <form
          data-testid="contact-form"
          className="grid gap-4"
          onSubmit={event => {
            event.preventDefault()
            void handleDone()
          }}
        >
          <ImageUpload form={form} name="avatarUrl" label="Avatar" saveOnBlur={saveOnBlur} />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              form={form}
              name="firstName"
              label="First name"
              autoFocus
              saveOnBlur={saveOnBlur}
            />
            <TextInput form={form} name="lastName" label="Last name" saveOnBlur={saveOnBlur} />
          </div>
          <TextInput form={form} name="userName" label="Username" saveOnBlur={saveOnBlur} />

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

export const ContactFormSchema = Contact.pipe(
  S.pick("firstName", "lastName", "userName", "avatarUrl"),
)

export type ContactFormValues = S.Schema.Type<typeof ContactFormSchema>

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
