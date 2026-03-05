import hoursCsv from "data/csv/hours.csv?raw"
import { bench, describe } from "vitest"
import { testCsvToTimeEntries } from "./csvToTimeEntries.test"

describe("csvToTimeEntries", () => {
  bench("parses properly formed csv data", () => {
    const csv = hoursCsv.split("\n").slice(0, 1000).join("\n")
    testCsvToTimeEntries({ input: csv, entries: 1000, errors: 0 })
  })
})
