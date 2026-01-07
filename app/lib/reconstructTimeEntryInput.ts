import { formatDuration } from "~/lib/formatDuration"

/**
 * Constructs a text input that could be parsed to recreate this entry. We use this in situations
 * where there was no human-entered input - for example when generating or importing entries. We
 * need this to be able to show put something in the input field when the entry is edited.
 */

export const reconstructTimeEntryInput = ({
  durationInHours,
  project,
  client,
  description,
}: {
  durationInHours: number
  project: string
  client: string | undefined
  description?: string
}) =>
  [
    `${formatDuration(durationInHours * 60)}`, // Duration in hours
    `#${project}`, // Project code
    client ? `@${client}` : undefined, // (maybe) client code
    description,
  ]
    .filter(Boolean)
    .join(" ")
