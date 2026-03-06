import { LocalDate } from "@js-joda/core"
import { HoursReport } from "ui/HoursReport"
import { PageLayout } from "ui/layouts/PageLayout"
import { Pane } from "ui/layouts/Pane"
import { YearNav } from "ui/YearNav"
import { useDbQuery } from "~/hooks/useDbQuery"
import { useRedirect } from "~/hooks/useRedirect"
import { useSelectedYear } from "~/hooks/useSelectedYear"
import { useTeam } from "~/hooks/useTeam"
import { getCurrentYear } from "~/lib/getCurrentYear"
import { isActiveContact } from "~/lib/isActiveContact"
import { TimeEntry } from "~/schema/TimeEntry"
import { Heading } from "~/ui/Heading"

export default function Hours$YearPage() {
  const timeEntries = useDbQuery(TimeEntry)
  const currentYear = getCurrentYear()
  const year = useSelectedYear()
  const { self, contacts } = useTeam()

  useRedirect({ from: "/hours", to: `/hours/${currentYear}`, condition: year > currentYear })

  const years =
    timeEntries.length > 0
      ? new Set(timeEntries.map(({ date }) => LocalDate.parse(date).year()))
      : [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  return (
    <PageLayout
      nav={
        <div className="flex h-full flex-row items-center gap-4">
          <Heading level={1} className="grow">
            Hours
          </Heading>
          <YearNav {...{ minYear, maxYear }} />
        </div>
      }
    >
      <Pane>
        <HoursReport {...{ self, year, contacts: contacts.filter(isActiveContact), timeEntries }} />
      </Pane>
    </PageLayout>
  )
}
