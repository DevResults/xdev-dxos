import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@ui/button"
import { type ReactElement, cloneElement, isValidElement, useState } from "react"
import { useGridNavigation } from "~/hooks/useGridNavigation"
import { ConfirmDialog } from "~/ui/ConfirmDialog"
import { Heading } from "~/ui/Heading"

/** A generic editable table with spreadsheet-style grid lines and keyboard navigation. */
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

  /** Number of navigable columns (excludes the delete button column). */
  const navColCount = columns.length

  const { containerRef, handleCellKeyDown } = useGridNavigation({
    rowCount: data.length,
    colCount: navColCount,
    onAddRow: onAdd,
  })

  return (
    <>
      {heading && <Heading level={2}>{heading}</Heading>}
      <div
        ref={containerRef}
        className="my-3 w-full min-w-[35em] text-sm"
        style={{
          display: "grid",
          gridTemplateColumns: `${gridTemplateColumns} min-content`,
        }}
      >
        {/* Header */}
        <div
          className="col-span-full grid grid-cols-subgrid border-b border-neutral-300 bg-neutral-50 font-medium text-neutral-500"
          style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          {table.getHeaderGroups().map(headerGroup =>
            headerGroup.headers.map(header => (
              <div key={header.id} className="px-2 py-1.5">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            )),
          )}
          {/* Empty header for delete column */}
          <div />
        </div>

        {/* Body rows */}
        {table.getRowModel().rows.map((row, rowIndex) => (
          <div key={row.id} className="col-span-full grid grid-cols-subgrid items-center">
            {row.getVisibleCells().map((cell, colIndex) => {
              const rendered = flexRender(cell.column.columnDef.cell, cell.getContext())
              // Inject row/col/onKeyDown props into editable cell components
              const enhanced = isValidElement(rendered)
                ? cloneElement(rendered as ReactElement<Record<string, unknown>>, {
                    row: rowIndex,
                    col: colIndex,
                    onKeyDown: handleCellKeyDown,
                  })
                : rendered
              return <div key={cell.id}>{enhanced}</div>
            })}
            {/* Delete button */}
            <button
              className="cursor-pointer px-2 py-1 opacity-10 hover:text-danger-500 hover:opacity-100"
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
