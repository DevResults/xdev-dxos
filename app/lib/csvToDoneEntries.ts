import { createId } from "@paralleldrive/cuid2"
import { Data, E, S } from "schema/lib/Effect"
import { type ContactId } from "schema/Contact"
import { ProvidedContacts } from "schema/ContactCollection"
import { DoneEntry, DoneEntryId } from "schema/DoneEntry"
import { csvToSchema } from "./parseCsv"

class DoneEntryCsvRow extends S.Class<DoneEntryCsvRow>("DoneEntryCsvRow")({
  userName: S.String,
  date: S.String,
  content: S.String,
  likes: S.String,
  timestamp: S.String,
}) {}

export const csvToDoneEntries = (csvData: string) =>
  E.gen(function* () {
    // Parse the CSV into DoneEntryCsvRow objects
    const [upstreamErrors, rows] = yield* csvToSchema(csvData, DoneEntryCsvRow)

    // Convert each DoneEntryCsvRow into a DoneEntry
    const [errors, entries] = yield* E.partition(rows, row => {
      const { input, index } = row
      return E.gen(function* () {
        const contacts = yield* ProvidedContacts
        const contact = contacts.find(c => c.userName.toLowerCase() === row.userName.toLowerCase())
        if (!contact) {
          return new DoneEntryCsvParseError({
            input,
            index,
            cause: new Error(`Contact \`${row.userName}\` not found.`),
          })
        }

        // `likes` comes in as as serialized array of user names; need to convert that to contactIDs
        const likesUserNames = JSON.parse(row.likes) as string[]
        const likes = [] as ContactId[]
        for (const userName of likesUserNames) {
          const contact = contacts.find(c => c.userName.toLowerCase() === userName.toLowerCase())
          if (contact) likes.push(contact.id)
        }

        return yield* S.decode(DoneEntry)({
          id: DoneEntryId.make(createId()),
          contactId: contact.id,
          date: row.date,
          content: row.content,
          likes,
          timestamp: row.timestamp,
        })
      }).pipe(E.mapError(cause => new DoneEntryCsvParseError({ input, index, cause })))
    })
    const allErrors = [
      ...upstreamErrors.map(cause => {
        const { input, index } = cause
        return new DoneEntryCsvParseError({ input, index, cause })
      }),
      ...errors,
    ]
    return [allErrors, entries] as const
  })

export class DoneEntryCsvParseError //
  extends Data.TaggedError("DoneEntryCsvParseError")<{
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

  return message
}
