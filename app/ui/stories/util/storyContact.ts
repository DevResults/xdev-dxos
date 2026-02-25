import { contacts } from "data/contacts"
import { extendContact, type ExtendedContact } from "schema/Contact"

export function storyContact(
  firstName: string,
  {
    admin = false, //
    self = false,
  }: Parameters_ = {},
): ExtendedContact {
  const c = contacts.find(c => c.id === firstName.toLowerCase())!
  return extendContact({
    contact: c,
    isSelf: self,
    isAdmin: admin,
    identity: undefined,
    invitationStatus: "NOT_INVITED",
  })
}

type Parameters_ = {
  admin?: boolean
  self?: boolean
}
