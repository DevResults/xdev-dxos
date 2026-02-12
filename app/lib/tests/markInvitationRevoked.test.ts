import { describe, expect, test } from "vitest"
import { markInvitationRevoked } from "../markInvitationRevoked"
import type { Invitation } from "~/schema/Invitation"

describe("markInvitationRevoked", () => {
  test("marks invitation as revoked and stores revoked timestamp", () => {
    const invitation = makeInvitation({ status: "pending" })
    const revokedAt = "2026-02-11T00:00:00.000Z"

    markInvitationRevoked(invitation, revokedAt)

    expect(invitation.status).toBe("revoked")
    expect(invitation.revokedAt).toBe(revokedAt)
  })
})

/** Create an invitation object for tests. */
function makeInvitation(overrides: Partial<Invitation> = {}): Invitation {
  return {
    id: overrides.id ?? "inv-0",
    contactId: overrides.contactId ?? "contact-0",
    invitationCode: overrides.invitationCode ?? "JOIN1234",
    dxosInvitationId: overrides.dxosInvitationId,
    status: overrides.status ?? "pending",
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    revokedAt: overrides.revokedAt,
    acceptedAt: overrides.acceptedAt,
  }
}
