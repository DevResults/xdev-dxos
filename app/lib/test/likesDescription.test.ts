import { contacts } from "data/contacts"
import { type Contact } from "schema/Contact"
import { describe, expect, test } from "vitest"
import { likesDescription } from "../likesDescription"

const [herb, shane, brent, leslie, ritika, aasit, reid, nathan, fred] = contacts

describe("likesDescription", () => {
  test("sorts names", () => {
    expect(likes(shane, herb)).toBe("Herb and Shane liked this")
  })

  test("replaces self's name with 'you'", () => {
    expect(likes(fred)).toBe("you liked this")
  })

  test("puts 'you' last", () => {
    expect(likes(herb, shane, brent, leslie, fred)).toBe(
      "Brent, Herb, Leslie, Shane, and you liked this",
    )
  })

  test("does not elide anyone", () => {
    expect(likes(herb, shane, brent, leslie, ritika, aasit, reid, nathan, fred)).toBe(
      "Aasit, Brent, Herb, Leslie, Nathan, Reid, Ritika, Shane, and you liked this",
    )
  })

  function likes(...likers: Contact[]) {
    return likesDescription(likers, fred)
  }
})
