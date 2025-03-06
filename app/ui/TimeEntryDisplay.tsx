import type { ReactNode } from "react"
import { cx } from "~/lib/cx"
import { formatDuration } from "~/lib/formatDuration"
import type { TimeEntry } from "~/schema/TimeEntry"
import type { Project } from "~/schema/Project"
import type { Client } from "~/schema/Client"
import type { Contact } from "~/schema/Contact"

/**
 * Displays a read-only TimeEntry
 */
export function TimeEntryDisplay({ className = "", timeEntry, projects, clients }: Props) {
  if (timeEntry === undefined) return null

  const { input, client: clientId, project: projectId, duration, description } = timeEntry
  const project = projects.find(d => d.id === projectId)
  const client = clients.find(d => d.id === clientId)

  return (
    <div
      className={cx(
        "block h-full w-full overflow-hidden rounded-md p-px",
        "text-sm font-normal leading-tight",
        "bg-neutral-50",
        "hover:bg-neutral-100",
        className,
      )}
      title={input}
      tabIndex={0}
    >
      <div className="flex flex-row gap-x-1 gap-y-px p-1">
        {/* duration */}
        <Badge
          truncate={false}
          className="bg-neutral-200 font-bold text-black"
          icon={<IconStopwatch />}
        >
          {formatDuration(duration)}
        </Badge>
        {/* project */}
        <Badge
          className="text-white"
          style={{ backgroundColor: project?.color }}
          // icon={<IconHash />}
        >
          #<span className="font-bold">{project?.code}</span>
          {project?.subCode ?
            <>
              <span className="inline-block px-px">:</span>
              {project?.subCode}
            </>
          : null}
        </Badge>
        {/* client */}
        {client ?
          <Badge className="border border-neutral-200 text-black">@{client.code}</Badge>
        : null}
      </div>
      {description ?
        <div className="px-1 text-xs">{description}</div>
      : null}
    </div>
  )
}

export function Badge({
  icon,
  className,
  style = {},
  children,
  truncate = true,
}: {
  icon?: ReactNode
  className?: string
  style?: React.CSSProperties
  children: ReactNode
  truncate?: boolean
}) {
  return (
    <span
      className={cx(
        "flex flex-row items-center gap-px rounded px-2 py-1",
        "text-2xs text-neutral-500",
        { "min-w-0 overflow-hidden": truncate },
        className,
      )}
      style={style}
    >
      <span className="shrink-0">{icon}</span>
      <span className={cx({ "overflow-hidden text-ellipsis whitespace-nowrap": truncate })}>
        {children}
      </span>
    </span>
  )
}

type Props = {
  className?: string
  timeEntry: TimeEntry
  projects: Project[]
  clients: Client[]
  self: Contact
}
