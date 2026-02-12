import { useCallback } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { useSpace } from "@dxos/react-client/echo"
import { EditContactDialog, type EditContactValues } from "ui/EditContactDialog"
import { useTeam } from "~/hooks/useTeam"
import { useLocalState } from "~/hooks/useLocalState"

export default function EditContactPage() {
  const { contactId: contactIdFromParams } = useParams()
  const { userId } = (useLocation().state as { userId?: string }) ?? {}
  const contactId = contactIdFromParams ?? userId
  const { contacts } = useTeam()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const navigate = useNavigate()

  const contact = contacts.find(({ id }) => id === contactId)

  const handleSubmit = useCallback(
    async (values: EditContactValues) => {
      if (!contact) return
      // Mutate the DXOS object directly
      contact.contact.firstName = values.firstName
      contact.contact.lastName = values.lastName
      contact.contact.userName = values.userName
      contact.contact.avatarUrl = values.avatarUrl
      await space?.db.flush()
      void navigate("..")
    },
    [contact, space, navigate],
  )

  // ----- ^ hooks

  if (!contact) {
    return null
  }

  return (
    <EditContactDialog
      defaultOpen={true}
      onClose={() => {
        void navigate("..")
      }}
      contact={contact}
      onSubmit={handleSubmit}
    />
  )
}
