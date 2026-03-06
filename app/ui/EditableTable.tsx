import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@ui/button"
import { useState } from "react"
import { ConfirmDialog } from "~/ui/ConfirmDialog"
import { Heading } from "~/ui/Heading"

/** A generic editable table using TanStack Table and CSS grid. */
export const EditableTable = <T,>({
  columns,
  data,
  onAdd,
  onDelete,
  addLabel,
  heading,
  gridTemplateColumns,
}: Props<T>) => {
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const colCount = columns.length + 1 // +1 for delete column

  return (
    <>
      {heading && <Heading level={2}>{heading}</Heading>}
      <div
        className="my-3 grid w-full min-w-[35em] gap-x-4 border-t text-sm"
        style={{ gridTemplateColumns: `${gridTemplateColumns} min-content` }}
      >
        {/* Header */}
        <div
          className="col-span-full grid grid-cols-subgrid border-b p-2 font-medium text-neutral-500"
          style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          {table
            .getHeaderGroups()
            .map(headerGroup =>
              headerGroup.headers.map(header => (
                <div key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              )),
            )}
          {/* Empty header for delete column */}
          <div />
        </div>

        {/* Body rows */}
        {table.getRowModel().rows.map(row => (
          <div
            key={row.id}
            className="col-span-full grid grid-cols-subgrid items-center border-b p-2"
          >
            {row.getVisibleCells().map(cell => (
              <div key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
            ))}
            {/* Delete button */}
            <button
              className="cursor-pointer opacity-10 hover:text-danger-500 hover:opacity-100"
              title="Delete"
              onClick={() => setDeleteTarget(row.original)}
            >
              <IconTrash className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="py-3">
        <Button intent="primary" size="sm" onClick={onAdd}>
          <IconPlus className="size-4" />
          {addLabel}
        </Button>
      </div>

      <ConfirmDialog
        defaultOpen={deleteTarget !== null}
        title="Delete this item?"
        body="This action cannot be undone."
        intent="danger"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

type Props<T> = {
  /** TanStack column definitions. */
  columns: ColumnDef<T, any>[]
  /** Array of data objects. */
  data: T[]
  /** Called when the user clicks the add button. */
  onAdd: () => void
  /** Called when the user confirms deletion of a row. */
  onDelete: (item: T) => void
  /** Label for the add button. */
  addLabel: string
  /** Optional heading above the table. */
  heading?: string
  /** CSS grid-template-columns for data columns (delete column is appended automatically). */
  gridTemplateColumns: string
}
