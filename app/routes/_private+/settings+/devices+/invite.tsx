import { useNavigate } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useClient } from "@dxos/react-client"
import {
  type CancellableInvitationObservable,
  Invitation,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { InviteDeviceDialog } from "ui/InviteDeviceDialog"

export default function DevicesInvitePage() {
  const navigate = useNavigate()
  const client = useClient()

  // Store the invitation observable in state so changes trigger re-renders
  const [invitation, setInvitation] = useState<CancellableInvitationObservable | undefined>()
  // Ref for cleanup access
  const invitationRef = useRef<CancellableInvitationObservable | undefined>()

  // Create a device/halo invitation when the component mounts
  useEffect(() => {
    // Check if existing invitation is still valid (not cancelled/error/timeout)
    // This handles React StrictMode's mount/unmount/remount cycle
    const existingState = invitationRef.current?.get()?.state
    const needsNewInvitation =
      !invitationRef.current ||
      existingState === Invitation.State.CANCELLED ||
      existingState === Invitation.State.ERROR ||
      existingState === Invitation.State.TIMEOUT

    if (!needsNewInvitation) {
      return
    }

    const newInvitation = client.halo.share()
    invitationRef.current = newInvitation
    setInvitation(newInvitation)
  }, [client])

  // Cancel invitation only when component unmounts
  useEffect(() => {
    return () => {
      if (invitationRef.current) {
        void invitationRef.current.cancel()
      }
    }
  }, [])

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
