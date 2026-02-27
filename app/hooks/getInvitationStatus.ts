import type { ContactInvitationStatus } from "~/schema/Contact"
import type { Invitation } from "~/schema/Invitation"

const INVITATION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

/** Compute the UI invitation status for a contact. */
export function getInvitationStatus(
  invitation: Invitation | undefined,
  now: number = Date.now(),
): ContactInvitationStatus {
  if (!invitation) {
    return "NOT_INVITED"
  }

  if (invitation.status === "accepted") {
    return "ACCEPTED"
  }

  if (invitation.status === "revoked") {
    return "REVOKED"
  }

  const createdAt = Date.parse(invitation.createdAt)
  if (Number.isNaN(createdAt)) {
    return "PENDING"
  }

  return now - createdAt >= INVITATION_EXPIRY_MS ? "EXPIRED" : "PENDING"
}
