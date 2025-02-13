import { Alert, AlertDescription } from "~/ui/shadcn/alert"
import { DoneEntryGenerator } from "./ui/DoneEntryGenerator"
import { DoneEntryImporter } from "./ui/DoneEntryImporter"
import { TimeEntryGenerator } from "./ui/TimeEntryGenerator"
import { TimeEntryImporter } from "./ui/TimeEntryImporter"
import { clients } from "~/data/clients"
import { projects } from "~/data/projects"
import { useLocalState } from "~/hooks/useLocalState"
import {
  create,
  Filter,
  useQuery,
  useSpace,
  type ReactiveEchoObject,
} from "@dxos/react-client/echo"
import { Contact } from "~/schema/Contact"
import { DoneEntry } from "~/schema/DoneEntry"
import { TimeEntry } from "~/schema/TimeEntry"
import type { BaseObject } from "@dxos/echo-schema"

export default function DangerPage() {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const contacts = useQuery(space, Filter.schema(Contact))
  const doneEntries = useQuery(space, Filter.schema(DoneEntry))
  const timeEntries = useQuery(space, Filter.schema(TimeEntry))

  const addDone = (done: Omit<DoneEntry, "id">) => space?.db.add(create(DoneEntry, done))
  const addTimeEntries = (timeEntries: Omit<TimeEntry, "id">[]) => {
    for (const timeEntry of timeEntries) space?.db.add(create(TimeEntry, timeEntry))
  }
  function destroyAll<T extends ReactiveEchoObject<U>, U extends BaseObject>(list: T[]) {
    for (const item of list) space?.db.remove(item)
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
                    destroyAll={() => destroyAll(doneEntries)}
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
                  destroyAll={() => destroyAll(doneEntries)}
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
                    destroyAll={() => destroyAll(timeEntries)}
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
                    destroyAll={() => destroyAll(timeEntries)}
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
              <h3 className="w-[14em] flex-none">{heading}</h3>
              <div className="flex-grow">{content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
