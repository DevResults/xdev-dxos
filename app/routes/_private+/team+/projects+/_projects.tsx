import { useSpace } from "@dxos/react-client/echo"
import { useDbQuery } from "~/hooks/useDbQuery"
import { useLocalState } from "~/hooks/useLocalState"
import { Project } from "~/schema/Project"
import { Pane } from "~/ui/layouts/Pane"
import { ProjectsTable } from "~/ui/ProjectsTable"

/** Page for editing the projects list. */
export default function ProjectsPage() {
  const projects = useDbQuery(Project)
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)

  return (
    <Pane>
      <ProjectsTable projects={projects} space={space} />
    </Pane>
  )
}
