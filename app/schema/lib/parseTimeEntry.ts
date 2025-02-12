import { createId } from "@paralleldrive/cuid2";
import { E } from "./Effect";
import { TimeEntry, TimeEntryId, type TimeEntryInput } from "../TimeEntry";
import { parseClient } from "./parseClient";
import { parseDuration } from "./parseDuration";
import { parseProject } from "./parseProject";

/**
 * Takes a string input like "1h #out doctor" and parses it into a TimeEntry object.
 */
export const parseTimeEntry = ({ input, contactId, date, id = TimeEntryId.make(createId()) }: TimeEntryInput) =>
  E.gen(function* (_) {
    const { duration, text: durationText } = yield* parseDuration(input);
    const { project, text: projectText } = yield* parseProject(input);
    const { client, text: clientText = "" } = yield* parseClient(input);

    // The description is the remaining text after we've removed the duration, project, and client
    const description = collapseWhitespace(
      input //
        .replace(durationText, "")
        .replace(projectText, "")
        .replace(clientText, "")
    );

    return new TimeEntry({
      id,
      contactId,
      date,
      duration,
      project,
      client,
      description,
      input,
      timestamp: new Date().toISOString(),
    });
  });

const collapseWhitespace = (s: string) => s.replaceAll(/\s+/g, " ").trim();
