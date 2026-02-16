import { useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { useSpace } from "@dxos/react-client/echo"
import { EditContactForm, type EditContactValues } from "ui/EditContactForm"
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

  const handleSubmit = useCallback(
    async (values: EditContactValues) => {
      if (!contact) return
      contact.contact.firstName = values.firstName
      contact.contact.lastName = values.lastName
      contact.contact.userName = values.userName
      contact.contact.avatarUrl = values.avatarUrl
      await space?.db.flush()
      void navigate("/team/members")
    },
    [contact, space, navigate],
  )

  const handleCancel = useCallback(() => {
    void navigate("/team/members")
  }, [navigate])

  // ----- ^ hooks

  if (!contact) {
    return null
  }

  return <EditContactForm contact={contact} onSubmit={handleSubmit} onCancel={handleCancel} />
}
