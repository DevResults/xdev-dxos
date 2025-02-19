import { LocalDate } from "@js-joda/core"
import { Fragment } from "react/jsx-runtime"
import { asPercentage } from "~/lib/asPercentage"
import { cx } from "~/lib/cx"
import { formatDate } from "~/lib/formatDate"
import { formatDateRange } from "~/lib/formatDateRange"
import { getSunday } from "~/lib/getSunday"
import { getSundaysForYear } from "~/lib/getSundaysForYear"
import { isCompleteWeek } from "~/lib/isCompleteWeek"
import { plural } from "~/lib/plural"
import { sum } from "~/lib/sum"
import { Avatar } from "~/ui/Avatar"
import { CenteredLayout } from "~/ui/layouts/CenteredLayout"
import type { TimeEntry } from "~/schema/TimeEntry"
import type { Contact, ContactId } from "~/schema/Contact"
import { rankByScore } from "~/lib/rankByScore"

export const HoursReport = ({ year, contacts, timeEntries }: Props) => {
  const sYear = year.toString()
  const entries = timeEntries.filter(d => d.date.startsWith(sYear))
  if (entries.length === 0) {
    return (
      <CenteredLayout>
        <p className="flex flex-col items-center">
          <span className="text-6xl text-gray-400">
            <IconCactus />
          </span>

          <span className="text-sm">No hours logged yet this year!</span>
        </p>
      </CenteredLayout>
    )
  }

  /** Which contacts have any hours data at all? */
  const reportingContacts = contacts.filter(c => entries.some(e => e.contactId === c.id))

  /** All weeks in the given year */
  const weeks = getSundaysForYear(year)

  const isPast = (week: LocalDate) => week.minusDays(1).isBefore(LocalDate.now())
  const isStartOfMonth = (week: LocalDate) => week.dayOfMonth() <= 7

  /** How many weeks have there been this year? */
  const weeksToDate = weeks.filter(isPast).length

  /** How many minutes have been logged by each contact for each week? */
  const minutesByWeekByContact = new Map(
    reportingContacts.map(({ id }) => {
      const minutesByWeek = new Map(
        weeks.map(week => {
          const totalMinutes = sum(
            entries
              .filter(({ date }) => getSunday(LocalDate.parse(date)).equals(week)) // for this week
              .filter(({ contactId }) => contactId === id) // for this contact
              .map(entry => entry.duration),
          )
          return [String(week), totalMinutes]
        }),
      )
      return [id, minutesByWeek]
    }),
  )

  /** Convenience lookup for minutesByWeekByContact */
  const getMinutes = (contactId: ContactId, week: LocalDate) =>
    minutesByWeekByContact.get(contactId)?.get(String(week)) ?? 0

  /** How many weeks has each contact completed? (as an array of objects) */
  const completionScores = reportingContacts.map(({ id }) => {
    const sContactId = id.toString()
    const score = weeks.filter(week => isCompleteWeek(getMinutes(id, week)) && isPast(week)).length
    return { id: sContactId, score }
  })

  /** How many weeks has each contact completed? (as a map) */
  const completionByContact = new Map(completionScores.map(({ id, score }) => [id, score]))

  /** Rank of contacts according to completion rates (0 = least complete) */
  const rankByCompletion = rankByScore(completionScores)

  /** As a team, which weeks do we have complete data for? */
  const teamCompletionByWeek = new Map(
    weeks.map(week => {
      const isComplete = reportingContacts.every(({ id }) => isCompleteWeek(getMinutes(id, week)))
      return [String(week), isComplete]
    }),
  )

  /** As a team, how many weeks do we have complete data for?  */
  const teamCompleteWeeks = [...teamCompletionByWeek.values()].filter(Boolean).length

  return (
    <div
      className={cx(
        "grid text-sm",
        "*:flex *:min-h-8 *:items-center *:border-b *:py-1", // shared styles for all grid cells
      )}
      style={{
        gridTemplateColumns: [
          "minmax(auto,4em)", // completion %
          "minmax(auto,4em)", // badge
          "minmax(6em,10em)", // avatar & name
          `repeat(${weeks.length}, minmax(.8em,1.3em))`, // weeks
        ].join(" "),
      }}
    >
      {/* HEADING ROW  */}

      <div className={cx("col-span-3", headingRowBorder)}>{/* empty cell */}</div>

      {/* Week headings */}
      {weeks.map((week, i) => (
        <div key={i} className={headingRowBorder}>
          {/* Show month name on first week of month */}
          {isStartOfMonth(week) && <span className="font-serif">{formatDate(week, "MMM")}</span>}
        </div>
      ))}

      {/* DATA ROWS  */}

      {reportingContacts.map(contact => {
        const { id, firstName } = contact

        const completeWeeks = completionByContact.get(id)!
        const weeksBehind = weeksToDate - completeWeeks
        const isMostShamed = Boolean(rankByCompletion.get(0)?.includes(id))
        const isAlsoShamed = Boolean(rankByCompletion.get(1)?.includes(id))
        const isShamed = weeksBehind > 2 && (isMostShamed || isAlsoShamed)

        const badge =
          isShamed ?
            isMostShamed ?
              mostShamedBadge //
            : alsoShamedBadge
          : weeksBehind <= 0 ?
            completeBadge //
          : null

        return (
          <Fragment key={id}>
            {/* Completion rate for contact */}
            <div
              className={isShamed ? "font-semibold text-danger" : "text-neutral"}
              title={`${completeWeeks}/${weeksToDate} complete weeks this year`}
            >
              <div className="w-full text-right text-xs">
                {asPercentage(completeWeeks, weeksToDate)}
              </div>
            </div>

            {/* Badge */}
            <div>
              <div className="w-full *:m-auto">{badge}</div>
            </div>

            {/* Avatar & name */}
            <div className="gap-2">
              <Avatar contact={contact} size="2xs" />
              {firstName}
            </div>

            {/* Completion by week */}
            {weeks.map(week => {
              const minutes = getMinutes(id, week)
              const hours = Math.round(minutes / 60)

              const icon =
                isCompleteWeek(minutes) ? weekCompleteIcon
                : minutes > 0 ? weekPartialIcon
                : isPast(week) ? weekEmptyIcon
                : null

              const dateRange = formatDateRange(week, week.plusDays(6), {
                monthFormat: "short",
                includeYear: false,
              })

              return (
                <div
                  key={week.toString()}
                  title={`${dateRange}: ${hours} hrs`}
                  className={cx(
                    isStartOfMonth(week) && monthBorder, //
                    !isPast(week) && futureBackground,
                  )}
                >
                  <div className="w-full *:m-auto">{icon}</div>
                </div>
              )
            })}
          </Fragment>
        )
      })}

      {/* TOTAL ROW  */}

      {/* Team completion rate */}
      <div className={totalRowBorder}>
        <div
          className="w-full text-right font-semibold"
          title={`${teamCompleteWeeks}/${weeksToDate} complete ${plural(teamCompleteWeeks, "week")} this year`}
        >
          {asPercentage(teamCompleteWeeks, weeksToDate)}
        </div>
      </div>

      <div className={totalRowBorder}>{/* empty cell */}</div>

      <div className={cx("font-semibold", totalRowBorder)}>Overall</div>

      {weeks.map(week => {
        const isComplete = teamCompletionByWeek.get(String(week))
        const isFuture = week.isAfter(LocalDate.now())
        const icon =
          isFuture ? null
          : isComplete ? weekCompleteIcon
          : weekEmptyIcon
        return (
          <div
            key={week.toString()}
            className={cx(
              totalRowBorder,
              isStartOfMonth(week) && monthBorder,
              isFuture && futureBackground,
            )}
          >
            <div className="w-full *:m-auto">{icon}</div>
          </div>
        )
      })}
    </div>
  )
}

// ICONS

const mostShamedBadge = <IconMoodWrrrFilled className="text-danger" />
const alsoShamedBadge = <IconMoodConfuzed className="text-danger" />
const completeBadge = <IconDiscountCheckFilled className="text-success" />

const weekCompleteIcon = <IconCircleCheck className="text-success" />
const weekPartialIcon = <IconCircleCheck className="text-neutral-300" />
const weekEmptyIcon = <IconCircle className="text-neutral-300" />

// COMMON STYLES

const monthBorder = cx("border-l border-l-neutral-100")
const headingRowBorder = cx("border-b-black")
const totalRowBorder = cx("border-t border-t-black")
const futureBackground = cx("bg-neutral-50")

// TYPES

type Props = {
  year: number
  timeEntries: TimeEntry[]
  contacts: Contact[]
}
