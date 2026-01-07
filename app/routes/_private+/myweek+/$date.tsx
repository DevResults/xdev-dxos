import { Checkbox } from "@ui/checkbox"
import { useState } from "react"
import { useSpace } from "@dxos/react-client/echo"
import { PageLayout } from "ui/layouts/PageLayout"
import { WeekNav } from "ui/WeekNav"
import { MyWeek } from "ui/MyWeek"
import { useSelectedWeek } from "~/hooks/useSelectedWeek"
import { useTeam } from "~/hooks/useTeam"
import { useDatabase } from "~/hooks/useDatabase"
import { useLocalState } from "~/hooks/useLocalState"

export default function MyWeek$DatePage() {
  const { self, contacts } = useTeam()
  const { doneEntries, timeEntries, projects, clients } = useDatabase()
  const [showWeekends, setShowWeekends] = useState(false)
  const { start, end } = useSelectedWeek()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  const sStart = start.toString()
  const sEnd = end.toString()
  const times = timeEntries.filter(d => d.date >= sStart && d.date <= sEnd)

  return (
    <PageLayout
      removePadding={true}
      nav={
        <div className="flex h-full flex-row items-center gap-4">
          <h1 className="grow">My week</h1>
          <WeekNav />
          <div className="flex items-center space-x-1">
            <Checkbox
              id="ShowWeekends"
              onCheckedChange={e => {
                setShowWeekends(e === true)
              }}
            />
            <div className="grid gap-1 leading-none">
              <label
                htmlFor="ShowWeekends"
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show weekends
              </label>
            </div>
          </div>
        </div>
      }
    >
      <div className="h-full p-1">
        <MyWeek
          {...{
            start,
            showWeekends,
            doneEntries,
            timeEntries: times,
            projects,
            clients,
            self,
            contacts,
            onAddDone: d => space?.db.add(d),
            onRemoveDone: d => space?.db.remove(d),
            onAddTime: d => space?.db.add(d),
            onRemoveTime: d => space?.db.remove(d),
          }}
        />
      </div>
    </PageLayout>
  )
}
