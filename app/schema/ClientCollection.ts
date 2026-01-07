import type { Client } from "./Client"
import { Context, Data } from "./lib/Effect"

export class ProvidedClients extends Context.Tag("ProvidedClients")<ProvidedClients, Client[]>() {}

export class ClientNotFoundError //
  extends (new Data.TaggedError("ClientCollection/ClientNotFound"))<{ code: string }>
{
  message = `There is no client with code "${this.code}"`
}
