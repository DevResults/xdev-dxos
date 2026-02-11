import { describe, expect, expectTypeOf, test } from "vitest"
import type { InvitationStatus } from "../Invitation"

describe("Invitation schema", () => {
  test("defines the expected invitation status union", () => {
    expectTypeOf<InvitationStatus>().toEqualTypeOf<"pending" | "accepted" | "revoked">()
    expect(["pending", "accepted", "revoked"]).toHaveLength(3)
  })
})
