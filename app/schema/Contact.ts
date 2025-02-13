import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"
import { withDefaultId } from "./lib/withDefault"
import { TypedObject } from "@dxos/echo-schema"

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
  private readonly contact: Contact
  readonly isSelf: boolean
  readonly isAdmin: boolean
  constructor({
    contact,
    isSelf,
    isAdmin,
  }: {
    contact: Contact
    isSelf: boolean
    isAdmin: boolean
  }) {
    this.contact = contact
    this.isSelf = isSelf
    this.isAdmin = isAdmin
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

  readonly isMember: boolean = true
  readonly invitationStatus?: string
}
