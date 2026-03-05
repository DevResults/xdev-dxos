import { useSpace, useSpaceInvitations } from "@dxos/react-client/echo"
import { useCallback } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { RevokeInvitationDialog } from "ui/RevokeInvitationDialog"
import { useLocalState } from "~/hooks/useLocalState"
import { useTeam } from "~/hooks/useTeam"
import { markInvitationRevoked } from "~/lib/markInvitationRevoked"

export default function RevokeInvitationPage() {
  const { contactId: contactIdFromParams } = useParams()
  const { userId } = (useLocation().state as { userId?: string }) ?? {}
  const contactId = contactIdFromParams ?? userId
  const { contacts } = useTeam()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const spaceInvitations = useSpaceInvitations(space?.key)
  const navigate = useNavigate()

  const contact = contacts.find(({ id }) => id === contactId)
  const invitation = contact?.invitation

  const revoke = useCallback(async () => {
    if (!invitation || invitation.status !== "pending") {
      return
    }

    if (invitation.dxosInvitationId) {
      const dxosInvitation = spaceInvitations.find(
        value => value.get().invitationId === invitation.dxosInvitationId,
      )
      await dxosInvitation?.cancel()
    }

    markInvitationRevoked(invitation, new Date().toISOString())
    await space?.db.flush()
  }, [invitation, space, spaceInvitations])

  // Only existing pending invitations can be revoked.
  if (!contact || !invitation || invitation.status !== "pending") {
    return null
  }

  return (
    <RevokeInvitationDialog
      defaultOpen={true}
      onClose={() => {
        void navigate("..")
      }}
      contact={contact}
      invitation={invitation}
      revoke={revoke}
    />
  )
}
