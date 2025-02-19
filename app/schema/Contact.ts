import { TypedObject } from "@dxos/echo-schema"
import type { Identity } from "@dxos/react-client/halo"
import type { PublicKey } from "@dxos/react-client"
import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"
import { withDefaultId } from "./lib/withDefault"

export const ContactId = pipe(Cuid, S.brand("ContactId"))
export type ContactId = typeof ContactId.Type

/** A contact's record, including staff directory type information */
export class Contact extends TypedObject({
  typename: "devresults.com/type/Contact",
  version: "0.1.0",
})({
  id: withDefaultId(ContactId),
  /** dxos identityKey */
  identityId: S.String,
  userName: S.String,
  firstName: S.String,
  lastName: S.String,
  avatarUrl: S.String,
}) {
  static encode = S.encodeSync(Contact)
  static decode = S.decodeSync(Contact)
}

type EncodedContact = typeof Contact.Encoded

// unable to extend dxos objects the same way, so we'll do it naively

export class ExtendedContact implements EncodedContact {
  readonly contact: Contact
  readonly isSelf: boolean
  readonly isAdmin: boolean
  readonly identityKey: PublicKey | undefined
  readonly invitationStatus?: string
  get isMember() {
    return true
  }

  constructor({
    contact,
    isSelf,
    isAdmin,
    identity,
  }: {
    contact: Contact
    isSelf: boolean
    isAdmin: boolean
    identity: Identity | undefined
  }) {
    this.contact = contact
    this.isSelf = isSelf
    this.isAdmin = isAdmin
    this.identityKey = identity?.identityKey
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
