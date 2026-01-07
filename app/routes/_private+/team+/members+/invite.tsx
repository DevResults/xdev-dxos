import { useNavigate } from "react-router"
import { useCallback, useEffect, useRef } from "react"
import { useSpace } from "@dxos/react-client/echo"
import {
  type CancellableInvitationObservable,
  Invitation,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { InviteMemberDialog } from "ui/InviteMemberDialog"
import { useLocalState } from "~/hooks/useLocalState"

export default function MembersInvitePage() {
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  // Store the invitation observable in a ref so it persists across renders
  const invitationRef = useRef<CancellableInvitationObservable | undefined>()

  // Create an invitation when the component mounts
  useEffect(() => {
    if (!space || invitationRef.current) {
      return
    }

    invitationRef.current = space.share({
      type: Invitation.Type.INTERACTIVE,
      authMethod: Invitation.AuthMethod.SHARED_SECRET,
      multiUse: false,
    })

    return () => {
      // Cancel the invitation when the dialog closes
      void invitationRef.current?.cancel()
    }
  }, [space])

  // Use the hook to track invitation status
  const { invitationCode, authCode } = useInvitationStatus(invitationRef.current)

  const handleClose = useCallback(() => {
    void invitationRef.current?.cancel()
    void navigate("..")
  }, [navigate])

  return (
    <InviteMemberDialog
      defaultOpen={true}
      onClose={handleClose}
      invitationCode={invitationCode}
      authCode={authCode}
    />
  )
}
