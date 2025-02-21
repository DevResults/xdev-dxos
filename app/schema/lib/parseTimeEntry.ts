import { create } from "@dxos/react-client/echo"
import { TimeEntry, type TimeEntryInput } from "../TimeEntry"
import type { Project } from "../Project"
import { Data, E } from "./Effect"
import { parseClient } from "./parseClient"
import { parseDuration } from "./parseDuration"
import { parseProject } from "./parseProject"

/**
 * Takes a string input like "1h #out doctor" and parses it into a TimeEntry object.
 */
export const parseTimeEntry = ({ input, contactId, date }: TimeEntryInput) =>
  E.gen(function* (_) {
    const { duration, text: durationText } = yield* parseDuration(input)
    const { project, text: projectText } = yield* parseProject(input)
    const { client, text: clientText = "" } = yield* parseClient(input)

    // Check if this project requires a client to be specified
    if (project.requiresClient && !client)
      return yield* E.fail(new ProjectRequiresClientError({ input, project }))

    // The description is the remaining text after we've removed the duration, project, and client
    const description = collapseWhitespace(
      input //
        .replace(durationText, "")
        .replace(projectText, "")
        .replace(clientText, ""),
    )

    return create(TimeEntry, {
      contactId,
      date,
      duration,
      project: project.id,
      client: client?.id,
      description,
      input,
      timestamp: new Date().toISOString(),
    })
  })

const collapseWhitespace = (s: string) => s.replaceAll(/\s+/g, " ").trim()

export class ProjectRequiresClientError //
  extends Data.TaggedError("parseTimeEntry/ProjectRequiresClient")<{
    input: string
    project: Project
  }>
{
  message = `For ${this.project.fullCode}, you need to specify a client`
}
