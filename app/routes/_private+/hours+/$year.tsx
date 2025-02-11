import { useRedirect } from "~/hooks/useRedirect";
import { useSelectedYear } from "~/hooks/useSelectedYear";
import { useTeam } from "~/hooks/useTeam";
import { getCurrentYear } from "~/lib/getCurrentYear";
import { HoursReport } from "./ui/HoursReport";
import { PageLayout } from "../ui/layouts/PageLayout";
import { YearNav } from "./ui/YearNav";

export default function Hours$YearPage() {
  const contacts = {};
  const timeEntries = {
    findBy(_) {
      return [];
    },
  };
  const currentYear = getCurrentYear();
  const { self } = useTeam();
  const year = useSelectedYear();

  useRedirect({ from: "/hours", to: `/hours/${currentYear}`, condition: year > currentYear });

  const years: any[] = [];
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

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
      <div className="h-full ">
        <HoursReport {...{ self, year, contacts, timeEntries }} />
      </div>
    </PageLayout>
  );
}
