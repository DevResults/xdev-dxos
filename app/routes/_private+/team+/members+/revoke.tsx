import { useLocation, useNavigate } from "react-router"
import { RevokeInvitationDialog } from "ui/RevokeInvitationDialog"
import { useTeam } from "~/hooks/useTeam"
import type { ContactId } from "~/schema/Contact"

export default function RevokeInvitationPage() {
  const { userId } = useLocation().state as { userId: ContactId }

  const { contacts } = useTeam()
  const navigate = useNavigate()

  const contact = contacts.find(({ id }) => id === userId)
  const invitation = {}
  const revoke = () => undefined

  // ----- ↑ hooks

  // Only existing invitations can be revoked
  if (!invitation) {
    return null
  }

  return (
    <RevokeInvitationDialog
      defaultOpen={true}
      onClose={async () => navigate("..")}
      contact={contact}
      invitation={invitation}
      revoke={revoke}
    />
  )
}
