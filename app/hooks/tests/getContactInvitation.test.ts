import { describe, expect, test } from "vitest"
import { getContactInvitation } from "../getContactInvitation"
import { type EncodedInvitation, type Invitation, makeInvitation } from "~/schema/Invitation"

describe("getContactInvitation", () => {
  test("returns undefined when no invitations match the contact", () => {
    const invitations = [
      make({
        contactId: "other",
        createdAt: "2026-01-01T00:00:00.000Z",
        invitationCode: "code1",
        status: "pending",
      }),
    ]

    expect(getContactInvitation("contact-1", invitations)).toBeUndefined()
  })

  test("returns the most recent invitation when multiple invitations match", () => {
    const invitations = [
      make({
        contactId: "contact-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        invitationCode: "code1",
        status: "pending",
      }),
      make({
        contactId: "contact-1",
        createdAt: "2026-01-03T00:00:00.000Z",
        invitationCode: "code2",
        status: "pending",
      }),
      make({
        contactId: "contact-2",
        createdAt: "2026-01-02T00:00:00.000Z",
        invitationCode: "code3",
        status: "pending",
      }),
    ]

    const result = getContactInvitation("contact-1", invitations)
    expect(result?.createdAt).toBe("2026-01-03T00:00:00.000Z")
  })
})

/** Create an invitation object for tests. */
function make(overrides: Omit<EncodedInvitation, "id">): Invitation {
  return makeInvitation({
    ...overrides,
    invitationCode: overrides.invitationCode ?? "code",
    dxosInvitationId: overrides.dxosInvitationId,
    status: overrides.status ?? "pending",
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
  })
}
