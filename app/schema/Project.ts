import { Obj, Type } from "@dxos/echo"
import { pipe, S } from "./lib/Effect"
import { Cuid } from "./Cuid"

export const ProjectId = pipe(Cuid, S.brand("ProjectId"))
export type ProjectId = typeof ProjectId.Type

export const Project = S.Struct({
  code: S.String,
  subCode: S.optional(S.String),
  fullCode: S.String, // Ideally calculated fields would not need to be on the defined schema
  description: S.optional(S.String),
  requiresClient: S.Boolean,
  color: S.optional(S.String),
  timestamp: S.String,
}).pipe(
  Type.Obj({
    typename: "devresults.com/type/Project",
    version: "0.1.0",
  }),
)

export type Project = S.Schema.Type<typeof Project>

/** Create a new Project object */
export const makeProject = (props: Omit<Project, "id">) => Obj.make(Project, props)

export const makeFullCode = (code: string, subCode?: string) =>
  subCode ? `${code}:${subCode}` : code
