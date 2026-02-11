import type { AddContactValues } from "ui/AddContactDialog"
import type { Contact } from "~/schema/Contact"

/** Map dialog values to a Contact payload for pre-created members. */
export function createContactFromValues(values: AddContactValues): Omit<Contact, "id"> {
  return {
    identityId: undefined,
    firstName: values.firstName,
    lastName: values.lastName,
    userName: values.userName,
    avatarUrl: values.avatarUrl,
  }
}
