import { useTeam } from "~/hooks/useTeam"
import { useLocation, useNavigate } from "react-router"
import { RemoveMemberDialog } from "./ui/RemoveMemberDialog"
import { useLocalState } from "~/hooks/useLocalState"
import { useSpace, HaloSpaceMember } from "@dxos/react-client/echo"

export default function RemovePage() {
  const { userId } = useLocation().state

  const { self, contacts } = useTeam()
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  // ----- ↑ hooks

  // Only admins can remove members
  if (!self?.isAdmin) return null

  const contact = contacts.find(({ id }) => id == userId)
  if (!contact?.identityKey) return null

  return (
    <RemoveMemberDialog
      defaultOpen={true}
      onClose={() => navigate("..")}
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
