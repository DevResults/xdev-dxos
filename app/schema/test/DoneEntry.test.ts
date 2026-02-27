import { describe, expect, expectTypeOf, it } from "vitest"
import { type ContactId } from "../Contact"
import {
  decodeDoneEntry,
  encodeDoneEntry,
  make as makeDoneEntry,
  type DoneEntry,
  type DoneEntryEncoded,
} from "../DoneEntry"

describe("DoneEntry", () => {
  it("constructs a DoneEntry", () => {
    const decoded = makeDoneEntry({
      contactId: "0001" as ContactId,
      date: "2024-06-10",
      content: "Coded and compiled terabytes of data",
    })

    // contactId was cast as a ContactId
    expectTypeOf(decoded.contactId).toEqualTypeOf<ContactId>()

    // id was populated
    expect(decoded.id).toBeTypeOf("string")
    expect(decoded.id).toHaveLength(26)

    // date was preserved as an ISO local date string
    expect(decoded.date).toBe("2024-06-10")

    // content was left untouched
    expect(decoded.content).toBe("Coded and compiled terabytes of data")

    // likes was initialized as an empty array
    expect(decoded.likes).toEqual([])

    // timestamp was populated
    expect(decoded.timestamp).toBeTypeOf("number")
    expect(decoded.timestamp).toBeGreaterThan(0)

    expectTypeOf(decoded).toMatchTypeOf<DoneEntry>()
  })

  it("encodes and decodes DoneEntry", () => {
    const decoded = makeDoneEntry({
      contactId: "0001" as ContactId,
      date: "2024-06-10",
      content: "Coded and compiled terabytes of data",
      likes: [],
      timestamp: Date.now(),
    })

    const encoded = encodeDoneEntry(decoded)

    expectTypeOf(encoded).toExtend<DoneEntryEncoded>()

    // Round trip
    const decodedAgain = decodeDoneEntry(encoded)
    expect(decodedAgain).toEqual(decoded)
  })
})
