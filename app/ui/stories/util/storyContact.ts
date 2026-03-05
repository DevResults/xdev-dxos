import { contacts } from "data/contacts"
import type { ExtendedContact } from "schema/Contact"

/** Create a mock ExtendedContact for stories. */
export function storyContact(
  firstName: string,
  { admin = false, self = false }: StoryContactOptions = {},
): ExtendedContact {
  const c = contacts.find(c => c.id === firstName.toLowerCase())!
  return {
    ...c,
    contact: c,
    member: undefined,
    selfIdentity: undefined,
    identity: undefined,
    invitation: undefined,
    invitationStatus: "NOT_INVITED",
    isAdmin: admin,
    isSelf: self,
    isMember: false,
    get fullName() {
      return `${c.firstName} ${c.lastName}`
    },
  } as ExtendedContact
}

type StoryContactOptions = {
  admin?: boolean
  self?: boolean
}
