import { useNavigate } from "react-router"
import { useSpace } from "@dxos/react-client/echo"
import { AddContactDialog, type AddContactValues } from "ui/AddContactDialog"
import { createContactFromValues } from "~/lib/createContactFromValues"
import { useLocalState } from "~/hooks/useLocalState"
import { make as makeContact } from "~/schema/Contact"

export default function MembersAddContactPage() {
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  const handleClose = () => {
    void navigate("..")
  }

  const handleSubmit = async (values: AddContactValues) => {
    if (!space) {
      return
    }

    const contact = makeContact(createContactFromValues(values))
    space.db.add(contact)
    await space.db.flush()
    void navigate(`/team/members/invite/${contact.id}`)
  }

  return <AddContactDialog defaultOpen={true} onClose={handleClose} onSubmit={handleSubmit} />
}
