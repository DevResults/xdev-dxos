// Convenience wrapper of the Effect library with E, S, $ aliases

import { Effect } from "effect"

export { Schema as S, ParseResult } from "@effect/schema"
export {
  Console,
  Clock,
  Context,
  Data,
  Effect as E,
  Either,
  Option,
  pipe,
  Types,
  Array,
} from "effect"

export const $ = Effect.runSync
