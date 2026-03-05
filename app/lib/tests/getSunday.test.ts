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
      /* Wed */ ["2023-02-01", "2023-01-29"],
      /* Thu */ ["2023-02-02", "2023-01-29"],
      /* Fri */ ["2023-02-03", "2023-01-29"],
      /* Sat */ ["2023-02-04", "2023-01-29"],

      /* SUN */ ["2023-02-05", "2023-02-05"],
      /* Mon */ ["2023-02-06", "2023-02-05"],
      /* Tue */ ["2023-02-07", "2023-02-05"],
    ])("%s", testCase)
  })

  describe("straddling a year", () => {
    test.each([
      /* Tue */ ["2019-12-31", "2019-12-29"],
      /* Wed */ ["2020-01-01", "2019-12-29"],
      /* Thu */ ["2020-01-02", "2019-12-29"],
      /* Fri */ ["2020-01-03", "2019-12-29"],
      /* Sat */ ["2020-01-04", "2019-12-29"],

      /* SUN */ ["2020-01-05", "2020-01-05"],
      /* Mon */ ["2020-01-06", "2020-01-05"],
      /* Tue */ ["2020-01-07", "2020-01-05"],
      /* Wed */ ["2020-01-08", "2020-01-05"],
    ])("%s", testCase)
  })
})
