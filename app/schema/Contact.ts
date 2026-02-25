import { Obj, Type } from "@dxos/echo"
import type { Identity } from "@dxos/react-client/halo"
import type { PublicKey } from "@dxos/react-client"
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

/** Create a new Contact object */
export const make = (props: Omit<EncodedContact, "id">) => Obj.make(Contact, props)

type EncodedContact = S.Schema.Encoded<typeof Contact>

// Unable to extend dxos objects the same way, so we'll do it naively
export class ExtendedContact implements EncodedContact {
  readonly contact: Contact
  readonly isSelf: boolean
  readonly isAdmin: boolean
  readonly identityKey: PublicKey | undefined
  readonly invitation: Invitation | undefined
  readonly invitationStatus: ContactInvitationStatus

  constructor({
    contact,
    isSelf,
    isAdmin,
    identity,
    invitation,
    invitationStatus,
  }: ExtendedContactProps) {
    this.contact = contact
    this.isSelf = isSelf
    this.isAdmin = isAdmin
    this.identityKey = identity?.identityKey
    this.invitation = invitation
    this.invitationStatus = invitationStatus
  }

  get isMember() {
    return Boolean(this.contact.identityId)
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
  invitation?: Invitation
  invitationStatus: ContactInvitationStatus
}

export type ContactInvitationStatus = "NOT_INVITED" | "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED"
