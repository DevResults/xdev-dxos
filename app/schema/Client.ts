import { Obj, Type } from "@dxos/echo"
import { Cuid } from "./Cuid"
import { pipe, S } from "./lib/Effect"

export const ClientId = pipe(Cuid, S.brand("ClientId"))
export type ClientId = typeof ClientId.Type

export const Client = S.Struct({
  code: S.String,
  description: S.optional(S.String),
  timestamp: S.String,
}).pipe(
  Type.Obj({
    typename: "devresults.com/type/Client",
    version: "0.1.0",
  }),
)

export type Client = S.Schema.Type<typeof Client>

/** Create a new Client object */
export const makeClient = (props: Omit<Client, "id">) => Obj.make(Client, props)
