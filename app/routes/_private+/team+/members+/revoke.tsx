import { useLocation, useNavigate } from "react-router"
import { RevokeInvitationDialog } from "./ui/RevokeInvitationDialog"
import { useTeam } from "~/hooks/useTeam"

export default function RevokeInvitationPage() {
  const { userId } = useLocation().state

  const { contacts } = useTeam()
  const navigate = useNavigate()

  const contact = contacts[userId]
  const invitation = {}
  const revoke = () => undefined

  // ----- ↑ hooks

  // Only existing invitations can be revoked
  if (!invitation) return null

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
