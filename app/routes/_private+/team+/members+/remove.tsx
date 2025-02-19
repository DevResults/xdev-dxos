import { useLocation, useNavigate } from "react-router"
import { useSpace, HaloSpaceMember } from "@dxos/react-client/echo"
import { RemoveMemberDialog } from "./ui/RemoveMemberDialog"
import { useTeam } from "~/hooks/useTeam"
import { useLocalState } from "~/hooks/useLocalState"

export default function RemovePage() {
  const { userId } = useLocation().state

  const { self, contacts } = useTeam()
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  // ----- ↑ hooks

  // Only admins can remove members
  if (!self?.isAdmin) return null

  const contact = contacts.find(({ id }) => id === userId)
  if (!contact?.identityKey) return null

  return (
    <RemoveMemberDialog
      defaultOpen={true}
      onClose={async () => navigate("..")}
      contact={contact}
      remove={async () => {
        // remove from space
        await space?.updateMemberRole({
          memberKey: contact.identityKey!,
          newRole: HaloSpaceMember.Role.REMOVED,
        })
        // remove contact from contacts list
        space?.db.remove(contact.contact)
      }}
    />
  )
}
