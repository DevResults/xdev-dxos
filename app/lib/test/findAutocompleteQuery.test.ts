import { describe, expect, test } from "vitest"
import {
  findAutocompleteQuery,
  type AutocompleteState,
  type AutocompleteTrigger,
} from "~/ui/AutocompleteMenu"
import { assert } from "~/lib/assert"

const autocompleteTriggers: AutocompleteTrigger[] = [
  { type: "PROJECT", trigger: "#" },
  { type: "CLIENT", trigger: "@" },
] as const

// the `|` character represents the cursor position
const cases: TestCase[] = [
  {
    name: "@ trigger at end of word",
    input: "#support @usaid|",
    expected: { trigger: "@", query: "usaid", start: 9, end: 15 },
  },
  {
    name: "# trigger at end of word",
    input: "#support|",
    expected: { trigger: "#", query: "support", start: 0, end: 8 },
  },
  {
    name: "trigger in middle of word",
    input: "#support @usa|id pizza",
    expected: { trigger: "@", query: "usaid", start: 9, end: 15 },
  },
  {
    name: "trigger at start of word",
    input: "#support |@usaid pizza",
    expected: { trigger: "@", query: "usaid", start: 9, end: 15 },
  },
  {
    name: "cursor not in trigger word",
    input: "he|llo @usaid",
    expected: undefined,
  },
  {
    name: "empty string",
    input: "|",
    expected: undefined,
  },
  {
    name: "spaces around trigger word",
    input: "   @us|aid   ",
    expected: { trigger: "@", query: "usaid", start: 3, end: 9 },
  },
]

/**
 * Takes a string containing a cursor marker `|` and returns the text without the cursor marker
 * along with the position of the cursor
 */
const extractCursor = (text: string): { text: string; position: number } => {
  const position = text.indexOf("|")
  if (position === -1) throw new Error("No cursor marker found in test input")
  return {
    text: text.replace("|", ""),
    position,
  }
}

describe("findAutocompleteTriggerAtCursor", () => {
  test.each(cases)("$name", ({ input, expected }) => {
    const { text, position } = extractCursor(input)
    const result = findAutocompleteQuery(text, position, autocompleteTriggers)
    if (expected === undefined) {
      expect(result).toBeUndefined()
    } else {
      assert(result !== undefined)
      const { trigger, query, start, end } = result
      expect({ trigger, query, start, end }).toEqual(expected)
    }
  })
})

type TestCase = {
  name: string
  input: string // includes `|` marker
  expected: Pick<AutocompleteState, "trigger" | "query" | "start" | "end"> | undefined
}
