import type { Contact } from "~/schema/Contact"

/** Returns true if the contact is active (status is 'active' or undefined). */
export const isActiveContact = (contact: Pick<Contact, "status">) => contact.status !== "inactive"
