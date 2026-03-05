import { LocalDate } from "@js-joda/core"
import { describe, expect, test } from "vitest"
import { formatDateRange, type Options } from "../formatDateRange"

describe("formatDateRange", () => {
  const testCase =
    (options?: Options) =>
    (expected: string, startOfWeek: string, endOfWeek: string): void => {
      const actual = formatDateRange(
        LocalDate.parse(startOfWeek),
        LocalDate.parse(endOfWeek),
        options,
      )
      expect(actual).toEqual(expected)
    }

  describe("default options", () => {
    describe("within the same month", () => {
      test.each([
        ["January 1 – 7, 2023", "2023-01-01", "2023-01-07"],
        ["January 8 – 14, 2023", "2023-01-08", "2023-01-14"],
        ["January 15 – 21, 2023", "2023-01-15", "2023-01-21"],
      ])("%s", testCase())
    })

    describe("straddling two months", () => {
      test.each([
        ["January 30 – February 5, 2022", "2022-01-30", "2022-02-05"],
        ["January 29 – February 4, 2023", "2023-01-29", "2023-02-04"],
        ["February 26 – March 4, 2023", "2023-02-26", "2023-03-04"],
      ])("%s", testCase())
    })

    describe("straddling two years", () => {
      test.each([
        ["December 26, 2021 – January 1, 2022", "2021-12-26", "2022-01-01"],
        ["December 31, 2023 – January 6, 2024", "2023-12-31", "2024-01-06"],
      ])("%s", testCase())
    })
  })

  describe("short month", () => {
    describe("within the same month", () => {
      test.each([
        ["Jan 1 – 7, 2023", "2023-01-01", "2023-01-07"],
        ["Jan 8 – 14, 2023", "2023-01-08", "2023-01-14"],
        ["Jan 15 – 21, 2023", "2023-01-15", "2023-01-21"],
      ])("%s", testCase({ monthFormat: "short" }))
    })

    describe("straddling two months", () => {
      test.each([
        ["Jan 30 – Feb 5, 2022", "2022-01-30", "2022-02-05"],
        ["Jan 29 – Feb 4, 2023", "2023-01-29", "2023-02-04"],
        ["Feb 26 – Mar 4, 2023", "2023-02-26", "2023-03-04"],
      ])("%s", testCase({ monthFormat: "short" }))
    })

    describe("straddling two years", () => {
      test.each([
        ["Dec 26, 2021 – Jan 1, 2022", "2021-12-26", "2022-01-01"],
        ["Dec 31, 2023 – Jan 6, 2024", "2023-12-31", "2024-01-06"],
      ])("%s", testCase({ monthFormat: "short" }))
    })
  })

  describe("short month, no year", () => {
    describe("within the same month", () => {
      test.each([
        ["Jan 1 – 7", "2023-01-01", "2023-01-07"],
        ["Jan 8 – 14", "2023-01-08", "2023-01-14"],
        ["Jan 15 – 21", "2023-01-15", "2023-01-21"],
      ])("%s", testCase({ monthFormat: "short", includeYear: false }))
    })

    describe("straddling two months", () => {
      test.each([
        ["Jan 30 – Feb 5", "2022-01-30", "2022-02-05"],
        ["Jan 29 – Feb 4", "2023-01-29", "2023-02-04"],
        ["Feb 26 – Mar 4", "2023-02-26", "2023-03-04"],
      ])("%s", testCase({ monthFormat: "short", includeYear: false }))
    })

    describe("straddling two years", () => {
      test.each([
        ["Dec 26, 2021 – Jan 1, 2022", "2021-12-26", "2022-01-01"],
        ["Dec 31, 2023 – Jan 6, 2024", "2023-12-31", "2024-01-06"],
      ])("%s", testCase({ monthFormat: "short", includeYear: false }))
    })
  })
})
