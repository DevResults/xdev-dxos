import { describe, expect, test } from "vitest"
import { getInvitationStatus } from "../getInvitationStatus"
import type { Invitation } from "~/schema/Invitation"

describe("getInvitationStatus", () => {
  test("returns NOT_INVITED when invitation is missing", () => {
    expect(getInvitationStatus(undefined, Date.parse("2026-01-01T00:00:00.000Z"))).toBe(
      "NOT_INVITED",
    )
  })

  test("returns PENDING for recent pending invitations", () => {
    const invitation = makeInvitation({
      status: "pending",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    const now = Date.parse("2026-01-03T00:00:00.000Z")
    expect(getInvitationStatus(invitation, now)).toBe("PENDING")
  })

  test("returns EXPIRED for pending invitations older than seven days", () => {
    const invitation = makeInvitation({
      status: "pending",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    const now = Date.parse("2026-01-10T00:00:00.000Z")
    expect(getInvitationStatus(invitation, now)).toBe("EXPIRED")
  })

  test("returns REVOKED for revoked invitations", () => {
    expect(getInvitationStatus(makeInvitation({ status: "revoked" }))).toBe("REVOKED")
  })

  test("returns ACCEPTED for accepted invitations", () => {
    expect(getInvitationStatus(makeInvitation({ status: "accepted" }))).toBe("ACCEPTED")
  })
})

/** Create an invitation object for tests. */
function makeInvitation(overrides: Partial<Invitation> = {}): Invitation {
  return {
    id: overrides.id ?? "inv-0",
    contactId: overrides.contactId ?? "contact-0",
    invitationCode: overrides.invitationCode ?? "code",
    dxosInvitationId: overrides.dxosInvitationId,
    status: overrides.status ?? "pending",
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    revokedAt: overrides.revokedAt,
    acceptedAt: overrides.acceptedAt,
  } as Invitation
}
