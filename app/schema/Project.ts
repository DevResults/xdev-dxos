import { pipe, S } from "./lib/Effect"
import { stripUndefined } from "./lib/stripUndefined"
import { Cuid } from "./Cuid"
import { withDefaultId } from "./lib/withDefault"
import { TypedObject } from "@dxos/echo-schema"

export const ProjectId = pipe(Cuid, S.brand("ProjectId"))
export type ProjectId = typeof ProjectId.Type

export class Project extends TypedObject({
  typename: "devresults.com/type/Project",
  version: "0.1.0",
})({
  id: withDefaultId(ProjectId),
  code: S.String,
  subCode: S.optional(S.String),
  fullCode: S.String, // ideally calculated fields would not need to be on the defined schema
  description: S.optional(S.String),
  requiresClient: S.Boolean,
  color: S.optional(S.String),
  timestamp: S.String,
}) {
  static decode = S.decodeSync(Project)
  static encode = (project: Project) =>
    pipe(
      project, //
      S.encodeSync(Project),
      stripUndefined,
    )
}

export const makeFullCode = (code: string, subCode?: string) =>
  subCode ? `${code}:${subCode}` : code
