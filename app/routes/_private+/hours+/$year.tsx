import { LocalDate } from "@js-joda/core"
import { PageLayout } from "ui/layouts/PageLayout"
import { HoursReport } from "ui/HoursReport"
import { YearNav } from "ui/YearNav"
import { useRedirect } from "~/hooks/useRedirect"
import { useSelectedYear } from "~/hooks/useSelectedYear"
import { useTeam } from "~/hooks/useTeam"
import { getCurrentYear } from "~/lib/getCurrentYear"
import { useDatabase } from "~/hooks/useDatabase"

export default function Hours$YearPage() {
  const { timeEntries } = useDatabase()
  const currentYear = getCurrentYear()
  const year = useSelectedYear()
  const { self, contacts } = useTeam()

  useRedirect({ from: "/hours", to: `/hours/${currentYear}`, condition: year > currentYear })

  const years =
    timeEntries.length > 0 ?
      new Set(timeEntries.map(({ date }) => LocalDate.parse(date).year()))
    : [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  return (
    <PageLayout
      removePadding={false}
      nav={
        <div className="flex h-full flex-row items-center gap-4">
          <h1 className="grow">Hours</h1>
          <YearNav {...{ minYear, maxYear }} />
        </div>
      }
    >
      <div className="h-full">
        <HoursReport {...{ self, year, contacts, timeEntries }} />
      </div>
    </PageLayout>
  )
}
