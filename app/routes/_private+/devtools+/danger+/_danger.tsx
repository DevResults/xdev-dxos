import { Filter, useQuery, useSpace } from "@dxos/react-client/echo"
import { Alert, AlertDescription } from "@ui/alert"
import { DoneEntryGenerator } from "ui/DoneEntryGenerator"
import { DoneEntryImporter } from "ui/DoneEntryImporter"
import { Pane } from "ui/layouts/Pane"
import { TimeEntryGenerator } from "ui/TimeEntryGenerator"
import { TimeEntryImporter } from "ui/TimeEntryImporter"
import { useLocalState } from "~/hooks/useLocalState"
import { processBatch } from "~/lib/processBatch"
import { Client } from "~/schema/Client"
import { Contact } from "~/schema/Contact"
import { DoneEntry, makeDoneEntry } from "~/schema/DoneEntry"
import { Project } from "~/schema/Project"
import { makeTimeEntry, TimeEntry } from "~/schema/TimeEntry"
import { Heading } from "~/ui/Heading"

export default function DangerPage() {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  // Only query lightweight collections eagerly; time/done entries are loaded on demand
  const contacts = useQuery(space, Filter.type(Contact)) as Contact[]
  const clients = useQuery(space, Filter.type(Client))
  const projects = useQuery(space, Filter.type(Project))

  const addDone = (done: Omit<DoneEntry, "id">) => space?.db.add(makeDoneEntry(done) as DoneEntry)
  const addTimeEntry = (entry: Omit<TimeEntry, "id">) =>
    space?.db.add(makeTimeEntry(entry) as TimeEntry)

  async function destroyAllOfType(
    schema: typeof TimeEntry | typeof DoneEntry,
    onProgress?: (progress: number) => void,
  ) {
    if (!space) return
    const { objects } = await space.db.query(Filter.type(schema)).run()
    await processBatch(objects, item => space.db.remove(item), onProgress, 50)
  }

  return (
    <Pane>
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
                    destroyAll={p => destroyAllOfType(DoneEntry, p)}
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
                  destroyAll={p => destroyAllOfType(DoneEntry, p)}
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
                    add={addTimeEntry}
                    destroyAll={p => destroyAllOfType(TimeEntry, p)}
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
                    destroyAll={p => destroyAllOfType(TimeEntry, p)}
                    add={addTimeEntry}
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
    </Pane>
  )
}
