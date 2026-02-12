import { describe, expect, test } from "vitest"
import { shouldUpdateInvitationCode } from "../shouldUpdateInvitationCode"

describe("shouldUpdateInvitationCode", () => {
  test("returns false when code is empty", () => {
    expect(shouldUpdateInvitationCode("", "")).toBe(false)
    expect(shouldUpdateInvitationCode("abc123", "")).toBe(false)
  })

  test("returns true when code becomes available", () => {
    expect(shouldUpdateInvitationCode("", "abc123")).toBe(true)
  })

  test("returns false when code is unchanged", () => {
    expect(shouldUpdateInvitationCode("abc123", "abc123")).toBe(false)
  })
})
