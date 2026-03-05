import { E, Either, pipe } from "schema/lib/Effect"
import { test as _test, assert, expect } from "vitest"

export const runTestCases = <
  TestCase extends BaseTestCase,
  ExpectedSchema extends Record<string, any> | undefined,
>({
  testCases,
  decoder,
  validate = () => {},
  label = ({ input }) => input,
}: {
  testCases: TestCase[]
  decoder: (input: string) => E.Effect<ExpectedSchema, Error>
  validate: (expected: TestCase, actual: ExpectedSchema) => void
  label?: (testCase: TestCase) => string
}) => {
  for (const testCase of testCases) {
    const { input: testInput, error, only, skip } = testCase
    const test = only ? _test.only : skip ? _test.skip : _test

    const decode = (text: string) =>
      pipe(
        text, //
        decoder,
        E.either,
        E.runSync,
      )

    const errorPadding = Math.max(...testCases.filter(tc => tc.error).map(tc => label(tc).length))
    const testName = error
      ? `⛔ ${testInput.padEnd(errorPadding)} ${error}`
      : `✅ ${label(testCase)}`

    test(testName, () => {
      const result = decode(testInput)
      if (Either.isLeft(result)) {
        const actualError = result.left as Error & { _tag: string }
        assert(error, `expected success but got error ${actualError.toString()}`)
        expect(actualError._tag).toContain(error)
      } else {
        assert(!error, `expected error ${error}`)
        const parseResult = result.right
        validate(testCase, parseResult)
      }
    })
  }
}

export const only = true
export const skip = true

export type BaseTestCase = {
  input: string
  error?: string
  only?: true
  skip?: true
}
