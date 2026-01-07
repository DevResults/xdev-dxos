import { useNavigate } from "react-router"
import { useCallback, useEffect, useState } from "react"
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

  // Store the invitation observable in state so changes trigger re-renders
  const [invitation, setInvitation] = useState<CancellableInvitationObservable | undefined>()

  // Create an invitation when the space becomes available
  useEffect(() => {
    if (!space || invitation) {
      return
    }

    const newInvitation = space.share({
      type: Invitation.Type.INTERACTIVE,
      authMethod: Invitation.AuthMethod.SHARED_SECRET,
      multiUse: false,
    })
    setInvitation(newInvitation)

    return () => {
      // Cancel the invitation when the dialog closes
      void newInvitation.cancel()
    }
  }, [space, invitation])

  // Use the hook to track invitation status
  const { invitationCode, authCode } = useInvitationStatus(invitation)

  const handleClose = useCallback(() => {
    void invitation?.cancel()
    void navigate("..")
  }, [invitation, navigate])

  return (
    <InviteMemberDialog
      defaultOpen={true}
      onClose={handleClose}
      invitationCode={invitationCode}
      authCode={authCode}
    />
  )
}
