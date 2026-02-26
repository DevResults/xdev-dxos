import { useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { useSpace } from "@dxos/react-client/echo"
import type { FieldPath } from "react-hook-form"
import { ContactForm, type ContactFormValues } from "ui/ContactForm"
import { useTeam } from "~/hooks/useTeam"
import { useLocalState } from "~/hooks/useLocalState"

/** Route for editing a single contact's details. */
export default function EditContactPage() {
  const { contactId } = useParams()
  const { contacts } = useTeam()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const navigate = useNavigate()

  const contact = contacts.find(({ id }) => id === contactId)

  const handleSaveField = useCallback(
    async (name: FieldPath<ContactFormValues>, value: string) => {
      if (!contact) return
      contact[name] = value
      await space?.db.flush()
    },
    [contact, space],
  )

  const handleDone = useCallback(
    (_values: ContactFormValues) => {
      void navigate("/team/members")
    },
    [navigate],
  )

  // ----- ^ hooks

  if (!contact) return null

  return (
    <ContactForm
      title={contact.fullName}
      defaultValues={{
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        userName: contact.userName ?? "",
        avatarUrl: contact.avatarUrl ?? "",
      }}
      onSaveField={handleSaveField}
      onDone={handleDone}
    />
  )
}
