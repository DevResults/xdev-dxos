import { useSpace } from "@dxos/react-client/echo"
import { useDatabase } from "~/hooks/useDatabase"
import { useLocalState } from "~/hooks/useLocalState"
import { Pane } from "~/ui/layouts/Pane"
import { ProjectsTable } from "~/ui/ProjectsTable"

/** Page for editing the projects list. */
export default function ProjectsPage() {
  const { projects } = useDatabase()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  return (
    <Pane>
      <ProjectsTable projects={projects} space={space} />
    </Pane>
  )
}
