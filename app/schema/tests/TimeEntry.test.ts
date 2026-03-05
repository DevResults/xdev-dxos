import { clients } from "data/clients"
import { projects } from "data/projects"
import { ProvidedClients } from "schema/ClientCollection"
import { parseTimeEntry } from "schema/lib/parseTimeEntry"
import { ProvidedProjects } from "schema/ProjectCollection"
import { describe, expect, it } from "vitest"
import type { ContactId } from "../Contact"
import {
  decodeTimeEntry,
  encodeTimeEntry,
  type TimeEntry,
  type TimeEntryEncoded,
} from "../TimeEntry"
import { E, pipe } from "~/schema/lib/Effect"

describe("TimeEntry", () => {
  const parse = (input: string) =>
    pipe(
      input,
      text => ({ contactId: "1234" as ContactId, date: "2024-06-10", input: text }), // This stuff is provided by the app when an entry is made
      parseTimeEntry,
      E.provideService(ProvidedProjects, projects),
      E.provideService(ProvidedClients, clients),
      E.runSync,
    )

  const encode = (decoded: TimeEntry) => encodeTimeEntry(decoded)

  const decode = (encoded: TimeEntryEncoded) => decodeTimeEntry(encoded)

  it("parses a TimeEntry", () => {
    const timeEntry = parse("1h #Support: Ongoing @ABA update geography")

    const projectId = projects.find(p => p.fullCode === "Support:Ongoing")?.id
    const clientId = clients.find(c => c.code === "aba")?.id

    expect(timeEntry).toMatchObject({
      contactId: "1234",
      date: "2024-06-10", // String
      project: projectId,
      client: clientId,
      duration: 60,
      description: "update geography",
      input: "1h #Support: Ongoing @ABA update geography",
      timestamp: expect.any(String),
    })
  })

  it("encodes a TimeEntry", () => {
    const timeEntry = parse("1h #Support: Ongoing @ABA update geography")

    const encoded = encode(timeEntry)

    const projectId = projects.find(p => p.fullCode === "Support:Ongoing")?.id
    const clientId = clients.find(c => c.code === "aba")?.id

    expect(encoded).toEqual({
      id: expect.any(String),
      contactId: "1234",
      date: "2024-06-10",
      project: projectId,
      client: clientId,
      duration: 60,
      description: "update geography",
      input: "1h #Support: Ongoing @ABA update geography",
      timestamp: expect.any(String),
    })
  })

  it("decodes a TimeEntry", () => {
    const timeEntry = parse("1h #Support: Ongoing @ABA update geography")
    const encoded = encode(timeEntry)
    const decoded = decode(encoded)
    expect(decoded).toEqual(timeEntry)
  })
})
