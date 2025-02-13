import type { Contact } from "./Contact"
import { Context } from "./lib/Effect"

export class ProvidedContacts extends Context.Tag("ProvidedContacts")<
  ProvidedContacts,
  Contact[]
>() {}
