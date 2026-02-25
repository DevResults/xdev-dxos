import { Obj, Type } from "@dxos/echo"
import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"

export const InvitationId = pipe(Cuid, S.brand("InvitationId"))
export type InvitationId = typeof InvitationId.Type

/** Status of an invitation */
export const InvitationStatus = S.Literal("pending", "accepted", "revoked")
export type InvitationStatus = typeof InvitationStatus.Type

/** An invitation to join the team, associated with a contact */
export const Invitation = S.Struct({
  /** The contact this invitation is for */
  contactId: S.String,
  /** The human-readable invitation code */
  invitationCode: S.String,
  /** The shared-secret verification code */
  authCode: S.optional(S.String),
  /** The DXOS internal invitation ID */
  dxosInvitationId: S.optional(S.String),
  /** Current status of the invitation */
  status: InvitationStatus,
  /** When the invitation was created */
  createdAt: S.String,
  /** When the invitation was revoked (if status is "revoked") */
  revokedAt: S.optional(S.String),
  /** When the invitation was accepted (if status is "accepted") */
  acceptedAt: S.optional(S.String),
}).pipe(
  Type.Obj({
    typename: "devresults.com/type/Invitation",
    version: "0.1.0",
  }),
)

export type Invitation = S.Schema.Type<typeof Invitation>

/** Create a new Invitation object */
export const make = (props: Omit<Invitation, "id">) => Obj.make(Invitation, props)
