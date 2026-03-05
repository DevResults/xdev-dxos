import { clients } from "data/clients"
import { contacts } from "data/contacts"
import actualHoursCsv from "data/csv/hours.csv?raw"
import { projects } from "data/projects"
import { type BaseTestCase } from "lib/runTestCases"
import { ProvidedClients } from "schema/ClientCollection"
import { ProvidedContacts } from "schema/ContactCollection"
import { E, pipe } from "schema/lib/Effect"
import { ProvidedProjects } from "schema/ProjectCollection"
import { assert, expect, test } from "vitest"
import { csvToTimeEntries } from "../csvToTimeEntries"

type TestCase = BaseTestCase & {
  text?: string
  entries?: number
  errors?: number
}

const testCases = [
  // INVALID
  {
    input: "herb",
    error: "The field `date` is required",
  },
  {
    input: "herb,2024-05-30",
    error: "The field `duration` is required",
  },
  {
    input: "herb,2024-05-30,1",
    error: "The field `project` is required",
  },
  {
    input: "leslie,2024-05-30,,Support: Ongoing,aba,tickets",
    error: "Duration must be a valid number",
  },
  {
    input: "leslie,2024-05-30,1hr,Support: Ongoing,aba,tickets",
    error: "Duration must be a valid number",
  },
  {
    input: "brent,2024-05-42,2.25,Out,,Out",
    error: "Invalid date",
  },
  {
    input: "brent,2024-05-30,2.25,Sick,,",
    error: 'There is no project with code "Sick"',
  },
  {
    input: "leslie,2024-05-30,1,Support: Ongoing,qrs,tickets",
    error: 'There is no client with code "qrs"',
  },

  // VALID
  { input: "", entries: 0, errors: 0 },

  {
    text: "3 well-formed entries",
    input: join(
      "Herb,2024-05-30,1.50,Overhead,,hours tracking",
      "Brent,2024-05-30,2.25,Out,,Out",
      "Leslie,2024-05-30,1,Support: Ongoing,aba,tickets",
    ),
    entries: 3,
    errors: 0,
  },

  {
    text: "actual hours dataset",
    input: actualHoursCsv.split("\n").slice(0, 5000).join("\n"),
    entries: 4998,
    errors: 2,
  },
] as TestCase[]

const label = ({ text, input }: TestCase) => text ?? (input.length > 0 ? `\`${input}\`` : "(empty)")

const errorPadding = Math.max(...testCases.filter(tc => tc.error).map(tc => label(tc).length))

for (const testCase of testCases) {
  testCsvToTimeEntries(testCase)
}

function decode(csv: string) {
  return pipe(
    csv,
    csvToTimeEntries,
    E.provideService(ProvidedContacts, contacts),
    E.provideService(ProvidedProjects, projects),
    E.provideService(ProvidedClients, clients),
    E.runSync,
  )
}

export function testCsvToTimeEntries(testCase: TestCase) {
  const { input, only, skip } = testCase

  const testName =
    "error" in testCase && testCase.error
      ? `⛔ ${label(testCase).padEnd(errorPadding)} ${testCase.error}`
      : `✅ ${label(testCase)}`

  const _test = only ? test.only : skip ? test.skip : test

  _test(testName, () => {
    const [errors, entries] = decode(input)
    if ("error" in testCase) {
      const [actualError] = errors
      assert(errors.length > 0)
      assert(testCase.error, `expected success but got error ${actualError.message}`)
      expect(actualError.message).toContain(testCase.error)
    } else {
      assert("entries" in testCase)
      assert("errors" in testCase)
      expect(entries).toHaveLength(testCase.entries)
      expect(errors).toHaveLength(testCase.errors)
    }
  })
}

function join(...lines: string[]) {
  return lines.join("\n")
}
