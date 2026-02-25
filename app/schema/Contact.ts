import { Obj, Type } from "@dxos/echo"
import type { Identity } from "@dxos/react-client/halo"
import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"
import type { Invitation } from "./Invitation"

export const ContactId = pipe(Cuid, S.brand("ContactId"))
export type ContactId = typeof ContactId.Type

/** A contact's record, including staff directory type information */
export const Contact = S.Struct({
  /** The DXOS identity ID - populated after the contact joins the team */
  identityId: S.optional(S.String),
  userName: S.String,
  firstName: S.String,
  lastName: S.String,
  avatarUrl: S.String,
}).pipe(
  Type.Obj({
    typename: "devresults.com/type/Contact",
    version: "0.1.0",
  }),
)

export type Contact = S.Schema.Type<typeof Contact>

/** Create a new Contact object. Accepts an Identity instead of a raw identityId string. */
export const make = ({ identity, ...props }: MakeContactProps) =>
  Obj.make(Contact, {
    ...props,
    identityId: identity?.identityKey.toString(),
  })

type EncodedContact = S.Schema.Encoded<typeof Contact>
type MakeContactProps = Omit<EncodedContact, "id" | "identityId"> & { identity?: Identity }

/** Contact with extra UI-facing properties, proxied to the underlying DXOS object. */
export type ExtendedContact = Contact & ContactExtensions

/** Create an ExtendedContact that proxies reads/writes to the underlying DXOS Contact. */
export const extendContact = ({
  contact,
  isSelf,
  isAdmin,
  identity,
  invitation,
  invitationStatus,
}: ExtendedContactProps): ExtendedContact => {
  const extensions: ContactExtensions = {
    contact,
    isSelf,
    isAdmin,
    identity,
    invitation,
    invitationStatus,
    get isMember() {
      return Boolean(contact.identityId)
    },
  }

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
  readonly isSelf: boolean
  readonly isAdmin: boolean
  readonly identity: Identity | undefined
  readonly invitation: Invitation | undefined
  readonly invitationStatus: ContactInvitationStatus
  readonly isMember: boolean
}

type ExtendedContactProps = Omit<ContactExtensions, "isMember">

export type ContactInvitationStatus = "NOT_INVITED" | "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED"
