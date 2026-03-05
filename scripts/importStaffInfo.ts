import { readFileSync, writeFileSync } from "fs"
import { parse } from "csv-parse/sync"

const INPUT_FILE = "app/data/csv/staff-info.csv"
const OUTPUT_FILE = "app/data/staffContactData.ts"

const CSV_COLUMNS = [
  "first",
  "middle",
  "last",
  "suffix",
  "businessCardName",
  "everydayName",
  "pronouns",
  "birthdate",
  "startDate",
  "passportNumber",
  "passportIssue",
  "passportExp",
  "passportCountry",
  "homeAddress",
  "homeCity",
  "homeState",
  "homeZip",
  "workAddress",
  "workCity",
  "workState",
  "workZip",
  "country",
  "phone",
  "title",
  "driversLicense",
  "dlExpiration",
  "emergencyContact",
  "emergencyRelationship",
  "emergencyPhone",
] as const

type StaffRow = Record<(typeof CSV_COLUMNS)[number], string>

/** Parse a date like "16-Mar-70" or "5-Dec-03" into an ISO date string. */
const parseDate = (raw: string): string | undefined => {
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  }

  const match = /^(\d{1,2})-(\w{3})-(\d{2,4})$/.exec(trimmed)
  if (!match) return undefined

  const [, day, monthStr, yearStr] = match
  const month = months[monthStr]
  if (!month) return undefined

  let year: number
  if (yearStr.length === 4) {
    year = parseInt(yearStr)
  } else {
    // Two-digit year: 00-39 -> 2000s, 40-99 -> 1900s
    const twoDigit = parseInt(yearStr)
    year = twoDigit <= 39 ? 2000 + twoDigit : 1900 + twoDigit
  }

  return `${year}-${month}-${day.padStart(2, "0")}`
}

/** Convert a staff CSV row to a contact data object. */
const rowToContact = (row: StaffRow) => {
  const contact: Record<string, string | undefined> = {
    userName: row.everydayName.trim().toLowerCase(),
    firstName: row.everydayName.trim(),
    lastName: row.last.trim(),
    avatarUrl: "",

    // Personal info
    legalFirstName: row.first.trim() || undefined,
    middleName: row.middle.trim() || undefined,
    suffix: row.suffix.trim() || undefined,
    preferredName: row.businessCardName.trim() || undefined,
    pronouns: row.pronouns.trim() || undefined,
    birthdate: parseDate(row.birthdate),
    startDate: parseDate(row.startDate),
    title: row.title.trim() || undefined,

    // Phone
    phone: row.phone.trim() || undefined,

    // Passport
    passportNumber: row.passportNumber.trim() || undefined,
    passportIssueDate: parseDate(row.passportIssue),
    passportExpirationDate: parseDate(row.passportExp),
    passportCountry: row.passportCountry.trim() || undefined,

    // Home address
    homeAddress: row.homeAddress.trim() || undefined,
    homeCity: row.homeCity.trim() || undefined,
    homeState: row.homeState.trim() || undefined,
    homeZip: row.homeZip.trim() || undefined,

    // Work address
    workAddress: row.workAddress.trim() || undefined,
    workCity: row.workCity.trim() || undefined,
    workState: row.workState.trim() || undefined,
    workZip: row.workZip.trim() || undefined,

    // Country
    country: row.country.trim() || undefined,

    // Driver's license
    driversLicense: row.driversLicense.trim() || undefined,
    driversLicenseExpiration: parseDate(row.dlExpiration),

    // Emergency contact
    emergencyContactName: row.emergencyContact.trim() || undefined,
    emergencyContactRelationship: row.emergencyRelationship.trim() || undefined,
    emergencyContactPhone: row.emergencyPhone.trim() || undefined,
  }

  // Remove undefined values for cleaner output
  return Object.fromEntries(Object.entries(contact).filter(([, v]) => v !== undefined))
}

/** Import staff info from CSV and generate a TypeScript data file. */
const importStaffInfo = () => {
  const csvData = readFileSync(INPUT_FILE, "utf-8")

  const rows = parse(csvData, {
    columns: CSV_COLUMNS as unknown as string[],
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
    from_line: 2, // skip header
  }) as StaffRow[]

  const contacts = rows.map(rowToContact)

  // Generate TypeScript output
  const tsContent = `import type { EncodedContact } from "~/schema/Contact"

/** Staff contact data imported from staff-info.csv. */
export const staffContactData: Array<Omit<EncodedContact, "id">> = ${JSON.stringify(contacts, null, 2)}
`

  writeFileSync(OUTPUT_FILE, tsContent)

  console.log(`\n=== Staff Info Import ===\n`)
  console.log(`Input: ${INPUT_FILE}`)
  console.log(`Output: ${OUTPUT_FILE}`)
  console.log(`Contacts imported: ${contacts.length}`)
  console.log()

  // Print summary
  for (const c of contacts) {
    console.log(`  ${c.firstName} ${c.lastName} (${c.userName})`)
  }
}

importStaffInfo()
