import { contacts } from "data/contacts"
import { ExtendedContact } from "schema/Contact"

export function storyContact(
  firstName: string,
  {
    admin = false, //
    self = false,
  }: Parameters_ = {},
): ExtendedContact {
  const c = contacts.find(c => c.id === firstName.toLowerCase())!
  return new ExtendedContact({
    contact: c,
    isSelf: self,
    isAdmin: admin,
    identity: undefined,
  })
}

type Parameters_ = {
  admin?: boolean
  self?: boolean
}
