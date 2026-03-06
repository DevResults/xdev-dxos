import { useState } from "react"
import { csvToDoneEntries } from "../lib/csvToDoneEntries"
import { useBatchWork } from "~/hooks/useBatchWork"
import { NO_OP } from "~/lib/constants"
import { processBatch } from "~/lib/processBatch"
import type { Contact } from "~/schema/Contact"
import { ProvidedContacts } from "~/schema/ContactCollection"
import type { DoneEntryEncoded } from "~/schema/DoneEntry"
import { pipe, E } from "~/schema/lib/Effect"
import { AsyncButton } from "~/ui/AsyncButton"

export const DoneEntryImporter = ({ add = NO_OP, destroyAll = NO_OP, contacts = [] }: Props) => {
  const [importData, setImportData] = useState("")
  const [errors, setErrors] = useState<Error[]>([])
  const [doneEntries, setDones] = useState<Array<Omit<DoneEntryEncoded, "id">>>([])

  const { isRunning, progress, result, run } = useBatchWork()

  const decode = (csv: string) =>
    pipe(csv, csvToDoneEntries, E.provideService(ProvidedContacts, contacts), E.runSync)

  const onImportDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const csv = event.target.value
    setImportData(csv)

    const decodeResult = decode(csv)
    const [decodeErrors, dones] = decodeResult
    setErrors(decodeErrors)
    setDones(dones)
  }

  const onImport = () => {
    run(async onProgress => {
      destroyAll()
      await processBatch(doneEntries, add, onProgress)
      return `Imported ${doneEntries.length} dones`
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
            "contactId,date,content,likes,timestamp ",
            "",
            "Example: ",
            "brent,2023-01-27,Added feature X,[],",
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
          ) : doneEntries.length > 0 ? (
            <div className="flex flex-row gap-1 text-sm">
              <IconCircleCheckFilled className="text-lg text-success" />
              <p>{doneEntries.length} dones will be imported.</p>
            </div>
          ) : null}
        </div>
      </div>
      <AsyncButton
        onClick={onImport}
        disabled={doneEntries.length === 0 || errors.length > 0}
        isRunning={isRunning}
        progress={progress}
        result={result}
      >
        Replace ALL dones with imported data
      </AsyncButton>
    </>
  )
}

type Props = {
  contacts: Contact[]
  add(d: Omit<DoneEntryEncoded, "id">): void
  destroyAll(): void
}
