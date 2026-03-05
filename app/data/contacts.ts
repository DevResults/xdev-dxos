import { avatars } from "./avatars"
import type { Contact } from "~/schema/Contact"
import { makeContact } from "~/schema/Contact"

/** Seed contact data for the DevResults team. */
export const contactData = [
  { userName: "herb", firstName: "Herb", lastName: "Caudill" },
  { userName: "shane", firstName: "Shane", lastName: "Kunkle" },
  { userName: "brent", firstName: "Brent", lastName: "Keller" },
  { userName: "leslie", firstName: "Leslie", lastName: "Sage" },
  { userName: "ritika", firstName: "Ritika", lastName: "Bhasker" },
  { userName: "aasit", firstName: "Aasit", lastName: "Nanavati" },
  { userName: "reid", firstName: "Reid", lastName: "Porter" },
  { userName: "nathan", firstName: "Nathan", lastName: "Gerhart" },
  { userName: "fred", firstName: "Fred", lastName: "Pinto" },
  { userName: "colleen", firstName: "Colleen", lastName: "Williams" },

  // Former team members
  { userName: "diego", firstName: "Diego", lastName: "Mijelsohn", status: "inactive" as const },
  { userName: "jeff", firstName: "Jeff", lastName: "Swenson", status: "inactive" as const },
  { userName: "nancy", firstName: "Nancy", lastName: "Hawa", status: "inactive" as const },
  { userName: "sam", firstName: "Sam", lastName: "Sesay", status: "inactive" as const },
].map(c => ({ ...c, avatarUrl: avatars[c.userName] ?? "" }))

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
