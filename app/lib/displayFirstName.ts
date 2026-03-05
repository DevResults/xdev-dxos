import type { Contact } from "~/schema/Contact"

/** Get the preferred first name for display, falling back to the legal first name. */
export const displayFirstName = (contact: Contact) => contact.preferredName || contact.firstName
