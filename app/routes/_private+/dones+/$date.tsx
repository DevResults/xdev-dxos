import { PageLayout } from "ui/layouts/PageLayout"
import { TeamDones } from "ui/TeamDones"
import { WeekNav } from "ui/WeekNav"
import { useDatabase } from "~/hooks/useDatabase"
import { useSelectedWeek } from "~/hooks/useSelectedWeek"
import { useTeam } from "~/hooks/useTeam"

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
      removePadding={true}
      nav={
        <div className="flex h-full flex-row items-center gap-4">
          <h1 className="grow">Dones</h1>
          <WeekNav />
        </div>
      }
    >
      <div className="flex flex-col gap-2 p-4">
        <TeamDones dones={dones} contacts={contacts} self={self} />
      </div>
    </PageLayout>
  )
}
