/* eslint-disable @typescript-eslint/no-unsafe-assignment */ // expect.any is `any`

import { clients } from "data/clients"
import { projects } from "data/projects"
import { runTestCases, type BaseTestCase } from "lib/runTestCases"
import { ProvidedClients } from "schema/ClientCollection"
import { ProvidedProjects } from "schema/ProjectCollection"
import { describe, expect } from "vitest"
import type { ContactId } from "../../Contact"
import { parseTimeEntry } from "../parseTimeEntry"
import { E } from "~/schema/lib/Effect"

describe("parseTimeEntry", () => {
  const testCases = [
    // failure
    { input: "#Support: Ongoing @aba ", error: "NoDuration" },
    { input: "1h 30mn #Support: Ongoing @aba", error: "MultipleDurations" },
    { input: "1h", error: "NoProject" },
    { input: "1h #API", error: "AmbiguousProjectCode" },
    { input: "1h #Out #Overhead", error: "MultipleProjects" },
    { input: "1h #Support: Ongoing @aba @chemonics", error: "MultipleClients" },
    { input: "1h #Support: Setup update geography", error: "ProjectRequiresClient" },

    // success
    {
      input: "#out 1:15",
      duration: 75,
      projectId: expect.any(String),
      description: "",
    },
    {
      input: "#out 1:15 doctor",
      duration: 75,
      projectId: expect.any(String),
      description: "doctor",
    },
    {
      input: "1h #Support: Ongoing @ABA update geography",
      duration: 60,
      projectId: expect.any(String),
      clientId: expect.any(String),
      description: "update geography",
    },
  ] as TestCase[]

  runTestCases({
    testCases,
    decoder: (input: string) =>
      parseTimeEntry({
        contactId: "1234" as ContactId,
        date: `2021-01-01`,
        input,
      }).pipe(
        E.provideService(ProvidedProjects, projects),
        E.provideService(ProvidedClients, clients),
      ),
    validate(expected, actual) {
      expect(actual.id).toBeTypeOf("string")
      expect(actual.input).toEqual(expected.input)
      expect(actual.duration).toEqual(expected.duration)
      expect(actual.project).toEqual(expected.projectId)
      expect(actual.timestamp).toEqual(expect.any(String))
      if (expected.clientId) expect(actual.client).toEqual(expected.clientId)
      else expect(actual.client).toBeUndefined()
    },
  })
})

type TestCase = BaseTestCase & {
  duration?: number
  projectId?: string
  clientId?: string
  description?: string
}
