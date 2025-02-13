import { Data, E } from "./Effect"
import { alphanumeric, endWord, startWord } from "./regex"
import { ProvidedClients } from "../ClientCollection"
import { buildRegExp, capture, oneOrMore } from "ts-regex-builder"

/**
 * Given a string of text, finds a client code (marked by the `@` character), and looks up the
 * corresponding client.
 *
 * For example, given the input `@aba 1h #support: ongoing`, succeeds with
 *
 * ```ts
 * {
 *   text: '@aba',
 *   client: {
 *    id: '001',
 *    code: 'aba',
 *    // ... rest of client object
 *   }
 * }
 * ```
 * If no client code is found, succeeds with { client: undefined, text: undefined } (since a client is optional).
 */
export const parseClient = (input: string) =>
  E.gen(function* () {
    const clients = yield* ProvidedClients

    const clientCodeRegex = buildRegExp(
      [
        startWord,
        capture(
          ["@", capture(oneOrMore(alphanumeric), { name: "code" })], // code doesn't include the @
          { name: "text" }, // text includes the @
        ),
        endWord,
      ],
      { ignoreCase: true, multiline: true, global: true },
    )

    const matches = [...input.matchAll(clientCodeRegex)]
    const results = matches.map(match => match.groups as { text: string; code: string })

    // Input must contain exactly one project code
    if (results.length > 1) return yield* E.fail(new MultipleClientsError({ input }))
    if (results.length === 0) return { client: undefined, text: "" }

    const { code, text } = results[0]
    const client = clients.find(d => d.code == code)
    return { text, client }
  })

export class MultipleClientsError //
  extends Data.TaggedError("parseClient/MultipleClients")<{ input: string }>
{
  message = "An entry can only include one @client code."
}
