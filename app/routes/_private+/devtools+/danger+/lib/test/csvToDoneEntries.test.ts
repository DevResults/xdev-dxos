import { E, pipe } from "schema/lib/Effect"
import { type BaseTestCase } from "lib/runTestCases"
import { ProvidedContacts } from "schema/ContactCollection"
import { assert, expect, test } from "vitest"
import { contacts } from "data/contacts"
import { csvToDoneEntries } from "../csvToDoneEntries"

type TestCase = BaseTestCase & {
  label?: string
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
    error: "The field `content` is required",
  },
  {
    input: `herb,2024-05-42,something something,"[""reid"",""leslie"",""fred""]",1709913601023`,
    error: "Invalid date",
  },

  {
    input: join(
      `herb, 2024-05-30, "quoted content`, //
      `continued on next line"`,
    ),
    error: "Quote Not Closed",
  },

  // VALID
  {
    input: "",
    entries: 0,
    errors: 0,
  },

  {
    label: "3 well-formed entries",
    input: join(
      "herb,2024-05-30,something something,[],1709913601023",
      "brent,2024-05-30,something something,[],1709913601024",
      "leslie,2024-05-30,something something,[],1709913601025",
    ),
    entries: 3,
    errors: 0,
  },
] as TestCase[]

const label = ({ label, input }: TestCase) =>
  label ?? (input.length > 0 ? `\`${input}\`` : "(empty)")

const errorPadding = Math.max(...testCases.filter(tc => tc.error).map(tc => label(tc).length))

const decode = (csv: string) =>
  pipe(csv, csvToDoneEntries, E.provideService(ProvidedContacts, contacts), E.runSync)

for (const testCase of testCases) {
  const { input, only, skip } = testCase

  const testName =
    "error" in testCase && testCase.error ?
      `⛔ ${label(testCase).padEnd(errorPadding)} ${testCase.error}`
    : `✅ ${label(testCase)}`

  const _test =
    only ? test.only
    : skip ? test.skip
    : test

  _test(testName, () => {
    const [errors, entries] = decode(input)
    if ("error" in testCase) {
      const [actualError] = errors
      assert(errors.length > 0)
      assert(testCase.error, `expected success but got error ${actualError.toString()}`)
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
