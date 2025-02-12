import { pipe, S } from "./lib/Effect";
import { Cuid } from "./Cuid";
import { withDefaultId } from "./lib/withDefault";
import { TypedObject } from "@dxos/echo-schema";

export const ContactId = pipe(Cuid, S.brand("ContactId"));
export type ContactId = typeof ContactId.Type;

/** A contact's record, including staff directory type information */
export class Contact extends TypedObject({ typename: "devresults.com/type/Contact", version: "0.1.0" })({
  id: withDefaultId(ContactId),
  /** dxos identityKey */
  identityId: S.String,
  userName: S.String,
  firstName: S.String,
  lastName: S.String,
  avatarUrl: S.String,
}) {
  static encode = S.encodeSync(Contact);
  static decode = S.decodeSync(Contact);
}
