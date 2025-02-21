import { create } from "@dxos/react-client/echo"
import { describe, expect, expectTypeOf, it } from "vitest"
import { type ContactId } from "../Contact"
import { DoneEntry, type DoneEntryEncoded } from "../DoneEntry"

describe("DoneEntry", () => {
  // it("constructs a DoneEntry", () => {
  //   const decoded = {
  //     contactId: "0001" as ContactId,
  //     date: LocalDate.parse("2024-06-10"),
  //     content: "Coded and compiled terabytes of data",
  //   }

  //   // contactId was cast as a ContactId
  //   expectTypeOf(decoded.contactId).toMatchTypeOf<ContactId>()

  //   // id was populated
  //   expect(decoded.id).toBeTypeOf("string")
  //   expect(decoded.id).toHaveLength(24)

  //   // date was parsed
  //   expect(decoded.date).toBeInstanceOf(LocalDate)
  //   expect(decoded.date.year()).toBe(2024)
  //   expect(decoded.date.monthValue()).toBe(6)
  //   expect(decoded.date.dayOfMonth()).toBe(10)

  //   // content was left untouched
  //   expect(decoded.content).toBe("Coded and compiled terabytes of data")

  //   // likes was initialized as an empty array
  //   expect(decoded.likes).toEqual([])

  //   // timestamp was populated
  //   expect(decoded.timestamp).toBeInstanceOf(Date)

  //   expectTypeOf(decoded).toMatchTypeOf<DoneEntry>()
  // })

  it("encodes and decodes DoneEntry", () => {
    const decoded = create(DoneEntry, {
      contactId: "0001" as ContactId,
      date: "2024-06-10",
      content: "Coded and compiled terabytes of data",
      likes: [],
      timestamp: new Date().toISOString(),
    })

    const encoded = DoneEntry.encode(decoded)

    expectTypeOf(encoded).toMatchTypeOf<DoneEntryEncoded>()

    // round trip
    const decodedAgain = DoneEntry.decode(encoded)
    expect(decodedAgain).toEqual(decoded)
  })
})
