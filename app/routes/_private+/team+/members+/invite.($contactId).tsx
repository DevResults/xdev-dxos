import { useSpace } from "@dxos/react-client/echo"
import {
  type CancellableInvitationObservable,
  Invitation,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { InviteMemberDialog } from "ui/InviteMemberDialog"
import { useLocalState } from "~/hooks/useLocalState"
import { createPendingInvitation } from "~/lib/createPendingInvitation"
import { shouldUpdateInvitationCode } from "~/lib/shouldUpdateInvitationCode"
import { makeInvitation, type Invitation as InvitationRecord } from "~/schema/Invitation"

export default function MembersInvitePage() {
  const { contactId: contactIdFromParams } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const contactId =
    contactIdFromParams ?? (location.state as { userId?: string } | undefined)?.userId

  /** The invitation observable; stored in state so changes trigger re-renders. */
  const [invitation, setInvitation] = useState<CancellableInvitationObservable | undefined>()

  /** Ref so the creation effect can check whether an invitation already exists. */
  const invitationRef = useRef<CancellableInvitationObservable | undefined>()
  /** The local Invitation record linked to this contact. */
  const invitationRecordRef = useRef<InvitationRecord | undefined>()

  // Create an invitation when the space becomes available.
  // We intentionally do NOT cancel on unmount — DXOS invitations have a built-in
  // timeout (3 min) and lifetime (7 days), so they expire naturally. Cancelling on
  // unmount caused problems with React StrictMode's double-mount cycle.
  useEffect(() => {
    if (!space || !contactId) {
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
      authMethod: Invitation.AuthMethod.NONE,
      multiUse: false,
    })

    const invitationRecord = makeInvitation(
      createPendingInvitation(contactId, new Date().toISOString()),
    )
    invitationRecord.dxosInvitationId = newInvitation.get().invitationId
    space.db.add(invitationRecord)

    invitationRef.current = newInvitation
    invitationRecordRef.current = invitationRecord
    setInvitation(newInvitation)
  }, [contactId, space])

  // Use the hook to track invitation status
  const { invitationCode } = useInvitationStatus(invitation)

  // Persist invitation code and auth code after DXOS generates them.
  useEffect(() => {
    const invitationRecord = invitationRecordRef.current
    if (!invitationRecord) {
      return
    }

    if (
      invitationCode &&
      shouldUpdateInvitationCode(invitationRecord.invitationCode, invitationCode)
    ) {
      invitationRecord.invitationCode = invitationCode
    }
  }, [invitationCode])

  // Don't cancel the invitation on close — DXOS invitations expire naturally
  // (7-day lifetime), and keeping them active lets the user view the invitation
  // details again from the members list.
  const handleClose = useCallback(() => {
    void navigate("..")
  }, [navigate])

  if (!contactId) {
    return null
  }

  return (
    <InviteMemberDialog defaultOpen={true} onClose={handleClose} invitationCode={invitationCode} />
  )
}
