import { Checkbox } from "@ui/checkbox"

/** A checkbox cell styled for spreadsheet grids. */
export const EditableCheckboxCell = ({ value, onSave, onKeyDown, row, col }: Props) => {
  return (
    <div
      className="flex items-center justify-center border border-neutral-200 px-2 py-1 focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-300"
      data-row={row}
      data-col={col}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === " " || e.key === "Enter") {
          // Let Enter/Space toggle, but also run grid nav for Enter
          if (e.key === " ") {
            e.preventDefault()
            onSave(!value)
          }
        }
        onKeyDown?.(e)
      }}
    >
      <Checkbox
        checked={value}
        onCheckedChange={checked => onSave(checked === true)}
        tabIndex={-1}
      />
    </div>
  )
}

type Props = {
  /** The current boolean value. */
  value: boolean
  /** Called with the new value immediately on change. */
  onSave: (value: boolean) => void
  /** Grid keyboard handler from useGridNavigation. */
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>
  /** Row index for grid navigation. */
  row?: number
  /** Column index for grid navigation. */
  col?: number
}
