import { avatars } from "./avatars"
import { staffContactData } from "./staffContactData"
import type { Contact } from "~/schema/Contact"
import { makeContact } from "~/schema/Contact"

/** Additional contacts not in staff-info.csv. */
const additionalContacts = [
  { userName: "colleen", firstName: "Colleen", lastName: "Williams", avatarUrl: "" },

  // Former team members
  {
    userName: "diego",
    firstName: "Diego",
    lastName: "Mijelsohn",
    avatarUrl: "",
    status: "inactive" as const,
  },
  {
    userName: "jeff",
    firstName: "Jeff",
    lastName: "Swenson",
    avatarUrl: "",
    status: "inactive" as const,
  },
  {
    userName: "nancy",
    firstName: "Nancy",
    lastName: "Hawa",
    avatarUrl: "",
    status: "inactive" as const,
  },
  {
    userName: "sam",
    firstName: "Sam",
    lastName: "Sesay",
    avatarUrl: "",
    status: "inactive" as const,
  },
]

/** Seed contact data for the DevResults team, enriched with staff-info.csv data. */
export const contactData = [...staffContactData, ...additionalContacts].map(c => ({
  ...c,
  avatarUrl: avatars[c.userName] ?? c.avatarUrl ?? "",
}))

/** Plain contact objects for use in tests. */
export const contacts = contactData.map(d => ({ ...d, id: d.userName })) as Contact[]

/** Find seed contact data matching a username (case-insensitive). */
export const findContactData = (userName: string) =>
  contactData.find(c => c.userName.toLowerCase() === userName.toLowerCase())

/** Create DXOS contact objects for all seed contacts, excluding a given username. */
export const createContacts = (
  /** Username to exclude (typically the current user, who already has a contact). */
  excludeUserName?: string,
) =>
  contactData
    .filter(c => c.userName.toLowerCase() !== excludeUserName?.toLowerCase())
    .map(c => makeContact(c))
