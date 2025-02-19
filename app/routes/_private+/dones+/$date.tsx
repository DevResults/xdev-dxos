import { Filter, useQuery, useSpace } from "@dxos/react-client/echo"
import { PageLayout } from "../ui/layouts/PageLayout"
import { WeekNav } from "../ui/WeekNav"
import { TeamDones } from "./ui/TeamDones"
import { useSelectedWeek } from "~/hooks/useSelectedWeek"
import { useTeam } from "~/hooks/useTeam"
import { useLocalState } from "~/hooks/useLocalState"
import { DoneEntry } from "~/schema/DoneEntry"

export default function Dones$DatePage() {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const doneEntries = useQuery(space, Filter.schema(DoneEntry))
  const { start, end } = useSelectedWeek()
  const { self, contacts } = useTeam()

  // get dones for a week
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
