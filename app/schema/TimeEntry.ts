import { Obj, Type } from "@dxos/echo"
import { E, pipe, S } from "./lib/Effect"
import { stripUndefined } from "./lib/stripUndefined"
import { Cuid } from "./Cuid"
import { ProvidedProjects } from "./ProjectCollection"
import { ProvidedClients } from "./ClientCollection"
import { parseTimeEntry } from "./lib/parseTimeEntry"
import type { Project } from "./Project"
import type { Client } from "./Client"

export const TimeEntryId = pipe(Cuid, S.brand("TimeEntryId"))
export type TimeEntryId = typeof TimeEntryId.Type

export class TimeEntryInput extends S.Class<TimeEntryInput>("TimeEntryInput")({
  contactId: S.String,
  date: S.String,
  input: S.String,
}) {}

export const TimeEntry = S.Struct({
  contactId: S.String,
  date: S.String,
  duration: S.Number,
  project: S.String,
  client: S.optional(S.String),
  description: S.optional(S.String),
  input: S.String,
  timestamp: S.String,
}).pipe(
  Type.Obj({
    typename: "devresults.com/type/TimeEntry",
    version: "0.1.0",
  }),
)

export type TimeEntry = S.Schema.Type<typeof TimeEntry>
export type TimeEntryEncoded = S.Schema.Encoded<typeof TimeEntry>

/** Create a new TimeEntry object */
export const makeTimeEntry = (props: Omit<TimeEntry, "id">) => Obj.make(TimeEntry, props)

/** Decode a TimeEntry from encoded form */
export const decodeTimeEntry = (encoded: TimeEntryEncoded) =>
  pipe(encoded, S.decode(TimeEntry), E.runSync)

/** Encode a TimeEntry to encoded form */
export const encodeTimeEntry = (decoded: TimeEntry) =>
  pipe(decoded, S.encode(TimeEntry), E.runSync, stripUndefined)

/**
 * Takes an input string consisting of one or more lines, and attempts to parse it into one or
 * more entries. Returns `[errors, parsedEntries]`.
 */
export const parseTimeEntries = ({
  input: multilineInput,
  contactId,
  date,
  projects,
  clients,
}: TimeEntryInput & {
  projects: Project[]
  clients: Client[]
}) => {
  const parse = (input: string) =>
    pipe(
      { input, contactId, date },
      parseTimeEntry,
      E.provideService(ProvidedProjects, projects),
      E.provideService(ProvidedClients, clients),
    )

  return pipe(
    multilineInput,
    s => s.split("\n"),
    E.partition(parse), // try to parse each line
    E.runSync,
  )
}
