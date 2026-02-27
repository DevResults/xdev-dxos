import { LocalDate } from "@js-joda/core"
import { type ContactId } from "schema/Contact"
import { ContactNotFoundError, ProvidedContacts } from "schema/ContactCollection"
import { Data, E, S } from "schema/lib/Effect"
import { type CsvParseError, csvToSchema } from "./parseCsv"

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
        const contact = contacts.find(({ userName }) => userName.toLowerCase() === row.userName)
        if (contact === undefined) {
          return yield* E.fail(new ContactNotFoundError({ userName: row.userName }))
        }

        // `likes` comes in as as serialized array of user names; need to convert that to contactIDs
        const likesUserNames = JSON.parse(row.likes) as string[]
        const likes = [] as ContactId[]
        for (const userName of likesUserNames) {
          const contact = contacts.find(d => d.userName.toLowerCase() === userName)
          if (contact === undefined) {
            return yield* E.fail(new ContactNotFoundError({ userName }))
          }

          likes.push(contact.id)
        }

        let date
        try {
          date = LocalDate.parse(row.date).toString()
        } catch {
          return yield* E.fail(new Error("Invalid date."))
        }

        return {
          contactId: contact.id,
          date,
          content: row.content,
          likes,
          timestamp: new Date(Number(row.timestamp)).toISOString(),
        }
      }).pipe(E.mapError(cause => new DoneEntryCsvParseError({ input, index, cause })))
    })
    const allErrors = [
      ...upstreamErrors.map((error: CsvParseError) => {
        return new DoneEntryCsvParseError({
          input: error.input,
          index: error.index,
          cause: error.cause,
        })
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
  get message() {
    return `Couldn't parse row ${this.index + 1}. ${adaptError(this.cause)}`
  }
}

const adaptError = (error: Error) => {
  const { message } = error

  if (message.includes("is missing")) {
    const field = /"([^"]+)"/.exec(message)?.[1]
    return `The field \`${field}\` is required.`
  }

  return message
}
