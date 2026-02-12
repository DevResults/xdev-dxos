import { describe, expect, test } from "vitest"
import { getInvitationForJoin } from "../getInvitationForJoin"
import type { Invitation } from "~/schema/Invitation"

describe("getInvitationForJoin", () => {
  test("returns undefined when no invitation matches the code", () => {
    const invitations = [makeInvitation({ invitationCode: "OTHER123" })]

    expect(getInvitationForJoin("JOIN1234", invitations)).toBeUndefined()
  })

  test("returns the most recent pending invitation for the code", () => {
    const invitations = [
      makeInvitation({
        id: "inv-1",
        invitationCode: "JOIN1234",
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
      makeInvitation({
        id: "inv-2",
        invitationCode: "JOIN1234",
        createdAt: "2026-01-02T00:00:00.000Z",
      }),
      makeInvitation({ id: "inv-3", invitationCode: "JOIN1234", status: "accepted" }),
    ]

    expect(getInvitationForJoin("JOIN1234", invitations)?.id).toBe("inv-2")
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
