import { Checkbox } from "~/ui/shadcn/checkbox";
import { useState } from "react";
import { PageLayout } from "../ui/layouts/PageLayout";
import { MyWeek } from "./ui/MyWeek";
import { WeekNav } from "../ui/WeekNav";
import { useSelectedWeek } from "~/hooks/useSelectedWeek";

export default function MyWeek$DatePage() {
  const [showWeekends, setShowWeekends] = useState(false);
  const { start } = useSelectedWeek();
  const doneEntries = {};
  const timeEntries = {
    reduce() {
      return 0;
    },
    findBy() {
      return [];
    },
  };
  const projects: any[] = [];
  const clients: any[] = [];

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
              onCheckedChange={(e) => setShowWeekends(e === true)}
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
        <MyWeek {...{ start, showWeekends, doneEntries, timeEntries, projects, clients, self }} />
      </div>
    </PageLayout>
  );
}
