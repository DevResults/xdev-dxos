import { useNavigate } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
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

  /** The invitation observable; stored in state so changes trigger re-renders. */
  const [invitation, setInvitation] = useState<CancellableInvitationObservable | undefined>()

  /** Ref so the creation effect can check whether an invitation already exists. */
  const invitationRef = useRef<CancellableInvitationObservable | undefined>()

  // Create an invitation when the space becomes available.
  // We intentionally do NOT cancel on unmount — DXOS invitations have a built-in
  // timeout (3 min) and lifetime (7 days), so they expire naturally. Cancelling on
  // unmount caused problems with React StrictMode's double-mount cycle.
  useEffect(() => {
    if (!space) {
      return
    }

    // Check if existing invitation is still valid (not cancelled/error/timeout)
    const existingState = invitationRef.current?.get()?.state
    const needsNewInvitation =
      !invitationRef.current ||
      existingState === Invitation.State.CANCELLED ||
      existingState === Invitation.State.ERROR ||
      existingState === Invitation.State.TIMEOUT

    if (!needsNewInvitation) {
      return
    }

    const newInvitation = space.share({
      type: Invitation.Type.INTERACTIVE,
      authMethod: Invitation.AuthMethod.SHARED_SECRET,
      multiUse: false,
    })
    invitationRef.current = newInvitation
    setInvitation(newInvitation)
  }, [space])

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
