import { LocalDate } from "@js-joda/core"
import { DailyDones } from "./DailyDones"
import { DailyTimeEntries } from "./DailyTimeEntries"
import { cx } from "~/lib/cx"
import { DAY_OF_MONTH, DAY_OF_WEEK, formatDate } from "~/lib/formatDate"
import { formatDuration } from "~/lib/formatDuration"
import { getDaysOfWeek } from "~/lib/getDaysOfWeek"
import { isWeekend } from "~/lib/isWeekend"
import { sum } from "~/lib/sum"
import type { Client } from "~/schema/Client"
import type { Contact } from "~/schema/Contact"
import type { DoneEntry } from "~/schema/DoneEntry"
import type { Project } from "~/schema/Project"
import type { TimeEntry } from "~/schema/TimeEntry"
import { Heading } from "~/ui/Heading"

const FULL_DAY = 7 * 60
const FULL_WEEK = FULL_DAY * 5

export const MyWeek = ({
  start,
  showWeekends = false,
  doneEntries,
  timeEntries,
  projects,
  clients,
  self,
  contacts,
  onAddDone = () => {},
  onRemoveDone = () => {},
  onAddTime = () => {},
  onRemoveTime = () => {},
}: Props) => {
  const days = getDaysOfWeek(start).filter(date => showWeekends || !isWeekend(date))

  const myTimeEntries = timeEntries.filter(({ contactId }) => contactId === self.id)

  const dailyTotals = myTimeEntries.reduce<Record<string, number>>((acc, { date, duration }) => {
    const day = date.toString()
    return {
      ...acc,
      [day]: (acc[day] || 0) + duration,
    }
  }, {})

  const weeklyTotal = sum(Object.values(dailyTotals))

  // Find the longest day to set the height of the time entries
  const longestDay = Math.max(...Object.values(dailyTotals))

  const weekendShading = (date: LocalDate) => cx(isWeekend(date) && "bg-neutral-100")

  return (
    <div
      className={cx(
        // Mobile
        "grid-flow-col grid-cols-[auto_1fr_1fr]",
        { "grid-rows-7": showWeekends },
        { "grid-rows-5": !showWeekends },
        // Desktop
        "sm:grid-flow-row sm:grid-rows-[auto_auto_1fr_auto_auto_1fr]",
        { "sm:grid-cols-7": showWeekends },
        { "sm:grid-cols-5": !showWeekends },
        // Common
        "grid h-full w-full",
      )}
    >
      {/* DAYS OF WEEK HEADINGS */}
      {days.map(date => {
        const isToday = date.equals(LocalDate.now())

        return (
          <Heading
            level={2}
            key={date.toString()}
            className={cx(
              "items-center p-2 text-center tracking-tight",
              // Mobile: dark line to right, day & date horizontal
              "flex border-b border-r border-r-black",
              // Desktop: dark line below, day & date vertical
              "sm:flex-col sm:border-r-0 sm:border-b-black",
              weekendShading(date),
            )}
          >
            {/* day of week */}
            <span className="block flex-1 p-1 text-xs font-normal uppercase text-neutral-500">
              {formatDate(date, DAY_OF_WEEK)}
            </span>
            {/* day of month */}
            <span
              className={cx([
                "flex aspect-square w-10 items-center justify-center rounded-full font-serif text-xl font-bold text-neutral-900",
                { "bg-primary-500 text-white": isToday },
              ])}
            >
              {formatDate(date, DAY_OF_MONTH)}
            </span>
          </Heading>
        )
      })}
      {/* HOURS */}
      <div className="col-span-full flex items-center gap-1 p-2">
        <Heading level={3} className="flex grow items-center gap-1">
          <IconClock2 />
          Hours
        </Heading>
        <div className="flex items-center text-xs font-semibold text-neutral-400">
          <IconStopwatch />
          {formatDuration(weeklyTotal)}
          {weeklyTotal >= FULL_WEEK ? (
            <IconSquareRoundedCheckFilled className="mx-2 size-5 text-success" />
          ) : null}
        </div>
      </div>
      {days.map(date => (
        <div key={date.toString()} className={cx("p-1", weekendShading(date))}>
          <DailyTimeEntries
            {...{
              timeEntries: myTimeEntries,
              projects,
              clients,
              date,
              self,
              longestDay,
              onAdd: onAddTime,
              onRemove: onRemoveTime,
            }}
          />
        </div>
      ))}
      {/* daily totals */}
      {days.map(date => {
        const total = dailyTotals[date.toString()] || 0
        return (
          <div
            key={date.toString()}
            className={cx("flex flex-col items-center", weekendShading(date))}
          >
            <div className="flex flex-row items-center gap-px pb-1 pt-2 text-xs font-semibold text-neutral-400">
              <IconStopwatch />
              {formatDuration(total)}
              {total >= FULL_DAY ? (
                <IconSquareRoundedCheckFilled className="mx-2 size-4 text-success" />
              ) : null}
            </div>
          </div>
        )
      })}
      {/* DONES */}
      <div className="col-span-full flex items-center gap-1 p-2">
        <Heading level={3} className="flex grow items-center gap-1">
          <IconClipboardCheck />
          Dones
        </Heading>
      </div>
      {days.map(date => (
        <div key={date.toString()} className={cx("overflow-auto", weekendShading(date))}>
          <DailyDones
            {...{
              doneEntries,
              date,
              self,
              contacts,
              onAdd: onAddDone,
              onRemove: onRemoveDone,
            }}
          />
        </div>
      ))}
    </div>
  )
}

type Props = {
  start: LocalDate
  showWeekends?: boolean
  doneEntries: DoneEntry[]
  timeEntries: TimeEntry[]
  projects: Project[]
  clients: Client[]
  self: Contact
  contacts: Contact[]
  onAddDone: (done: DoneEntry) => void
  onRemoveDone: (done: DoneEntry) => void
  onAddTime: (time: TimeEntry) => void
  onRemoveTime: (time: TimeEntry) => void
}
