import { LocalDate } from "@js-joda/core"
import { Button } from "@ui/button"
import { useState } from "react"
import { generateTimeEntries } from "../lib/generateTimeEntries"
import { RadioGroup } from "./RadioGroup"
import { getSunday } from "~/lib/getSunday"
import type { Contact } from "~/schema/Contact"
import type { Project } from "~/schema/Project"
import type { Client } from "~/schema/Client"

export const TimeEntryGenerator = ({
  destroyAll = () => {},
  add = () => {},
  contacts,
  projects,
  clients,
}: Props) => {
  const weekOptions = ["1", "2", "5", "10", "20", "50", "100"]
  const [weeks, setWeeks] = useState(Number(weekOptions[2]))

  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)

  const onConfirm = () => {
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
    add(timeEntries)
    setSuccessMessage(`Generated ${timeEntries.length} entries`)
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
      <div className="py-4">
        <Button intent="danger" onClick={onConfirm}>
          Replace ALL hours with dummy data
        </Button>
        {successMessage ? (
          <div className="mt-2 flex flex-row items-center gap-2 text-sm">
            <IconCircleCheckFilled className="text-lg text-success" />
            {successMessage}
          </div>
        ) : null}
      </div>
    </>
  )
}

type Props = {
  contacts: Contact[]
  projects: Project[]
  clients: Client[]
  destroyAll(): void
  add(entries: any[]): void
}
