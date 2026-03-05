import { Button } from "@ui/button"
import { useState } from "react"
import { csvToTimeEntries } from "../lib/csvToTimeEntries"
import { NO_OP } from "~/lib/constants"
import type { Client } from "~/schema/Client"
import { ProvidedClients } from "~/schema/ClientCollection"
import type { Contact } from "~/schema/Contact"
import { ProvidedContacts } from "~/schema/ContactCollection"
import { E, pipe } from "~/schema/lib/Effect"
import type { Project } from "~/schema/Project"
import { ProvidedProjects } from "~/schema/ProjectCollection"
import type { TimeEntryEncoded } from "~/schema/TimeEntry"

export const TimeEntryImporter = ({
  add = NO_OP,
  destroyAll = NO_OP,
  contacts = [],
  clients,
  projects,
}: Props) => {
  const [importData, setImportData] = useState("")
  const [errors, setErrors] = useState<Error[]>([])
  const [timeEntries, setTimes] = useState<Array<Omit<TimeEntryEncoded, "id">>>([])

  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)

  const decode = (csv: string) =>
    pipe(
      csv,
      csvToTimeEntries,
      E.provideService(ProvidedContacts, contacts),
      E.provideService(ProvidedProjects, projects),
      E.provideService(ProvidedClients, clients),
      E.runSync,
    )

  const onImportDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const csv = event.target.value
    setImportData(csv)
    const [decodeErrors, decodedEntries] = decode(csv)
    setErrors(decodeErrors)
    setTimes(decodedEntries)
  }

  const onImport = () => {
    destroyAll()
    add(timeEntries)
    setSuccessMessage(`Imported ${timeEntries.length} entries`)
  }

  return (
    <>
      <div>
        <textarea
          className="relative z-10 block w-full rounded-md border p-2 font-mono text-xs"
          value={importData}
          onChange={onImportDataChange}
          rows={20}
          cols={200}
          placeholder={[
            "Enter comma-delimited entries, one per line in this format: ",
            "userId,date,duration,project,client,description",
            "",

            "Example: ",
            "brent,2023-01-27,1.4,Tech-wealth:Bug-fixin,,Fixed data table import error",
          ].join("\n")}
        ></textarea>
        <div className="-mt-1 mb-2 rounded-md rounded-t-none border border-t-0 bg-neutral-50 p-2 pt-3">
          {errors.length > 0 ? (
            <div className="text-sm">
              <div className="flex flex-row gap-1">
                <IconExclamationCircleFilled className="text-lg text-danger" />
                <p>Can't import &mdash; check these lines:</p>
              </div>
              <ul>
                {errors.map((e, i) => (
                  <li key={i}>{e.message}</li>
                ))}
              </ul>
            </div>
          ) : timeEntries.length > 0 ? (
            <div className="flex flex-row gap-1 text-sm">
              <IconCircleCheckFilled className="text-lg text-success" />
              <p>{timeEntries.length} entries will be imported.</p>
            </div>
          ) : undefined}
        </div>
      </div>
      <div className="py-4">
        <Button
          onClick={onImport}
          intent="danger"
          disabled={timeEntries.length === 0 || errors.length > 0}
        >
          Replace ALL hours with imported data
        </Button>
        {successMessage ? (
          <div className="mt-2 flex flex-row items-center gap-2 text-sm">
            <IconCircleCheckFilled className="text-lg text-success" />
            {successMessage}
          </div>
        ) : undefined}
      </div>
    </>
  )
}

type Props = {
  defaultOpen: boolean
  contacts: Contact[]
  projects: Project[]
  clients: Client[]
  destroyAll(): void
  add(ts: Array<Omit<TimeEntryEncoded, "id">>): void
}
