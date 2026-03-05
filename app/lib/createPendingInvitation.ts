import type { EncodedInvitation } from "~/schema/Invitation"

/** Create a pending invitation payload for persistence. */
export function createPendingInvitation(
  contactId: string,
  createdAt: string,
): Omit<EncodedInvitation, "id" | "dxosInvitationId" | "revokedAt" | "acceptedAt"> {
  return {
    contactId,
    invitationCode: "",
    status: "pending",
    createdAt,
  }
}
