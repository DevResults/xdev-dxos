import { createId as _createId } from "@paralleldrive/cuid2"
import { pipe, S } from "./lib/Effect"

export const Cuid = pipe(S.String, S.brand("Cuid"))
export type Cuid = typeof Cuid.Type
export const createId = () => _createId() as Cuid
