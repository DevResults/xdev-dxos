import { useNavigate } from "react-router"
import { useCallback, useEffect, useState } from "react"
import { useClient } from "@dxos/react-client"
import {
  type CancellableInvitationObservable,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { InviteDeviceDialog } from "ui/InviteDeviceDialog"

export default function DevicesInvitePage() {
  const navigate = useNavigate()
  const client = useClient()

  // Store the invitation observable in state so changes trigger re-renders
  const [invitation, setInvitation] = useState<CancellableInvitationObservable | undefined>()

  // Create a device/halo invitation when the component mounts
  useEffect(() => {
    if (invitation) {
      return
    }

    const newInvitation = client.halo.share()
    setInvitation(newInvitation)

    return () => {
      void newInvitation.cancel()
    }
  }, [client, invitation])

  // Use the hook to track invitation status
  const { invitationCode, authCode } = useInvitationStatus(invitation)

  const handleClose = useCallback(() => {
    void invitation?.cancel()
    void navigate("..")
  }, [invitation, navigate])

  return (
    <InviteDeviceDialog
      defaultOpen={true}
      onClose={handleClose}
      invitationCode={invitationCode}
      authCode={authCode}
    />
  )
}
