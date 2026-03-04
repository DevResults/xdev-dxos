import type { Contact } from "~/schema/Contact"
import { makeContact } from "~/schema/Contact"

/** Seed contact data for the DevResults team. */
export const contactData = [
  {
    userName: "herb",
    firstName: "Herb",
    lastName: "Caudill",
    avatarUrl: "https://www.devresults.com/images/staff/square/herb.jpg",
  },
  {
    userName: "shane",
    firstName: "Shane",
    lastName: "Kunkle",
    avatarUrl: "https://www.devresults.com/images/staff/square/shane.jpg",
  },
  {
    userName: "brent",
    firstName: "Brent",
    lastName: "Keller",
    avatarUrl: "https://www.devresults.com/images/staff/square/brent.jpg",
  },
  {
    userName: "leslie",
    firstName: "Leslie",
    lastName: "Sage",
    avatarUrl: "https://www.devresults.com/images/staff/square/leslie.jpg",
  },
  {
    userName: "ritika",
    firstName: "Ritika",
    lastName: "Bhasker",
    avatarUrl: "https://www.devresults.com/images/staff/square/ritika.jpg",
  },
  {
    userName: "aasit",
    firstName: "Aasit",
    lastName: "Nanavati",
    avatarUrl: "https://www.devresults.com/images/staff/square/aasit.jpg",
  },
  {
    userName: "reid",
    firstName: "Reid",
    lastName: "Porter",
    avatarUrl: "https://www.devresults.com/images/staff/square/reid.jpg",
  },
  {
    userName: "nathan",
    firstName: "Nathan",
    lastName: "Gerhart",
    avatarUrl: "https://www.devresults.com/images/staff/square/nathan.jpg",
  },
  {
    userName: "fred",
    firstName: "Fred",
    lastName: "Pinto",
    avatarUrl: "https://www.devresults.com/images/staff/square/fred.jpg",
  },
  {
    userName: "colleen",
    firstName: "Colleen",
    lastName: "Williams",
    avatarUrl:
      "https://github-production-user-asset-6210df.s3.amazonaws.com/2136620/319523394-c7499fc3-89ce-4577-953c-2ff23ea353c4.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20241107%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241107T172214Z&X-Amz-Expires=300&X-Amz-Signature=3c8566391ec13159c78f8f82851e32887ceb850aa48efb06abd5a36ab01e1b71&X-Amz-SignedHeaders=host",
  },
]

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
