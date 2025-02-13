import { useTeam } from "~/hooks/useTeam"
import { useLocation, useNavigate } from "react-router"
import { RevokeInvitationDialog } from "./ui/RevokeInvitationDialog"

export default function RevokeInvitationPage() {
  const { userId } = useLocation().state

  const { self, contacts } = useTeam()
  const navigate = useNavigate()

  const contact = contacts[userId]
  const invitation = {}
  const revoke = () => void 0

  // ----- ↑ hooks

  // Only existing invitations can be revoked
  if (!invitation) return null

  return (
    <RevokeInvitationDialog
      defaultOpen={true}
      onClose={() => navigate("..")}
      contact={contact}
      invitation={invitation}
      revoke={revoke}
    />
  )
}
