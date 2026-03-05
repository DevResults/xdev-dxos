import { useSpace } from "@dxos/react-client/echo"
import { useCallback } from "react"
import { useNavigate } from "react-router"
import { ContactForm, type ContactFormValues } from "ui/ContactForm"
import { useLocalState } from "~/hooks/useLocalState"
import { makeContact } from "~/schema/Contact"

/** Route for adding a new contact. Creates the contact on Done. */
export default function MembersAddContactPage() {
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  /** No-op for add — data stays in the form until Done. */
  const handleSaveField = useCallback(async () => {}, [])

  const handleDone = useCallback(
    async (values: ContactFormValues) => {
      if (!space) return
      const contact = makeContact(values)
      space.db.add(contact)
      await space.db.flush()
      void navigate(`/team/members/invite/${contact.id}`)
    },
    [space, navigate],
  )

  const handleCancel = useCallback(() => {
    void navigate("..")
  }, [navigate])

  return (
    <ContactForm
      defaultValues={{ firstName: "", lastName: "", userName: "", avatarUrl: "", status: "active" }}
      onSaveField={handleSaveField}
      onDone={handleDone}
      onCancel={handleCancel}
      title="Add contact"
      description="Enter contact details to add a new team member."
    />
  )
}
