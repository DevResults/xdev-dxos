import { useLocation, useNavigate, useParams } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSpace } from "@dxos/react-client/echo"
import {
  type CancellableInvitationObservable,
  Invitation,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { InviteMemberDialog } from "ui/InviteMemberDialog"
import { createPendingInvitation } from "~/lib/createPendingInvitation"
import { shouldUpdateInvitationCode } from "~/lib/shouldUpdateInvitationCode"
import { useLocalState } from "~/hooks/useLocalState"
import { make as makeInvitation, type Invitation as InvitationRecord } from "~/schema/Invitation"

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
      authMethod: Invitation.AuthMethod.SHARED_SECRET,
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
  const { invitationCode, authCode } = useInvitationStatus(invitation)

  // Persist invitation code after DXOS generates it.
  useEffect(() => {
    const invitationRecord = invitationRecordRef.current
    if (!invitationRecord) {
      return
    }

    if (!shouldUpdateInvitationCode(invitationRecord.invitationCode, invitationCode)) {
      return
    }

    invitationRecord.invitationCode = invitationCode
  }, [invitationCode])

  const handleClose = useCallback(() => {
    void invitation?.cancel()
    void navigate("..")
  }, [invitation, navigate])

  if (!contactId) {
    return null
  }

  return (
    <InviteMemberDialog
      defaultOpen={true}
      onClose={handleClose}
      invitationCode={invitationCode}
      authCode={authCode}
    />
  )
}
