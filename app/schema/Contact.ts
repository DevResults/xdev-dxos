import { Obj, Type } from "@dxos/echo"
import type { Identity } from "@dxos/react-client/halo"
import type { PublicKey } from "@dxos/react-client"
import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"

export const ContactId = pipe(Cuid, S.brand("ContactId"))
export type ContactId = typeof ContactId.Type

/** A contact's record, including staff directory type information */
export const Contact = S.Struct({
  identityId: S.String,
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

/** Create a new Contact object */
export const makeContact = (props: Omit<EncodedContact, "id">) => Obj.make(Contact, props)

type EncodedContact = S.Schema.Encoded<typeof Contact>

// Unable to extend dxos objects the same way, so we'll do it naively
export class ExtendedContact implements EncodedContact {
  readonly contact: Contact
  readonly isSelf: boolean
  readonly isAdmin: boolean
  readonly identityKey: PublicKey | undefined
  readonly invitationStatus?: string

  constructor({ contact, isSelf, isAdmin, identity }: ExtendedContactProps) {
    this.contact = contact
    this.isSelf = isSelf
    this.isAdmin = isAdmin
    this.identityKey = identity?.identityKey
  }

  get isMember() {
    return true
  }

  get id() {
    return this.contact.id
  }

  get identityId() {
    return this.contact.identityId
  }

  get userName() {
    return this.contact.userName
  }

  get firstName() {
    return this.contact.firstName
  }

  get lastName() {
    return this.contact.lastName
  }

  get avatarUrl() {
    return this.contact.avatarUrl
  }
}

type ExtendedContactProps = {
  contact: Contact
  isSelf: boolean
  isAdmin: boolean
  identity: Identity | undefined
}
