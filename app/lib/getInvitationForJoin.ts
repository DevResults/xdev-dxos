import type { Invitation } from "~/schema/Invitation"

/** Get the latest pending invitation record for a join code. */
export function getInvitationForJoin(
  invitationCode: string | undefined,
  invitations: Invitation[],
): Invitation | undefined {
  if (!invitationCode) {
    return undefined
  }

  return invitations
    .filter(
      invitation => invitation.invitationCode === invitationCode && invitation.status === "pending",
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0]
}
