import { LocalDate } from "@js-joda/core"
import { isWeekend } from "lib/isWeekend"
import { describe, expect, test } from "vitest"

describe("getPreviousSunday", () => {
  const testCase = (date: string, expected: boolean): void => {
    const actual = isWeekend(LocalDate.parse(date))
    expect(actual).toEqual(expected)
  }

  describe("returns correct value", () => {
    test.each([
      /* Wed */ ["2023-02-01", false],
      /* Thu */ ["2023-02-02", false],
      /* Fri */ ["2023-02-03", false],
      /* SAT */ ["2023-02-04", true],
      /* SUN */ ["2023-02-05", true],
      /* Mon */ ["2023-02-06", false],
      /* Tue */ ["2023-02-07", false],
    ])("%s", testCase)
  })
})
