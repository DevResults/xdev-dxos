import { parse } from "csv-parse/sync"
import { E, pipe, S, Data } from "~/schema/lib/Effect"

export const parseCsv = <K extends string, T extends Record<K, string>>(
  csvData: string,
  columns: K[],
) => {
  const columnSet = new Set(columns.map(c => c.toLowerCase()))

  const records = parse(csvData, {
    columns: columns as string[],
    relax_column_count: true,
    trim: true,
    skip_empty_lines: true,
  }) as T[]

  return records
    .filter(record => {
      // Skip header rows whose fields all match the expected column names
      const values = Object.values(record) as string[]
      return !values.every(v => columnSet.has(v.toLowerCase()))
    })
    .map((record, index) => {
      const input = columns.map(c => record[c] ?? "").join(",")
      return { input, index, ...record }
    })
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
