import { pipe, S } from "./lib/Effect"
import { stripUndefined } from "./lib/stripUndefined"
import { Cuid } from "./Cuid"
import { withDefault, withDefaultId } from "./lib/withDefault"
import { TypedObject } from "@dxos/echo-schema"

export const ClientId = pipe(Cuid, S.brand("ClientId"))
export type ClientId = typeof ClientId.Type

export class Client extends TypedObject({
  typename: "devresults.com/type/Client",
  version: "0.1.0",
})({
  id: withDefaultId(ClientId),
  code: S.String,
  description: S.optional(S.String),
  timestamp: S.String,
}) {
  static decode = S.decodeSync(Client)
  static encode = (client: Client) =>
    pipe(
      client, //
      S.encodeSync(Client),
      stripUndefined,
    )
}
