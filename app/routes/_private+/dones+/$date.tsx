import { PageLayout } from "ui/layouts/PageLayout"
import { Pane } from "ui/layouts/Pane"
import { TeamDones } from "ui/TeamDones"
import { WeekNav } from "ui/WeekNav"
import { useDatabase } from "~/hooks/useDatabase"
import { useSelectedWeek } from "~/hooks/useSelectedWeek"
import { useTeam } from "~/hooks/useTeam"
import { isActiveContact } from "~/lib/isActiveContact"
import { Heading } from "~/ui/Heading"

export default function Dones$DatePage() {
  const { doneEntries } = useDatabase()
  const { start, end } = useSelectedWeek()
  const { self, contacts } = useTeam()

  // Get dones for a week
  const sStart = start.toString()
  const sEnd = end.toString()
  const dones = doneEntries.filter(d => d.date >= sStart && d.date <= sEnd)

  return (
    <PageLayout
      nav={
        <div className="flex h-full flex-row items-center gap-4">
          <Heading level={1} className="grow">
            Dones
          </Heading>
          <WeekNav />
        </div>
      }
    >
      <Pane>
        <div className="flex flex-col gap-2">
          <TeamDones dones={dones} contacts={contacts.filter(isActiveContact)} self={self} />
        </div>
      </Pane>
    </PageLayout>
  )
}
