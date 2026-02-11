import { describe, expect, test } from "vitest"
import { getContactInvitation } from "../getContactInvitation"
import type { Invitation } from "~/schema/Invitation"

describe("getContactInvitation", () => {
  test("returns undefined when no invitations match the contact", () => {
    const invitations = [makeInvitation({ contactId: "other" })]

    expect(getContactInvitation("contact-1", invitations)).toBeUndefined()
  })

  test("returns the most recent invitation when multiple invitations match", () => {
    const invitations = [
      makeInvitation({
        id: "inv-1",
        contactId: "contact-1",
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
      makeInvitation({
        id: "inv-2",
        contactId: "contact-1",
        createdAt: "2026-01-03T00:00:00.000Z",
      }),
      makeInvitation({
        id: "inv-3",
        contactId: "contact-2",
        createdAt: "2026-01-02T00:00:00.000Z",
      }),
    ]

    expect(getContactInvitation("contact-1", invitations)?.id).toBe("inv-2")
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
  }
}
