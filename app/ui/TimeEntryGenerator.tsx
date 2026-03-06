import { LocalDate } from "@js-joda/core"
import { useState } from "react"
import { generateTimeEntries } from "../lib/generateTimeEntries"
import { AsyncButton } from "./AsyncButton"
import { RadioGroup } from "./RadioGroup"
import { useBatchWork } from "~/hooks/useBatchWork"
import { getSunday } from "~/lib/getSunday"
import { processBatch } from "~/lib/processBatch"
import type { Client } from "~/schema/Client"
import type { Contact } from "~/schema/Contact"
import type { Project } from "~/schema/Project"
import type { TimeEntryEncoded } from "~/schema/TimeEntry"

export const TimeEntryGenerator = ({
  destroyAll = () => {},
  add = () => {},
  contacts,
  projects,
  clients,
}: Props) => {
  const weekOptions = ["1", "2", "5", "10", "20", "50", "100"]
  const [weeks, setWeeks] = useState(Number(weekOptions[2]))

  const { isRunning, progress, result, error, run } = useBatchWork()

  const hasData = contacts.length > 0 && projects.length > 0 && clients.length > 0

  const onConfirm = () => {
    run(async onProgress => {
      destroyAll()
      const timeEntries = generateTimeEntries({
        startDate: getSunday(LocalDate.now().minusWeeks(weeks - 1)),
        weekCount: weeks,
        contacts,
        projects,
        clients,
        procrastinators: ["Herb", "Aasit"],
        omit: ["Colleen"],
      })
      await processBatch(timeEntries, add, onProgress)
      return `Generated ${timeEntries.length} entries`
    })
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <RadioGroup
          label="Weeks"
          initialValue={weeks.toString()}
          onChange={v => {
            setWeeks(Number(v))
          }}
          options={weekOptions}
        />
      </div>
      <AsyncButton
        onClick={onConfirm}
        isRunning={isRunning}
        progress={progress}
        result={result}
        error={error}
        disabled={!hasData}
      >
        Replace ALL hours with dummy data
      </AsyncButton>
    </>
  )
}

type Props = {
  contacts: Contact[]
  projects: Project[]
  clients: Client[]
  destroyAll(): void
  add(entry: Omit<TimeEntryEncoded, "id">): void
}
