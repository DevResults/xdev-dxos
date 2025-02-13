import { parse } from "csv-parse/sync"
import { E, pipe, S, Data } from "lib/Effect"

export const parseCsv = <K extends string, T extends Record<K, string>>(
  csvData: string,
  columns: K[],
) => {
  const rows = csvData.trim().split("\n")
  const parsedRows = rows
    .filter(row => row.length > 0)
    .map((input, index) => {
      const parsedRow = parse(input, {
        columns: columns as string[],
        relax_column_count: true,
        trim: true,
      })[0] as T
      return { input, index, ...parsedRow }
    })
  return parsedRows
}

export const csvToSchema = <
  Encoded extends Record<string, string>,
  Decoded,
  ParsedRow = { input: string; index: number } & Decoded,
>(
  csvData: string,
  OutputSchema: S.Schema<Decoded, Encoded> & { fields: S.Struct.Fields },
) =>
  E.gen(function* (_) {
    const fields = Object.keys(OutputSchema.fields as Record<string, unknown>)
    try {
      const rows = parseCsv(csvData, fields)
      return yield* E.partition(rows, row => {
        const { input, index, ...rest } = row
        return pipe(
          rest as Encoded,
          S.decode(OutputSchema),
          E.mapBoth({
            onFailure: cause => new CsvParseError({ input, index, cause }),
            onSuccess: (value: Decoded) => ({ index, input, ...value }),
          }),
        )
      })
    } catch (error) {
      // If the overall CSV parsing step fails (as opposed to an individual row failing to parse),
      // still return in [errors, rows] format
      const errors = [new CsvParseError({ input: csvData, index: 0, cause: error as Error })]
      const rows = [] as ParsedRow[]
      return [errors, rows] as const
    }
  })

export class CsvParseError //
  extends Data.TaggedError("CsvParseError")<{ input: string; index: number; cause: Error }>
{
  message = `Couldn't parse CSV: \n${this.cause.message}`
}
