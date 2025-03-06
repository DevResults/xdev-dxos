import { createId } from "@paralleldrive/cuid2"
import { Data, E, S } from "schema/lib/Effect"
import { ProvidedClients } from "schema/ClientCollection"
import { ProvidedContacts } from "schema/ContactCollection"
import { reconstructTimeEntryInput } from "schema/lib/reconstructTimeEntryInput"
import { ProvidedProjects } from "schema/ProjectCollection"
import { TimeEntry } from "schema/TimeEntry"
import { csvToSchema } from "./parseCsv"
import { findByCode } from "~/schema/lib/parseProject"

export class TimeEntryCsvRow extends S.Class<TimeEntryCsvRow>("TimeEntryCsvRow")({
  userName: S.String,
  date: S.String,
  duration: S.NumberFromString,
  project: S.String,
  client: S.String,
  description: S.String,
}) {}

export const csvToTimeEntries = (csvData: string) =>
  E.gen(function* (_) {
    // Parse the CSV into TimeEntryCsvRow objects
    const [upstreamErrors, rows] = yield* csvToSchema(csvData, TimeEntryCsvRow)

    // Convert each TimeEntryCsvRow into a TimeEntry
    const [errors, entries] = yield* E.partition(rows, row => {
      const { input, index } = row
      return E.gen(function* () {
        const contacts = yield* ProvidedContacts
        const projects = yield* ProvidedProjects
        const clients = yield* ProvidedClients

        const contact = contacts.find(c => c.userName === row.userName.toLowerCase())
        if (!contact)
          return yield* E.fail(
            new TimeEntryCsvParseError({
              input,
              index,
              cause: new Error(`There is no contact with username "${row.userName}"`),
            }),
          )

        const project = yield* findByCode(row.project, projects)
        const client = row.client.length > 0 ? clients.find(c => c.code === row.client) : undefined

        if (row.client.length > 0 && !client)
          return yield* E.fail(
            new TimeEntryCsvParseError({
              input,
              index,
              cause: new Error(`There is no client with code "${row.client}"`),
            }),
          )

        return yield* S.decode(TimeEntry)({
          ...row,
          id: createId(),
          duration: Math.floor(row.duration * 60), // duration comes in as hours
          project: project.id,
          client: client?.id,
          contactId: contact.id,
          timestamp: Date.now().toString(),
          input: reconstructTimeEntryInput({
            ...row,
            durationInHours: row.duration,
            project: project.fullCode,
          }),
        })
      }).pipe(E.mapError(cause => new TimeEntryCsvParseError({ input, index, cause })))
    })

    const allErrors = [
      ...upstreamErrors.map(cause => {
        const { input, index } = cause
        return new TimeEntryCsvParseError({ input, index, cause })
      }),
      ...errors,
    ]

    return [allErrors, entries] as const
  })

export class TimeEntryCsvParseError //
  extends Data.TaggedError("TimeEntryCsvParseError")<{
    input: string
    index: number
    cause: Error
  }>
{
  message = `Couldn't parse row ${this.index + 1}. ${adaptError(this.cause)}`
}

const adaptError = (error: Error) => {
  const { message } = error

  if (message.includes("could not be parsed as LocalDate")) {
    return "Invalid date."
  }

  if (message.includes("is missing")) {
    const field = /"([^"]+)"/.exec(message)?.[1]
    return `The field \`${field}\` is required.`
  }

  if (message.includes("duration") && message.includes("NumberFromString")) {
    return "Duration must be a valid number."
  }

  return message
}
