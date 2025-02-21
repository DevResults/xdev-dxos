import { clients } from "data/clients"
import { runTestCases, type BaseTestCase } from "lib/runTestCases"
import { ProvidedClients } from "schema/ClientCollection"
import { describe, expect } from "vitest"
import { parseClient } from "../parseClient"
import { E, pipe } from "~/schema/lib/Effect"

describe("parseClient", () => {
  runTestCases({
    testCases: [
      { input: "@aba @chemonics", error: "MultipleClients" },
      { input: "#out @aaba 1h", error: "ClientCodeNotFound" },
      { input: "#out 1h", noClient: true },
      { input: "1h #Support: ongoing @aba", code: "aba", text: "@aba" },
      { input: "1h #Ongoing @chemonics", code: "chemonics", text: "@chemonics" },
    ] as TestCase[],
    decoder: (input: string) =>
      pipe(
        input, //
        parseClient,
        E.provideService(ProvidedClients, clients),
      ),
    validate(testCase, result) {
      if (result.client === undefined) {
        expect(testCase.noClient).toBe(true)
      } else {
        expect(testCase.noClient).not.toBe(true)
        expect(result.client.code).toEqual(testCase.code)
        expect(result.text).toEqual(testCase.text)
      }
    },
  })
})

type TestCase = BaseTestCase & {
  code?: string
  text?: string
  noClient?: boolean
}
