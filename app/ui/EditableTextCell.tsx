import { useEffect, useRef, useState } from "react"
import { cx } from "~/lib/cx"

/** An always-visible input cell styled for spreadsheet grids. */
export const EditableTextCell = ({ value, onSave, onKeyDown, row, col }: Props) => {
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  return (
    <input
      ref={inputRef}
      className={cx(
        "w-full border border-neutral-200 bg-white px-2 py-1 text-sm outline-none",
        "focus:border-primary-300 focus:ring-1 focus:ring-primary-300",
      )}
      value={draft}
      data-row={row}
      data-col={col}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) onSave(draft)
      }}
      onKeyDown={e => {
        if (e.key === "Escape") {
          setDraft(value)
          e.currentTarget.blur()
        }
        onKeyDown?.(e)
      }}
    />
  )
}

type Props = {
  /** The current text value. */
  value: string
  /** Called with the new value on blur. */
  onSave: (value: string) => void
  /** Grid keyboard handler from useGridNavigation. */
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>
  /** Row index for grid navigation. */
  row?: number
  /** Column index for grid navigation. */
  col?: number
}
