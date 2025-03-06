import { LocalDate } from "@js-joda/core"
import { describe, expect, test } from "vitest"
import { getSunday } from "../getSunday"

describe("getSunday", () => {
  const testCase = (date: string, sunday: string): void => {
    const actual = getSunday(LocalDate.parse(date))
    const expected = LocalDate.parse(sunday)
    expect(actual).toEqual(expected)
  }

  describe("straddling a month", () => {
    test.each([
      /* wed */ ["2023-02-01", "2023-01-29"],
      /* thu */ ["2023-02-02", "2023-01-29"],
      /* fri */ ["2023-02-03", "2023-01-29"],
      /* sat */ ["2023-02-04", "2023-01-29"],

      /* SUN */ ["2023-02-05", "2023-02-05"],
      /* mon */ ["2023-02-06", "2023-02-05"],
      /* tue */ ["2023-02-07", "2023-02-05"],
    ])("%s", testCase)
  })

  describe("straddling a year", () => {
    test.each([
      /* tue */ ["2019-12-31", "2019-12-29"],
      /* wed */ ["2020-01-01", "2019-12-29"],
      /* thu */ ["2020-01-02", "2019-12-29"],
      /* fri */ ["2020-01-03", "2019-12-29"],
      /* sat */ ["2020-01-04", "2019-12-29"],

      /* SUN */ ["2020-01-05", "2020-01-05"],
      /* mon */ ["2020-01-06", "2020-01-05"],
      /* tue */ ["2020-01-07", "2020-01-05"],
      /* wed */ ["2020-01-08", "2020-01-05"],
    ])("%s", testCase)
  })
})
