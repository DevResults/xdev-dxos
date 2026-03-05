import { Obj, Type } from "@dxos/echo"
import { HaloSpaceMember, type SpaceMember } from "@dxos/react-client/echo"
import type { Identity } from "@dxos/react-client/halo"
import { Cuid } from "./Cuid"
import type { Invitation } from "./Invitation"
import { pipe, S } from "./lib/Effect"

export const ContactId = pipe(Cuid, S.brand("ContactId"))
export type ContactId = typeof ContactId.Type

/** The editable fields of a Contact, with validation. */
export const ContactFields = S.Struct({
  /** The DXOS identity ID - populated after the contact joins the team */
  identityId: S.optional(S.String),
  userName: S.Trim.pipe(S.minLength(1, { message: () => "Username is required." })),
  firstName: S.Trim.pipe(S.minLength(1, { message: () => "First name is required." })),
  lastName: S.Trim,
  avatarUrl: S.Trim,

  /** Whether the contact is active or inactive. Defaults to 'active'. */
  status: S.optional(S.Union(S.Literal("active"), S.Literal("inactive"))),

  // Personal info
  /** Middle name */
  middleName: S.optional(S.Trim),
  /** Suffix (e.g. Jr., III) */
  suffix: S.optional(S.Trim),
  /** Legal first name */
  legalFirstName: S.optional(S.Trim),
  /** Preferred name (for business card) */
  preferredName: S.optional(S.Trim),
  /** Pronouns */
  pronouns: S.optional(S.Trim),
  /** Birthdate (ISO date string) */
  birthdate: S.optional(S.Trim),
  /** Start date (ISO date string) */
  startDate: S.optional(S.Trim),
  /** Job title */
  title: S.optional(S.Trim),

  // Emergency contact
  /** Emergency contact name */
  emergencyContactName: S.optional(S.Trim),
  /** Emergency contact relationship */
  emergencyContactRelationship: S.optional(S.Trim),
  /** Emergency contact phone */
  emergencyContactPhone: S.optional(S.Trim),

  // Driver's license
  /** Driver's license number */
  driversLicense: S.optional(S.Trim),
  /** Driver's license expiration date (ISO date string) */
  driversLicenseExpiration: S.optional(S.Trim),

  // Phone
  /** Phone number */
  phone: S.optional(S.Trim),

  // Passport
  /** Passport number */
  passportNumber: S.optional(S.Trim),
  /** Passport issue date (ISO date string) */
  passportIssueDate: S.optional(S.Trim),
  /** Passport expiration date (ISO date string) */
  passportExpirationDate: S.optional(S.Trim),
  /** Passport country */
  passportCountry: S.optional(S.Trim),

  // Home address
  /** Home street address */
  homeAddress: S.optional(S.Trim),
  /** Home city */
  homeCity: S.optional(S.Trim),
  /** Home state/province */
  homeState: S.optional(S.Trim),
  /** Home zip/postal code */
  homeZip: S.optional(S.Trim),

  // Work address
  /** Work street address */
  workAddress: S.optional(S.Trim),
  /** Work city */
  workCity: S.optional(S.Trim),
  /** Work state/province */
  workState: S.optional(S.Trim),
  /** Work zip/postal code */
  workZip: S.optional(S.Trim),

  /** Country (shared between home and work) */
  country: S.optional(S.Trim),
})

/** A contact's record, including staff directory type information */
export const Contact = ContactFields.pipe(
  Type.Obj({
    typename: "devresults.com/type/Contact",
    version: "0.1.0",
  }),
)
export type Contact = Omit<S.Schema.Type<typeof Contact>, "id"> & { readonly id: ContactId }
export type EncodedContact = S.Schema.Encoded<typeof Contact>

/** Create a new Contact object. Accepts an Identity instead of a raw identityId string. */
export const makeContact = ({
  identity,
  ...props
}: Omit<EncodedContact, "id" | "identityId"> & { identity?: Identity }) =>
  Obj.make(Contact, {
    ...props,
    identityId: identity?.identityKey.toString(),
  })

/** Contact with extra UI-facing properties, proxied to the underlying DXOS object. */
export type ExtendedContact = Contact & ContactExtensions

/** Create an ExtendedContact that proxies reads/writes to the underlying DXOS Contact. */
export const extendContact = ({
  contact,
  member,
  selfIdentity,
  invitation,
  invitationStatus,
}: ExtendedContactProps): ExtendedContact => {
  const extensions = {
    contact,
    member,
    selfIdentity,
    invitation,
    invitationStatus,
    get fullName() {
      return `${contact.firstName} ${contact.lastName}`
    },
    get identity() {
      return member?.identity
    },
    get isAdmin() {
      return (
        member?.role === HaloSpaceMember.Role.OWNER || member?.role === HaloSpaceMember.Role.ADMIN
      )
    },
    get isSelf() {
      return (
        member?.identity.identityKey.toString() === selfIdentity?.identityKey.toString() ||
        contact.identityId === selfIdentity?.identityKey.toString()
      )
    },
    get isMember() {
      return Boolean(contact.identityId)
    },
  }

  // Use a Proxy to allow direct access to Contact properties while also providing the extended properties.
  return new Proxy(contact, {
    get(target, prop, receiver) {
      if (prop in extensions) return extensions[prop as keyof ContactExtensions]
      return Reflect.get(target, prop, receiver) as Contact[keyof Contact]
    },
    set(target, prop, value, receiver) {
      if (prop in extensions) return false
      return Reflect.set(target, prop, value, receiver)
    },
  }) as ExtendedContact
}

type ContactExtensions = {
  readonly contact: Contact
  readonly member: SpaceMember | undefined
  readonly selfIdentity: Identity | undefined
  readonly invitation: Invitation | undefined
  readonly invitationStatus: ContactInvitationStatus
  readonly identity: Identity | undefined
  readonly isAdmin: boolean
  readonly isSelf: boolean
  readonly isMember: boolean
  readonly fullName: string
}

type ExtendedContactProps = Omit<
  ContactExtensions,
  "isMember" | "identity" | "isAdmin" | "isSelf" | "fullName"
>

export type ContactInvitationStatus = "NOT_INVITED" | "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED"
