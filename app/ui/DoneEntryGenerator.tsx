import { LocalDate } from "@js-joda/core"
import { Button } from "@ui/button"
import { NO_OP } from "lib/constants"
import { generateDones } from "lib/generateDones"
import { useState } from "react"
import type { Contact } from "schema/Contact"
import type { DoneEntryEncoded } from "schema/DoneEntry"
import { RadioGroup } from "ui/RadioGroup"

export const DoneEntryGenerator = ({ destroyAll = NO_OP, add = () => {}, contacts }: Props) => {
  const weekOptions = ["1", "2", "5", "10", "20", "50", "200"]
  const [weeks, setWeeks] = useState(Number(weekOptions[2]))

  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)

  const productivityOptions = [
    { value: ".5", label: "chill", title: "3-4 dones per person, per week" },
    { value: "1", label: "focused", title: "7 dones per person, per week" },
    { value: "5", label: "workaholic", title: "35 dones per person, per week" },
  ]
  const [productivity, setProductivity] = useState(Number(productivityOptions[1].value))

  const enthusiasmOptions = [
    { value: "0.05", label: <span className="text-xl">🙂</span> },
    { value: "0.1", label: <span className="text-xl">😃</span> },
    { value: "0.5", label: <span className="text-xl">🥰</span> },
  ]
  const [enthusiasm, setEnthusiasm] = useState(Number(enthusiasmOptions[1].value))

  const onConfirm = () => {
    destroyAll()
    const dones = generateDones({
      today: LocalDate.now(),
      weeks,
      productivity,
      enthusiasm,
      contacts,
    })
    for (const done of dones) {
      add(done)
    }

    setSuccessMessage(`Generated ${dones.length} dones`)
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
        <RadioGroup
          label="Productivity"
          initialValue={productivity.toString()}
          onChange={v => {
            setProductivity(Number(v))
          }}
          options={productivityOptions}
        />
        <RadioGroup
          label="Enthusiasm"
          initialValue={enthusiasm.toString()}
          onChange={v => {
            setEnthusiasm(Number(v))
          }}
          options={enthusiasmOptions}
        />
      </div>
      <div className="py-4">
        <Button intent="danger" onClick={onConfirm}>
          Replace ALL dones with dummy data
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
  destroyAll(): void
  add(done: Omit<DoneEntryEncoded, "id">): void
}
