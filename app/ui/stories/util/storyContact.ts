import { contacts } from "data/contacts"
import type { ExtendedContact } from "schema/Contact"

/** Create a mock ExtendedContact for stories. */
export function storyContact(
  firstName: string,
  { admin = false, self = false, status }: StoryContactOptions = {},
): ExtendedContact {
  const c = contacts.find(contact => contact.id === firstName.toLowerCase())!
  return {
    ...c,
    ...(status != null ? { status } : {}),
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
      return `${c.preferredName ?? c.firstName} ${c.lastName}`
    },
    get legalFullName() {
      return [c.firstName, (c as any).middleName, c.lastName, (c as any).suffix]
        .filter(Boolean)
        .join(" ")
    },
  } as ExtendedContact
}

type StoryContactOptions = {
  admin?: boolean
  self?: boolean
  status?: "active" | "inactive"
}
