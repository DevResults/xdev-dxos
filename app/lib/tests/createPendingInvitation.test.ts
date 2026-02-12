import { describe, expect, test } from "vitest"
import { createPendingInvitation } from "../createPendingInvitation"

describe("createPendingInvitation", () => {
  test("creates a pending invitation record for a contact", () => {
    const createdAt = "2026-02-11T00:00:00.000Z"
    const invitation = createPendingInvitation("contact-1", createdAt)

    expect(invitation).toEqual({
      contactId: "contact-1",
      invitationCode: "",
      status: "pending",
      createdAt,
    })
  })
})
