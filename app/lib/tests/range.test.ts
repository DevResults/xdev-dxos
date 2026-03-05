import { describe, expect, test } from "vitest"
import { range } from "../range"

describe("range", () => {
  test("with only stop returns array from 1 to 5", () => {
    expect(range(5)).toEqual([1, 2, 3, 4, 5])
  })

  test("with only start and stop returns array from start to stop", () => {
    expect(range(3, 8)).toEqual([3, 4, 5, 6, 7, 8])
  })

  test("with props and step 1 works as start and stop", () => {
    expect(range({ start: 3, stop: 8, step: 1 })).toEqual([3, 4, 5, 6, 7, 8])
  })

  test("with props and step 2 gets only odd numbers", () => {
    expect(range({ start: 1, stop: 8, step: 2 })).toEqual([1, 3, 5, 7])
  })
})
