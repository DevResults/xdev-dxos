import type { Invitation } from "~/schema/Invitation"

/** Mark an invitation record as revoked. */
export function markInvitationRevoked(invitation: Invitation, revokedAt: string): void {
  invitation.status = "revoked"
  invitation.revokedAt = revokedAt
}
