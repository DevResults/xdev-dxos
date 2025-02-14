import type { Client } from "./Client"
import { Context, Data } from "./lib/Effect"

export class ProvidedClients extends Context.Tag("ProvidedClients")<ProvidedClients, Client[]>() {}

export class ClientNotFoundError //
  extends Data.TaggedError("ClientCollection/ClientNotFound")<{ code: string }>
{
  message = `There is no Client with code "${this.code}"`
}
