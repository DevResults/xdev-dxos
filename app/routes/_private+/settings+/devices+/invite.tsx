import { useNavigate } from "react-router"
import { InviteDeviceDialog } from "./ui/InviteDeviceDialog"
import { useTeam } from "~/hooks/useTeam"

export default function DevicesInvitePage() {
  const { self } = useTeam()
  const navigate = useNavigate()

  const invitationCode = "invite me"

  return (
    <InviteDeviceDialog
      defaultOpen={true}
      onClose={async () => navigate("..")}
      invitationCode={invitationCode}
    />
  )
}
