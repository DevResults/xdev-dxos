import { Alert, AlertDescription } from "~/ui/shadcn/alert";
import { DoneEntryGenerator } from "./ui/DoneEntryGenerator";
import { DoneEntryImporter } from "./ui/DoneEntryImporter";
import { TimeEntryGenerator } from "./ui/TimeEntryGenerator";
import { TimeEntryImporter } from "./ui/TimeEntryImporter";

export default function DangerPage() {
  const fake = {
    add(_: any) {},
    destroyAll() {},
    all() {
      return [];
    },
  };
  const timeEntries = fake;
  const doneEntries = fake;
  const clients = fake;
  const projects = fake;
  const contacts = fake;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Alert variant="danger">
          <IconExclamationCircle />
          <AlertDescription>
            <b>Careful!</b> The tools on this page overwrite existing data and shouldn't be used in production.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2 divide-y border-t">
          {[
            {
              heading: "Generate dones data",
              content: (
                <div className="w-[30em]">
                  <DoneEntryGenerator
                    contacts={contacts.all()}
                    add={(done) => doneEntries.add(done)}
                    destroyAll={() => doneEntries.destroyAll()}
                  />
                </div>
              ),
            },
            {
              heading: "Import dones data",
              content: (
                <DoneEntryImporter
                  contacts={contacts.all()}
                  add={(done) => doneEntries.add(done)}
                  destroyAll={() => doneEntries.destroyAll()}
                />
              ),
            },
            {
              heading: "Generate hours data",
              content: (
                <div className="w-[30em]">
                  <TimeEntryGenerator
                    contacts={contacts.all()}
                    clients={clients.all()}
                    projects={projects.all()}
                    add={(t) => timeEntries.add(t)}
                    destroyAll={() => timeEntries.destroyAll()}
                  />
                </div>
              ),
            },
            {
              heading: "Import hours data",
              content: (
                <div>
                  <TimeEntryImporter
                    defaultOpen={true}
                    destroyAll={() => timeEntries.destroyAll()}
                    add={(timeEntry) => timeEntries.add(timeEntry)}
                    contacts={contacts.all()}
                    clients={clients.all()}
                    projects={projects.all()}
                  />
                </div>
              ),
            },
          ].map(({ heading, content }) => (
            <div
              className="flex flex-row py-2"
              key={heading}
            >
              <h3 className="w-[14em] flex-none">{heading}</h3>
              <div className="flex-grow">{content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
