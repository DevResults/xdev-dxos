import type { LocalDate } from "@js-joda/core"
import { useState } from "react"
import { DeleteButton } from "./DeleteButton"
import { TimeEntryDisplay } from "./TimeEntryDisplay"
import { TimeEntryInput } from "./TimeEntryInput"
import { cx } from "~/lib/cx"
import type { Client } from "~/schema/Client"
import type { Contact } from "~/schema/Contact"
import type { Project } from "~/schema/Project"
import type { TimeEntry } from "~/schema/TimeEntry"

/** Displays a single day of the current user's timeentries */
export const DailyTimeEntries = ({
  date,
  timeEntries,
  projects,
  clients,
  longestDay,
  self,
  onAdd = () => {},
  onRemove = () => {},
}: Props) => {
  const [focus, setFocus] = useState<number>(-1) // Nothing focused by default

  const sDate = date.toString()
  const entries = timeEntries.filter(({ date }) => date === sDate)

  const onFocusNext = () => {
    setFocus((f: number) => f + 1)
  }

  const onFocusPrevious = () => {
    setFocus((f: number) => Math.max(f - 1, 0))
  }

  const onDiscard = () => {
    setFocus(-1)
  }

  return (
    <>
      {/* the day takes up the available vertical space, and acts as a container for proportionally setting the height of each entry */}
      <ul
        className="relative flex h-full flex-col gap-1 overflow-auto"
        style={{ containerName: "day", containerType: "size" }}
        onBlur={event => {
          const nextFocused = event.relatedTarget
          if (nextFocused instanceof Node && event.currentTarget.contains(nextFocused)) {
            return
          }

          setFocus(-1)
        }}
      >
        {/* existing entries */}
        {entries.map((timeEntry, index) => {
          // The container height corresponds to either the greatest number of hours this week, or 8 hours, whichever is longer
          const day = Math.max(longestDay, 60 * 8)
          const height =
            0.8 * // Leave space for the input
            Math.round((timeEntry.duration / day) * 100) // Proportional to duration
          return (
            <li
              className={cx(
                "flex-shrink transition-all",
                "hover:min-h-[2rem] hover:flex-shrink-0 hover:flex-grow", // Grow to display all text on hover
              )}
              key={timeEntry.id}
              style={{ minHeight: `${height}cqh` }}
              onFocus={() => {
                setFocus(index)
              }}
            >
              {focus === index ? (
                <TimeEntryInput
                  content={timeEntry.input}
                  {...{
                    index,
                    date,
                    projects,
                    clients,
                    self,
                    onFocusNext,
                    onFocusPrev: onFocusPrevious,
                    onDiscard,
                  }}
                  isFocused={focus === index}
                  onFocus={setFocus}
                  onDestroy={() => {
                    onRemove(timeEntry)
                  }}
                  onCommit={e => Object.assign(timeEntry, e)}
                />
              ) : (
                <div className="group relative h-full cursor-pointer">
                  <TimeEntryDisplay
                    key={index}
                    timeEntry={timeEntry}
                    projects={projects}
                    clients={clients}
                    self={self}
                  />
                  <span className="absolute right-0 top-0 z-10">
                    <DeleteButton
                      onDestroy={() => {
                        onRemove(timeEntry)
                      }}
                    />
                  </span>
                </div>
              )}
            </li>
          )
        })}
        {/* Input for new entry */}
        <li className="min-h-[2rem] grow">
          <TimeEntryInput
            key={entries.length} // This way we get a new instance after adding a done
            content=""
            index={entries.length}
            {...{
              date,
              projects,
              clients,
              self,
              onFocusNext,
              onFocusPrev: onFocusPrevious,
              onDiscard,
            }}
            isFocused={focus === entries.length}
            onFocus={setFocus}
            onCommit={e => {
              onAdd(e)
            }}
          />
        </li>
      </ul>
    </>
  )
}

type Props = {
  date: LocalDate
  timeEntries: TimeEntry[]
  projects: Project[]
  clients: Client[]
  longestDay: number
  self: Contact
  onAdd: (time: TimeEntry) => void
  onRemove: (time: TimeEntry) => void
}
