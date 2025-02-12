import { E, pipe, S } from "./lib/Effect";
import { stripUndefined } from "./lib/stripUndefined";
import { Cuid } from "./Cuid";
import { withDefaultId } from "./lib/withDefault";
import { ProvidedProjects } from "./ProjectCollection";
import { ProvidedClients } from "./ClientCollection";
import { parseTimeEntry } from "./lib/parseTimeEntry";
import { TypedObject } from "@dxos/echo-schema";
import type { Project } from "./Project";
import type { Client } from "./Client";

export const TimeEntryId = pipe(Cuid, S.brand("TimeEntryId"));
export type TimeEntryId = typeof TimeEntryId.Type;

export class TimeEntryInput extends S.Class<TimeEntryInput>("TimeEntryInput")({
  id: S.optional(TimeEntryId),
  contactId: S.String,
  date: S.String,
  input: S.String,
}) {}

/** A time entry that decodes from serialized form (e.g. from storage) */
export class TimeEntry extends TypedObject({ typename: "devresults.com/type/TimeEntry", version: "0.1.0" })({
  id: withDefaultId(TimeEntryId),
  contactId: S.String,
  date: S.String,
  duration: S.Number,
  project: S.String,
  client: S.optional(S.String),
  description: S.optional(S.String),
  input: S.String,
  timestamp: S.String,
}) {
  static decode = (encoded: TimeEntryEncoded) => pipe(encoded, S.decode(TimeEntry), E.runSync);

  static encode = (decoded: TimeEntry) => pipe(decoded, S.encode(TimeEntry), E.runSync, stripUndefined);

  /**
   * Takes an input string consisting of one or more lines, and attempts to parse it into one or
   * more entries. Returns `[errors, parsedEntries]`.
   */
  static parseMany = ({
    input: multilineInput,
    contactId,
    date,
    projects,
    clients,
  }: TimeEntryInput & {
    projects: Project[];
    clients: Client[];
  }) => {
    const parse = (input: string) =>
      pipe(
        { input, contactId, date },
        parseTimeEntry,
        E.provideService(ProvidedProjects, projects),
        E.provideService(ProvidedClients, clients)
      );

    return pipe(
      multilineInput,
      (s) => s.split("\n"),
      E.partition(parse), // try to parse each line
      E.runSync
    );
  };
}

export type TimeEntryEncoded = typeof TimeEntry.Encoded;
