import { TypedObject } from "@dxos/echo-schema"
import { E, pipe, S } from "./lib/Effect"
import { stripUndefined } from "./lib/stripUndefined"
import { Cuid } from "./Cuid"
import { withDefaultId } from "./lib/withDefault"

export const DoneEntryId = pipe(Cuid, S.brand("DoneEntryId"))
export type DoneEntryId = typeof DoneEntryId.Type

export class DoneEntry extends TypedObject({
  typename: "devresults.com/type/DoneEntry",
  version: "0.1.0",
})({
  id: withDefaultId(DoneEntryId),
  date: S.String,
  contactId: S.String,
  content: S.String,
  likes: S.Array(S.String),
  timestamp: S.String,
}) {
  static decode = (encoded: DoneEntryEncoded) =>
    pipe(
      encoded, //
      S.decode(DoneEntry),
      E.runSync,
    )

  static encode = (decoded: DoneEntry) =>
    pipe(
      decoded, //
      S.encode(DoneEntry),
      E.runSync,
      stripUndefined,
    )
}
export type DoneEntryEncoded = typeof DoneEntry.Encoded

export type DoneEntryInput = Omit<DoneEntry, "id" | "timestamp">
