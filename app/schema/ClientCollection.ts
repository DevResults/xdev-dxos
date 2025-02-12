import type { Client } from "./Client";
import { Context } from "./lib/Effect";

export class ProvidedClients extends Context.Tag("ProvidedClients")<ProvidedClients, Client[]>() {}
