import type { Obj } from "@dxos/echo"
import { useSpace } from "@dxos/react-client/echo"
import { Alert, AlertDescription } from "@ui/alert"
import { DoneEntryGenerator } from "ui/DoneEntryGenerator"
import { DoneEntryImporter } from "ui/DoneEntryImporter"
import { TimeEntryGenerator } from "ui/TimeEntryGenerator"
import { TimeEntryImporter } from "ui/TimeEntryImporter"
import { useDatabase } from "~/hooks/useDatabase"
import { useLocalState } from "~/hooks/useLocalState"
import { makeDoneEntry, type DoneEntry } from "~/schema/DoneEntry"
import { makeTimeEntry, type TimeEntry } from "~/schema/TimeEntry"
import { Heading } from "~/ui/Heading"

export default function DangerPage() {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const { clients, contacts, doneEntries, projects, timeEntries } = useDatabase()

  const addDone = (done: Omit<DoneEntry, "id">) => space?.db.add(makeDoneEntry(done) as DoneEntry)
  const addTimeEntries = (timeEntries: Array<Omit<TimeEntry, "id">>) => {
    for (const timeEntry of timeEntries) {
      space?.db.add(makeTimeEntry(timeEntry) as TimeEntry)
    }
  }

  function destroyAll(list: Obj.Any[]) {
    for (const item of list) {
      space?.db.remove(item)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Alert variant="danger">
          <IconExclamationCircle />
          <AlertDescription>
            <b>Careful!</b> The tools on this page overwrite existing data and shouldn't be used in
            production.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2 divide-y border-t">
          {[
            {
              heading: "Generate dones data",
              content: (
                <div className="w-[30em]">
                  <DoneEntryGenerator
                    contacts={contacts}
                    add={addDone}
                    destroyAll={() => {
                      destroyAll(doneEntries)
                    }}
                  />
                </div>
              ),
            },
            {
              heading: "Import dones data",
              content: (
                <DoneEntryImporter
                  contacts={contacts}
                  add={addDone}
                  destroyAll={() => {
                    destroyAll(doneEntries)
                  }}
                />
              ),
            },
            {
              heading: "Generate hours data",
              content: (
                <div className="w-[30em]">
                  <TimeEntryGenerator
                    contacts={contacts}
                    clients={clients}
                    projects={projects}
                    add={addTimeEntries}
                    destroyAll={() => {
                      destroyAll(timeEntries)
                    }}
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
                    destroyAll={() => {
                      destroyAll(timeEntries)
                    }}
                    add={addTimeEntries}
                    contacts={contacts}
                    clients={clients}
                    projects={projects}
                  />
                </div>
              ),
            },
          ].map(({ heading, content }) => (
            <div className="flex flex-row py-2" key={heading}>
              <Heading level={3} className="w-[14em] flex-none">
                {heading}
              </Heading>
              <div className="flex-grow">{content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
