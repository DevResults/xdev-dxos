import { test as _test, assert } from "vitest"
import { $, E, Either, pipe } from "~/schema/lib/Effect"

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
    const { input, error, only, skip } = testCase
    const test =
      only ? _test.only
      : skip ? _test.skip
      : _test

    const decode = (input: string) =>
      pipe(
        input, //
        decoder,
        E.either,
        $,
      )

    const errorPadding = Math.max(...testCases.filter(tc => tc.error).map(tc => label(tc).length))
    const testName = error ? `⛔ ${input.padEnd(errorPadding)} ${error}` : `✅ ${label(testCase)}`

    test(testName, () => {
      const result = decode(input)
      if (Either.isLeft(result)) {
        const actualError = result.left as Error & { _tag: string }
        assert(error, `expected success but got error ${actualError.toString()}`)
        assert(
          actualError._tag.includes(error),
          `expected error ${error} but got ${actualError.toString()}`,
        )
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
