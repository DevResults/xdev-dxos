import { describe, test, expect } from "vitest"
import { rankByScore } from "../rankByScore"

describe("rankByScore", () => {
  test("no ties", () => {
    const items = [
      { id: "a", score: 20 },
      { id: "b", score: 30 },
      { id: "c", score: 10 },
    ]
    const result = rankByScore(items)
    expect(result).toEqual(
      new Map([
        [0, ["c"]],
        [1, ["a"]],
        [2, ["b"]],
      ]),
    )
  })

  test("one tie", () => {
    const items = [
      { id: "a", score: 10 },
      { id: "b", score: 20 },
      { id: "c", score: 10 },
      { id: "d", score: 30 },
    ]
    const result = rankByScore(items)
    expect(result).toEqual(
      new Map([
        [0, ["a", "c"]],
        [1, ["b"]],
        [2, ["d"]],
      ]),
    )
  })

  test("two ties", () => {
    const items = [
      { id: "a", score: 10 },
      { id: "b", score: 20 },
      { id: "c", score: 10 },
      { id: "d", score: 20 },
      { id: "e", score: 30 },
    ]
    const result = rankByScore(items)
    expect(result).toEqual(
      new Map([
        [0, ["a", "c"]],
        [1, ["b", "d"]],
        [2, ["e"]],
      ]),
    )
  })
})
