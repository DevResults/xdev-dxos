import type { ContactInvitationStatus } from "~/schema/Contact"

/** Derive status label and invitation actions for the members table. */
export function getContactMembershipDisplay({
  isAdmin,
  isMember,
  invitationStatus,
}: Input): Output {
  if (isAdmin) {
    return { statusLabel: "Admin", canInvite: false, canRevoke: false }
  }

  if (isMember) {
    return { statusLabel: "Member", canInvite: false, canRevoke: false }
  }

  if (invitationStatus === "PENDING") {
    return { statusLabel: "Invitation pending", canInvite: false, canRevoke: true }
  }

  if (invitationStatus === "REVOKED") {
    return { statusLabel: "Invitation revoked", canInvite: true, canRevoke: false }
  }

  if (invitationStatus === "EXPIRED") {
    return { statusLabel: "Invitation expired", canInvite: true, canRevoke: false }
  }

  if (invitationStatus === "ACCEPTED") {
    return { statusLabel: "Invitation accepted", canInvite: false, canRevoke: false }
  }

  return { statusLabel: "Not invited", canInvite: true, canRevoke: false }
}

type Input = {
  isAdmin: boolean
  isMember: boolean
  invitationStatus: ContactInvitationStatus
}

type Output = {
  statusLabel: string
  canInvite: boolean
  canRevoke: boolean
}
