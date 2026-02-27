import type { MakeOptional } from "@dxos/util"
import { Obj, Type } from "@dxos/echo"
import { Cuid } from "./Cuid"
import { E, pipe, S } from "./lib/Effect"
import { stripUndefined } from "./lib/stripUndefined"

export const DoneEntryId = pipe(Cuid, S.brand("DoneEntryId"))
export type DoneEntryId = typeof DoneEntryId.Type

export const DoneEntry = S.Struct({
  date: S.String,
  contactId: S.String,
  content: S.String,
  likes: S.mutable(S.Array(S.String)),
  timestamp: S.Number,
}).pipe(
  Type.Obj({
    typename: "devresults.com/type/DoneEntry",
    version: "0.1.0",
  }),
)

export type DoneEntry = S.Schema.Type<typeof DoneEntry>
export type DoneEntryEncoded = S.Schema.Encoded<typeof DoneEntry>

/** Create a new DoneEntry object */
export const make = ({
  likes = [],
  timestamp = Date.now(),
  ...rest
}: MakeOptional<DoneEntry, "id" | "likes" | "timestamp">) =>
  Obj.make(DoneEntry, { ...rest, likes, timestamp })

/** Decode a DoneEntry from encoded form */
export const decodeDoneEntry = (encoded: DoneEntryEncoded) =>
  pipe(encoded, S.decode(DoneEntry), E.runSync)

/** Encode a DoneEntry to encoded form */
export const encodeDoneEntry = (decoded: DoneEntry) =>
  pipe(decoded, S.encode(DoneEntry), E.runSync, stripUndefined)

export type DoneEntryInput = Omit<DoneEntryEncoded, "id" | "timestamp">
