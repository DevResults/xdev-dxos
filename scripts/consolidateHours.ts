import { writeFileSync, readFileSync } from "fs"
import { parse } from "csv-parse/sync"
import { parseClientCodes } from "../app/data/clientCodes"
import { parseProjectCodes } from "../app/data/projectCodes"

const INPUT_DIR = "app/data/csv/hours-export"
const OUTPUT_FILE = "app/data/csv/hours.csv"
const COLUMNS = ["name", "date", "hours", "project", "client", "notes", "week"] as const

/** Consolidates yearly hours export CSVs into a single clean CSV file. */
const consolidateHours = () => {
  // Each file is the source of truth for its calendar year.
  // The 2019 file also contains 2018 data.
  const allRows = [
    ...filterByYear(readCsvFile("2019.csv"), [2018, 2019]),
    ...filterByYear(readCsvFile("2020.csv"), [2020]),
    ...filterByYear(readCsvFile("2021.csv"), [2021]),
    ...filterByYear(readCsvFile("2022.csv"), [2022]),
    ...filterByYear(readCsvFile("2023.csv"), [2023]),
    ...filterByYear(readCsvFile("2024.csv"), [2024]),
    ...filterByYear(readCsvFile("2025.csv"), [2025]),
    ...filterByYear(readCsvFile("2026.csv"), [2026]),
  ]

  // Normalize and validate
  const validProjectSet = new Set(parseProjectCodes().map(p => p.fullCode.toLowerCase()))
  const validClientSet = new Set(parseClientCodes().map(c => c.toLowerCase()))

  const invalidProjects = new Map<string, number>()
  const invalidDates: Array<{ date: string; source: string; line: number }> = []
  const invalidNames: Array<{ name: string; source: string; line: number }> = []

  const cleanedRows = allRows
    .map(row => {
      const date = normalizeDate(row.date)
      let name = row.name.trim().toLowerCase()
      const hours = parseFloat(row.hours)
      let project = row.project.trim()
      let client = row.client.trim()
      let notes = row.notes.trim()

      // Apply project corrections
      if (projectCorrections[project]) {
        project = projectCorrections[project]
      } else if (projectSplitToNotes[project]) {
        const split = projectSplitToNotes[project]
        const alreadyInNotes = notes.toLowerCase().includes(split.notePrefix.toLowerCase())
        notes = alreadyInNotes ? notes : notes ? `${split.notePrefix} - ${notes}` : split.notePrefix
        project = split.project
      }

      // Apply client corrections
      client = splitMultiClient(client)
      if (clientToProject[client]) {
        project = clientToProject[client]
        client = ""
      } else if (clientCorrections[client]) {
        client = clientCorrections[client]
      }
      // Map unrecognized client codes to ???
      if (client && !validClientSet.has(client.toLowerCase())) client = "???"

      // Validate date
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        invalidDates.push({ date: row.date, source: row._source, line: row._line })
      }

      // Validate name
      if (!name || /[,"]/.test(name) || name.length > 30) {
        invalidNames.push({ name, source: row._source, line: row._line })
      }

      // Validate project (skip ones we're intentionally dropping)
      if (project && !validProjectSet.has(project.toLowerCase()) && !droppedProjects.has(project)) {
        invalidProjects.set(project, (invalidProjects.get(project) ?? 0) + 1)
      }

      return { name, date, hours, project, client, notes }
    })
    .filter(row => {
      // Filter out rows with clearly invalid data
      if (isNaN(row.hours)) return false
      if (!row.name) return false
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return false
      // Drop rows with non-project entries
      if (droppedProjects.has(row.project)) return false
      return true
    })
    .toSorted((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name))

  // Write consolidated CSV
  const header = "userName,date,duration,project,client,description"
  const csvLines = cleanedRows.map(r =>
    [r.name, r.date, r.hours.toString(), r.project, r.client, escapeField(r.notes)].join(","),
  )

  writeFileSync(OUTPUT_FILE, [header, ...csvLines].join("\n") + "\n")

  // Report
  console.log(`\n=== Consolidation Report ===\n`)
  console.log(`Output: ${OUTPUT_FILE}`)
  console.log(`Total rows: ${cleanedRows.length}`)
  console.log(`Date range: ${cleanedRows[0]?.date} to ${cleanedRows[cleanedRows.length - 1]?.date}`)
  console.log(`Unique names: ${new Set(cleanedRows.map(r => r.name)).size}`)

  if (invalidDates.length > 0) {
    console.log(`\n--- Invalid dates (${invalidDates.length} rows filtered out) ---`)
    invalidDates.forEach(d => console.log(`  ${d.source}:${d.line} - "${d.date}"`))
  }

  if (invalidNames.length > 0) {
    console.log(`\n--- Invalid names (${invalidNames.length} rows) ---`)
    invalidNames.forEach(n => console.log(`  ${n.source}:${n.line} - "${n.name}"`))
  }

  if (invalidProjects.size > 0) {
    console.log(`\n--- Invalid projects (${invalidProjects.size} unique values) ---`)
    const sorted = [...invalidProjects.entries()].toSorted((a, b) => b[1] - a[1])
    sorted.forEach(([project, count]) => console.log(`  "${project}" (${count} rows)`))
  }
}

// -- Corrections --

/** Simple project code corrections (no notes to preserve). */
const projectCorrections: Record<string, string> = {
  // Typos
  Ouyt: "Out",

  // Case variations
  "Feature: Multimatrix": "Feature: Matrix",
  "Feature: MultiMatrix": "Feature: Matrix",
  "Feature: Ag-grid": "Feature: Ag Grid conversions",

  // Missing subcategory that can be inferred
  InstanceExport: "Feature: Instance Export",
  "Feature: Sharepoint": "Feature: Too small to name",
  Feature: "Feature: Too small to name",

  // Map to closest match
  "Tech wealth: SecFu": "Security",
  "reduced hours": "Overhead",
}

/** Project codes where the subcategory should be split into project + prepended to notes. */
const projectSplitToNotes: Record<string, { project: string; notePrefix: string }> = {
  "Thought Leadership: Blog post": { project: "Thought Leadership", notePrefix: "Blog post" },
  "Thought Leadership: Teach a course": {
    project: "Thought Leadership",
    notePrefix: "Teach a course",
  },
  "Thought Leadership: Host public event": {
    project: "Thought Leadership",
    notePrefix: "Host public event",
  },
  "Thought Leadership: Speak at public event": {
    project: "Thought Leadership",
    notePrefix: "Speak at public event",
  },
  "Thought Leadership: Engage in public online discussion": {
    project: "Thought Leadership",
    notePrefix: "Engage in public online discussion",
  },
  "Out: Parental Leave": { project: "Out", notePrefix: "Parental leave" },
}

/** Project codes that aren't real projects - these rows get dropped. */
const droppedProjects = new Set([
  "Project", // placeholder/junk
])

/** Client codes that should be mapped to valid codes. */
const clientCorrections: Record<string, string> = {
  // Typos
  episopalrelief: "episcopalrelief",

  // Variations of the same client
  rainforest: "rainforestalliance",
  "rainforest alliance": "rainforestalliance",
  wwfus: "wwf-us",
  wwf: "wwf-us",
  johanitter: "johanniter",
  "dt global": "dtglobal",
  "stop spillover": "stopspillover",
  "prime source": "primesource",
  stc: "savethechildren",
  "state department": "state",
  stateaf: "state",
  statesca: "state",
  "USAID Jordan": "jor",
  abaroli: "aba",
  "abaroli-asia": "aba",
  syriaART: "syriamel",
  abtaus: "abt",
  usfs: "usfs-ip",
  usda: "usfs-ip",
  mastercard: "mastercardfdn",
  surge: "surges",
}

/** Client values that are actually project codes - move to project field and clear client. */
const clientToProject: Record<string, string> = {
  surveycto: "Feature: SurveyCTO", // 4
  "Tech wealth: SecFu": "Security", // 1
}

// -- Helpers --

/** Parse a date string in either M/D/YYYY or YYYY-MM-DD format to ISO YYYY-MM-DD. */
const normalizeDate = (raw: string): string => {
  const trimmed = raw.trim()

  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  // M/D/YYYY with optional time suffix
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(trimmed)
  if (match) {
    const [, m, d, y] = match
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
  }

  return trimmed // return as-is for reporting
}

type Row = Record<(typeof COLUMNS)[number], string> & { _source: string; _line: number }

/** Read and parse a single CSV file. */
const readCsvFile = (filename: string): Row[] => {
  const csvData = readFileSync(`${INPUT_DIR}/${filename}`, "utf-8")

  const records = parse(csvData, {
    columns: COLUMNS as unknown as string[],
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
    from_line: 2, // skip header
  }) as Array<Record<(typeof COLUMNS)[number], string>>

  return records.map((record, i) => ({
    ...record,
    _source: filename,
    _line: i + 2,
  }))
}

/** Filter rows to only those whose normalized date falls within the given calendar year(s). */
const filterByYear = (rows: Row[], years: number[]) =>
  rows.filter(r => {
    const date = normalizeDate(r.date)
    const y = parseInt(date.substring(0, 4))
    return years.includes(y)
  })

/** Client fields with multiple comma-separated values - take the first one. */
const splitMultiClient = (client: string): string => {
  if (client.includes(",")) return client.split(",")[0].trim()
  return client
}

/** Escape a CSV field value. */
const escapeField = (value: string) => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// -- Run --

consolidateHours()
