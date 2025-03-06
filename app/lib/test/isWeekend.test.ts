import { LocalDate } from "@js-joda/core"
import { describe, expect, test } from "vitest"
import { isWeekend } from "lib/isWeekend"

describe("getPreviousSunday", () => {
  const testCase = (date: string, expected: boolean): void => {
    const actual = isWeekend(LocalDate.parse(date))
    expect(actual).toEqual(expected)
  }

  describe("returns correct value", () => {
    test.each([
      /* wed */ ["2023-02-01", false],
      /* thu */ ["2023-02-02", false],
      /* fri */ ["2023-02-03", false],
      /* SAT */ ["2023-02-04", true],
      /* SUN */ ["2023-02-05", true],
      /* mon */ ["2023-02-06", false],
      /* tue */ ["2023-02-07", false],
    ])("%s", testCase)
  })
})
