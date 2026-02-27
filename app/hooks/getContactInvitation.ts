import type { Invitation } from "~/schema/Invitation"

/** Get the most recent invitation for a contact. */
export function getContactInvitation(
  contactId: string,
  invitations: Invitation[],
): Invitation | undefined {
  return invitations
    .filter(invitation => invitation.contactId === contactId)
    .toSorted((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0]
}
