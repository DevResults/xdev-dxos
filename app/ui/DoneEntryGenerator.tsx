import { LocalDate } from "@js-joda/core"
import { NO_OP } from "lib/constants"
import { generateDones } from "lib/generateDones"
import { useState } from "react"
import type { Contact } from "schema/Contact"
import type { DoneEntryEncoded } from "schema/DoneEntry"
import { AsyncButton } from "ui/AsyncButton"
import { RadioGroup } from "ui/RadioGroup"
import { useBatchWork } from "~/hooks/useBatchWork"
import { processBatch } from "~/lib/processBatch"

export const DoneEntryGenerator = ({ destroyAll = NO_OP, add = () => {}, contacts }: Props) => {
  const weekOptions = ["1", "2", "5", "10", "20", "50", "200"]
  const [weeks, setWeeks] = useState(Number(weekOptions[2]))

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

  const { isRunning, progress, result, error, run } = useBatchWork()

  const onConfirm = () => {
    run(async onProgress => {
      destroyAll()
      const dones = generateDones({
        today: LocalDate.now(),
        weeks,
        productivity,
        enthusiasm,
        contacts,
      })
      await processBatch(dones, add, onProgress)
      return `Generated ${dones.length} dones`
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
      <AsyncButton
        onClick={onConfirm}
        isRunning={isRunning}
        progress={progress}
        result={result}
        error={error}
      >
        Replace ALL dones with dummy data
      </AsyncButton>
    </>
  )
}

type Props = {
  contacts: Contact[]
  destroyAll(): void
  add(done: Omit<DoneEntryEncoded, "id">): void
}
