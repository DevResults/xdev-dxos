import { Filter, useQuery, useSpace } from "@dxos/react-client/echo"
import { useLocalState } from "./useLocalState"
import { DoneEntry } from "~/schema/DoneEntry"
import { TimeEntry } from "~/schema/TimeEntry"
import { Project } from "~/schema/Project"
import { Client } from "~/schema/Client"
import { Contact } from "~/schema/Contact"

export const useDatabase = () => {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const contacts = useQuery(space, Filter.schema(Contact))
  const clients = useQuery(space, Filter.schema(Client))
  const doneEntries = useQuery(space, Filter.schema(DoneEntry))
  const projects = useQuery(space, Filter.schema(Project))
  const timeEntries = useQuery(space, Filter.schema(TimeEntry))

  return {
    clients,
    contacts,
    doneEntries,
    projects,
    timeEntries,
  }
}
