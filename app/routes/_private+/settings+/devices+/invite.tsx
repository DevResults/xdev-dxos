import { useNavigate } from "react-router"
import { InviteDeviceDialog } from "./ui/InviteDeviceDialog"

export default function DevicesInvitePage() {
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
