import { Data, E, S } from "lib/Effect"
import { ClientNotFoundError, ProvidedClients } from "schema/ClientCollection"
import { ContactNotFoundError, ProvidedContacts } from "schema/ContactCollection"
import { ProvidedProjects } from "schema/ProjectCollection"
import { reconstructTimeEntryInput } from "./reconstructTimeEntryInput"
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

        const contact = contacts.find(({ userName }) => userName === row.userName)
        if (contact === undefined) {
          return yield* E.fail(new ContactNotFoundError({ userName: row.userName }))
        }

        const project = yield* findByCode(row.project, projects)
        let client
        if (row.client.length > 0) {
          client = clients.find(({ code }) => code === row.client)
          if (client === undefined) {
            return yield* E.fail(new ClientNotFoundError({ code: row.client }))
          }
        }

        return {
          ...row,
          duration: Math.floor(row.duration * 60), // duration comes in as hours
          project: project.id,
          client: client?.id,
          contactId: contact.id,
          timestamp: new Date().toISOString(),
          input: reconstructTimeEntryInput({
            ...row,
            durationInHours: row.duration,
            project: project.fullCode,
          }),
        }
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
