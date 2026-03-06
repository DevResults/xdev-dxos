import type { Space } from "@dxos/react-client/echo"
import { type ColumnDef } from "@tanstack/react-table"
import { makeFullCode, makeProject, type Project } from "~/schema/Project"
import { EditableCheckboxCell } from "~/ui/EditableCheckboxCell"
import { EditableColorCell } from "~/ui/EditableColorCell"
import { EditableTable } from "~/ui/EditableTable"
import { EditableTextCell } from "~/ui/EditableTextCell"

/** Editable grid for managing projects. */
export const ProjectsTable = ({ projects, space }: Props) => {
  return (
    <EditableTable
      heading="Projects"
      columns={columns}
      data={projects}
      gridTemplateColumns="6em 6em 1fr min-content 6em"
      addLabel="Add project"
      onAdd={() => {
        space?.db.add(
          makeProject({
            code: "",
            fullCode: "",
            requiresClient: false,
            timestamp: new Date().toISOString(),
          }),
        )
      }}
      onDelete={project => {
        space?.db.remove(project)
      }}
    />
  )
}

const columns: ColumnDef<Project, any>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <EditableTextCell
        value={row.original.code ?? ""}
        onSave={v => {
          row.original.code = v
          row.original.fullCode = makeFullCode(v, row.original.subCode)
        }}
      />
    ),
  },
  {
    accessorKey: "subCode",
    header: "Sub-code",
    cell: ({ row }) => (
      <EditableTextCell
        value={row.original.subCode ?? ""}
        onSave={v => {
          row.original.subCode = v
          row.original.fullCode = makeFullCode(row.original.code, v)
        }}
      />
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <EditableTextCell
        value={row.original.description ?? ""}
        onSave={v => {
          row.original.description = v
        }}
      />
    ),
  },
  {
    accessorKey: "requiresClient",
    header: "Requires client",
    cell: ({ row }) => (
      <EditableCheckboxCell
        value={row.original.requiresClient ?? false}
        onSave={v => {
          row.original.requiresClient = v
        }}
      />
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <EditableColorCell
        value={row.original.color ?? ""}
        onSave={v => {
          row.original.color = v
        }}
      />
    ),
  },
]

type Props = {
  /** Array of Project objects from DXOS. */
  projects: Project[]
  /** The DXOS space for adding/removing objects. */
  space: Space | undefined
}
