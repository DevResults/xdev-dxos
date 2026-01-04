import { type LocalDate } from "@js-joda/core"
import { useState } from "react"
import { DoneEditable } from "./DoneEditable"
import { DoneInput } from "./DoneInput"
import { cx } from "~/lib/cx"
import { makeDoneEntry, type DoneEntry } from "~/schema/DoneEntry"
import type { Contact } from "~/schema/Contact"

/** Displays a single day of the current user's dones */
export const DailyDones = ({
  date,
  doneEntries,
  self,
  contacts,
  onAdd = () => {},
  onRemove = () => {},
}: Props) => {
  const [focus, setFocus] = useState<number>(-1) // nothing focused by default

  const sDate = date.toString()
  const dones = doneEntries.filter(d => d.date === sDate && d.contactId === self.id)

  const focusNext = () => setFocus((f: number) => Math.min(f + 1, dones.length + 1))
  const focusPrev = () => setFocus((f: number) => Math.max(f - 1, 0))

  return (
    <>
      <ul className="flex h-full flex-col gap-1 p-2">
        {/* existing dones */}
        {dones.map((done, index) => (
          <li key={done.id}>
            <DoneEditable
              done={done}
              index={index}
              onUpdate={content => {
                done.content = content
              }}
              onDestroy={() => onRemove(done)}
              isFocused={focus === index}
              onFocus={setFocus}
              onFocusNext={focusNext}
              onFocusPrev={focusPrev}
              self={self}
              contacts={contacts}
            />
          </li>
        ))}
        {/* new done */}
        <li
          className={cx(
            "flex grow flex-col rounded-md border p-2",
            "focus-within:border-2 focus-within:border-primary-600",
          )}
        >
          <DoneInput
            key={dones.length} // this way we get a new instance after adding a done
            content=""
            isFocused={focus === dones.length}
            index={dones.length}
            onFocus={setFocus}
            onFocusNext={focusNext}
            onFocusPrev={focusPrev}
            onDestroy={() => {}}
            onChange={content => {
              const done = makeDoneEntry({
                contactId: self.id,
                content,
                date: sDate,
                likes: [],
                timestamp: new Date().toISOString(),
              })
              onAdd(done)
              setFocus(dones.length + 1)
            }}
          />
        </li>
      </ul>
    </>
  )
}

type Props = {
  date: LocalDate
  doneEntries: DoneEntry[]
  onAdd: (done: DoneEntry) => void
  onRemove: (done: DoneEntry) => void
  self: Contact
  contacts: Contact[]
}
