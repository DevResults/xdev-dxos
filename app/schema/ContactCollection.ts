import type { Contact } from "./Contact"
import { Context, Data } from "./lib/Effect"

export class ProvidedContacts extends Context.Tag("ProvidedContacts")<
  ProvidedContacts,
  Contact[]
>() {}

export class ContactNotFoundError //
  extends (new Data.TaggedError("ContactCollection/ContactNotFound"))<{ userName: string }>
{
  message = `There is no contact with username "${this.userName}"`
}
