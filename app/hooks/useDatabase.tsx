import { Filter, useQuery, useSpace } from "@dxos/react-client/echo"
import { useLocalState } from "./useLocalState"
import { Client } from "~/schema/Client"
import { Contact } from "~/schema/Contact"
import { DoneEntry } from "~/schema/DoneEntry"
import { Project } from "~/schema/Project"
import { TimeEntry } from "~/schema/TimeEntry"

export const useDatabase = () => {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const contacts = useQuery(space, Filter.type(Contact))
  const clients = useQuery(space, Filter.type(Client))
  const doneEntries = useQuery(space, Filter.type(DoneEntry))
  const projects = useQuery(space, Filter.type(Project))
  const timeEntries = useQuery(space, Filter.type(TimeEntry))

  return {
    clients,
    contacts,
    doneEntries,
    projects,
    timeEntries,
  }
}
