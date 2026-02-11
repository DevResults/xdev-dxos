import { describe, expect, test } from "vitest"
import { createContactFromValues } from "../createContactFromValues"

describe("createContactFromValues", () => {
  test("builds a contact payload with optional identity", () => {
    expect(
      createContactFromValues({
        firstName: "Ada",
        lastName: "Lovelace",
        userName: "ada",
        avatarUrl: "https://example.com/ada.png",
      }),
    ).toEqual({
      identityId: undefined,
      firstName: "Ada",
      lastName: "Lovelace",
      userName: "ada",
      avatarUrl: "https://example.com/ada.png",
    })
  })
})
