import type { Space } from "@dxos/react-client/echo"
import { type ColumnDef } from "@tanstack/react-table"
import { type Client, makeClient } from "~/schema/Client"
import { EditableTable } from "~/ui/EditableTable"
import { EditableTextCell } from "~/ui/EditableTextCell"

/** Editable grid for managing clients. */
export const ClientsTable = ({ clients, space }: Props) => {
  return (
    <EditableTable
      heading="Clients"
      columns={columns}
      data={clients}
      gridTemplateColumns="8em 1fr"
      addLabel="Add client"
      onAdd={() => {
        space?.db.add(makeClient({ code: "", timestamp: new Date().toISOString() }))
      }}
      onDelete={client => {
        space?.db.remove(client)
      }}
    />
  )
}

const columns: ColumnDef<Client, any>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <EditableTextCell
        value={row.original.code ?? ""}
        onSave={v => {
          row.original.code = v
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
]

type Props = {
  /** Array of Client objects from DXOS. */
  clients: Client[]
  /** The DXOS space for adding/removing objects. */
  space: Space | undefined
}
