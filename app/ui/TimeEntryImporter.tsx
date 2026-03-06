import { useState } from "react"
import { csvToTimeEntries } from "../lib/csvToTimeEntries"
import { useBatchWork } from "~/hooks/useBatchWork"
import { NO_OP } from "~/lib/constants"
import { processBatch } from "~/lib/processBatch"
import type { Client } from "~/schema/Client"
import { ProvidedClients } from "~/schema/ClientCollection"
import type { Contact } from "~/schema/Contact"
import { ProvidedContacts } from "~/schema/ContactCollection"
import { E, pipe } from "~/schema/lib/Effect"
import type { Project } from "~/schema/Project"
import { ProvidedProjects } from "~/schema/ProjectCollection"
import type { TimeEntryEncoded } from "~/schema/TimeEntry"
import { AsyncButton } from "~/ui/AsyncButton"

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

  const { isRunning, progress, result, error, run } = useBatchWork()

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
    run(async onProgress => {
      await destroyAll(p => onProgress(p * 0.5))
      await processBatch(timeEntries, add, p => onProgress(0.5 + p * 0.5))
      return `Imported ${timeEntries.length} entries`
    })
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
      <AsyncButton
        onClick={onImport}
        disabled={timeEntries.length === 0 || errors.length > 0}
        isRunning={isRunning}
        progress={progress}
        result={result}
        error={error}
      >
        Replace ALL hours with imported data
      </AsyncButton>
    </>
  )
}

type Props = {
  defaultOpen: boolean
  contacts: Contact[]
  projects: Project[]
  clients: Client[]
  destroyAll(onProgress?: (progress: number) => void): Promise<void>
  add(entry: Omit<TimeEntryEncoded, "id">): void
}
