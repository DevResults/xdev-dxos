import { useNavigate } from "react-router"
import { useCallback, useEffect, useRef } from "react"
import { useClient } from "@dxos/react-client"
import {
  type CancellableInvitationObservable,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { InviteDeviceDialog } from "ui/InviteDeviceDialog"

export default function DevicesInvitePage() {
  const navigate = useNavigate()
  const client = useClient()

  // Store the invitation observable in a ref so it persists across renders
  const invitationRef = useRef<CancellableInvitationObservable | undefined>()

  // Create a device/halo invitation when the component mounts
  useEffect(() => {
    if (invitationRef.current) {
      return
    }

    invitationRef.current = client.halo.share()

    return () => {
      void invitationRef.current?.cancel()
    }
  }, [client])

  // Use the hook to track invitation status
  const { invitationCode, authCode } = useInvitationStatus(invitationRef.current)

  const handleClose = useCallback(() => {
    void invitationRef.current?.cancel()
    void navigate("..")
  }, [navigate])

  return (
    <InviteDeviceDialog
      defaultOpen={true}
      onClose={handleClose}
      invitationCode={invitationCode}
      authCode={authCode}
    />
  )
}
