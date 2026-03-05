import { Button } from "@ui/button"
import { Form } from "@ui/form"
import type { FieldPath } from "react-hook-form"
import { ImageUpload } from "./ImageUpload"
import { TextInput } from "./TextInput"
import { useAutoSaveForm } from "~/hooks/useAutoSaveForm"
import { Contact } from "~/schema/Contact"
import { S } from "~/schema/lib/Effect"
import { Heading } from "~/ui/Heading"
import { Label } from "~/ui/shadcn/label"
import { Switch } from "~/ui/shadcn/switch"

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
          className="grid gap-8"
          onSubmit={event => {
            event.preventDefault()
            void handleDone()
          }}
        >
          {/* Basic info */}
          <section className="grid gap-4">
            <div className="flex items-start justify-between">
              <div className="w-[10em]">
                <ImageUpload form={form} name="avatarUrl" label="Avatar" saveOnBlur={saveOnBlur} />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="status"
                  checked={(form.watch("status") ?? "active") === "active"}
                  onCheckedChange={checked => {
                    const value = checked ? "active" : "inactive"
                    form.setValue("status", value as ContactFormValues["status"])
                    void saveOnBlur("status" as any)()
                  }}
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>
            <div className="grid grid-cols-[3fr_2fr_3fr_1fr] gap-4">
              <TextInput
                form={form}
                name="firstName"
                label="First name"
                autoFocus
                saveOnBlur={saveOnBlur}
              />
              <TextInput
                form={form}
                name="middleName"
                label="Middle name"
                saveOnBlur={saveOnBlur}
              />
              <TextInput form={form} name="lastName" label="Last name" saveOnBlur={saveOnBlur} />
              <TextInput form={form} name="suffix" label="Suffix" saveOnBlur={saveOnBlur} />
            </div>
            <TextInput form={form} name="userName" label="Username" saveOnBlur={saveOnBlur} />
          </section>

          {/* Personal info */}
          <section className="grid gap-4">
            <Heading level={3}>Personal info</Heading>
            <TextInput form={form} name="pronouns" label="Pronouns" saveOnBlur={saveOnBlur} />
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="legalFirstName"
                label="Legal first name"
                saveOnBlur={saveOnBlur}
              />
              <TextInput
                form={form}
                name="preferredName"
                label="Preferred name"
                saveOnBlur={saveOnBlur}
              />
            </div>
            <TextInput form={form} name="title" label="Title" saveOnBlur={saveOnBlur} />
            <div className="grid grid-cols-2 gap-4">
              <TextInput form={form} name="birthdate" label="Birthdate" saveOnBlur={saveOnBlur} />
              <TextInput form={form} name="startDate" label="Start date" saveOnBlur={saveOnBlur} />
            </div>
          </section>

          {/* Contact */}
          <section className="grid gap-4">
            <Heading level={3}>Contact</Heading>
            <TextInput form={form} name="phone" label="Phone" saveOnBlur={saveOnBlur} />
          </section>

          {/* Home address */}
          <section className="grid gap-4">
            <Heading level={3}>Home address</Heading>
            <TextInput
              form={form}
              name="homeAddress"
              label="Street address"
              saveOnBlur={saveOnBlur}
            />
            <div className="grid grid-cols-3 gap-4">
              <TextInput form={form} name="homeCity" label="City" saveOnBlur={saveOnBlur} />
              <TextInput form={form} name="homeState" label="State" saveOnBlur={saveOnBlur} />
              <TextInput form={form} name="homeZip" label="Zip" saveOnBlur={saveOnBlur} />
            </div>
            <TextInput form={form} name="country" label="Country" saveOnBlur={saveOnBlur} />
          </section>

          {/* Work address */}
          <section className="grid gap-4">
            <Heading level={3}>Work address</Heading>
            <TextInput
              form={form}
              name="workAddress"
              label="Street address"
              saveOnBlur={saveOnBlur}
            />
            <div className="grid grid-cols-3 gap-4">
              <TextInput form={form} name="workCity" label="City" saveOnBlur={saveOnBlur} />
              <TextInput form={form} name="workState" label="State" saveOnBlur={saveOnBlur} />
              <TextInput form={form} name="workZip" label="Zip" saveOnBlur={saveOnBlur} />
            </div>
          </section>

          {/* Emergency contact */}
          <section className="grid gap-4">
            <Heading level={3}>Emergency contact</Heading>
            <TextInput
              form={form}
              name="emergencyContactName"
              label="Name"
              saveOnBlur={saveOnBlur}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="emergencyContactRelationship"
                label="Relationship"
                saveOnBlur={saveOnBlur}
              />
              <TextInput
                form={form}
                name="emergencyContactPhone"
                label="Phone"
                saveOnBlur={saveOnBlur}
              />
            </div>
          </section>

          {/* Travel documents */}
          <section className="grid gap-4">
            <Heading level={3}>Travel documents</Heading>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="passportNumber"
                label="Passport number"
                saveOnBlur={saveOnBlur}
              />
              <TextInput
                form={form}
                name="passportCountry"
                label="Passport country"
                saveOnBlur={saveOnBlur}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="passportIssueDate"
                label="Issue date"
                saveOnBlur={saveOnBlur}
              />
              <TextInput
                form={form}
                name="passportExpirationDate"
                label="Expiration date"
                saveOnBlur={saveOnBlur}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="driversLicense"
                label="Driver's license"
                saveOnBlur={saveOnBlur}
              />
              <TextInput
                form={form}
                name="driversLicenseExpiration"
                label="License expiration"
                saveOnBlur={saveOnBlur}
              />
            </div>
          </section>

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
  S.pick(
    // Basic info
    "firstName",
    "lastName",
    "userName",
    "avatarUrl",
    "status",
    // Personal info
    "middleName",
    "suffix",
    "legalFirstName",
    "preferredName",
    "pronouns",
    "birthdate",
    "startDate",
    "title",
    // Contact
    "phone",
    // Home address
    "homeAddress",
    "homeCity",
    "homeState",
    "homeZip",
    "country",
    // Work address
    "workAddress",
    "workCity",
    "workState",
    "workZip",
    // Emergency contact
    "emergencyContactName",
    "emergencyContactRelationship",
    "emergencyContactPhone",
    // Travel documents
    "passportNumber",
    "passportIssueDate",
    "passportExpirationDate",
    "passportCountry",
    "driversLicense",
    "driversLicenseExpiration",
  ),
)

export type ContactFormValues = S.Schema.Type<typeof ContactFormSchema>

export type Props = {
  /** Initial form values. */
  defaultValues: ContactFormValues
  /** Called on valid blur with the field name and its new value. */
  onSaveField: (name: FieldPath<ContactFormValues>, value: string | undefined) => Promise<void>
  /** Called when the user clicks Done (after validation passes). Receives the final form values. */
  onDone: (values: ContactFormValues) => void
  /** Optional cancel handler (used in add flow). */
  onCancel?: () => void
  /** Form heading text. */
  title: string
  /** Form description text. */
  description?: string
}
