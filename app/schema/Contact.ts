import { Obj, Type } from "@dxos/echo"
import { HaloSpaceMember, type SpaceMember } from "@dxos/react-client/echo"
import type { Identity } from "@dxos/react-client/halo"
import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"
import type { Invitation } from "./Invitation"

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
})

/** A contact's record, including staff directory type information */
export const Contact = ContactFields.pipe(
  Type.Obj({
    typename: "devresults.com/type/Contact",
    version: "0.1.0",
  }),
)
export type Contact = S.Schema.Type<typeof Contact>
export type EncodedContact = S.Schema.Encoded<typeof Contact>

/** Create a new Contact object. Accepts an Identity instead of a raw identityId string. */
export const make = ({
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

type ExtendedContactProps = Omit<ContactExtensions, "isMember" | "identity" | "isAdmin" | "isSelf">

export type ContactInvitationStatus = "NOT_INVITED" | "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED"
