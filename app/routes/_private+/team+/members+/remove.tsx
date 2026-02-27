import { useSpace, HaloSpaceMember } from "@dxos/react-client/echo"
import { useLocation, useNavigate } from "react-router"
import { RemoveMemberDialog } from "ui/RemoveMemberDialog"
import { useLocalState } from "~/hooks/useLocalState"
import { useTeam } from "~/hooks/useTeam"
import type { ContactId } from "~/schema/Contact"

export default function RemovePage() {
  const { userId } = useLocation().state as { userId: ContactId }

  const { self, contacts } = useTeam()
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  // ----- ↑ hooks

  // Only admins can remove members
  if (!self?.isAdmin) {
    return null
  }

  const contact = contacts.find(({ id }) => id === userId)
  if (!contact?.identity?.identityKey) {
    return null
  }

  return (
    <RemoveMemberDialog
      defaultOpen={true}
      onClose={async () => navigate("..")}
      contact={contact}
      remove={async () => {
        // Remove from space
        await space?.updateMemberRole({
          memberKey: contact.identity!.identityKey,
          newRole: HaloSpaceMember.Role.REMOVED,
        })
        // Remove contact from contacts list
        space?.db.remove(contact.contact)
      }}
    />
  )
}
