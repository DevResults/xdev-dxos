import hoursCsv from "data/csv/actual-hours.csv?raw"
import { bench, describe } from "vitest"
// eslint-disable-next-line import-x/extensions -- .test is part of filename, not extension
import { testCsvToTimeEntries } from "./csvToTimeEntries.test"

describe("csvToTimeEntries", () => {
  bench("parses properly formed csv data", () => {
    const csv = hoursCsv.split("\n").slice(0, 1000).join("\n")
    testCsvToTimeEntries({ input: csv, entries: 1000, errors: 0 })
  })
})
