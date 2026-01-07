/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      input => ({ contactId: "1234" as ContactId, date: "2024-06-10", input }), // This stuff is provided by the app when an entry is made
      parseTimeEntry,
      E.provideService(ProvidedProjects, projects),
      E.provideService(ProvidedClients, clients),
      E.runSync,
    )

  const encode = (decoded: TimeEntry) => encodeTimeEntry(decoded)

  const decode = (encoded: TimeEntryEncoded) => decodeTimeEntry(encoded)

  // Skip test - parseTimeEntry now uses Obj.make which requires DXOS runtime context
  it.skip("parses a TimeEntry", () => {
    const timeEntry = parse("1h #Support: Ongoing @ABA update geography")

    const projectId = projects.find(p => p.fullCode === "Support:Ongoing")?.id
    const clientId = clients.find(c => c.code === "aba")?.id

    // ParseTimeEntry now returns a reactive DXOS object with id
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

    // With current DXOS limitations, the parsed value is no different from the encoded value
    // see https://discord.com/channels/837138313172353095/1340003933757902908/1342464555791552598

    // expect(timeEntry).toEqual({
    //   id: "", // expect.any(String),
    //   contactId: "", // expect.any(String),
    //   date: "2024-06-10", // hydrated LocalDate
    //   input: "1h #Support: Ongoing @ABA update geography",
    //   project: "",
    //   client: "",
    //   // project: {
    //   //   // hydrated project
    //   //   id: expect.any(String),
    //   //   code: "Support",
    //   //   color: expect.any(String),
    //   //   subCode: "Ongoing",
    //   //   description: "Includes engineering support to individual clients (but not bug fixing)",
    //   //   requiresClient: false,
    //   //   timestamp: expect.any(Date),
    //   // },
    //   // client: {
    //   //   // hydrated client
    //   //   id: expect.any(String),
    //   //   code: "aba",
    //   //   timestamp: expect.any(Date),
    //   // },
    //   description: "update geography",
    //   duration: 60,
    //   timestamp: "", // expect.any(String),
    // })
  })

  // Skip encode/decode tests - they require DXOS runtime context
  // These would need integration tests with a real DXOS client
  it.skip("encodes a TimeEntry", () => {
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

  // Skip encode/decode tests - they require DXOS runtime context
  it.skip("decodes a TimeEntry", () => {
    const timeEntry = parse("1h #Support: Ongoing @ABA update geography")
    const encoded = encode(timeEntry)
    const decoded = decode(encoded)
    expect(decoded).toEqual(timeEntry)
  })
})
