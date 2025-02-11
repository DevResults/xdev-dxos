import { useSelectedWeek } from "~/hooks/useSelectedWeek";
import { useTeam } from "~/hooks/useTeam";
import { PageLayout } from "../ui/layouts/PageLayout";
import { TeamDones } from "./ui/TeamDones";
import { WeekNav } from "../ui/WeekNav";

export default function Dones$DatePage() {
  const doneEntries = {
    findBy(_, __) {
      return [];
    },
    update(_) {},
  };
  const { start } = useSelectedWeek();
  const { self, contacts } = useTeam();

  const dones = doneEntries.findBy("week", start);

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
        <TeamDones
          dones={dones}
          contacts={Object.values(contacts)}
          self={self}
          updateLikes={(id, likes) => doneEntries.update({ id, likes })}
        />
      </div>
    </PageLayout>
  );
}
